"use client";

import { useState, useEffect } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, isFirebaseConfigured } from "../../lib/firebase-client";
import AppHeader from "../../components/app-header";

export default function BetaDashboardPage() {
  const [formData, setFormData] = useState({
    type: "bug",
    title: "",
    description: "",
    pageUrl: "",
    deviceType: "",
    userEmail: "",
  });
  const [browserInfo, setBrowserInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setBrowserInfo(navigator.userAgent || "Unknown");
    }
    if (typeof window !== "undefined") {
      setFormData((prev) => ({ ...prev, pageUrl: window.location.href }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.title.trim()) {
      setError("Titel krävs.");
      return;
    }
    if (!formData.description.trim()) {
      setError("Beskrivning krävs.");
      return;
    }

    if (!isFirebaseConfigured || !db) {
      setError("Feedback-överföring är för närvarande inte tillgänglig. Firebase är inte konfigurerat.");
      return;
    }

    setSubmitting(true);

    try {
      const feedbackData = {
        type: formData.type,
        title: formData.title.trim(),
        description: formData.description.trim(),
        pageUrl: formData.pageUrl.trim() || (typeof window !== "undefined" ? window.location.href : ""),
        deviceType: formData.deviceType.trim(),
        userEmail: formData.userEmail.trim(),
        status: "new",
        browserInfo,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "beta_feedback"), feedbackData);

      setSuccess(true);
      setFormData({
        type: "bug",
        title: "",
        description: "",
        pageUrl: typeof window !== "undefined" ? window.location.href : "",
        deviceType: "",
        userEmail: "",
      });
    } catch (err: any) {
      console.error("Fel vid inskickning av feedback:", err);
      if (err.code === "permission-denied") {
        setError("Tyvärr kan vi inte spara din feedback just nu. Behörighet nekad. Försök igen senare eller kontakta support.");
      } else {
        setError(`Kunde inte skicka feedback: ${err.message || "Okänt fel"}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <AppHeader />
      <main style={{ backgroundColor: "#000", color: "#fff", minHeight: "100vh", padding: "2rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1 style={{ color: "#FFD700", fontSize: "2.5rem", marginBottom: "1rem" }}>Beta Tester Panel</h1>
          <p style={{ color: "#ccc", fontSize: "1.1rem", marginBottom: "2rem" }}>
            Välkommen till beta-testpanelen! Som beta-testare kan du rapportera buggar, problem, idéer och lämna ärlig feedback för att hjälpa oss förbättra plattformen.
          </p>

          {success && (
            <div style={{ backgroundColor: "#1a1a1a", border: "1px solid #FFD700", padding: "1rem", marginBottom: "2rem", borderRadius: "4px" }}>
              Tack för din feedback! Ditt bidrag har tagits emot.
            </div>
          )}

          {error && (
            <div style={{ backgroundColor: "#1a1a1a", border: "1px solid #ff4444", padding: "1rem", marginBottom: "2rem", borderRadius: "4px", color: "#ff4444" }}>
              {error}
            </div>
          )}

          {!isFirebaseConfigured && (
            <div style={{ backgroundColor: "#1a1a1a", border: "1px solid #ff4444", padding: "1rem", marginBottom: "2rem", borderRadius: "4px", color: "#ff4444" }}>
              Firebase är inte konfigurerat. Feedback-överföring är inte tillgänglig.
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <label htmlFor="type" style={{ color: "#FFD700", display: "block", marginBottom: "0.5rem" }}>Feedback-typ *</label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                style={{ backgroundColor: "#1a1a1a", border: "1px solid #FFD700", color: "#fff", padding: "0.5rem", width: "100%", borderRadius: "4px" }}
                required
              >
                <option value="bug">Bugg</option>
                <option value="issue">Problem</option>
                <option value="idea">Idé</option>
                <option value="general_feedback">Allmän feedback</option>
              </select>
            </div>

            <div>
              <label htmlFor="title" style={{ color: "#FFD700", display: "block", marginBottom: "0.5rem" }}>Titel *</label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                style={{ backgroundColor: "#1a1a1a", border: "1px solid #FFD700", color: "#fff", padding: "0.5rem", width: "100%", borderRadius: "4px" }}
                required
              />
            </div>

            <div>
              <label htmlFor="description" style={{ color: "#FFD700", display: "block", marginBottom: "0.5rem" }}>Beskrivning *</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                rows={5}
                style={{ backgroundColor: "#1a1a1a", border: "1px solid #FFD700", color: "#fff", padding: "0.5rem", width: "100%", borderRadius: "4px", resize: "vertical" }}
                required
              />
            </div>

            <div>
              <label htmlFor="pageUrl" style={{ color: "#FFD700", display: "block", marginBottom: "0.5rem" }}>Sid-URL</label>
              <input
                type="text"
                id="pageUrl"
                value={formData.pageUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, pageUrl: e.target.value }))}
                style={{ backgroundColor: "#1a1a1a", border: "1px solid #FFD700", color: "#fff", padding: "0.5rem", width: "100%", borderRadius: "4px" }}
                placeholder="t.ex. https://oneinhimbiblestudy.com/library/kjv"
              />
            </div>

            <div>
              <label htmlFor="deviceType" style={{ color: "#FFD700", display: "block", marginBottom: "0.5rem" }}>Enhetstyp</label>
              <input
                type="text"
                id="deviceType"
                value={formData.deviceType}
                onChange={(e) => setFormData((prev) => ({ ...prev, deviceType: e.target.value }))}
                style={{ backgroundColor: "#1a1a1a", border: "1px solid #FFD700", color: "#fff", padding: "0.5rem", width: "100%", borderRadius: "4px" }}
                placeholder="t.ex. Dator, Mobil, Surfplatta"
              />
            </div>

            <div>
              <label htmlFor="userEmail" style={{ color: "#FFD700", display: "block", marginBottom: "0.5rem" }}>E-post (valfritt)</label>
              <input
                type="email"
                id="userEmail"
                value={formData.userEmail}
                onChange={(e) => setFormData((prev) => ({ ...prev, userEmail: e.target.value }))}
                style={{ backgroundColor: "#1a1a1a", border: "1px solid #FFD700", color: "#fff", padding: "0.5rem", width: "100%", borderRadius: "4px" }}
                placeholder="din.epost@exempel.com"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !isFirebaseConfigured}
              style={{
                backgroundColor: "#FFD700",
                color: "#000",
                padding: "0.75rem 1.5rem",
                border: "none",
                borderRadius: "4px",
                cursor: submitting ? "not-allowed" : "pointer",
                opacity: submitting ? 0.7 : 1,
                fontSize: "1rem",
                fontWeight: "bold",
                alignSelf: "flex-start",
              }}
            >
              {submitting ? "Skickar..." : "Skicka feedback"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}

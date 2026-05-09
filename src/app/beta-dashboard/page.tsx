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
      setError("Title is required.");
      return;
    }
    if (!formData.description.trim()) {
      setError("Description is required.");
      return;
    }

    if (!isFirebaseConfigured || !db) {
      setError("Feedback submission is currently unavailable. Firebase is not configured.");
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
      console.error("Error submitting feedback:", err);
      if (err.code === "permission-denied") {
        setError("Unfortunately, we cannot save your feedback right now. Permission denied. Try again later or contact support.");
      } else {
        setError(`Could not submit feedback: ${err.message || "Unknown error"}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <AppHeader />
      <main style={{ 
        backgroundColor: "var(--color-bg)", 
        color: "var(--color-ink)", 
        minHeight: "100vh", 
        padding: "calc(var(--header-height) + 2rem) 2rem 2rem",
        maxWidth: "72rem",
        margin: "0 auto",
      }}>
        <div style={{ maxWidth: "48rem", margin: "0 auto" }}>
          <h1 style={{ 
            color: "var(--color-highlight)", 
            fontFamily: "var(--font-display)", 
            fontSize: "clamp(2rem, 5vw, 2.5rem)", 
            marginBottom: "1rem",
            fontWeight: 600,
            lineHeight: 1.1,
          }}>
            Beta Tester Dashboard
          </h1>
          <p style={{ 
            color: "var(--color-muted)", 
            fontSize: "1.1rem", 
            marginBottom: "2rem",
            lineHeight: 1.7,
            fontFamily: "var(--font-body)",
          }}>
            Welcome to the beta tester dashboard! As a beta tester, you can report bugs, issues, ideas, and provide honest feedback to help us improve the platform.
          </p>

          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ 
              color: "var(--color-highlight)", 
              fontFamily: "var(--font-display)", 
              fontSize: "clamp(1.5rem, 3vw, 2rem)", 
              marginBottom: "1rem",
              fontWeight: 600,
              lineHeight: 1.1,
            }}>
              How to Test
            </h2>
            <ul style={{ 
              color: "var(--color-muted)", 
              fontSize: "1.1rem", 
              lineHeight: 1.7,
              fontFamily: "var(--font-body)",
              paddingLeft: "1.5rem",
              margin: 0,
            }}>
              <li>Test the site on desktop, tablet, and mobile if possible.</li>
              <li>Look for bugs, broken links, confusing pages, layout issues, spelling mistakes, login problems, and anything that feels unclear.</li>
              <li>Be honest and specific.</li>
              <li>Include the page URL when reporting an issue.</li>
              <li>Ideas and suggestions are welcome, not only bugs.</li>
              <li>Google Play beta testing will come later.</li>
            </ul>
          </div>

          {success && (
            <div style={{ 
              backgroundColor: "var(--color-panel)", 
              border: "1px solid var(--color-highlight)", 
              padding: "1rem", 
              marginBottom: "2rem", 
              borderRadius: "1rem",
              color: "var(--color-ink)",
              fontFamily: "var(--font-body)",
            }}>
              Thank you for your feedback! Your submission has been received.
            </div>
          )}

          {error && (
            <div style={{ 
              backgroundColor: "var(--color-panel)", 
              border: "1px solid #e6a5a5", 
              padding: "1rem", 
              marginBottom: "2rem", 
              borderRadius: "1rem", 
              color: "#e6a5a5",
              fontFamily: "var(--font-body)",
            }}>
              {error}
            </div>
          )}

          {!isFirebaseConfigured && (
            <div style={{ 
              backgroundColor: "var(--color-panel)", 
              border: "1px solid #e6a5a5", 
              padding: "1rem", 
              marginBottom: "2rem", 
              borderRadius: "1rem", 
              color: "#e6a5a5",
              fontFamily: "var(--font-body)",
            }}>
              Firebase is not configured. Feedback submission is unavailable.
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem", fontFamily: "var(--font-body)" }}>
            <div>
              <label htmlFor="type" style={{ 
                color: "var(--color-highlight)", 
                display: "block", 
                marginBottom: "0.5rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}>Feedback Type *</label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                style={{ 
                  width: "100%",
                  border: "1px solid rgba(229, 197, 122, 0.38)",
                  borderRadius: "1rem",
                  background: "rgba(10, 10, 10, 0.78)",
                  color: "var(--color-ink)",
                  padding: "0.85rem 1rem",
                  outline: "none",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.95rem",
                }}
                required
              >
                <option value="bug">Bug</option>
                <option value="issue">Issue</option>
                <option value="idea">Idea</option>
                <option value="general_feedback">General Feedback</option>
              </select>
            </div>

            <div>
              <label htmlFor="title" style={{ 
                color: "var(--color-highlight)", 
                display: "block", 
                marginBottom: "0.5rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}>Title *</label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                style={{ 
                  width: "100%",
                  border: "1px solid rgba(229, 197, 122, 0.38)",
                  borderRadius: "1rem",
                  background: "rgba(10, 10, 10, 0.78)",
                  color: "var(--color-ink)",
                  padding: "0.85rem 1rem",
                  outline: "none",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.95rem",
                }}
                required
              />
            </div>

            <div>
              <label htmlFor="description" style={{ 
                color: "var(--color-highlight)", 
                display: "block", 
                marginBottom: "0.5rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}>Description *</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                rows={5}
                style={{ 
                  width: "100%",
                  border: "1px solid rgba(229, 197, 122, 0.38)",
                  borderRadius: "1rem",
                  background: "rgba(10, 10, 10, 0.78)",
                  color: "var(--color-ink)",
                  padding: "0.85rem 1rem",
                  outline: "none",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.95rem",
                  resize: "vertical",
                }}
                required
              />
            </div>

            <div>
              <label htmlFor="pageUrl" style={{ 
                color: "var(--color-highlight)", 
                display: "block", 
                marginBottom: "0.5rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}>Page URL</label>
              <input
                type="text"
                id="pageUrl"
                value={formData.pageUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, pageUrl: e.target.value }))}
                style={{ 
                  width: "100%",
                  border: "1px solid rgba(229, 197, 122, 0.38)",
                  borderRadius: "1rem",
                  background: "rgba(10, 10, 10, 0.78)",
                  color: "var(--color-ink)",
                  padding: "0.85rem 1rem",
                  outline: "none",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.95rem",
                }}
                placeholder="e.g. https://oneinhimbiblestudy.com/library/kjv"
              />
            </div>

            <div>
              <label htmlFor="deviceType" style={{ 
                color: "var(--color-highlight)", 
                display: "block", 
                marginBottom: "0.5rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}>Device Type</label>
              <input
                type="text"
                id="deviceType"
                value={formData.deviceType}
                onChange={(e) => setFormData((prev) => ({ ...prev, deviceType: e.target.value }))}
                style={{ 
                  width: "100%",
                  border: "1px solid rgba(229, 197, 122, 0.38)",
                  borderRadius: "1rem",
                  background: "rgba(10, 10, 10, 0.78)",
                  color: "var(--color-ink)",
                  padding: "0.85rem 1rem",
                  outline: "none",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.95rem",
                }}
                placeholder="e.g. Desktop, Mobile, Tablet"
              />
            </div>

            <div>
              <label htmlFor="userEmail" style={{ 
                color: "var(--color-highlight)", 
                display: "block", 
                marginBottom: "0.5rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}>Email (optional)</label>
              <input
                type="email"
                id="userEmail"
                value={formData.userEmail}
                onChange={(e) => setFormData((prev) => ({ ...prev, userEmail: e.target.value }))}
                style={{ 
                  width: "100%",
                  border: "1px solid rgba(229, 197, 122, 0.38)",
                  borderRadius: "1rem",
                  background: "rgba(10, 10, 10, 0.78)",
                  color: "var(--color-ink)",
                  padding: "0.85rem 1rem",
                  outline: "none",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.95rem",
                }}
                placeholder="your.email@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !isFirebaseConfigured}
              style={{
                background: "var(--color-highlight)",
                color: "#080808",
                padding: "0.9rem 1.4rem",
                border: "none",
                borderRadius: "999px",
                cursor: submitting ? "not-allowed" : "pointer",
                opacity: submitting ? 0.7 : 1,
                fontSize: "1rem",
                fontWeight: "bold",
                alignSelf: "flex-start",
                fontFamily: "var(--font-body)",
                letterSpacing: "0.06em",
                boxShadow: "0 8px 32px rgba(201, 168, 76, 0.22)",
                transition: "transform 180ms ease, box-shadow 180ms ease",
              }}
            >
              {submitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}

"use client";

import Link from "next/link";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import Breadcrumb from "@/components/breadcrumb";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/lib/firebase-client";
import { useAuth } from "@/lib/use-auth";
import {
  christianTraditions,
  emptyProfileForm,
  toProfileFormValues,
  type SocialLinks,
  type UserProfileFormValues,
} from "@/lib/user-profile";

const socialFields: Array<keyof SocialLinks> = ["youtube", "facebook", "instagram", "x", "tiktok"];
const allowedAvatarTypes = ["image/jpeg", "image/png", "image/webp"];
const avatarSizeLimitBytes = 2 * 1024 * 1024;
const pendingAvatarPath = (uid: string) => `profile_images_pending/${uid}/avatar`;

function SignInPrompt() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-10">
      <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-highlight)]">
          Profile
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[var(--color-ink)]">
          Sign in required
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
          Sign in to update your profile.
        </p>
        <Link
          href="/login?next=/user-panel"
          className="mt-5 inline-flex rounded-full bg-[var(--color-highlight)] px-5 py-2 text-sm font-semibold text-[#080808]"
        >
          Sign in
        </Link>
      </div>
    </section>
  );
}

function normalizeFormValues(values: UserProfileFormValues): UserProfileFormValues {
  return {
    displayName: values.displayName.trim(),
    christianTradition: values.christianTradition,
    bio: values.bio.trim(),
    websiteUrl: values.websiteUrl.trim(),
    socialLinks: {
      youtube: values.socialLinks.youtube.trim(),
      facebook: values.socialLinks.facebook.trim(),
      instagram: values.socialLinks.instagram.trim(),
      x: values.socialLinks.x.trim(),
      tiktok: values.socialLinks.tiktok.trim(),
    },
  };
}

export default function ProfileClient() {
  const { user, loading } = useAuth();
  const [form, setForm] = useState<UserProfileFormValues>(emptyProfileForm);
  const [profileExists, setProfileExists] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarMessage, setAvatarMessage] = useState("");
  const [avatarError, setAvatarError] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      if (!user || !db) {
        setProfileLoading(false);
        return;
      }

      setProfileLoading(true);
      setError("");

      try {
        const snapshot = await getDoc(doc(db, "users", user.uid));
        if (!cancelled) {
          setProfileExists(snapshot.exists());
          setForm(toProfileFormValues(snapshot.data()));
        }
      } catch (loadError) {
        console.error("Error loading user profile:", loadError);
        if (!cancelled) {
          setError("Unable to load your profile right now.");
        }
      } finally {
        if (!cancelled) {
          setProfileLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [user]);

  function updateField<T extends keyof UserProfileFormValues>(
    field: T,
    value: UserProfileFormValues[T],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateSocialField(field: keyof SocialLinks, value: string) {
    setForm((current) => ({
      ...current,
      socialLinks: {
        ...current.socialLinks,
        [field]: value,
      },
    }));
  }

  function handleAvatarFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setAvatarMessage("");
    setAvatarError("");

    if (!file) {
      setAvatarFile(null);
      return;
    }

    if (!allowedAvatarTypes.includes(file.type)) {
      setAvatarFile(null);
      setAvatarError("Please choose a JPG, PNG, or WebP image.");
      return;
    }

    if (file.size > avatarSizeLimitBytes) {
      setAvatarFile(null);
      setAvatarError("Please choose an image smaller than 2MB.");
      return;
    }

    setAvatarFile(file);
  }

  async function handleAvatarUpload() {
    if (!user || !db || !storage) {
      setAvatarError("You must be signed in to upload a profile image.");
      return;
    }

    if (!avatarFile) {
      setAvatarError("Choose an image before uploading.");
      return;
    }

    setAvatarUploading(true);
    setAvatarMessage("");
    setAvatarError("");

    const avatarStoragePath = pendingAvatarPath(user.uid);

    try {
      await uploadBytes(ref(storage, avatarStoragePath), avatarFile, {
        contentType: avatarFile.type,
        customMetadata: {
          uid: user.uid,
          moderationStatus: "pending",
        },
      });

      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          email: user.email ?? "",
          avatarStatus: "pending",
          avatarStoragePath,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      setAvatarFile(null);
      setAvatarMessage("Profile image uploaded and pending review.");
    } catch (uploadError) {
      console.error("Error uploading profile image:", uploadError);
      setAvatarError("Unable to upload your profile image right now.");
    } finally {
      setAvatarUploading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user || !db) {
      setError("You must be signed in to save your profile.");
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    const normalized = normalizeFormValues(form);
    const userRef = doc(db, "users", user.uid);
    const editableData = {
      uid: user.uid,
      email: user.email ?? "",
      ...normalized,
      updatedAt: serverTimestamp(),
    };

    try {
      if (profileExists) {
        await setDoc(userRef, editableData, { merge: true });
      } else {
        await setDoc(userRef, {
          ...editableData,
          role: "user",
          isBanned: false,
          isRestricted: false,
          createdAt: serverTimestamp(),
        });
        setProfileExists(true);
      }

      setForm(normalized);
      setMessage("Profile saved.");
    } catch (saveError) {
      console.error("Error saving user profile:", saveError);
      setError("Unable to save your profile right now.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="px-4 py-10 text-sm text-[var(--color-muted)]">
        Checking sign-in status...
      </section>
    );
  }

  if (!user) {
    return <SignInPrompt />;
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-14">
      <Breadcrumb items={[
        { label: "Home", href: "/" },
        { label: "User Panel", href: "/user-panel" },
        { label: "Edit Profile" },
      ]} />

      <section className="mt-2 rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--color-highlight)]">
          Profile
        </p>
        <h1 className="site-page-title mt-3">Edit Profile</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
          Signed in as <span className="text-[var(--color-ink)]">{user.email ?? "your account"}</span>
        </p>
      </section>

      <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--color-highlight)]">
          Profile Image
        </p>
        <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--color-ink)]">
          Upload for review
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
          JPG, PNG, or WebP only. Max 2MB. Uploaded images are reviewed before they appear publicly.
        </p>
        <div className="mt-5 grid gap-3">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleAvatarFileChange}
            className="w-full rounded-[0.75rem] border border-[var(--color-border)] bg-[rgba(10,10,10,0.48)] px-4 py-3 text-sm text-[var(--color-ink)] file:mr-4 file:rounded-full file:border-0 file:bg-[var(--color-highlight)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#080808]"
          />
          {avatarFile && (
            <p className="text-sm text-[var(--color-muted)]">
              Selected: {avatarFile.name}
            </p>
          )}
          {avatarMessage && <p className="text-sm text-green-300">{avatarMessage}</p>}
          {avatarError && <p className="text-sm text-red-300">{avatarError}</p>}
          <button
            type="button"
            onClick={handleAvatarUpload}
            disabled={avatarUploading || !avatarFile}
            className="w-fit rounded-full bg-[var(--color-highlight)] px-6 py-3 text-sm font-semibold text-[#080808] disabled:opacity-60"
          >
            {avatarUploading ? "Uploading..." : "Upload Image"}
          </button>
        </div>
      </section>

      <form
        onSubmit={handleSubmit}
        className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6"
      >
        {profileLoading ? (
          <p className="text-sm text-[var(--color-muted)]">Loading profile...</p>
        ) : (
          <div className="grid gap-5">
            <label className="grid gap-2 text-sm text-[var(--color-ink)]">
              Display name
              <input
                type="text"
                value={form.displayName}
                onChange={(event) => updateField("displayName", event.target.value)}
                className="rounded-[0.75rem] border border-[var(--color-border)] bg-[rgba(10,10,10,0.48)] px-4 py-3 text-[var(--color-ink)] outline-none focus:border-[var(--color-highlight)]"
              />
            </label>

            <label className="grid gap-2 text-sm text-[var(--color-ink)]">
              Christian tradition
              <select
                value={form.christianTradition}
                onChange={(event) =>
                  updateField(
                    "christianTradition",
                    event.target.value as UserProfileFormValues["christianTradition"],
                  )
                }
                className="rounded-[0.75rem] border border-[var(--color-border)] bg-[#101010] px-4 py-3 text-[var(--color-ink)] outline-none focus:border-[var(--color-highlight)]"
              >
                <option value="">Select tradition</option>
                {christianTraditions.map((tradition) => (
                  <option key={tradition} value={tradition}>
                    {tradition}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm text-[var(--color-ink)]">
              Bio
              <textarea
                value={form.bio}
                onChange={(event) => updateField("bio", event.target.value)}
                rows={5}
                className="rounded-[0.75rem] border border-[var(--color-border)] bg-[rgba(10,10,10,0.48)] px-4 py-3 text-[var(--color-ink)] outline-none focus:border-[var(--color-highlight)]"
              />
            </label>

            <label className="grid gap-2 text-sm text-[var(--color-ink)]">
              Website URL
              <input
                type="url"
                value={form.websiteUrl}
                onChange={(event) => updateField("websiteUrl", event.target.value)}
                className="rounded-[0.75rem] border border-[var(--color-border)] bg-[rgba(10,10,10,0.48)] px-4 py-3 text-[var(--color-ink)] outline-none focus:border-[var(--color-highlight)]"
              />
            </label>

            <fieldset className="grid gap-3">
              <legend className="text-sm text-[var(--color-ink)]">Social links</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {socialFields.map((field) => (
                  <label key={field} className="grid gap-2 text-sm capitalize text-[var(--color-muted)]">
                    {field}
                    <input
                      type="url"
                      value={form.socialLinks[field]}
                      onChange={(event) => updateSocialField(field, event.target.value)}
                      className="rounded-[0.75rem] border border-[var(--color-border)] bg-[rgba(10,10,10,0.48)] px-4 py-3 text-[var(--color-ink)] outline-none focus:border-[var(--color-highlight)]"
                    />
                  </label>
                ))}
              </div>
            </fieldset>

            {message && <p className="text-sm text-green-300">{message}</p>}
            {error && <p className="text-sm text-red-300">{error}</p>}

            <button
              type="submit"
              disabled={saving}
              className="w-fit rounded-full bg-[var(--color-highlight)] px-6 py-3 text-sm font-semibold text-[#080808] disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        )}
      </form>
    </main>
  );
}

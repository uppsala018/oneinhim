"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import AppHeader from "@/components/app-header";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import { catholicLibrary } from "@/lib/content";
import type { Verse } from "@/lib/content-types";
import { createStudyPersistence, type StudyState } from "@/lib/persistence";
import { shareVerse } from "@/lib/share";
import { hasSupabaseEnv, subscribeToAuthChanges } from "@/lib/supabase";

type BookMeta = {
  code: string;
  name: string;
  chapterCount: number;
  aliases?: string[];
};

type ChapterData = {
  work: string;
  code: string;
  book: string;
  chapterCount: number;
  chapter: number;
  summary: string | null;
  verses: Verse[];
};

type RemoteSearchResult = {
  kind: "catholic-search";
  id: string;
  title: string;
  detail: string;
  reference: string;
  bookCode: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
};

export default function CatholicReader({
  initialReference,
}: {
  initialReference?: {
    book?: string;
    chapter?: string;
    verse?: string;
  };
}) {
  const persistence = useMemo(() => createStudyPersistence(), []);
  const router = useRouter();
  const pathname = usePathname();
  const initialChapter = Number(initialReference?.chapter);
  const initialVerse = Number(initialReference?.verse);
  const [bookCatalog, setBookCatalog] = useState<BookMeta[]>([]);
  const [selectedBookCode, setSelectedBookCode] = useState(
    initialReference?.book || "genesis",
  );
  const [selectedChapterNumber, setSelectedChapterNumber] = useState(
    Number.isFinite(initialChapter) && initialChapter > 0 ? initialChapter : 1,
  );
  const [chapterData, setChapterData] = useState<ChapterData | null>(null);
  const [chapterLoading, setChapterLoading] = useState(true);
  const [chapterError, setChapterError] = useState<string | null>(null);
  const [selectedVerseId, setSelectedVerseId] = useState<string | null>(null);
  const [pendingVerseNumber, setPendingVerseNumber] = useState<number | null>(
    Number.isFinite(initialVerse) && initialVerse > 0 ? initialVerse : null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<RemoteSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDeuterocanon, setShowDeuterocanon] = useState(true);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [progress, setProgress] = useState<StudyState["progress"]>(null);
  const [hydrated, setHydrated] = useState(false);

  const applyLoadedStudyState = useCallback(
    (state: StudyState) => {
      setBookmarks(state.bookmarks);
      setNotes(state.notes);
      setProgress(state.progress);

      if (
        !initialReference?.book &&
        !initialReference?.chapter &&
        state.progress?.tab === "catholic" &&
        state.progress.book &&
        state.progress.chapter
      ) {
        setChapterLoading(true);
        setChapterError(null);
        setSelectedBookCode(state.progress.book);
        setSelectedChapterNumber(state.progress.chapter);
        setPendingVerseNumber(state.progress.verse ?? null);
      }
    },
    [initialReference?.book, initialReference?.chapter],
  );

  useEffect(() => {
    void fetch("/api/catholic/books")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Unable to load Catholic books.");
        }

        const payload = (await response.json()) as { books: BookMeta[] };
        setBookCatalog(payload.books);
      })
      .catch(() => {
        setBookCatalog([]);
      });
  }, []);

  useEffect(() => {
    void fetch(
      `/api/catholic/chapter?book=${encodeURIComponent(
        selectedBookCode,
      )}&chapter=${selectedChapterNumber}`,
    )
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Unable to load chapter.");
        }

        const payload = (await response.json()) as ChapterData;
        setChapterData(payload);

        const desiredVerseNumber = pendingVerseNumber;
        const matchingVerse =
          payload.verses.find((verse) => verse.number === desiredVerseNumber) ??
          payload.verses[0] ??
          null;
        setSelectedVerseId(matchingVerse?.id ?? null);
        if (matchingVerse) {
          setProgress({
            tab: "catholic",
            book: payload.code,
            chapter: payload.chapter,
            verse: matchingVerse.number,
            reference: matchingVerse.reference,
            updatedAt: new Date().toISOString(),
          });
        }
        setPendingVerseNumber(null);
      })
      .catch(() => {
        setChapterData(null);
        setSelectedVerseId(null);
        setChapterError("This Catholic chapter could not be loaded.");
      })
      .finally(() => {
        setChapterLoading(false);
      });
  }, [pendingVerseNumber, selectedBookCode, selectedChapterNumber]);

  useEffect(() => {
    void persistence.load().then((state) => {
      applyLoadedStudyState(state);
      setHydrated(true);
    });
  }, [applyLoadedStudyState, persistence]);

  useEffect(() => {
    if (!hasSupabaseEnv()) {
      return;
    }

    return subscribeToAuthChanges(() => {
      void persistence.load().then((state) => {
        applyLoadedStudyState(state);
        setHydrated(true);
      });
    });
  }, [applyLoadedStudyState, persistence]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    void persistence.save({ bookmarks, notes, progress });
  }, [bookmarks, hydrated, notes, persistence, progress]);

  useEffect(() => {
    const normalized = searchTerm.trim();

    if (!normalized) {
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      setSearchLoading(true);

      void fetch(`/api/catholic/search?q=${encodeURIComponent(normalized)}`, {
        signal: controller.signal,
      })
        .then(async (response) => {
          if (!response.ok) {
            throw new Error("Search failed.");
          }

          const payload = (await response.json()) as { results: RemoteSearchResult[] };
          setSearchResults(payload.results.slice(0, 8));
        })
        .catch((error: unknown) => {
          if (error instanceof DOMException && error.name === "AbortError") {
            return;
          }

          setSearchResults([]);
        })
        .finally(() => {
          setSearchLoading(false);
        });
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [searchTerm]);

  const selectedVerse =
    chapterData?.verses.find((verse) => verse.id === selectedVerseId) ??
    chapterData?.verses[0] ??
    null;
  const selectedBook = bookCatalog.find((book) => book.code === selectedBookCode);
  const selectedBookIndex = bookCatalog.findIndex((book) => book.code === selectedBookCode);
  const chapterOptions = Array.from(
    { length: selectedBook?.chapterCount ?? chapterData?.chapterCount ?? 1 },
    (_, index) => index + 1,
  );
  const selectedVerseNumber = selectedVerse?.number ?? null;
  const selectedNoteKey =
    selectedVerse?.reference ??
    `${chapterData?.book ?? selectedBook?.name ?? "Douay-Rheims"} ${selectedChapterNumber}`;
  const bookmarkSet = new Set(bookmarks);
  const matchingStudies = catholicLibrary.filter(
    (entry) =>
      entry.book.toLowerCase() === (chapterData?.book ?? selectedBook?.name ?? "").toLowerCase() &&
      entry.chapter === selectedChapterNumber,
  );
  const previousChapterTarget =
    selectedBook && selectedChapterNumber > 1
      ? { book: selectedBook.code, chapter: selectedChapterNumber - 1 }
      : selectedBookIndex > 0
        ? {
            book: bookCatalog[selectedBookIndex - 1].code,
            chapter: bookCatalog[selectedBookIndex - 1].chapterCount,
          }
        : null;
  const nextChapterTarget =
    selectedBook && selectedChapterNumber < selectedBook.chapterCount
      ? { book: selectedBook.code, chapter: selectedChapterNumber + 1 }
      : selectedBookIndex >= 0 && selectedBookIndex < bookCatalog.length - 1
        ? {
            book: bookCatalog[selectedBookIndex + 1].code,
            chapter: 1,
          }
        : null;
  const featuredStudy = matchingStudies[0] ?? catholicLibrary[0] ?? null;
  const visibleCrossReferences = selectedVerse?.crossRefs?.length
    ? selectedVerse.crossRefs.map((item) => item.text)
    : [
        "Genesis 1:1",
        "Psalm 33:6",
        "Proverbs 8:22",
        "1 John 1:1",
        "Colossians 1:15",
      ];

  function toggleBookmark(reference: string) {
    setBookmarks((current) =>
      current.includes(reference)
        ? current.filter((item) => item !== reference)
        : [...current, reference],
    );
  }

  function jumpToChapter(target: { book: string; chapter: number }) {
    setChapterLoading(true);
    setChapterError(null);
    setSelectedBookCode(target.book);
    setSelectedChapterNumber(target.chapter);
    setPendingVerseNumber(null);
  }

  function handleSearchSelection(result: RemoteSearchResult) {
    setSearchTerm("");
    setSearchResults([]);
    setChapterLoading(true);
    setChapterError(null);
    setSelectedBookCode(result.bookCode);
    setSelectedChapterNumber(result.chapter);
    setPendingVerseNumber(result.verse);
  }

  useEffect(() => {
    if (!pathname.startsWith("/library/catholic")) {
      return;
    }

    const params = new URLSearchParams();
    params.set("book", selectedBookCode);
    params.set("chapter", String(selectedChapterNumber));

    if (selectedVerseNumber) {
      params.set("verse", String(selectedVerseNumber));
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, selectedBookCode, selectedChapterNumber, selectedVerseNumber]);

  return (
    <>
      <div className="hidden lg:block">
        <AppHeader />
      </div>

      <section className="catholic-mobile mobile-app-shell lg:hidden">
        <header className="catholic-mobile__topbar">
          <Link href="/" className="catholic-mobile__icon-button" aria-label="Back home">
            ‹
          </Link>
          <h1>Douay-Rheims Catholic Bible</h1>
          <Link href="/library/settings" className="catholic-mobile__icon-button" aria-label="Settings">
            ⚙
          </Link>
        </header>

        <div className="catholic-mobile__selector">
          <span>▱</span>
          <select
            value={selectedBookCode}
            onChange={(event) => {
              setChapterLoading(true);
              setChapterError(null);
              setSelectedBookCode(event.target.value);
              setSelectedChapterNumber(1);
              setPendingVerseNumber(null);
            }}
            aria-label="Book"
          >
            {bookCatalog.map((book) => (
              <option key={book.code} value={book.code}>
                {book.name}
              </option>
            ))}
          </select>
          <select
            value={selectedChapterNumber}
            onChange={(event) => {
              setChapterLoading(true);
              setChapterError(null);
              setSelectedChapterNumber(Number(event.target.value));
              setPendingVerseNumber(null);
            }}
            aria-label="Chapter"
          >
            {chapterOptions.map((chapterNumber) => (
              <option key={chapterNumber} value={chapterNumber}>
                {chapterNumber}
              </option>
            ))}
          </select>
        </div>

        {chapterLoading ? (
          <p className="catholic-mobile__status">Loading chapter...</p>
        ) : null}
        {chapterError ? <p className="catholic-mobile__status">{chapterError}</p> : null}

        {selectedVerse ? (
          <section className="catholic-mobile__reading">
            <div className="catholic-mobile__reading-meta">
              <span>
                {chapterData?.chapter ?? selectedChapterNumber}:{selectedVerse.number}
              </span>
              <span>{selectedVerse.reference}</span>
            </div>
            <p>{selectedVerse.text}</p>
            <div className="catholic-mobile__actions">
              <button
                type="button"
                onClick={() => toggleBookmark(selectedVerse.reference)}
                aria-label="Bookmark"
              >
                ♡
              </button>
              <button type="button" aria-label="Share"
                onClick={() => void shareVerse(selectedVerse.reference, selectedVerse.text)}>
                ⇧
              </button>
            </div>
          </section>
        ) : null}

        {chapterData ? (
          <section className="catholic-mobile__chapter">
            {chapterData.verses.map((verse) => (
              <article
                key={verse.id}
                className={`catholic-mobile-verse ${
                  selectedVerseId === verse.id ? "catholic-mobile-verse--active" : ""
                }${bookmarkSet.has(verse.reference) ? " catholic-mobile-verse--bookmarked" : ""}`}
              >
                <button
                  type="button"
                  onClick={(event) => {
                    setSelectedVerseId(verse.id);
                    const article = event.currentTarget.closest(".catholic-mobile-verse");
                    window.setTimeout(() => {
                      article?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 80);
                    setProgress({
                      tab: "catholic",
                      book: selectedBookCode,
                      chapter: selectedChapterNumber,
                      verse: verse.number,
                      reference: verse.reference,
                      updatedAt: new Date().toISOString(),
                    });
                  }}
                >
                  <span>{verse.number}</span>
                  <p>{verse.text}</p>
                </button>

                {selectedVerseId === verse.id ? (
                  <div className="catholic-mobile-verse__actions">
                    <button type="button" onClick={() => toggleBookmark(verse.reference)}
                      className={bookmarkSet.has(verse.reference) ? "catholic-mobile-verse__actions-saved" : ""}>
                      {bookmarkSet.has(verse.reference) ? "★ Saved" : "☆ Save"}
                    </button>
                    <button type="button" onClick={() => void shareVerse(verse.reference, verse.text)}>
                      Share
                    </button>
                    <span>{verse.reference}</span>
                  </div>
                ) : null}
                {selectedVerseId === verse.id && verse.notes?.length ? (
                  <div className="catholic-mobile-verse__notes">
                    {verse.notes.map((note, index) => (
                      <div
                        key={`${verse.id}-mobile-note-${index}`}
                        className="catholic-mobile-verse__note"
                      >
                        <strong>{note.label ? note.label : String.fromCharCode(65 + index)}</strong>
                        <p>{note.text}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </section>
        ) : null}

        {(featuredStudy || visibleCrossReferences.length) ? (
          <section className="catholic-mobile__study-strip">
            {featuredStudy ? (
              <Link
                href={`/library/catholic/${featuredStudy.slug}`}
                className="catholic-mobile__study-chip"
              >
                <span>Roman Catechism</span>
                <strong>{featuredStudy.catechismReference}</strong>
              </Link>
            ) : null}
            {visibleCrossReferences.slice(0, 3).map((reference) => (
              <div key={reference} className="catholic-mobile__study-chip">
                <span>Cross Reference</span>
                <strong>{reference}</strong>
              </div>
            ))}
          </section>
        ) : null}

        <div className="catholic-mobile__divider">✣</div>

        {featuredStudy ? (
          <section className="catholic-mobile-catechism">
            <div className="catholic-mobile-catechism__icon">☩</div>
            <div>
              <h2>Roman Catechism Reference</h2>
              <p>
                {featuredStudy.catechismReference} - {featuredStudy.catechismExcerpt}
              </p>
              <Link href={`/library/catholic/${featuredStudy.slug}`}>
                Read Full Entry ›
              </Link>
            </div>
          </section>
        ) : null}

        <section className="catholic-mobile-crossrefs">
          <div className="catholic-mobile-crossrefs__title">
            <span>☩</span>
            <h2>Cross References</h2>
            <span>▱</span>
          </div>
          <div>
            {visibleCrossReferences.slice(0, 5).map((reference) => (
              <button
                key={reference}
                type="button"
                className="catholic-mobile-crossrefs__row"
              >
                <span>•</span>
                <strong>{reference}</strong>
                <em>
                  {reference === selectedVerse?.reference
                    ? selectedVerse.text
                    : "Open related passage..."}
                </em>
                <span>›</span>
              </button>
            ))}
          </div>
        </section>

        <label className="catholic-mobile__toggle">
          <span>▱</span>
          <strong>Show Deuterocanonical Books</strong>
          <input
            type="checkbox"
            checked={showDeuterocanon}
            onChange={(event) => setShowDeuterocanon(event.target.checked)}
          />
        </label>

        <div className="catholic-mobile__chapter-actions">
          <button
            type="button"
            onClick={() => previousChapterTarget && jumpToChapter(previousChapterTarget)}
            disabled={!previousChapterTarget}
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => nextChapterTarget && jumpToChapter(nextChapterTarget)}
            disabled={!nextChapterTarget}
          >
            Next
          </button>
        </div>

        <MobileBottomNav active="Home" />
      </section>

      <section className="mx-auto hidden max-w-7xl px-6 py-14 sm:px-8 lg:block lg:px-12">
        <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-[var(--color-soft)]">
          <Link
            href="/library"
            className="rounded-full border border-[var(--color-border)] px-4 py-2"
          >
            Library Home
          </Link>
          <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-2">
            Persistence:{" "}
            {persistence.syncStatus === "supabase-ready" ? "Supabase ready" : "Local only"}
          </span>
          <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-2">
            Catholic canon: {bookCatalog.length === 73 ? "Full Douay-Rheims loaded" : "Loading"}
          </span>
        </div>

        <div className="grid gap-10 lg:grid-cols-[0.38fr_0.62fr]">
          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--color-highlight)]">
                Catholic Bible
              </p>
              <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl text-[var(--color-ink)]">
                Full Douay-Rheims with catechesis beside it.
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                The Catholic section now has a real 73-book reader, chapter navigation,
                search, notes, and companion catechism-linked studies.
              </p>
            </div>

            <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
              <label
                htmlFor="catholic-search"
                className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--color-highlight)]"
              >
                Search
              </label>
              <input
                id="catholic-search"
                value={searchTerm}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  setSearchTerm(nextValue);
                  if (!nextValue.trim()) {
                    setSearchResults([]);
                  }
                }}
                placeholder="Search the Douay-Rheims or enter John 1:1"
                className="mt-4 w-full rounded-2xl border border-[var(--color-border)] bg-[rgba(5,17,34,0.78)] px-4 py-3 text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-soft)]"
              />

              {searchTerm.trim() && searchLoading ? (
                <p className="mt-4 text-sm text-[var(--color-muted)]">Searching...</p>
              ) : null}

              {searchResults.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {searchResults.map((result) => (
                    <button
                      key={`${result.kind}-${result.id}`}
                      type="button"
                      onClick={() => handleSearchSelection(result)}
                      className="w-full rounded-2xl border border-[var(--color-border)] bg-[rgba(5,17,34,0.58)] px-4 py-3 text-left transition hover:bg-[rgba(7,22,44,0.92)]"
                    >
                      <p className="font-semibold text-[var(--color-highlight)]">
                        {result.title}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
                        {result.detail}
                      </p>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--color-highlight)]">
                Saved
              </p>
              {progress?.tab === "catholic" && progress.reference ? (
                <div className="mt-4 rounded-2xl border border-[var(--color-border)] bg-[rgba(5,17,34,0.58)] px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-soft)]">
                    Resume
                  </p>
                  <p className="mt-2 text-sm text-[var(--color-ink)]">{progress.reference}</p>
                </div>
              ) : null}
              <div className="mt-4 space-y-3">
                {bookmarks.length === 0 ? (
                  <p className="text-sm leading-7 text-[var(--color-muted)]">
                    No bookmarks yet. Save key Catholic passages as you study.
                  </p>
                ) : (
                  bookmarks.map((reference) => (
                    <div
                      key={reference}
                      className="rounded-2xl border border-[var(--color-border)] bg-[rgba(5,17,34,0.58)] px-4 py-3 text-sm text-[var(--color-ink)]"
                    >
                      {reference}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--color-highlight)]">
                Resources
              </p>
              <a
                href="https://www.catholicculture.org/"
                target="_blank"
                rel="noreferrer"
                className="mt-4 block rounded-2xl border border-[var(--color-border)] bg-[rgba(5,17,34,0.58)] px-4 py-4 transition hover:bg-[rgba(7,22,44,0.92)]"
              >
                <p className="font-semibold text-[var(--color-ink)]">Catholic Culture</p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                  Catholic articles, liturgical material, and study resources to pair with the
                  Douay-Rheims reader and catechism library.
                </p>
              </a>
            </div>
          </aside>

          <div className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-[0.62fr_0.38fr]">
              <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--color-highlight)]">
                      {chapterData?.work ?? "Douay-Rheims"}
                    </p>
                    <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[var(--color-ink)]">
                      {chapterData?.book ?? selectedBook?.name ?? "Loading"}{" "}
                      {chapterData?.chapter ?? selectedChapterNumber}
                    </h1>
                  </div>
                  {selectedVerse ? (
                    <button
                      type="button"
                      onClick={() => toggleBookmark(selectedVerse.reference)}
                      className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-soft)]"
                    >
                      {bookmarkSet.has(selectedVerse.reference) ? "Bookmarked" : "Bookmark"}
                    </button>
                  ) : null}
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="text-sm text-[var(--color-soft)]">
                    <span className="mb-2 block text-xs uppercase tracking-[0.25em] text-[var(--color-highlight)]">
                      Book
                    </span>
                    <select
                      value={selectedBookCode}
                      onChange={(event) => {
                        setChapterLoading(true);
                        setChapterError(null);
                        setSelectedBookCode(event.target.value);
                        setSelectedChapterNumber(1);
                        setPendingVerseNumber(null);
                      }}
                      className="w-full rounded-2xl border border-[var(--color-border)] bg-[rgba(5,17,34,0.78)] px-4 py-3 text-sm text-[var(--color-ink)] outline-none"
                    >
                      {bookCatalog.map((book) => (
                        <option key={book.code} value={book.code}>
                          {book.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="text-sm text-[var(--color-soft)]">
                    <span className="mb-2 block text-xs uppercase tracking-[0.25em] text-[var(--color-highlight)]">
                      Chapter
                    </span>
                    <select
                      value={selectedChapterNumber}
                      onChange={(event) => {
                        setChapterLoading(true);
                        setChapterError(null);
                        setSelectedChapterNumber(Number(event.target.value));
                        setPendingVerseNumber(null);
                      }}
                      className="w-full rounded-2xl border border-[var(--color-border)] bg-[rgba(5,17,34,0.78)] px-4 py-3 text-sm text-[var(--color-ink)] outline-none"
                    >
                      {chapterOptions.map((chapterNumber) => (
                        <option key={chapterNumber} value={chapterNumber}>
                          Chapter {chapterNumber}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => previousChapterTarget && jumpToChapter(previousChapterTarget)}
                    disabled={!previousChapterTarget}
                    className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-soft)] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous chapter
                  </button>
                  <button
                    type="button"
                    onClick={() => nextChapterTarget && jumpToChapter(nextChapterTarget)}
                    disabled={!nextChapterTarget}
                    className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-soft)] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next chapter
                  </button>
                  {selectedVerse ? (
                    <span className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-soft)]">
                      {selectedVerse.reference}
                    </span>
                  ) : null}
                </div>

                {chapterLoading ? (
                  <p className="mt-6 text-sm text-[var(--color-muted)]">Loading chapter...</p>
                ) : null}

                {chapterError ? (
                  <p className="mt-6 text-sm text-[#f3b3a6]">{chapterError}</p>
                ) : null}

                {chapterData?.summary ? (
                  <div className="mt-6 rounded-[1.5rem] border border-[var(--color-border)] bg-[rgba(5,17,34,0.5)] p-5">
                    <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-highlight)]">
                      Chapter Summary
                    </p>
                    <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                      {chapterData.summary}
                    </p>
                  </div>
                ) : null}

                {chapterData ? (
                  <div className="mt-6 space-y-4">
                    {chapterData.verses.map((verse) => (
                      <button
                        key={verse.id}
                        type="button"
                        onClick={() => {
                          setSelectedVerseId(verse.id);
                          setProgress({
                            tab: "catholic",
                            book: selectedBookCode,
                            chapter: selectedChapterNumber,
                            verse: verse.number,
                            reference: verse.reference,
                            updatedAt: new Date().toISOString(),
                          });
                        }}
                        className={`w-full rounded-[1.5rem] border p-5 text-left transition ${
                          selectedVerseId === verse.id
                            ? "border-[var(--color-highlight)] bg-[rgba(10,28,55,0.96)]"
                            : "border-[var(--color-border)] bg-[rgba(5,17,34,0.5)]"
                        }`}
                      >
                        <p className="text-sm leading-8 text-[var(--color-ink)]">
                          <span className="mr-3 font-[family-name:var(--font-display)] text-3xl text-[var(--color-highlight)]">
                            {verse.number}
                          </span>
                          {verse.text}
                        </p>
                        {verse.notes?.length ? (
                          <div className="mt-4 space-y-2">
                            {verse.notes.map((note, index) => (
                              <div
                                key={`${verse.id}-note-${index}`}
                                className="rounded-2xl border border-[var(--color-border)] bg-[rgba(12,25,44,0.66)] px-4 py-3"
                              >
                                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-highlight)]">
                                  Note {note.label ? note.label : index + 1}
                                </p>
                                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                                  {note.text}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : null}
                        {verse.crossRefs?.length ? (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {verse.crossRefs.map((item, index) => (
                              <span
                                key={`${verse.id}-xref-${index}`}
                                className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-highlight)]"
                              >
                                {item.text}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="space-y-6">
                <div className="rounded-[2rem] border border-[var(--color-border)] bg-[linear-gradient(180deg,rgba(75,38,40,0.98),rgba(17,21,40,0.94))] p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--color-highlight)]">
                    Catechesis
                  </p>
                  <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--color-ink)]">
                    Roman Catechism companion studies
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                    The full Catholic Bible now sits beside doctrine-linked study entries.
                    Use the companion cards below to move from a chapter into catechism-focused reading.
                  </p>
                  <Link
                    href="/library/catechism"
                    className="mt-5 inline-flex rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-highlight)]"
                  >
                    Open full catechism
                  </Link>
                </div>

                <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--color-highlight)]">
                      Companion Studies
                    </p>
                    <Link
                      href="/library/catholic/john-prologue"
                      className="text-sm text-[var(--color-soft)]"
                    >
                      Open examples
                    </Link>
                  </div>
                  <div className="mt-5 space-y-4">
                    {(matchingStudies.length > 0 ? matchingStudies : catholicLibrary).map((entry) => (
                      <Link
                        key={entry.slug}
                        href={`/library/catholic/${entry.slug}`}
                        className="block rounded-[1.5rem] border border-[var(--color-border)] bg-[rgba(5,17,34,0.56)] p-4 transition hover:bg-[rgba(9,26,52,0.9)]"
                      >
                        <p className="font-semibold text-[var(--color-highlight)]">{entry.title}</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--color-soft)]">
                          {entry.catechismReference}
                        </p>
                        <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                          {entry.catechismExcerpt}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--color-highlight)]">
                    Study Notes
                  </p>
                  <textarea
                    value={notes[selectedNoteKey] ?? ""}
                    onChange={(event) =>
                      setNotes((current) => ({
                        ...current,
                        [selectedNoteKey]: event.target.value,
                      }))
                    }
                    placeholder={`Write notes for ${selectedNoteKey}`}
                    className="mt-4 min-h-44 w-full rounded-[1.5rem] border border-[var(--color-border)] bg-[rgba(5,17,34,0.68)] px-4 py-4 text-sm leading-7 text-[var(--color-ink)] outline-none placeholder:text-[var(--color-soft)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import AppHeader from "@/components/app-header";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import { readPreferences } from "@/lib/user-preferences";
import {
  catholicReading,
  fathers,
  getCatholicVerse,
  historyTopics,
} from "@/lib/content";
import type {
  ArticleCard,
  LexiconEntry,
  SearchResult,
  Verse,
} from "@/lib/content-types";
import { shareVerse } from "@/lib/share";
import { createStudyPersistence, type StudyState } from "@/lib/persistence";
import { hasSupabaseEnv, subscribeToAuthChanges } from "@/lib/supabase";

export type WorkspaceTab = "reader" | "catholic" | "fathers" | "history" | "notes";

type BookMeta = {
  code: string;
  name: string;
  chapterCount: number;
};

type ChapterData = {
  work: string;
  code: string;
  book: string;
  chapterCount: number;
  chapter: number;
  verses: Verse[];
};

type RemoteSearchResult =
  | {
      kind: "kjv-search";
      id: string;
      title: string;
      detail: string;
      reference: string;
      bookCode: string;
      book: string;
      chapter: number;
      verse: number;
      text: string;
    }
  | {
      kind: "strongs";
      id: string;
      title: string;
      detail: string;
      strongsId: string;
    };

type WorkspaceSearchResult = SearchResult | RemoteSearchResult;

const supplementalSearchIndex: SearchResult[] = [
  ...catholicReading.verses.map((verse) => ({
    id: verse.id,
    title: verse.reference,
    detail: verse.text,
    target: { kind: "catholic-verse", verseId: verse.id } as const,
  })),
  ...fathers.map((card) => ({
    id: card.id,
    title: card.title,
    detail: card.summary,
    target: { kind: "father", cardId: card.id } as const,
  })),
  ...historyTopics.map((card) => ({
    id: card.id,
    title: card.title,
    detail: card.summary,
    target: { kind: "history", cardId: card.id } as const,
  })),
];

function CardShelf({
  title,
  cards,
}: {
  title: string;
  cards: ArticleCard[];
}) {
  return (
    <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
      <h3 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-ink)]">
        {title}
      </h3>
      <div className="mt-6 grid gap-4">
        {cards.map((card) => (
          <article
            key={card.id}
            className="rounded-[1.5rem] border border-[var(--color-border)] bg-[rgba(5,17,34,0.5)] p-5"
          >
            <div className="flex items-center justify-between gap-4">
              <h4 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-highlight)]">
                {card.title}
              </h4>
              <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--color-soft)]">
                {card.era}
              </span>
            </div>
            <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
              {card.summary}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

function isRemoteSearchResult(result: WorkspaceSearchResult): result is RemoteSearchResult {
  return "kind" in result;
}

function normalizeKjvBookCode(bookCode: string | undefined, catalog: BookMeta[]) {
  const normalized = (bookCode ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "");

  if (!normalized) {
    return "Gen";
  }

  const match = catalog.find((book) => {
    const bookCodeNormalized = book.code.toLowerCase().replace(/[^a-z0-9]+/g, "");
    const bookNameNormalized = book.name.toLowerCase().replace(/[^a-z0-9]+/g, "");
    return normalized === bookCodeNormalized || normalized === bookNameNormalized;
  });

  if (match) {
    return match.code;
  }

  if (normalized === "psalm" || normalized === "psalms" || normalized === "psa" || normalized === "ps") {
    return catalog.find((book) => book.code === "Psa")?.code ?? "Gen";
  }

  if (
    normalized === "song" ||
    normalized === "sos" ||
    normalized === "songofsongs" ||
    normalized === "songofsolomon"
  ) {
    return catalog.find((book) => book.code === "Sng")?.code ?? "Gen";
  }

  if (normalized === "rev" || normalized === "revelation" || normalized === "revelations") {
    return catalog.find((book) => book.code === "Rev")?.code ?? "Gen";
  }

  return catalog.length ? catalog[0].code : "Gen";
}

export default function StudyWorkspace({
  initialTab = "reader",
  initialReference,
}: {
  initialTab?: WorkspaceTab;
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
  const [activeTab, setActiveTab] = useState<WorkspaceTab>(initialTab);
  const [bookCatalog, setBookCatalog] = useState<BookMeta[]>([]);
  const [bookCatalogLoaded, setBookCatalogLoaded] = useState(false);
  const [studyStateLoaded, setStudyStateLoaded] = useState(false);
  const [selectedBookCode, setSelectedBookCode] = useState(initialReference?.book || "Gen");
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
  const [selectedStrongsId, setSelectedStrongsId] = useState("H430");
  const [selectedEntry, setSelectedEntry] = useState<LexiconEntry | null>(null);
  const [lexiconLoading, setLexiconLoading] = useState(true);
  const [preferences] = useState(() => readPreferences());
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<WorkspaceSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedCatholicVerseId, setSelectedCatholicVerseId] = useState(
    catholicReading.verses[0].id,
  );
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [progress, setProgress] = useState<StudyState["progress"]>(null);
  const [hydrated, setHydrated] = useState(false);

  const applyLoadedStudyState = useCallback((state: StudyState) => {
    setBookmarks(state.bookmarks);
    setNotes(state.notes);
    setProgress(state.progress);

    if (
      !initialReference?.book &&
      !initialReference?.chapter &&
      initialTab === "reader" &&
      state.progress?.book &&
      state.progress.chapter
    ) {
      setSelectedBookCode(state.progress.book);
      setSelectedChapterNumber(state.progress.chapter);
      setPendingVerseNumber(state.progress.verse ?? null);

      if (state.progress.strongsId) {
        setLexiconLoading(true);
        setSelectedStrongsId(state.progress.strongsId);
      }
    }
  }, [initialReference?.book, initialReference?.chapter, initialTab]);

  useEffect(() => {
    void fetch("/api/kjv/books")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Unable to load Bible books.");
        }

        const payload = (await response.json()) as { books: BookMeta[] };
        setBookCatalog(payload.books);
      })
      .catch(() => {
        setBookCatalog([{ code: "Gen", name: "Genesis", chapterCount: 50 }]);
      })
      .finally(() => {
        setBookCatalogLoaded(true);
      });
  }, []);

  useEffect(() => {
    if (!bookCatalogLoaded || !studyStateLoaded) {
      return;
    }

    void fetch(
      `/api/kjv/chapter?book=${encodeURIComponent(
        normalizeKjvBookCode(selectedBookCode, bookCatalog),
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
        const nextStrongsId = matchingVerse?.strongs?.[0]?.strongsId;
        if (nextStrongsId) {
          setLexiconLoading(true);
          setSelectedEntry(null);
          setSelectedStrongsId(nextStrongsId);
        }
        if (matchingVerse) {
          setProgress({
            tab: "reader",
            book: payload.code,
            chapter: payload.chapter,
            verse: matchingVerse.number,
            reference: matchingVerse.reference,
            strongsId: nextStrongsId,
            updatedAt: new Date().toISOString(),
          });
        }
        setPendingVerseNumber(null);
      })
      .catch(() => {
        setChapterData(null);
        setSelectedVerseId(null);
        setChapterError("This chapter could not be loaded.");
      })
      .finally(() => {
        setChapterLoading(false);
      });
  }, [bookCatalog, bookCatalogLoaded, pendingVerseNumber, selectedBookCode, selectedChapterNumber, studyStateLoaded]);

  useEffect(() => {
    if (!selectedStrongsId) {
      return;
    }

    void fetch(`/api/strongs/${encodeURIComponent(selectedStrongsId)}`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Unable to load Strong's entry.");
        }

        const payload = (await response.json()) as LexiconEntry;
        setSelectedEntry(payload);
      })
      .catch(() => {
        setSelectedEntry(null);
      })
      .finally(() => {
        setLexiconLoading(false);
      });
  }, [selectedStrongsId]);

  useEffect(() => {
    void persistence.load().then((state) => {
      applyLoadedStudyState(state);
      setHydrated(true);
      setStudyStateLoaded(true);
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
    const normalized = searchTerm.trim().toLowerCase();

    if (!normalized) {
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      setSearchLoading(true);

      const localResults = supplementalSearchIndex.filter((item) => {
        const haystack = `${item.title} ${item.detail}`.toLowerCase();
        return haystack.includes(normalized);
      });

      void fetch(`/api/kjv/search?q=${encodeURIComponent(searchTerm.trim())}`, {
        signal: controller.signal,
      })
        .then(async (response) => {
          if (!response.ok) {
            throw new Error("Search failed.");
          }

          const payload = (await response.json()) as { results: RemoteSearchResult[] };
          setSearchResults([...payload.results, ...localResults].slice(0, 8));
        })
        .catch((error: unknown) => {
          if (
            error instanceof DOMException &&
            error.name === "AbortError"
          ) {
            return;
          }

          setSearchResults(localResults.slice(0, 8));
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
    chapterData?.verses.find((verse) => verse.id === selectedVerseId) ?? chapterData?.verses[0] ?? null;
  const selectedCatholicVerse = getCatholicVerse(selectedCatholicVerseId);
  const resolvedSelectedBookCode = normalizeKjvBookCode(selectedBookCode, bookCatalog);
  const selectedBook = bookCatalog.find((book) => book.code === resolvedSelectedBookCode);
  const selectedBookIndex = bookCatalog.findIndex((book) => book.code === resolvedSelectedBookCode);
  const showStrongs = preferences.showStrongs;
  const chapterOptions = Array.from(
    { length: selectedBook?.chapterCount ?? chapterData?.chapterCount ?? 1 },
    (_, index) => index + 1,
  );
  const normalizedSearchTerm = searchTerm.trim();
  const visibleSearchResults = normalizedSearchTerm ? searchResults : [];
  const selectedVerseNumber = selectedVerse?.number ?? null;
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
  const selectedNoteKey =
    activeTab === "reader"
      ? selectedVerse?.reference ??
        `${chapterData?.book ?? selectedBook?.name ?? "KJV"} ${selectedChapterNumber}`
      : activeTab === "catholic"
        ? selectedCatholicVerse.reference
        : "general";
  const bookmarkSet = new Set(bookmarks);

  function toggleBookmark(reference: string) {
    setBookmarks((current) =>
      current.includes(reference)
        ? current.filter((item) => item !== reference)
        : [...current, reference],
    );
  }

  function handleSearchSelection(result: WorkspaceSearchResult) {
      setSearchTerm("");
      setSearchResults([]);

    if (isRemoteSearchResult(result)) {
      if (result.kind === "strongs") {
        setActiveTab("reader");
        setLexiconLoading(true);
        setSelectedStrongsId(result.strongsId);
        return;
      }

      setActiveTab("reader");
      setChapterLoading(true);
      setChapterError(null);
      setSelectedBookCode(result.bookCode);
      setSelectedChapterNumber(result.chapter);
      setPendingVerseNumber(result.verse);
      return;
    }

    switch (result.target.kind) {
      case "catholic-verse":
        setActiveTab("catholic");
        setSelectedCatholicVerseId(result.target.verseId);
        break;
      case "catechism":
        void router.push(`/library/catechism/${result.target.slug}`);
        break;
      case "father":
        setActiveTab("fathers");
        break;
      case "history":
        setActiveTab("history");
        break;
      case "kjv-verse":
      case "strongs":
        setActiveTab("reader");
        break;
    }
  }

  function jumpToChapter(target: { book: string; chapter: number }) {
    setChapterLoading(true);
    setChapterError(null);
    setSelectedBookCode(target.book);
    setSelectedChapterNumber(target.chapter);
    setPendingVerseNumber(null);
  }

  useEffect(() => {
    if (!pathname.startsWith("/library/kjv")) {
      return;
    }

    const params = new URLSearchParams();
    params.set("book", resolvedSelectedBookCode);
    params.set("chapter", String(selectedChapterNumber));

    if (selectedVerseNumber) {
      params.set("verse", String(selectedVerseNumber));
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, resolvedSelectedBookCode, router, selectedChapterNumber, selectedVerseNumber]);

  return (
    <>
      <div className="hidden lg:block">
        <AppHeader />
      </div>

      {activeTab === "reader" ? (
        <section
          className={`kjv-mobile mobile-app-shell ${
            preferences.compactReader ? "kjv-mobile--compact" : ""
          }`}
        >
          <header className="kjv-mobile__topbar">
            <Link href="/" className="kjv-mobile__icon-button" aria-label="Back home">
              ‹
            </Link>
            <h1>KJV Bible + Strong&apos;s</h1>
            <Link href="/library/settings" className="kjv-mobile__icon-button" aria-label="Settings">
              ⚙
            </Link>
          </header>

          <div className="kjv-mobile__chapterbar">
            <button
              type="button"
              onClick={() => previousChapterTarget && jumpToChapter(previousChapterTarget)}
              disabled={!previousChapterTarget}
              aria-label="Previous chapter"
            >
              ‹
            </button>
            <div>
              <span>▱</span>
              <strong>
                {chapterData?.book ?? selectedBook?.name ?? "Genesis"}{" "}
                {chapterData?.chapter ?? selectedChapterNumber}
              </strong>
            </div>
            <button
              type="button"
              onClick={() => nextChapterTarget && jumpToChapter(nextChapterTarget)}
              disabled={!nextChapterTarget}
              aria-label="Next chapter"
            >
              ›
            </button>
          </div>

          <div className="kjv-mobile__selectors">
            <select
              value={resolvedSelectedBookCode}
              onChange={(event) => {
                const nextBookCode = event.target.value;
                setChapterLoading(true);
                setChapterError(null);
                setSelectedBookCode(nextBookCode);
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
                  Chapter {chapterNumber}
                </option>
              ))}
            </select>
          </div>

          {chapterLoading ? (
            <p className="kjv-mobile__status">Loading chapter...</p>
          ) : null}
          {chapterError ? <p className="kjv-mobile__status">{chapterError}</p> : null}

          {chapterData ? (
            <div className="kjv-mobile__verses">
              {chapterData.verses.map((verse) => (
                <article key={verse.id} className={`kjv-mobile-verse${bookmarkSet.has(verse.reference) ? " kjv-mobile-verse--bookmarked" : ""}`}>
                  <button
                    type="button"
                    onClick={(event) => {
                      setSelectedVerseId(verse.id);
                      const article = event.currentTarget.closest(".kjv-mobile-verse");
                      window.setTimeout(() => {
                        article?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }, 80);
                      setProgress({
                        tab: "reader",
                        book: resolvedSelectedBookCode,
                        chapter: selectedChapterNumber,
                        verse: verse.number,
                        reference: verse.reference,
                        strongsId: selectedStrongsId,
                        updatedAt: new Date().toISOString(),
                      });
                    }}
                    className="kjv-mobile-verse__text"
                  >
                    <span className="kjv-mobile-verse__number">{verse.number}</span>
                    <span>{verse.text}</span>
                  </button>

                  {selectedVerseId === verse.id && (
                    <div className="kjv-mobile-verse__quick-actions">
                      <button type="button"
                        className={`kjv-mobile-verse__quick-btn${bookmarkSet.has(verse.reference) ? " kjv-mobile-verse__quick-btn--saved" : ""}`}
                        onClick={() => toggleBookmark(verse.reference)}>
                        {bookmarkSet.has(verse.reference) ? "★ Saved" : "☆ Save"}
                      </button>
                      <button type="button" className="kjv-mobile-verse__quick-btn"
                        onClick={() => void shareVerse(verse.reference, verse.text)}>
                        Share
                      </button>
                    </div>
                  )}

                  {showStrongs && verse.strongs?.length ? (
                    <div className="kjv-mobile-verse__strongs">
                      {verse.strongs.slice(0, 8).map((word, index) => (
                        <button
                          key={`${verse.id}-${word.strongsId}-${word.label}-${index}`}
                          type="button"
                          onClick={(event) => {
                            setSelectedVerseId(verse.id);
                            setLexiconLoading(true);
                            setSelectedEntry(null);
                            setSelectedStrongsId(word.strongsId);
                            const article = event.currentTarget.closest(".kjv-mobile-verse");
                            window.setTimeout(() => {
                              article?.scrollIntoView({ behavior: "smooth", block: "start" });
                            }, 80);
                            setProgress({
                              tab: "reader",
                              book: resolvedSelectedBookCode,
                              chapter: selectedChapterNumber,
                              verse: verse.number,
                              reference: verse.reference,
                              strongsId: word.strongsId,
                              updatedAt: new Date().toISOString(),
                            });
                          }}
                          className={`kjv-mobile-strong ${
                            selectedVerseId === verse.id &&
                            selectedStrongsId === word.strongsId
                              ? "kjv-mobile-strong--active"
                              : ""
                          }`}
                        >
                          <span>{word.label}</span>
                          <small>{word.strongsId}</small>
                        </button>
                      ))}
                    </div>
                  ) : null}

                  {showStrongs && selectedVerseId === verse.id ? (
                    <div className="kjv-mobile-concordance">
                      <div className="kjv-mobile-concordance__header">
                        <span>▰⌕</span>
                        <strong>Strong&apos;s Concordance</strong>
                        <button
                          type="button"
                          onClick={() => toggleBookmark(verse.reference)}
                        >
                          {bookmarkSet.has(verse.reference) ? "Saved" : "Save"}
                        </button>
                      </div>
                      {selectedEntry ? (
                        <div className="kjv-mobile-concordance__body">
                          <div className="kjv-mobile-concordance__badge">
                            {selectedEntry.id}
                          </div>
                          <div>
                            <h2>
                              {selectedEntry.id} - {selectedEntry.transliteration}
                              {selectedEntry.lemma ? ` (${selectedEntry.lemma})` : ""}
                            </h2>
                            <p>{selectedEntry.definition}</p>
                          </div>
                          <div className="kjv-mobile-concordance__meta">
                            <div>
                              <span>Pronunciation</span>
                              <strong>{selectedEntry.pronunciation || "Not listed"}</strong>
                            </div>
                            <div>
                              <span>Root Word</span>
                              <strong>{selectedEntry.root || selectedEntry.lemma}</strong>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="kjv-mobile-concordance__loading">
                          {lexiconLoading ? "Loading Strong's entry..." : "No entry found."}
                        </p>
                      )}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          ) : null}

          <MobileBottomNav active="Home" />
        </section>
      ) : null}

      <section className="mx-auto hidden max-w-7xl px-6 py-14 sm:px-8 lg:px-12">
        <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-[var(--color-soft)]">
          <Link
            href="/library"
            className="rounded-full border border-[var(--color-border)] px-4 py-2"
          >
            Library Home
          </Link>
          <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-2">
            Persistence:{" "}
            {persistence.syncStatus === "supabase-ready"
              ? "Supabase ready"
              : "Local only"}
          </span>
          <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-2">
            KJV corpus: {bookCatalog.length === 66 ? "Full library loaded" : "Loading"}
          </span>
        </div>

        <div className="grid gap-10 lg:grid-cols-[0.38fr_0.62fr]">
          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--color-highlight)]">
                Study Workspace
              </p>
              <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl text-[var(--color-ink)]">
                Full KJV, Strong&apos;s, bookmarks, and notes.
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                The reader now pulls the full imported KJV corpus with Strong&apos;s links
                through local API routes, while your notes and bookmarks continue to save
                locally or through Supabase sync.
              </p>
            </div>

            <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
              <label
                htmlFor="search"
                className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--color-highlight)]"
              >
                Search
              </label>
              <input
                id="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search the full KJV, Strong's, fathers, history"
                className="mt-4 w-full rounded-2xl border border-[var(--color-border)] bg-[rgba(5,17,34,0.78)] px-4 py-3 text-sm text-[var(--color-ink)] outline-none placeholder:text-[var(--color-soft)]"
              />

              {normalizedSearchTerm && searchLoading ? (
                <p className="mt-4 text-sm text-[var(--color-muted)]">Searching...</p>
              ) : null}

              {visibleSearchResults.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {visibleSearchResults.map((result) => (
                    <button
                      key={isRemoteSearchResult(result) ? `${result.kind}-${result.id}` : result.id}
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
              {progress?.reference ? (
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
                    No bookmarks yet. Save key passages as you study.
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
          </aside>

          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              {[
                ["reader", "KJV + Strong's", "/library/kjv"],
                ["catholic", "Catholic Study", "/library/catholic"],
                ["fathers", "Church Fathers", "/library/fathers"],
                ["history", "Church History", "/library/history"],
                ["notes", "Notes", "/library/notes"],
                ["settings", "Settings", "/library/settings"],
              ].map(([id, label, href]) => (
                <Link
                  key={id}
                  href={href}
                  onClick={() => setActiveTab(id as WorkspaceTab)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    activeTab === id
                      ? "border-transparent bg-[linear-gradient(180deg,#f0cf84,#cba45b)] text-[#0a1530]"
                      : "border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-soft)]"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>

            {activeTab === "reader" ? (
              <div className="grid gap-6 xl:grid-cols-[0.58fr_0.42fr]">
                <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--color-highlight)]">
                          {chapterData?.work ?? "KJV + Strong's"}
                        </p>
                        <h3 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[var(--color-ink)]">
                          {chapterData?.book ?? selectedBook?.name ?? "Loading"}{" "}
                          {chapterData?.chapter ?? selectedChapterNumber}
                        </h3>
                      </div>
                      {selectedVerse ? (
                        <button
                          type="button"
                          onClick={() => toggleBookmark(selectedVerse.reference)}
                          className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-soft)]"
                        >
                          {bookmarkSet.has(selectedVerse.reference)
                            ? "Bookmarked"
                            : "Bookmark"}
                        </button>
                      ) : null}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="text-sm text-[var(--color-soft)]">
                        <span className="mb-2 block text-xs uppercase tracking-[0.25em] text-[var(--color-highlight)]">
                          Book
                        </span>
                        <select
                          value={resolvedSelectedBookCode}
                          onChange={(event) => {
                            const nextBookCode = event.target.value;
                            setChapterLoading(true);
                            setChapterError(null);
                            setSelectedBookCode(nextBookCode);
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

                    <div className="flex flex-wrap gap-3">
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
                  </div>

                  {chapterLoading ? (
                    <p className="mt-6 text-sm text-[var(--color-muted)]">Loading chapter...</p>
                  ) : null}

                  {chapterError ? (
                    <p className="mt-6 text-sm text-[#f3b3a6]">{chapterError}</p>
                  ) : null}

                  {chapterData ? (
                    <div className="mt-6 space-y-4">
                      {chapterData.verses.map((verse) => (
                        <button
                          key={verse.id}
                          type="button"
                          onClick={() => {
                            setSelectedVerseId(verse.id);
                            const nextStrongsId = verse.strongs?.[0]?.strongsId;
                            if (verse.strongs?.length) {
                              setLexiconLoading(true);
                              setSelectedStrongsId(nextStrongsId!);
                            }
                            setProgress({
                              tab: "reader",
                              book: resolvedSelectedBookCode,
                              chapter: selectedChapterNumber,
                              verse: verse.number,
                              reference: verse.reference,
                              strongsId: nextStrongsId,
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
                          {showStrongs && verse.strongs?.length ? (
                            <span className="mt-4 flex flex-wrap gap-2">
                              {verse.strongs.map((word, index) => (
                                <span
                                  key={`${verse.id}-${word.strongsId}-${word.label}-${index}`}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    setLexiconLoading(true);
                                    setSelectedStrongsId(word.strongsId);
                                  }}
                                  onKeyDown={(event) => {
                                    if (event.key === "Enter" || event.key === " ") {
                                      event.preventDefault();
                                      setLexiconLoading(true);
                                      setSelectedStrongsId(word.strongsId);
                                    }
                                  }}
                                  role="button"
                                  tabIndex={0}
                                  className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-highlight)]"
                                >
                                  {word.label} {word.strongsId}
                                </span>
                              ))}
                            </span>
                          ) : null}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="space-y-6">
                  {showStrongs ? (
                  <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--color-highlight)]">
                      Strong&apos;s Concordance
                    </p>
                    {selectedEntry ? (
                      <>
                        <h3 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[var(--color-ink)]">
                          {selectedEntry.id} {selectedEntry.transliteration}
                        </h3>
                        <p className="mt-2 text-sm uppercase tracking-[0.18em] text-[var(--color-soft)]">
                          {selectedEntry.language} - {selectedEntry.pronunciation}
                        </p>
                        <p className="mt-5 text-sm leading-7 text-[var(--color-muted)]">
                          {selectedEntry.definition}
                        </p>
                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                          <div className="rounded-[1.5rem] border border-[var(--color-border)] bg-[rgba(5,17,34,0.56)] p-4">
                            <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-soft)]">
                              Lemma
                            </p>
                            <p className="mt-2 text-2xl text-[var(--color-highlight)]">
                              {selectedEntry.lemma}
                            </p>
                          </div>
                          <div className="rounded-[1.5rem] border border-[var(--color-border)] bg-[rgba(5,17,34,0.56)] p-4">
                            <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-soft)]">
                              Root Note
                            </p>
                            <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                              {selectedEntry.root}
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                        {lexiconLoading
                          ? "Loading Strong's entry..."
                          : "Select a Strong's tag to inspect the lexicon entry."}
                      </p>
                    )}
                  </div>
                  ) : null}

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
            ) : null}

            {activeTab === "catholic" ? (
              <div className="grid gap-6 xl:grid-cols-[0.58fr_0.42fr]">
                <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--color-highlight)]">
                        {catholicReading.translation}
                      </p>
                      <h3 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-[var(--color-ink)]">
                        {catholicReading.book} {catholicReading.chapter}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleBookmark(selectedCatholicVerse.reference)}
                      className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-soft)]"
                    >
                      {bookmarkSet.has(selectedCatholicVerse.reference)
                        ? "Bookmarked"
                        : "Bookmark"}
                    </button>
                  </div>

                  <div className="mt-6 space-y-4">
                    {catholicReading.verses.map((verse) => (
                      <button
                        key={verse.id}
                        type="button"
                        onClick={() => setSelectedCatholicVerseId(verse.id)}
                        className={`w-full rounded-[1.5rem] border p-5 text-left transition ${
                          selectedCatholicVerseId === verse.id
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
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-[2rem] border border-[var(--color-border)] bg-[linear-gradient(180deg,rgba(75,38,40,0.98),rgba(17,21,40,0.94))] p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--color-highlight)]">
                      {catholicReading.catechismTitle}
                    </p>
                    <h3 className="mt-3 font-[family-name:var(--font-display)] text-3xl text-[var(--color-ink)]">
                      {catholicReading.catechismReference}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                      {catholicReading.catechismExcerpt}
                    </p>
                  </div>

                  <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--color-highlight)]">
                      Cross References
                    </p>
                    <div className="mt-5 space-y-4">
                      {catholicReading.crossReferences.map((item) => (
                        <div
                          key={item.reference}
                          className="rounded-[1.5rem] border border-[var(--color-border)] bg-[rgba(5,17,34,0.56)] p-4"
                        >
                          <p className="font-semibold text-[var(--color-highlight)]">
                            {item.reference}
                          </p>
                          <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                            {item.note}
                          </p>
                        </div>
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
                      className="mt-4 min-h-36 w-full rounded-[1.5rem] border border-[var(--color-border)] bg-[rgba(5,17,34,0.68)] px-4 py-4 text-sm leading-7 text-[var(--color-ink)] outline-none placeholder:text-[var(--color-soft)]"
                    />
                  </div>
                </div>
              </div>
            ) : null}

            {activeTab === "fathers" ? (
              <CardShelf title="Church Fathers" cards={fathers} />
            ) : null}
            {activeTab === "history" ? (
              <CardShelf title="Church History Guides" cards={historyTopics} />
            ) : null}

            {activeTab === "notes" ? (
              <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-panel)] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--color-highlight)]">
                  Notes Archive
                </p>
                <div className="mt-6 space-y-4">
                  {Object.entries(notes).length === 0 ? (
                    <p className="text-sm leading-7 text-[var(--color-muted)]">
                      No notes saved yet. Add notes from the KJV or Catholic study tabs.
                    </p>
                  ) : (
                    Object.entries(notes).map(([reference, note]) => (
                      <article
                        key={reference}
                        className="rounded-[1.5rem] border border-[var(--color-border)] bg-[rgba(5,17,34,0.56)] p-5"
                      >
                        <h3 className="font-semibold text-[var(--color-highlight)]">
                          {reference}
                        </h3>
                        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[var(--color-muted)]">
                          {note}
                        </p>
                      </article>
                    ))
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}

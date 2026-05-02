"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import type { Verse } from "@/lib/content-types";
import { createStudyPersistence } from "@/lib/persistence";
import { shareVerse } from "@/lib/share";

type LxxBookMeta = {
  code: string;
  usfmId: string;
  name: string;
  shortTitle: string;
  chapterCount: number;
  canonGroup: string;
  canonStatus: "protocanonical" | "deuterocanonical" | "orthodox-expanded";
};

type LxxChapterData = {
  work: string;
  code: string;
  usfmId: string;
  book: string;
  shortTitle: string;
  chapterCount: number;
  chapter: number;
  canonGroup: string;
  canonStatus: LxxBookMeta["canonStatus"];
  verses: Verse[];
};

type LxxSearchResult = {
  id: string;
  title: string;
  detail: string;
  reference: string;
  bookCode: string;
  book: string;
  chapter: number;
  verse: number;
};

const preferredGroups = [
  "All",
  "Pentateuch",
  "Historical Books",
  "Wisdom And Poetry",
  "Major Prophets",
  "Minor Prophets",
  "Deuterocanonical And Orthodox Books",
];

export default function LxxReader() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const persistence = useMemo(() => createStudyPersistence(), []);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [bookCatalog, setBookCatalog] = useState<LxxBookMeta[]>([]);
  const [selectedGroup, setSelectedGroup] = useState(searchParams.get("group") ?? "All");
  const [selectedBookCode, setSelectedBookCode] = useState(searchParams.get("book") ?? "genesis");
  const [selectedChapterNumber, setSelectedChapterNumber] = useState(
    Number(searchParams.get("chapter")) || 1,
  );
  const [pendingVerseNumber, setPendingVerseNumber] = useState<number | null>(
    Number(searchParams.get("verse")) || null,
  );
  const [chapterData, setChapterData] = useState<LxxChapterData | null>(null);
  const [selectedVerseId, setSelectedVerseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<LxxSearchResult[]>([]);

  const groups = useMemo(() => {
    const available = new Set(bookCatalog.map((book) => book.canonGroup));
    return preferredGroups.filter((group) => group === "All" || available.has(group));
  }, [bookCatalog]);

  const visibleBooks = useMemo(() => {
    if (selectedGroup === "All") {
      return bookCatalog;
    }

    return bookCatalog.filter((book) => book.canonGroup === selectedGroup);
  }, [bookCatalog, selectedGroup]);

  const selectedBook = bookCatalog.find((book) => book.code === selectedBookCode);
  const chapterOptions = Array.from(
    { length: selectedBook?.chapterCount ?? chapterData?.chapterCount ?? 1 },
    (_, index) => index + 1,
  );

  useEffect(() => {
    void fetch("/api/lxx/books")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Unable to load Septuagint books.");
        }

        const payload = (await response.json()) as { books: LxxBookMeta[] };
        setBookCatalog(payload.books);

        const queryGroup = searchParams.get("group");
        if (queryGroup === "deuterocanonical") {
          const firstDeuterocanonical = payload.books.find(
            (book) => book.canonStatus === "deuterocanonical",
          );
          setSelectedGroup("Deuterocanonical And Orthodox Books");
          if (!searchParams.get("book") && firstDeuterocanonical) {
            setSelectedBookCode(firstDeuterocanonical.code);
          }
        }
      })
      .catch(() => {
        setError("Unable to load Septuagint books.");
      });
  }, [searchParams]);

  useEffect(() => {
    void fetch(
      `/api/lxx/chapter?book=${encodeURIComponent(
        selectedBookCode,
      )}&chapter=${selectedChapterNumber}`,
    )
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Unable to load Septuagint chapter.");
        }

        const payload = (await response.json()) as LxxChapterData;
        setChapterData(payload);

        const desiredVerse = pendingVerseNumber;
        const selectedVerse = desiredVerse
          ? payload.verses.find((verse) => verse.number === desiredVerse)
          : payload.verses[0];
        setSelectedVerseId(selectedVerse?.id ?? payload.verses[0]?.id ?? null);
        setPendingVerseNumber(null);
      })
      .catch(() => {
        setError("Unable to load Septuagint chapter.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [pendingVerseNumber, selectedBookCode, selectedChapterNumber]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("book", selectedBookCode);
    params.set("chapter", String(selectedChapterNumber));
    if (selectedGroup !== "All") {
      params.set("group", selectedGroup);
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, selectedBookCode, selectedChapterNumber, selectedGroup]);

  // Load bookmarks from shared persistence
  useEffect(() => {
    void persistence.load().then((state) => {
      setBookmarks(state.bookmarks);
      setHydrated(true);
    });
  }, [persistence]);

  // Save bookmarks whenever they change
  useEffect(() => {
    if (!hydrated) return;
    void persistence.load().then((state) => {
      void persistence.save({ ...state, bookmarks });
    });
  }, [bookmarks, hydrated, persistence]);

  function toggleBookmark(reference: string) {
    setBookmarks((current) =>
      current.includes(reference)
        ? current.filter((b) => b !== reference)
        : [...current, reference],
    );
  }

  useEffect(() => {
    const normalized = query.trim();
    if (normalized.length < 2) {
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      void fetch(`/api/lxx/search?q=${encodeURIComponent(normalized)}`, {
        signal: controller.signal,
      })
        .then(async (response) => {
          if (!response.ok) {
            throw new Error("Search failed.");
          }

          const payload = (await response.json()) as { results: LxxSearchResult[] };
          setSearchResults(payload.results);
        })
        .catch((searchError) => {
          if ((searchError as Error).name !== "AbortError") {
            setSearchResults([]);
          }
        });
    }, 250);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  const selectBook = (bookCode: string) => {
    const book = bookCatalog.find((item) => item.code === bookCode);
    if (book) {
      setSelectedGroup(book.canonGroup);
    }
    setSelectedBookCode(bookCode);
    setSelectedChapterNumber(1);
    setPendingVerseNumber(null);
    setSearchResults([]);
    setQuery("");
  };

  const selectedVerse = chapterData?.verses.find((verse) => verse.id === selectedVerseId);
  const bookmarkSet = new Set(bookmarks);

  return (
    <main className="lxx-reader mobile-app-shell">
      <header className="lxx-reader__topbar">
        <Link href="/library/orthodox" className="lxx-reader__icon" aria-label="Back">
          ‹
        </Link>
        <div>
          <p>Brenton Septuagint</p>
          <h1>Orthodox LXX Reader</h1>
        </div>
        <Link href="/library/orthodox/orthodox-canon-notes" className="lxx-reader__icon">
          ☦
        </Link>
      </header>

      <section className="lxx-reader__controls">
        <label>
          <span>Canon Group</span>
          <select
            value={selectedGroup}
            onChange={(event) => {
              const nextGroup = event.target.value;
              setSelectedGroup(nextGroup);
              const firstBook =
                nextGroup === "All"
                  ? bookCatalog[0]
                  : bookCatalog.find((book) => book.canonGroup === nextGroup);
              if (firstBook) {
                setLoading(true);
                setError(null);
                setSelectedBookCode(firstBook.code);
                setSelectedChapterNumber(1);
              }
            }}
          >
            {groups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Book</span>
          <select
            value={selectedBookCode}
            onChange={(event) => {
              setLoading(true);
              setError(null);
              selectBook(event.target.value);
            }}
          >
            {visibleBooks.map((book) => (
              <option key={book.code} value={book.code}>
                {book.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Chapter</span>
          <select
            value={selectedChapterNumber}
            onChange={(event) => {
              setLoading(true);
              setError(null);
              setSelectedChapterNumber(Number(event.target.value));
              setPendingVerseNumber(null);
            }}
          >
            {chapterOptions.map((chapter) => (
              <option key={chapter} value={chapter}>
                {chapter}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="lxx-reader__search">
        <input
          value={query}
          onChange={(event) => {
            const nextQuery = event.target.value;
            setQuery(nextQuery);
            if (nextQuery.trim().length < 2) {
              setSearchResults([]);
            }
          }}
          placeholder="Search Brenton LXX or enter Genesis 1:1"
        />
        {searchResults.length ? (
          <div className="lxx-reader__results">
            {searchResults.slice(0, 6).map((result) => (
              <button
                key={`${result.id}-${result.reference}`}
                type="button"
                onClick={() => {
                  const book = bookCatalog.find((item) => item.code === result.bookCode);
                  if (book) {
                    setSelectedGroup(book.canonGroup);
                  }
                  setLoading(true);
                  setError(null);
                  setSelectedBookCode(result.bookCode);
                  setSelectedChapterNumber(result.chapter);
                  setPendingVerseNumber(result.verse);
                  setQuery("");
                  setSearchResults([]);
                }}
              >
                <strong>{result.reference}</strong>
                <span>{result.detail}</span>
              </button>
            ))}
          </div>
        ) : null}
      </section>

      {chapterData ? (
        <section className="lxx-reader__chapter-heading">
          <p>{chapterData.canonGroup}</p>
          <h2>
            {chapterData.book} {chapterData.chapter}
          </h2>
          <span>
            {chapterData.canonStatus === "deuterocanonical"
              ? "Deuterocanonical / Orthodox book"
              : chapterData.canonStatus === "orthodox-expanded"
                ? "Greek Orthodox text form"
                : "Septuagint Old Testament"}
          </span>
        </section>
      ) : null}

      {loading ? <p className="lxx-reader__status">Loading Septuagint chapter...</p> : null}
      {error ? <p className="lxx-reader__status">{error}</p> : null}

      {chapterData ? (
        <section className="lxx-reader__chapter">
          {chapterData.verses.map((verse) => (
            <article
              key={verse.id}
              className={`lxx-verse ${selectedVerseId === verse.id ? "lxx-verse--active" : ""}${bookmarkSet.has(verse.reference ?? "") ? " lxx-verse--bookmarked" : ""}`}
            >
              <button
                type="button"
                onClick={(event) => {
                  setSelectedVerseId(verse.id);
                  const article = event.currentTarget.closest(".lxx-verse");
                  window.setTimeout(() => {
                    article?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }, 60);
                }}
              >
                <span>{verse.number}</span>
                <p>{verse.text}</p>
              </button>
            </article>
          ))}
        </section>
      ) : null}

      {selectedVerse ? (
        <section className="lxx-reader__selected">
          <strong>{selectedVerse.reference}</strong>
          <p>{selectedVerse.text}</p>
          <div className="lxx-reader__verse-actions">
            <button type="button"
              className={`lxx-reader__action-btn${bookmarkSet.has(selectedVerse.reference ?? "") ? " lxx-reader__action-btn--active" : ""}`}
              onClick={() => toggleBookmark(selectedVerse.reference ?? "")}>
              {bookmarkSet.has(selectedVerse.reference ?? "") ? "★ Saved" : "☆ Save"}
            </button>
            <button type="button" className="lxx-reader__action-btn"
              onClick={() => void shareVerse(selectedVerse.reference ?? "", selectedVerse.text)}>
              Share
            </button>
          </div>
        </section>
      ) : null}

      <nav className="lxx-reader__chapter-nav">
        <button
          type="button"
          disabled={selectedChapterNumber <= 1}
          onClick={() => {
            setLoading(true);
            setError(null);
            setSelectedChapterNumber((current) => Math.max(1, current - 1));
          }}
        >
          Previous Chapter
        </button>
        <button
          type="button"
          disabled={!selectedBook || selectedChapterNumber >= selectedBook.chapterCount}
          onClick={() => {
            setLoading(true);
            setError(null);
            setSelectedChapterNumber((current) =>
              selectedBook ? Math.min(selectedBook.chapterCount, current + 1) : current,
            );
          }}
        >
          Next Chapter
        </button>
      </nav>

      <MobileBottomNav active="Home" />
    </main>
  );
}

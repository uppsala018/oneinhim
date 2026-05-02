import { createSupabaseBrowserClient, hasSupabaseEnv } from "@/lib/supabase";

export type StudyState = {
  bookmarks: string[];
  notes: Record<string, string>;
  progress: {
    tab: "reader" | "catholic" | "fathers" | "history" | "notes";
    book?: string;
    chapter?: number;
    verse?: number;
    reference?: string;
    strongsId?: string;
    updatedAt?: string;
  } | null;
};

export type StudyPersistence = {
  load(): Promise<StudyState>;
  save(state: StudyState): Promise<void>;
  syncStatus: "local-only" | "supabase-ready";
};

const bookmarkStorageKey = "logos-legacy-bookmarks";
const noteStorageKey = "logos-legacy-notes";
const progressStorageKey = "logos-legacy-progress";
const progressNoteKey = "__logos_legacy_progress__";

function splitNotesAndProgress(notes: Record<string, string>) {
  const cleanNotes = { ...notes };
  const rawProgress = cleanNotes[progressNoteKey];
  delete cleanNotes[progressNoteKey];

  if (!rawProgress) {
    return { notes: cleanNotes, progress: null };
  }

  try {
    return {
      notes: cleanNotes,
      progress: JSON.parse(rawProgress) as StudyState["progress"],
    };
  } catch {
    return { notes: cleanNotes, progress: null };
  }
}

function combineNotesAndProgress(state: StudyState) {
  const remoteNotes = { ...state.notes };

  if (state.progress) {
    remoteNotes[progressNoteKey] = JSON.stringify(state.progress);
  }

  return remoteNotes;
}

function loadLocalState(): StudyState {
  if (typeof window === "undefined") {
    return { bookmarks: [], notes: {}, progress: null };
  }

  const storedBookmarks = window.localStorage.getItem(bookmarkStorageKey);
  const storedNotes = window.localStorage.getItem(noteStorageKey);
  const storedProgress = window.localStorage.getItem(progressStorageKey);

  return {
    bookmarks: storedBookmarks ? (JSON.parse(storedBookmarks) as string[]) : [],
    notes: storedNotes ? (JSON.parse(storedNotes) as Record<string, string>) : {},
    progress: storedProgress
      ? (JSON.parse(storedProgress) as StudyState["progress"])
      : null,
  };
}

function saveLocalState(state: StudyState) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(bookmarkStorageKey, JSON.stringify(state.bookmarks));
  window.localStorage.setItem(noteStorageKey, JSON.stringify(state.notes));
  window.localStorage.setItem(progressStorageKey, JSON.stringify(state.progress));
}

export function createStudyPersistence(): StudyPersistence {
  return {
    async load() {
      const localState = loadLocalState();

      if (!hasSupabaseEnv()) {
        return localState;
      }

      const supabase = createSupabaseBrowserClient();

      if (!supabase) {
        return localState;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return localState;
      }

      const { data, error } = await supabase
        .from("study_state")
        .select("bookmarks, notes")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error || !data) {
        return localState;
      }

      const remoteNotesSource =
        data.notes && typeof data.notes === "object"
          ? (data.notes as Record<string, string>)
          : localState.notes;
      const { notes: remoteNotes, progress: remoteProgress } = splitNotesAndProgress(
        remoteNotesSource,
      );

      const remoteState: StudyState = {
        bookmarks: Array.isArray(data.bookmarks)
          ? (data.bookmarks as string[])
          : localState.bookmarks,
        notes: remoteNotes,
        progress: remoteProgress ?? localState.progress,
      };

      saveLocalState(remoteState);
      return remoteState;
    },
    async save(state) {
      saveLocalState(state);

      if (!hasSupabaseEnv()) {
        return;
      }

      const supabase = createSupabaseBrowserClient();

      if (!supabase) {
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return;
      }

      await supabase.from("study_state").upsert({
        user_id: user.id,
        bookmarks: state.bookmarks,
        notes: combineNotesAndProgress(state),
        updated_at: new Date().toISOString(),
      });
    },
    syncStatus: hasSupabaseEnv() ? "supabase-ready" : "local-only",
  };
}

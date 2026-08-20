import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { normalizeReaderHandle } from "@/lib/reader-handle";
import { openReaderProfile, saveReaderProgress } from "@/lib/reader-profile";
import { emptyProgress, progressSnapshot, useProgress } from "@/lib/progress";

const STORAGE_KEY = "silence-reader-handle";

type ReaderProfileContextValue = {
  handle: string | null;
  loading: boolean;
  open: (handle: string) => Promise<string>;
  changeReader: () => void;
};

const ReaderProfileContext = createContext<ReaderProfileContextValue | null>(null);

export function ReaderProfileProvider({ children }: { children: ReactNode }) {
  const [handle, setHandle] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const activeHandle = useRef<string | null>(null);
  const ready = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const open = useCallback(async (rawHandle: string) => {
    ready.current = false;
    activeHandle.current = null;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setLoading(true);
    try {
      const result = await openReaderProfile({
        data: {
          handle: rawHandle,
          initialProgress: progressSnapshot(useProgress.getState()),
        },
      });
      useProgress.getState().replace(result.progress);
      activeHandle.current = result.handle;
      ready.current = true;
      localStorage.setItem(STORAGE_KEY, result.handle);
      setHandle(result.handle);
      return result.handle;
    } finally {
      setLoading(false);
    }
  }, []);

  const changeReader = useCallback(() => {
    ready.current = false;
    activeHandle.current = null;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    localStorage.removeItem(STORAGE_KEY);
    setHandle(null);
    useProgress.getState().replace(emptyProgress());
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      setLoading(false);
      return;
    }
    void open(normalizeReaderHandle(saved)).catch(() => {
      localStorage.removeItem(STORAGE_KEY);
      setHandle(null);
      setLoading(false);
    });
  }, [open]);

  useEffect(() => {
    return useProgress.subscribe((state) => {
      const currentHandle = activeHandle.current;
      if (!ready.current || !currentHandle) return;
      if (saveTimer.current) clearTimeout(saveTimer.current);
      const progress = progressSnapshot(state);
      saveTimer.current = setTimeout(() => {
        void saveReaderProgress({
          data: { handle: currentHandle, progress },
        }).catch(() => undefined);
      }, 700);
    });
  }, []);

  const value = useMemo(
    () => ({ handle, loading, open, changeReader }),
    [handle, loading, open, changeReader],
  );

  return <ReaderProfileContext.Provider value={value}>{children}</ReaderProfileContext.Provider>;
}

export function useReaderProfile() {
  const context = useContext(ReaderProfileContext);
  if (!context) {
    throw new Error("useReaderProfile doit être utilisé dans ReaderProfileProvider.");
  }
  return context;
}

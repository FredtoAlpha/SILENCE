import { useEffect } from "react";
import { useProgress } from "@/lib/progress";

export function ThemeRoot() {
  const theme = useProgress((s) => s.theme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return null;
}

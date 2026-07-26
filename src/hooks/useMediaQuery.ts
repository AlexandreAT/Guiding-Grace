import { useSyncExternalStore } from "react";

const subscribeToQuery = (query: string, callback: () => void) => {
  const mediaQuery = window.matchMedia(query);
  mediaQuery.addEventListener("change", callback);

  return () => mediaQuery.removeEventListener("change", callback);
};

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (callback) => subscribeToQuery(query, callback),
    () => window.matchMedia(query).matches,
    () => false,
  );
}

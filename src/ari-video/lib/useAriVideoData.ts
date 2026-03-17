import { cancelRender, continueRender, delayRender } from "remotion";
import { useEffect, useState } from "react";
import { loadAriVideoData } from "./loadAriVideoData";
import type { AriVideoData } from "./types";

export function useAriVideoData() {
  const [data, setData] = useState<AriVideoData | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [handle] = useState(() => delayRender("Loading Ari video trace"));

  useEffect(() => {
    let mounted = true;

    loadAriVideoData()
      .then((nextData) => {
        if (!mounted) {
          return;
        }

        setData(nextData);
        continueRender(handle);
      })
      .catch((reason: unknown) => {
        if (!mounted) {
          return;
        }

        const nextError = reason instanceof Error ? reason : new Error(String(reason));
        setError(nextError);
        cancelRender(nextError);
      });

    return () => {
      mounted = false;
    };
  }, [handle]);

  return { data, error };
}

"use client";

import { useEffect, useState } from "react";
import { usePreloadedState } from "../context/PreloadContext";

export default function UseLoaded() {
  const preloaded = usePreloadedState();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (preloaded) {
      setIsLoaded(true);
    } else {
      setTimeout(() => {
        setIsLoaded(true);
      }, 200);
    }
  }, [preloaded]);
  return isLoaded;
}

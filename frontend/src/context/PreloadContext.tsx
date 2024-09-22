import clsx from "clsx";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const PreloadContext = createContext<boolean>(false);

export function PreloadProvider({ children }: { children: ReactNode }) {
  const [preloaded, setIsPreloaded] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setIsPreloaded(true);
    }, 200);
  }, []);

  return (
    <PreloadContext.Provider value={preloaded}>
      <div
        className={clsx(
          "fixed inset-0 flex items-center justify-center bg-white transition-opacity",
          preloaded && "pointer-events-none opacity-0"
        )}
      >
        {children}
      </div>
    </PreloadContext.Provider>
  );
}

export const usePreloadedState = () => useContext(PreloadContext);

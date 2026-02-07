// src/depth/DepthContext.tsx
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type DepthContextType = {
  depth: number; // 0 → start, 1 → end
  setDepth: (value: number) => void;
};

const DepthContext = createContext<DepthContextType | undefined>(undefined);

export const DepthProvider = ({ children }: { children: ReactNode }) => {
  const [depth, setDepth] = useState(0);
  return (
    <DepthContext.Provider value={{ depth, setDepth }}>
      {children}
    </DepthContext.Provider>
  );
};

export const useDepth = () => {
  const context = useContext(DepthContext);
  if (!context) throw new Error("useDepth must be used within DepthProvider");
  return context;
};

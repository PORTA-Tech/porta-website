// src/depth/DepthController.tsx
import { useEffect } from "react";
import { useDepth } from "./DepthContext";

export default function DepthController() {
  const { setDepth } = useDepth();

  useEffect(() => {
    const handleScroll = () => {
  const scrollY = window.scrollY;
  const totalHeight = document.body.scrollHeight - window.innerHeight;
  const depth = Math.min(scrollY / totalHeight, 1);

  console.log("DEPTH:", depth); 
  setDepth(depth);
};

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setDepth]);

  return null;
}

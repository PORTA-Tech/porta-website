import { useEffect } from "react";
import { useDepth } from "./DepthContext";

export default function DepthController() {
  const { setDepth } = useDepth();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      setDepth(Math.min(scrollY / totalHeight, 1));
    };

    // initialize depth at current scroll to prevent jump
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setDepth]);

  return null;
}

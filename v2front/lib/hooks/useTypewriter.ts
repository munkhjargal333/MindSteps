import { useEffect, useState } from "react";

export function useTypewriter(text: string, speed = 18) {
  const [out, setOut] = useState("");

  useEffect(() => {
    setOut("");
    let i = 0;

    const id = setInterval(() => {
      i++;
      setOut(text.slice(0, i));

      if (i >= text.length) {
        clearInterval(id);
      }
    }, speed);

    return () => clearInterval(id);
  }, [text, speed]);

  return out;
}
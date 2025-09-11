// src/components/fx/ConfettiOnce.tsx
import { useEffect, useRef } from "react";

export default function ConfettiOnce({ fire }: { fire: boolean }) {
  const fired = useRef(false);
  useEffect(() => {
    if (!fire || fired.current) return;
    fired.current = true;
    shoot();
  }, [fire]);
  return null;
}

function shoot() {
  // tiny, dependency-free confetti (just a quick sprinkle)
  const colors = ["#10b981", "#22d3ee", "#8b5cf6", "#f59e0b"];
  for (let i = 0; i < 36; i++) {
    const div = document.createElement("div");
    div.style.position = "fixed";
    div.style.top = "50%";
    div.style.left = "50%";
    div.style.width = "6px";
    div.style.height = "6px";
    div.style.background = colors[i % colors.length];
    div.style.borderRadius = "9999px";
    div.style.pointerEvents = "none";
    document.body.appendChild(div);
    const angle = (i / 36) * 2 * Math.PI;
    const dist = 80 + Math.random() * 80;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;
    div.animate(
      [
        { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
        { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0.8)`, opacity: 0 }
      ],
      { duration: 900 + Math.random() * 400, easing: "cubic-bezier(.2,.7,.2,1)" }
    ).onfinish = () => div.remove();
  }
}
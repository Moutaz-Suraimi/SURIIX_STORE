import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const container = document.getElementById("root")!;

if (container.hasChildNodes()) {
  hydrateRoot(container, <App />);
} else {
  createRoot(container).render(<App />);
}

// Reveal body after first frame — ensures LCP element is painted before visible
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    try {
      document.body.classList.add("loaded");
    } catch (e) {
      console.error("Failed to add loaded class:", e);
    }
  });
});


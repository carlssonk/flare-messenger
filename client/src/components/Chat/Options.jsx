import { useEffect } from "react";

function Options({ container, toggleEmoji }) {
  useEffect(() => {
    if (!container.current) return;
    document.documentElement.style.setProperty(
      "--background-size-h",
      `${container.current.offsetHeight}px`
    );
  }, [container, toggleEmoji]);

  const reportWindowSize = () => {
    document.documentElement.style.setProperty(
      "--background-size-h",
      `${container.current.offsetHeight}px`
    );
  };
  window.onresize = reportWindowSize;

  return null;
}

export default Options;

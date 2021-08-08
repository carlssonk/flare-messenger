import React, { useEffect } from "react";

function Options({ container }) {
  useEffect(() => {
    if (!container.current) return;
    setBubbleGradientHeight();
  }, [container]);

  const reportWindowSize = () => {
    setBubbleGradientHeight();
  };
  window.onresize = reportWindowSize;

  const setBubbleGradientHeight = () => {
    document.documentElement.style.setProperty(
      "--background-size-h",
      `${container.current.offsetHeight}px`
    );
  };

  return null;
}

export default Options;

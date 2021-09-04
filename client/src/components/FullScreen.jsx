import React, { useEffect } from "react";

function FullScreen() {
  setTimeout(() => {
    if (
      "ontouchstart" in window ||
      navigator.maxTouchPoints ||
      navigator.msMaxTouchPoints
    ) {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch((err) => console.log(err));
      } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen().catch((err) => console.log(err));
      } else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari & Opera */
        elem.webkitRequestFullscreen().catch((err) => console.log(err));
      } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen().catch((err) => console.log(err));
      }
    }
  }, []);

  return null;
}

export default FullScreen;

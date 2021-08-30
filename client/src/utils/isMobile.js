export const isMobile = () => {
  if (
    "ontouchstart" in window ||
    navigator.maxTouchPoints ||
    navigator.msMaxTouchPoints
  )
    return true;
  return false;
};

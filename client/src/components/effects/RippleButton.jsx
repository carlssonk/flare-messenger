import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const RippleButton = ({ children, onClick, className, scale = 1 }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [pause, setPause] = useState(false);
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    if (
      "ontouchstart" in window ||
      navigator.maxTouchPoints ||
      navigator.msMaxTouchPoints
    ) {
      setIsMobile(true);
    }
  }, []);

  const removeRipple = () => {
    setRipples((array) =>
      array.filter(function (e) {
        return e.id !== array[0].id;
      })
    );
  };

  const addRipple = (coords) => {
    const rippleId = uuidv4();
    setRipples((ripples) => [...ripples, { ...coords, id: rippleId }]);
    if (ripples.length < 1) return;
    setTimeout(() => removeRipple(), 600);
  };

  useEffect(() => {
    if (!pause) return;
    const timer = setTimeout(() => setIsHolding(true), 150);
    return () => clearTimeout(timer);
  }, [pause]);

  const setRippleScale = (e, rect, isTouch) => {
    // Component Width & Height
    const WIDTH = rect.width;
    const HEIGHT = rect.height;

    const clientX = isTouch ? e.touches[0].clientX : e.clientX;
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;

    let rippleScale;

    const halfY = HEIGHT / 2;
    const halfX = WIDTH / 2;

    // Calculate cursor pos
    const cursorPosY = (clientY - rect.y) / halfY;
    const cursorPosX = (clientX - rect.left) / halfX;

    // Convert cursorPos so min num i 0 and max num is 1.
    const diffY = Math.abs(cursorPosY - 1) + 1;
    const diffX = Math.abs(cursorPosX - 1) + 1;

    // Max size of component, check if height or width is wider
    const MAX_SIZE = WIDTH >= HEIGHT ? WIDTH : HEIGHT;

    // How far away is the cursor relative to the middle of component. 1 = corner, 0 = middle
    const MAX_CURSOR_POS = diffX >= diffY ? diffX : diffY;

    rippleScale = ((MAX_SIZE * 1.25 * MAX_CURSOR_POS) / 10) * scale;

    document.documentElement.style.setProperty(
      "--ripple-scale",
      `${rippleScale}`
    );
  };

  return (
    <li
      className={`ripple-effect ${className}`}
      onMouseDown={(e) => {
        if (isMobile) return;
        setPause(true);
        const rect = e.target.getBoundingClientRect();
        setRippleScale(e, rect);
        addRipple({
          x: e.clientX - rect.left - 4,
          y: e.clientY - rect.y - 4,
        });
        onClick && onClick(e);
      }}
      onMouseUp={() => {
        if (isMobile) return;
        setIsHolding(false);
        setPause(false);
      }}
      onMouseLeave={() => {
        if (isMobile) return;
        setIsHolding(false);
        setPause(false);
      }}
      onTouchStart={(e) => {
        if (!isMobile) return;
        setPause(true);
        const rect = e.target.getBoundingClientRect();
        setRippleScale(e, rect, true);
        addRipple({
          x: e.touches[0].clientX - rect.left - 4,
          y: e.touches[0].clientY - rect.y - 4,
        });
        onClick && onClick(e);
      }}
      onTouchEnd={() => {
        if (!isMobile) return;
        setIsHolding(false);
        setPause(false);
      }}
    >
      {children}
      <span className="render-ripples">
        {ripples.map((e) => {
          return (
            <span
              key={e.id}
              className="ripple"
              style={{
                left: e.x,
                top: e.y,
                animationPlayState: isHolding ? "paused" : "",
              }}
            />
          );
        })}
      </span>
    </li>
  );
};

export default RippleButton;

import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const Ripple = ({
  children,
  onClick,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  onTouchStart,
  onTouchEnd,
  className,
  style,
  scale = 1,
  color = "white",
  opacity = 0.2,
  element = "div",
}) => {
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

  const setRippleScale = (e, rect) => {
    // Component Width & Height
    const WIDTH = rect.width;
    const HEIGHT = rect.height;

    const clientX = isMobile ? e.touches[0].clientX : e.clientX;
    const clientY = isMobile ? e.touches[0].clientY : e.clientY;

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

  const renderRipples = (
    <span key={0} className="render-ripples">
      {ripples.map((e) => {
        return (
          <span
            key={e.id}
            className="ripple"
            style={{
              left: e.x,
              top: e.y,
              animationPlayState: isHolding ? "paused" : "",
              backgroundColor: color,
              filter: `opacity(${opacity})`,
            }}
          />
        );
      })}
    </span>
  );

  return React.createElement(
    element,
    {
      key: 1,
      className: `ripple-effect ${className ? className : ""}`,
      style: style,
      onClick: (e) => onClick && onClick(e),
      onMouseDown: (e) => {
        if (isMobile) return;
        setPause(true);
        const rect = e.target.getBoundingClientRect();
        setRippleScale(e, rect);
        addRipple({
          x: e.clientX - rect.left - 4,
          y: e.clientY - rect.y - 4,
        });
        onMouseDown && onMouseDown(e);
      },
      onMouseUp: (e) => {
        if (isMobile) return;
        setIsHolding(false);
        setPause(false);
        onMouseUp && onMouseUp(e);
      },
      onMouseLeave: (e) => {
        if (isMobile) return;
        setIsHolding(false);
        setPause(false);
        onMouseLeave && onMouseLeave(e);
      },
      onTouchStart: (e) => {
        if (!isMobile) return;
        setPause(true);
        const rect = e.target.getBoundingClientRect();
        setRippleScale(e, rect);
        addRipple({
          x: e.touches[0].clientX - rect.left - 4,
          y: e.touches[0].clientY - rect.y - 4,
        });
        onTouchStart && onTouchStart(e);
      },
      onTouchEnd: (e) => {
        if (!isMobile) return;
        setIsHolding(false);
        setPause(false);
        onTouchEnd && onTouchEnd(e);
      },
    },
    [children, renderRipples]
  );
};

const Article = ({
  children,
  className,
  style,
  scale,
  color,
  opacity,
  onClick,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  onTouchStart,
  onTouchEnd,
}) => (
  <Ripple
    children={children}
    className={className}
    style={style}
    scale={scale}
    color={color}
    opacity={opacity}
    onClick={onClick}
    onMouseDown={onMouseDown}
    onMouseUp={onMouseUp}
    onMouseLeave={onMouseLeave}
    onTouchStart={onTouchStart}
    onTouchEnd={onTouchEnd}
    element="article"
  />
);
Ripple.Article = Article;

const Aside = ({
  children,
  className,
  style,
  scale,
  color,
  opacity,
  onClick,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  onTouchStart,
  onTouchEnd,
}) => (
  <Ripple
    children={children}
    className={className}
    style={style}
    scale={scale}
    color={color}
    opacity={opacity}
    onClick={onClick}
    onMouseDown={onMouseDown}
    onMouseUp={onMouseUp}
    onMouseLeave={onMouseLeave}
    onTouchStart={onTouchStart}
    onTouchEnd={onTouchEnd}
    element="aside"
  />
);
Ripple.Aside = Aside;

const Header = ({
  children,
  className,
  style,
  scale,
  color,
  opacity,
  onClick,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  onTouchStart,
  onTouchEnd,
}) => (
  <Ripple
    children={children}
    className={className}
    style={style}
    scale={scale}
    color={color}
    opacity={opacity}
    onClick={onClick}
    onMouseDown={onMouseDown}
    onMouseUp={onMouseUp}
    onMouseLeave={onMouseLeave}
    onTouchStart={onTouchStart}
    onTouchEnd={onTouchEnd}
    element="header"
  />
);
Ripple.Header = Header;

const Footer = ({
  children,
  className,
  style,
  scale,
  color,
  opacity,
  onClick,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  onTouchStart,
  onTouchEnd,
}) => (
  <Ripple
    children={children}
    className={className}
    style={style}
    scale={scale}
    color={color}
    opacity={opacity}
    onClick={onClick}
    onMouseDown={onMouseDown}
    onMouseUp={onMouseUp}
    onMouseLeave={onMouseLeave}
    onTouchStart={onTouchStart}
    onTouchEnd={onTouchEnd}
    element="footer"
  />
);
Ripple.Footer = Footer;

const Main = ({
  children,
  className,
  style,
  scale,
  color,
  opacity,
  onClick,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  onTouchStart,
  onTouchEnd,
}) => (
  <Ripple
    children={children}
    className={className}
    style={style}
    scale={scale}
    color={color}
    opacity={opacity}
    onClick={onClick}
    onMouseDown={onMouseDown}
    onMouseUp={onMouseUp}
    onMouseLeave={onMouseLeave}
    onTouchStart={onTouchStart}
    onTouchEnd={onTouchEnd}
    element="main"
  />
);
Ripple.Main = Main;

const Nav = ({
  children,
  className,
  style,
  scale,
  color,
  opacity,
  onClick,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  onTouchStart,
  onTouchEnd,
}) => (
  <Ripple
    children={children}
    className={className}
    style={style}
    scale={scale}
    color={color}
    opacity={opacity}
    onClick={onClick}
    onMouseDown={onMouseDown}
    onMouseUp={onMouseUp}
    onMouseLeave={onMouseLeave}
    onTouchStart={onTouchStart}
    onTouchEnd={onTouchEnd}
    element="nav"
  />
);
Ripple.Nav = Nav;

const Section = ({
  children,
  className,
  style,
  scale,
  color,
  opacity,
  onClick,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  onTouchStart,
  onTouchEnd,
}) => (
  <Ripple
    children={children}
    className={className}
    style={style}
    scale={scale}
    color={color}
    opacity={opacity}
    onClick={onClick}
    onMouseDown={onMouseDown}
    onMouseUp={onMouseUp}
    onMouseLeave={onMouseLeave}
    onTouchStart={onTouchStart}
    onTouchEnd={onTouchEnd}
    element="section"
  />
);
Ripple.Section = Section;

const Div = ({
  children,
  className,
  style,
  scale,
  color,
  opacity,
  onClick,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  onTouchStart,
  onTouchEnd,
}) => (
  <Ripple
    children={children}
    className={className}
    style={style}
    scale={scale}
    color={color}
    opacity={opacity}
    onClick={onClick}
    onMouseDown={onMouseDown}
    onMouseUp={onMouseUp}
    onMouseLeave={onMouseLeave}
    onTouchStart={onTouchStart}
    onTouchEnd={onTouchEnd}
    element="div"
  />
);
Ripple.Div = Div;

const Span = ({
  children,
  className,
  style,
  scale,
  color,
  opacity,
  onClick,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  onTouchStart,
  onTouchEnd,
}) => (
  <Ripple
    children={children}
    className={className}
    style={style}
    scale={scale}
    color={color}
    opacity={opacity}
    onClick={onClick}
    onMouseDown={onMouseDown}
    onMouseUp={onMouseUp}
    onMouseLeave={onMouseLeave}
    onTouchStart={onTouchStart}
    onTouchEnd={onTouchEnd}
    element="span"
  />
);
Ripple.Span = Span;

const Li = ({
  children,
  className,
  style,
  scale,
  color,
  opacity,
  onClick,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  onTouchStart,
  onTouchEnd,
}) => (
  <Ripple
    children={children}
    className={className}
    style={style}
    scale={scale}
    color={color}
    opacity={opacity}
    onClick={onClick}
    onMouseDown={onMouseDown}
    onMouseUp={onMouseUp}
    onMouseLeave={onMouseLeave}
    onTouchStart={onTouchStart}
    onTouchEnd={onTouchEnd}
    element="li"
  />
);
Ripple.Li = Li;

const Ul = ({
  children,
  className,
  style,
  scale,
  color,
  opacity,
  onClick,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  onTouchStart,
  onTouchEnd,
}) => (
  <Ripple
    children={children}
    className={className}
    style={style}
    scale={scale}
    color={color}
    opacity={opacity}
    onClick={onClick}
    onMouseDown={onMouseDown}
    onMouseUp={onMouseUp}
    onMouseLeave={onMouseLeave}
    onTouchStart={onTouchStart}
    onTouchEnd={onTouchEnd}
    element="ul"
  />
);
Ripple.Ul = Ul;

const Ol = ({
  children,
  className,
  style,
  scale,
  color,
  opacity,
  onClick,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  onTouchStart,
  onTouchEnd,
}) => (
  <Ripple
    children={children}
    className={className}
    style={style}
    scale={scale}
    color={color}
    opacity={opacity}
    onClick={onClick}
    onMouseDown={onMouseDown}
    onMouseUp={onMouseUp}
    onMouseLeave={onMouseLeave}
    onTouchStart={onTouchStart}
    onTouchEnd={onTouchEnd}
    element="ol"
  />
);
Ripple.Ol = Ol;

const Button = ({
  children,
  className,
  style,
  scale,
  color,
  opacity,
  onClick,
  onMouseDown,
  onMouseUp,
  onMouseLeave,
  onTouchStart,
  onTouchEnd,
}) => (
  <Ripple
    children={children}
    className={className}
    style={style}
    scale={scale}
    color={color}
    opacity={opacity}
    onClick={onClick}
    onMouseDown={onMouseDown}
    onMouseUp={onMouseUp}
    onMouseLeave={onMouseLeave}
    onTouchStart={onTouchStart}
    onTouchEnd={onTouchEnd}
    element="button"
  />
);
Ripple.Button = Button;

export default Ripple;

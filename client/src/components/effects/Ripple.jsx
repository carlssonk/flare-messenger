import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const Ripple = ({
  children,
  onClick,
  className,
  style,
  scale = 1,
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
      onMouseDown: (e) => {
        if (isMobile) return;
        setPause(true);
        const rect = e.target.getBoundingClientRect();
        setRippleScale(e, rect);
        addRipple({
          x: e.clientX - rect.left - 4,
          y: e.clientY - rect.y - 4,
        });
        onClick && onClick(e);
      },
      onMouseUp: () => {
        if (isMobile) return;
        setIsHolding(false);
        setPause(false);
      },
      onMouseLeave: () => {
        if (isMobile) return;
        setIsHolding(false);
        setPause(false);
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
        onClick && onClick(e);
      },
      onTouchEnd: () => {
        if (!isMobile) return;
        setIsHolding(false);
        setPause(false);
      },
    },
    [children, renderRipples]
  );

  // JSX
  // <li
  //   className={`ripple-effect ${className}`}
  //   onMouseDown={(e) => {
  //     if (isMobile) return;
  //     setPause(true);
  //     const rect = e.target.getBoundingClientRect();
  //     setRippleScale(e, rect);
  //     addRipple({
  //       x: e.clientX - rect.left - 4,
  //       y: e.clientY - rect.y - 4,
  //     });
  //     onClick && onClick(e);
  //   }}
  //   onMouseUp={() => {
  //     if (isMobile) return;
  //     setIsHolding(false);
  //     setPause(false);
  //   }}
  //   onMouseLeave={() => {
  //     if (isMobile) return;
  //     setIsHolding(false);
  //     setPause(false);
  //   }}
  //   onTouchStart={(e) => {
  //     if (!isMobile) return;
  //     setPause(true);
  //     const rect = e.target.getBoundingClientRect();
  //     setRippleScale(e, rect);
  //     addRipple({
  //       x: e.touches[0].clientX - rect.left - 4,
  //       y: e.touches[0].clientY - rect.y - 4,
  //     });
  //     onClick && onClick(e);
  //   }}
  //   onTouchEnd={() => {
  //     if (!isMobile) return;
  //     setIsHolding(false);
  //     setPause(false);
  //   }}
  // >
  //   {children}
  //   <span className="render-ripples">
  //     {ripples.map((e) => {
  //       return (
  //         <span
  //           key={e.id}
  //           className="ripple"
  //           style={{
  //             left: e.x,
  //             top: e.y,
  //             animationPlayState: isHolding ? "paused" : "",
  //           }}
  //         />
  //       );
  //     })}
  //   </span>
  // </li>
};

const Address = ({ children, onClick, className, scale }) => (
  <Ripple
    children={children}
    scale={scale}
    className={className}
    onClick={onClick}
    element="address"
  />
);
Ripple.Address = Address;

const Article = ({ children, onClick, className, scale }) => (
  <Ripple
    children={children}
    scale={scale}
    className={className}
    onClick={onClick}
    element="article"
  />
);
Ripple.Article = Article;

const Aside = ({ children, onClick, className, scale }) => (
  <Ripple
    children={children}
    scale={scale}
    className={className}
    onClick={onClick}
    element="aside"
  />
);
Ripple.Aside = Aside;

const Header = ({ children, onClick, className, scale }) => (
  <Ripple
    children={children}
    scale={scale}
    className={className}
    onClick={onClick}
    element="header"
  />
);
Ripple.Header = Header;

const Footer = ({ children, onClick, className, scale }) => (
  <Ripple
    children={children}
    scale={scale}
    className={className}
    onClick={onClick}
    element="footer"
  />
);
Ripple.Footer = Footer;

const H1 = ({ children, onClick, className, scale }) => (
  <Ripple
    children={children}
    scale={scale}
    className={className}
    onClick={onClick}
    element="h1"
  />
);
Ripple.H1 = H1;

const H2 = ({ children, onClick, className, scale }) => (
  <Ripple
    children={children}
    scale={scale}
    className={className}
    onClick={onClick}
    element="h2"
  />
);
Ripple.H2 = H2;

const H3 = ({ children, onClick, className, scale }) => (
  <Ripple
    children={children}
    scale={scale}
    className={className}
    onClick={onClick}
    element="h3"
  />
);
Ripple.H3 = H3;

const H4 = ({ children, onClick, className, scale }) => (
  <Ripple
    children={children}
    scale={scale}
    className={className}
    onClick={onClick}
    element="h4"
  />
);
Ripple.H4 = H4;

const H5 = ({ children, onClick, className, scale }) => (
  <Ripple
    children={children}
    scale={scale}
    className={className}
    onClick={onClick}
    element="h5"
  />
);
Ripple.H5 = H5;

const H6 = ({ children, onClick, className, scale }) => (
  <Ripple
    children={children}
    scale={scale}
    className={className}
    onClick={onClick}
    element="h6"
  />
);
Ripple.H6 = H6;

const Main = ({ children, onClick, className, scale }) => (
  <Ripple
    children={children}
    scale={scale}
    className={className}
    onClick={onClick}
    element="main"
  />
);
Ripple.Main = Main;

const Nav = ({ children, onClick, className, scale }) => (
  <Ripple
    children={children}
    scale={scale}
    className={className}
    onClick={onClick}
    element="nav"
  />
);
Ripple.Nav = Nav;

const Section = ({ children, onClick, className, scale }) => (
  <Ripple
    children={children}
    scale={scale}
    className={className}
    onClick={onClick}
    element="section"
  />
);
Ripple.Section = Section;

const Div = ({ children, onClick, className, style, scale }) => (
  <Ripple
    children={children}
    scale={scale}
    className={className}
    style={style}
    onClick={onClick}
    element="div"
  />
);
Ripple.Div = Div;

const Span = ({ children, onClick, className, scale }) => (
  <Ripple
    children={children}
    scale={scale}
    className={className}
    onClick={onClick}
    element="span"
  />
);
Ripple.Span = Span;

const Li = ({ children, onClick, className, scale }) => (
  <Ripple
    children={children}
    scale={scale}
    className={className}
    onClick={onClick}
    element="li"
  />
);
Ripple.Li = Li;

const Ul = ({ children, onClick, className, scale }) => (
  <Ripple
    children={children}
    scale={scale}
    className={className}
    onClick={onClick}
    element="ul"
  />
);
Ripple.Ul = Ul;

const Ol = ({ children, onClick, className, scale }) => (
  <Ripple
    children={children}
    scale={scale}
    className={className}
    onClick={onClick}
    element="ol"
  />
);
Ripple.Ol = Ol;

const P = ({ children, onClick, className, scale }) => (
  <Ripple
    children={children}
    scale={scale}
    className={className}
    onClick={onClick}
    element="p"
  />
);
Ripple.P = P;

const Pre = ({ children, onClick, className, scale }) => (
  <Ripple
    children={children}
    scale={scale}
    className={className}
    onClick={onClick}
    element="pre"
  />
);
Ripple.Pre = Pre;

const Button = ({ children, onClick, className, scale }) => (
  <Ripple
    children={children}
    scale={scale}
    className={className}
    onClick={onClick}
    element="button"
  />
);
Ripple.Button = Button;

export default Ripple;

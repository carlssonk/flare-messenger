import { useEffect } from "react";

function Utils({
  container,
  toggleEmoji,
  editorState,
  setEditorHeight,
  setEditorMaxWidth,
  editorContainer,
  editorWrapper,
}) {
  useEffect(() => {
    setEditorHeight(
      editorContainer.current && editorContainer.current.offsetHeight
    );
    setEditorMaxWidth(
      editorWrapper.current && editorWrapper.current.offsetWidth
    );
  }, [editorState]);

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

    setEditorMaxWidth(
      editorWrapper.current && editorWrapper.current.offsetWidth
    );
  };
  window.onresize = reportWindowSize;

  return null;
}

export default Utils;

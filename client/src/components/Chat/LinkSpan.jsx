import React from "react";

function LinkSpan(props) {
  const styles = {
    link: {
      color: "#149afa",
    },
  };

  return (
    <span style={styles.link} data-offset-key={props.offsetKey}>
      {props.children}
    </span>
  );
}

export default LinkSpan;

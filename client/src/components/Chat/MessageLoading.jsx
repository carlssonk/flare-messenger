import React from "react";
import { IonSpinner } from "@ionic/react";

function ImageLoading({ style, name }) {
  return (
    <div className="message-loading-container" style={style}>
      <IonSpinner name={name} />
    </div>
  );
}

export default ImageLoading;

import React from "react";
import { IonSpinner } from "@ionic/react";

function ImageLoading({ style }) {
  return (
    <div className="image-loading-container" style={style}>
      <IonSpinner />
    </div>
  );
}

export default ImageLoading;

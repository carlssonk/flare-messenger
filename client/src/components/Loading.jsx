import React from "react";

function Loading() {
  return (
    <div className="center">
      <div className="preloader-wrapper active">
        <div className="spinner-layer">
          <div className="circle-clipper left">
            <div className="circle"></div>
          </div>
          <div className="gap-patch">
            <div className="circle"></div>
          </div>
          <div className="circle-clipper right">
            <div className="circle"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loading;

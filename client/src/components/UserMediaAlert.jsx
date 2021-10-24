import React from 'react'
import { IonAlert } from "@ionic/react";

function UserMediaAlert({toggleCameraAlert, setToggleCameraAlert}) {
  return (
    <IonAlert
      isOpen={toggleCameraAlert}
      onDidDismiss={() => setToggleCameraAlert(false)}
      cssClass="popup-alert"
      header={"Camera API not supported."}
      message={"User Media API is not supported on your device/browser."}
      buttons={[{ text: "OK", handler: () => setToggleCameraAlert(false) }]}
    />
  )
}

export default UserMediaAlert

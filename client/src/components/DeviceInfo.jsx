import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBatteryFull,
  faWifi,
  faSignal,
} from "@fortawesome/free-solid-svg-icons";

function DeviceInfo() {
  return (
    <div className="device-info-box">
      <div className="device-info__time">9:41</div>
      <FontAwesomeIcon icon={faSignal} />
      <FontAwesomeIcon icon={faWifi} />
      <FontAwesomeIcon icon={faBatteryFull} />
    </div>
  );
}

export default DeviceInfo;

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBatteryEmpty,
  faWifi,
} from "@fortawesome/free-solid-svg-icons";

function DeviceInfo() {
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [battery, setBattery] = useState(0);
  const [batteryStyle, setBatteryStyle] = useState(null);

  useEffect(() => {
    if (
      "getBattery" in navigator ||
      ("battery" in navigator && "Promise" in window)
    )
      getBattery();

    handleSetDate();
    setInterval(() => {
      handleSetDate();
    }, 1000);
  }, []);

  const handleSetDate = () => {
    const date = new Date();
    setMinutes(("0" + date.getMinutes()).slice(-2));
    setHours(("0" + date.getHours()).slice(-2));
  };

  const getBattery = () => {
    let batteryPromise;
    if ("getBattery" in navigator) {
      batteryPromise = navigator.getBattery();
    } else {
      batteryPromise = Promise.resolve(navigator.battery);
    }
    batteryPromise.then(function (battery) {
      setBattery(battery.level);
      battery.addEventListener("levelchange", function () {
        setBattery(battery.level);
      });
    });
  };

  useEffect(() => {
    let batteryColor = null;
    if (battery <= 0.2 && battery > 0.1) batteryColor = "yellow";
    if (battery >= 0 && battery <= 0.1) batteryColor = "red";
    setBatteryStyle({
      clipPath: `polygon(0 0, ${battery * 100}% 0, ${
        battery * 100
      }% 100%, 0% 100%)`,
      backgroundColor: batteryColor,
    });
  }, [battery]);

  return (
    <div className="device-info-box">
      <div className="device-info__time">
        {hours}:{minutes}
      </div>
      <div className="device-info__status">
        <FontAwesomeIcon
          icon={faWifi}
          style={navigator.onLine && navigator.onLine ? null : { color: "red" }}
        />
        <div className="battery-box">
          <FontAwesomeIcon icon={faBatteryEmpty} />
          <div className="battery-level" style={batteryStyle}></div>
        </div>
      </div>
    </div>
  );
}

export default DeviceInfo;

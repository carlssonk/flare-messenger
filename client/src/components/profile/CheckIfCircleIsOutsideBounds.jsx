import { useEffect } from "react";
import { getImgSizeInfo } from "../../utils/previewAvatar";

function CheckIfCircleIsOutsideBounds({
  imageSize,
  scaleValue,
  circleRef,
  imageRef,
  maxX,
  maxY,
  setOutsideBounds,
  setIsOutsideBounds,
  lastX,
  lastY,
}) {
  useEffect(() => {
    const checkIfOutsideBounds = () => {
      const {
        top: circleTOP,
        right: circleRIGHT,
        bottom: circleBOTTOM,
        left: circleLEFT,
      } = circleRef.current.getBoundingClientRect();

      const {
        top: imageTOP,
        right: imageRIGHT,
        bottom: imageBOTTOM,
        left: imageLEFT,
      } = imageRef.current.getBoundingClientRect();

      const { top: imageNaturalTOP, left: imageNaturalLEFT } = getImgSizeInfo(
        imageRef.current
      );

      const outsideTOP = circleTOP < imageTOP + imageNaturalTOP * scaleValue;
      const outsideBOTTOM =
        circleBOTTOM > imageBOTTOM - imageNaturalTOP * scaleValue;
      const outsideLEFT =
        circleLEFT < imageLEFT + imageNaturalLEFT * scaleValue;
      const outsideRIGHT =
        circleRIGHT > imageRIGHT - imageNaturalLEFT * scaleValue;

      // console.log(circleTOP - (imageTOP + imageNaturalTOP * scaleValue));
      // console.log(imageTOP + imageNaturalTOP * scaleValue);
      // console.log(circleTOP);

      const calculateSetOutsideBounds = () => {
        setOutsideBounds({
          y: outsideTOP ? maxY : -maxY,
          x: outsideLEFT ? maxX : -maxX,
        });
      };

      if (outsideTOP || outsideBOTTOM) {
        setIsOutsideBounds(true);
        if (outsideLEFT || outsideRIGHT) return calculateSetOutsideBounds();
        return setOutsideBounds({ y: outsideTOP ? maxY : -maxY, x: lastX });
      }

      if (outsideLEFT || outsideRIGHT) {
        setIsOutsideBounds(true);
        if (outsideTOP || outsideBOTTOM) return calculateSetOutsideBounds();
        return setOutsideBounds({ y: lastY, x: outsideLEFT ? maxX : -maxX });
      }

      setIsOutsideBounds(false);
    };

    checkIfOutsideBounds();
  }, [
    scaleValue,
    imageSize,
    circleRef,
    imageRef,
    lastX,
    lastY,
    maxX,
    maxY,
    setIsOutsideBounds,
    setOutsideBounds,
  ]);

  return null;
}

export default CheckIfCircleIsOutsideBounds;

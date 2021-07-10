function getRenderedSize(contains, cWidth, cHeight, width, height, pos) {
  var oRatio = width / height,
    cRatio = cWidth / cHeight;
  return function () {
    if (contains ? oRatio > cRatio : oRatio < cRatio) {
      this.width = Math.round(cWidth);
      this.height = Math.round(cWidth / oRatio);
    } else {
      this.width = Math.round(cHeight * oRatio);
      this.height = Math.round(cHeight);
    }
    this.naturalWidth = width;
    this.naturalHeight = height;

    this.left = (cWidth - this.width) * (pos / 100);
    this.right = this.width + this.left;

    this.top = (cHeight - this.height) * (pos / 100);
    this.bottom = this.height + this.top;
    return this;
  }.call({});
}

export function getImgSizeInfo(img) {
  if (img === null) return;
  var pos = window
    .getComputedStyle(img)
    .getPropertyValue("object-position")
    .split(" ");
  return getRenderedSize(
    true,
    img.width,
    img.height,
    img.naturalWidth,
    img.naturalHeight,
    parseInt(pos[0])
  );
}

export const calculatePosition = (
  imageSize,
  circleRef,
  imageRef,
  scaleValue
) => {
  const SCALE =
    imageSize.naturalWidth < imageSize.naturalHeight
      ? imageSize.naturalWidth
      : imageSize.naturalHeight;

  const ZOOM = Math.round(SCALE / scaleValue);

  const { top: circleTOP, left: circleLEFT } =
    circleRef.current.getBoundingClientRect();

  const { top: imageTOP, left: imageLEFT } =
    imageRef.current.getBoundingClientRect();

  const { top: imageNaturalTOP, left: imageNaturalLEFT } = getImgSizeInfo(
    imageRef.current
  );

  const SCALE_TO_NATURAL = imageSize.naturalHeight / imageSize.height;

  const FindX = Math.round(
    ((circleLEFT - (imageLEFT + imageNaturalLEFT * scaleValue)) *
      SCALE_TO_NATURAL) /
      scaleValue
  );
  const FindY = Math.round(
    ((circleTOP - (imageTOP + imageNaturalTOP * scaleValue)) *
      SCALE_TO_NATURAL) /
      scaleValue
  );

  return { ZOOM, FindX, FindY };
};

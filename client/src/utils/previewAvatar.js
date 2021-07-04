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
    this.left = (cWidth - this.width) * (pos / 100);
    this.right = this.width + this.left;

    this.top = (cHeight - this.height) * (pos / 100);
    this.bottom = this.height + this.top;
    return this;
  }.call({});
}

export function getImgSizeInfo(img) {
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

const hexCodes = [
  "#38b6a1",
  "#66c787",
  "#5b3cb0",
  "#896b04",
  "#956365",
  "#70c2b0",
  "#566445",
  "#ac1b34",
  "#415752",
  "#1b513a",
  "#55a9ba",
  "#bd6a26",
  "#622216",
  "#c5b11f",
  "#63bb7c",
  "#384618",
  "#1429a4",
  "#4928e3",
  "#dfab0f",
];

module.exports.randomHexGenerator = () => {
  return hexCodes[Math.floor(Math.random() * hexCodes.length)];
};

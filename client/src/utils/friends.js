export const findUserAndRemove = (array, id) => {
  const arrayCopy = [...array];
  const findIdx = arrayCopy.findIndex((e) => e._id === id);
  if (findIdx >= 0) arrayCopy.splice(findIdx, 1);
  return arrayCopy;
};

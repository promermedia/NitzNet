export const setHeadsets = (headsets) => ({
  type: "SET_HEADSETS",
  payload: headsets,
});

export const addHeadset = (hs) => ({
  type: "ADD_HEADSET",
  payload: hs,
});

export const updateHeadset = (updatedHS) => ({
  type: "UPDATE_HEADSET",
  payload: updatedHS,
});
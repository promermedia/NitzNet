export const setScreenings = (events) => ({
  type: "SET_SCREENINGS",
  payload: events,
});

export const addScreening = (ev) => ({
  type: "ADD_SCREENING",
  payload: ev,
});

export const updateScreening = (events) => ({
  type: "UPDATE_SCREENING",
  payload: events,
});
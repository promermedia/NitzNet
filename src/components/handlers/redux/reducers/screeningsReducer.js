const initialState = [];

const screeningsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_SCREENINGS":
      return action.payload;
    case "ADD_SCREENING":
      return [...state, action.payload];
    case "UPDATE_SCREENING":
      return state.map((ev) =>
        ev.id === action.payload.id ? action.payload : ev
      );
    default:
      return state;
  }
};

export default screeningsReducer;

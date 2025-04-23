const initialState = [];

const headsetsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_HEADSETS":
      return action.payload;
    case "ADD_HEADSET":
      return [...state, action.payload];
    case "UPDATE_HEADSET":
      return state.map((hs) =>
        hs.id === action.payload.id ? action.payload : hs
      );
    default:
      return state;
  }
};

export default headsetsReducer;

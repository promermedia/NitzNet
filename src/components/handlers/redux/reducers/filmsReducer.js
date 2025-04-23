const initialState = [];

const filmsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_FILMS":
      return action.payload;
    case "ADD_FILM":
      return [...state, action.payload];
    case "UPDATE_FILM":
      return state.map((hs) =>
        hs.id === action.payload.id ? action.payload : hs
      );
    default:
      return state;
  }
};

export default filmsReducer;

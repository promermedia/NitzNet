const initialState = [];

const rolesReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_ROLES":
      return action.payload;
    case "ADD_ROLE":
      return [...state, action.payload]; 
    default:
      return state;
  }
};

export default rolesReducer;

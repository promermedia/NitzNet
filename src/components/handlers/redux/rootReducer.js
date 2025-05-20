import { combineReducers } from "redux";
import usersReducer from "./reducers/usersReducer";
import rolesReducer from "./reducers/rolesReducer";
import headsetsReducer from "./reducers/headsetsReducer";
import filmsReducer from "./reducers/filmsReducer";
import screeningsReducer from "./reducers/screeningsReducer";

const rootReducer = combineReducers({
  users: usersReducer,
  roles: rolesReducer,
  headsets: headsetsReducer,
  films: filmsReducer,
  screenings: screeningsReducer,
});

export default rootReducer;

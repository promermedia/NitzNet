import { combineReducers } from "redux";
import usersReducer from "./reducers/usersReducer";
import rolesReducer from "./reducers/rolesReducer";
import headsetsReducer from "./reducers/headsetsReducer";
import filmsReducer from "./reducers/filmsReducer";




const rootReducer = combineReducers({
  users: usersReducer,
  roles: rolesReducer,
  headsets: headsetsReducer,
  films: filmsReducer,

});

export default rootReducer;

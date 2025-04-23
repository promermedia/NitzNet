import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Tools from "../handlers/tools";
import Navbar from "../htmlelements/navbar";
import Users from "./users/users";
import HeadSetsTable from "./headsets/headsetstable";
import FilmsTable from "./films/filmstable";
import Admin from "./admin";
import { useSelector, useDispatch } from "react-redux";
import { setUsers } from "../handlers/redux/actions/usersActions";
import { setRoles } from "../handlers/redux/actions/rolesActions";


function AdminDash({ userInfo, setLogged }) {
 const users = useSelector((state) => state.users);
  const dispatch = useDispatch();
  
  const navItems = [
    { title: "בית", path: "admin", comp: Admin, props: { userInfo } },
    { title: "צוות", path: "config", comp: Users },
    {
      title: "משקפות",
      path: "headsets",
      comp: HeadSetsTable,
    },
    {
      title: "סרטים",
      path: "films",
      comp: FilmsTable,
    },
  ];

  useEffect(() => {
    async function getUsers() {
      var formdata = new FormData();
      formdata.append("token", Tools.getLSbyKey("NHuser", "token"));
      var requestOptions = {
        method: "POST",
        body: formdata,
      };
      const response = await fetch(
        Tools.serverURL + "admin/getAllUsers",
        requestOptions
      );
      const result = await response.json();
      if (
        result &&
        result.payload &&
        result.payload.success === true &&
        result.payload.Users &&
        result.payload.Users.length > 0
      ) {
        dispatch(setUsers(result.payload.Users));
        dispatch(setRoles(result.payload.Roles));
      }
    }
    if (!users || users.length == 0) getUsers();
  }, [dispatch]);

  return (
    <Router>
      <div className="admin-dash dashboards">
        <Navbar navItems={navItems} userInfo={userInfo} setLogged={setLogged} />
        <Routes>
          {navItems.map(({ path, comp: Component, props }, index) => (
            <Route
              key={index}
              path={`/${path}`}
              element={<Component {...props} />}
            />
          ))}
          <Route path="*" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}
export default AdminDash;

// const mapStateToProps = (state) => ({
//   users: state.users,
// });

// const mapDispatchToProps = {
//   setUsers,
// };
// export default connect(mapStateToProps, mapDispatchToProps)(AdminDash);
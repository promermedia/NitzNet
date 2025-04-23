import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Tools from "../handlers/tools";
import Client from './client'
import Navbar from "../htmlelements/navbar";
// import DonationsTable from "./donations/donationstable";

function ClientDash({ userInfo, setLogged }) {
   const navItems = [
     { title: "בית", path: "client", comp: Client, props: { userInfo } },
    //  {
    //    title: "נדבות",
    //    path: "donations",
    //    comp: DonationsTable,
    //  },
   ];

  return (
    <Router>
      <div className="client-dash dashboards">
        <Navbar navItems={navItems} userInfo={userInfo} setLogged={setLogged}/>
        <Routes>
          {navItems.map(({ path, comp: Component, props }, index) => (
            <Route
              key={index}
              path={`/${path}`}
              element={<Component {...props} />}
            />
          ))}
          <Route path="*" element={<Client />} />
        </Routes>
      </div>
    </Router>
  );
}
export default ClientDash;

import Sidebar from "../sidebar/sidebar";
import Header from "../header/header";
import React from 'react'

const NavBar = ({ children }) => {
  return (
    <div>
      <Header />
      <Sidebar />
      <div style={{ marginTop: "120px", marginLeft: "280px", marginRight: "20px" }} >{children}</div>
    </div>
  )
}

export default NavBar;


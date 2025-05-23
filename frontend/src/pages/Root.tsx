import { Outlet } from "react-router-dom";
import { Navbar } from "./navbar";
import React from 'react'

function Root() {
  return (
    <div>
        <Navbar/>
        <Outlet/>
    </div>
  )
}

export default Root
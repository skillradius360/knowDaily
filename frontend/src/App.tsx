import { useState } from 'react'
import { Navbar } from './pages/navbar'
import './App.css'
import { createBrowserRouter,createRoutesFromElements,Route ,RouterProvider} from 'react-router-dom'
import Root from './pages/root'
import Home from './pages/Home'

function App() {
 const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Root/>}>
      <Route path='/Home' element={<Home/>}/>
    </Route>
  )
)
  return (
    <>
     {/* <Navbar/> */}
   <RouterProvider router={router}/>
    </>
  )
}

export default App

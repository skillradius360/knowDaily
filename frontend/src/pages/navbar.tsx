import { NavLink} from "react-router-dom"
export function Navbar(){
    return (
        <>
<div className="w-screen shadow-md">
    <nav className="h-10 w-full  flex justify-between pl-3 items-center">
        <span>LOGO</span>
        <ul className="w-1/5 flex justify-evenly" > 
            <li><NavLink to="/Blogs">Blogs</NavLink></li>
           <li><NavLink to="/User">Profile</NavLink></li>
        </ul>
    </nav>
</div>
        </>
    )
}
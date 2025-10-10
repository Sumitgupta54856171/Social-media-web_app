import { Link } from "react-router-dom"
function Liveoption(){
    return(
        <>
        <p className="flex flex-cols bg-white  ">
            <span className="flex flex-row "><Link to='/Stream' className=" text-sm text-gray-800 border-0 "> live Event</Link><span><img src="https://cdn-icons-png.flaticon.com/512/2989/2989838.png"  className="size-12" ></img></span></span>
            <span  className="flex flex-row">
                <Link>
                Squared
                </Link>
                <img src="https://cdn-icons-png.flaticon.com/512/5127/5127336.png " className="size-12" ></img>
            </span>
        </p>
        </>
    )
}
export default Liveoption;
import { useContext } from 'react';
import { Authcontext } from '../context';
import Navbar from './Navbar';
function Shownav(){
    const {handleclick,shownav} = useContext(Authcontext);
    return(
        <>
        {shownav ? <div className="fixed bottom-4 left-4">
    <button className="bg-blend-saturation text-white p-2 rounded-full shadow-lg" onMouseEnter={handleclick}>
    <img src="   https://cdn-icons-png.flaticon.com/512/1828/1828859.png " className="size-10"></img>
    </button>
</div>:<Navbar/>}

        </>
    )
}
export default Shownav;
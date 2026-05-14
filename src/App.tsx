import Board from "./components/Board"
import LeftSection from "./components/LeftSection"
import RightSection from "./components/RightSection"

function App(){
    return(
    <div className="min-h-screen h-screen bg-black flex flex-row">
        <div className="w-1/4">
            <LeftSection />
        </div>

        <div className="w-2/4">
            <Board />
        </div>

        <div className="w-1/4">
            <RightSection />
        </div>
    </div>
    )
}
export default App
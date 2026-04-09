import { useState } from "react"
import Loading from "./Layouts/Loading"
import Home from "./pages/Home"
const App = () => {
  const[isLoading, setIsLoading] = useState(true)
  return (
    <div>
      {isLoading ? (<Loading onComplete={setIsLoading}/>) : (<Home />)}
    </div>
  )
}

export default App
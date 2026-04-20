import { useState, useEffect, useRef } from "react"
import Loading from "./Layouts/Loading"
import Hero from "./pages/Hero"
import gsap from "gsap"

const App = () => {
  const [loaderDone, setLoaderDone] = useState(false)
  const loaderRef = useRef(null)

  useEffect(() => {
    if (loaderDone) {
      gsap.to(loaderRef.current, {
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut",
        onComplete: () => {
          loaderRef.current.style.display = "none"
        }
      })
    }
  }, [loaderDone])

  return (
    <div style={{ background: "#080808", position: "relative" }}>

      <Hero />
      {/* <div
        ref={loaderRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "#080808"
        }}
      >
        <Loading onComplete={() => setLoaderDone(true)} />
      </div> */}

    </div>
  )
}

export default App
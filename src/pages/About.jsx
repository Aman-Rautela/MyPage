import gsap from "gsap";
import { useEffect, useRef } from "react";

const About = ({ onClose }) => {
  const panelRef = useRef(null);

  useEffect(() => {
    // Entry animation (from right)
    gsap.fromTo(
      panelRef.current,
      { x: "100%" },
      {
        x: "0%",
        duration: 0.7,
        ease: "power3.inOut",
      }
    );
  }, []);

  // Exit animation
  const handleClose = () => {
    gsap.to(panelRef.current, {
      x: "100%",
      duration: 0.5,
      ease: "power3.in",
      onComplete: onClose,
    });
  };

  return (
    <div className="absolute inset-0 z-50 pointer-events-none">
      
      {/* Optional background dim */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-none" />

      {/* Right side panel */}
      <div
        ref={panelRef}
        className="absolute right-0 top-0 h-full w-[400px] bg-blue-600 text-white p-6 flex flex-col pointer-events-auto shadow-2xl"
      >
        <h1 className="text-2xl font-bold mb-4">
          YO! HERE'S SOMETHING About ME
        </h1>

        <p className="text-zinc-200 text-sm leading-relaxed">
          I’m Aman — MCA student, passionate about React, GSAP animations,
          and building system-level projects in C.
        </p>

        <button
          onClick={handleClose}
          className="mt-6 px-4 py-2 border border-white hover:bg-white hover:text-black transition w-fit"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default About;
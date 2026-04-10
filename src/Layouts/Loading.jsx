import { useEffect, useRef } from "react";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { ScrambleTextPlugin } from "gsap/all";
// import typeSounds from "../assets/sounds/type.wav";
import crtSounds from "../assets/sounds/fuse.wav";

gsap.registerPlugin(TextPlugin, ScrambleTextPlugin);

const LINES = [
  { text: "SYSTEM BOOT... OK", color: "text-zinc-700", big: false },
  { text: "LOADING CORE MODULES...", color: "text-zinc-700", big: false },
  {
    text: "ASSET BUNDLE [████████████████-] 99%",
    color: "text-zinc-600",
    big: false,
  },
  {
    text: "DECRYPTING: 0x4152415554454C41",
    color: "text-orange-600",
    big: false,
  },
  { text: "ERR_CORRUPT › RETRYING...", color: "text-red-600", big: false },
  { text: "IDENTITY RESOLVED ✓", color: "text-green-500", big: false },
  { text: "> Aman Rautela", color: "text-zinc-400", big: true },
  { text: "STATUS: READY TO EXPLORE", color: "text-orange-500", big: false },
];

const Loading = ({ onComplete }) => {
  const loaderRef = useRef(null);
  const linesRef = useRef([]);
  const progressRef = useRef(null);
  const promptRef = useRef(null);
  const canExitRef = useRef(false);
  const screenRef = useRef();

  // const typeSound = useRef(null);
  const crtSound = useRef(null);

  const triggerExit = () => {
    if (!canExitRef.current) return;
    canExitRef.current = false;

    const tl = gsap.timeline({ onComplete });

    tl.call(() => {
      if (crtSound.current) {
        crtSound.current.currentTime = 0;
        crtSound.current.volume = 0.5;
        crtSound.current.play();
      }
    });

    tl.to(screenRef.current, {
      filter: "brightness(3)",
      duration: 0.08,
    });

    tl.to(screenRef.current, {
      filter: "brightness(0.5)",
      duration: 0.1,
    });

    tl.to(screenRef.current, {
      scaleY: 0.05,
      transformOrigin: "center",
      duration: 0.25,
      ease: "power4.in",
    });

    tl.to(screenRef.current, {
      scaleX: 0.05,
      duration: 0.2,
      ease: "power4.in",
    });

    tl.to(screenRef.current, {
      opacity: 0,
      duration: 0.2,
    });

    tl.to(
      loaderRef.current,
      {
        y: "-100%",
        duration: 0.8,
        ease: "power4.inOut",
      },
      ">+0.2",
    );
  };

  useEffect(() => {
    const tl = gsap.timeline();

    gsap.set(promptRef.current, { autoAlpha: 0 });

    gsap.from(loaderRef.current, {
      scale: 1.05,
      duration: 2,
      ease: "power4.inOut",
    });

    LINES.forEach((line, i) => {
      const el = linesRef.current[i];

      tl.to(el, {
        opacity: 1,
        duration: 0.2,
        // onStart: () => {
        //   if (typeSound.current && typeSound.current.paused) {
        //     typeSound.current.volume = 0.4;
        //     typeSound.current.play().catch(() => {});
        //   }
        // },
      });

      if (line.big) {
        tl.to(el, {
          duration: 3.5,
          scrambleText: {
            text: line.text,
            chars: "!<>-_\\/[]{}",
            revealDelay: 1.5,
            speed: 2,
          },
        });
      } else {
        tl.fromTo(
          el,
          { text: "" },
          { text: line.text, duration: 2, ease: "power4.inOut" },
        );
      }
    });

    gsap.to(progressRef.current, {
      width: "100%",
      duration: Math.max(tl.duration() - 1, 0.5),
      ease: "linear",
    });

    tl.call(() => {
      canExitRef.current = true;

      gsap.set(promptRef.current, { autoAlpha: 1 });

      gsap.to(promptRef.current, {
        autoAlpha: 0,
        duration: 0.6,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    });

    const handleKey = (e) => {
      if (e.key === "Enter") triggerExit();
    };

    window.addEventListener("keydown", handleKey);

    return () => {
      tl.kill();
      window.removeEventListener("keydown", handleKey);
    };
  }, [onComplete]);

  return (
    <div
      ref={loaderRef}
      onClick={triggerExit}
      className="fixed inset-0 bg-black z-9999 flex items-center justify-center overflow-hidden cursor-pointer"
    >
      {/* <audio ref={typeSound} src={typeSounds} preload="auto" /> */}
      <audio ref={crtSound} src={crtSounds} preload="auto" />

      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[100%_2px]" />

      <div
        ref={screenRef}
        className="w-[820px] h-[500px] px-10 py-10 border border-zinc-900 relative bg-black overflow-hidden will-change-transform"
      >
        <span className="absolute top-0 left-0 w-4 h-4 border-t border-l border-orange-500" />
        <span className="absolute top-0 right-0 w-4 h-4 border-t border-r border-orange-500" />
        <span className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-orange-500" />
        <span className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-orange-500" />

        <div className="flex justify-between font-mono text-[9px] tracking-[4px] text-zinc-700 mb-6">
          <span>TERMINAL_v3.0</span>
          <span>BOOT_SEQUENCE</span>
        </div>

        <div className="min-h-[240px] space-y-1 py-6">
          {LINES.map((line, i) => (
            <div
              key={i}
              ref={(el) => (linesRef.current[i] = el)}
              className={`opacity-0 font-mono tracking-widest ${
                line.big
                  ? `text-2xl font-black tracking-[6px] ${line.color}`
                  : `text-[11px] ${line.color}`
              }`}
            />
          ))}
        </div>

        <div
          ref={promptRef}
          className="mt-6 opacity-0 font-mono text-[10px] tracking-[4px] text-zinc-600 text-center"
        >
          PRESS ENTER OR CLICK TO CONTINUE
        </div>

        <div className="mt-10 h-[2px] bg-zinc-900">
          <div
            ref={progressRef}
            className="h-full bg-orange-500 shadow-[0_0_8px_#f97316]"
            style={{ width: "0%" }}
          />
        </div>

        <div className="flex justify-between font-mono text-[8px] tracking-[3px] text-zinc-700 mt-3">
          <span>SYS::PORTFOLIO</span>
          <span>INITIALIZING</span>
        </div>
      </div>
    </div>
  );
};

export default Loading;

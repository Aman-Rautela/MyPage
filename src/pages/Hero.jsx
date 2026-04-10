/* eslint-disable react-hooks/exhaustive-deps */
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

const COLS = 7;
const ROWS = 6;

const SLIDES = [
  { type: "text", content: "AMAN" },
  {
    type: "svg",
    content: (
      <svg viewBox="0 0 100 100" width="160" height="160" fill="none">
        <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="1.5"/>
        <circle cx="50" cy="50" r="4" fill="white"/>
        <line x1="50" y1="5" x2="50" y2="25" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="50" y1="75" x2="50" y2="95" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="5" y1="50" x2="25" y2="50" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="75" y1="50" x2="95" y2="50" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="50" cy="50" r="44" stroke="white" strokeWidth="0.5" strokeDasharray="4 6"/>
      </svg>
    ),
  },{
  type: "svg",
  content: (
    <svg viewBox="0 0 200 100" width="300" height="150" fill="none">
      <path d="M60 10 L30 10 L30 90 L60 90" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M140 10 L170 10 L170 90 L140 90" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M85 35 L100 50 L85 65" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M115 35 L100 50 L115 65" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
},
];

export default function Hero() {
  const gridRef = useRef(null);
  const slideRef = useRef(null);
  const glowRef = useRef(null);
  const boxRef = useRef(null);
  const measureRef = useRef(null);
  const timerRef = useRef(null);
  const idxRef = useRef(0);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const tiles = Array.from(gridRef.current.querySelectorAll(".tile"));

    gsap.set(slideRef.current, {
      scale: 0.01,
      opacity: 0,
      filter: "blur(8px)",
    });
    gsap.set(glowRef.current, { opacity: 0 });
    gsap.set(boxRef.current, { opacity: 0, scale: 0 });

    function colSweep(onDone) {
      const tl = gsap.timeline({ onComplete: onDone });
      for (let col = COLS - 1; col >= 0; col--) {
        const colTiles = tiles.filter((_, i) => i % COLS === col);
        const d = (COLS - 1 - col) * 0.07;

        tl.to(colTiles, {
          borderColor: "#888",
          duration: 0.12,
          stagger: 0.015,
        }, d).to(colTiles, {
          borderColor: "#1a1a1a",
          duration: 0.4,
          stagger: 0.015,
        }, d + 0.1);
      }
    }

    function fitBox() {
      if (!measureRef.current || !boxRef.current) return;
      const { width, height } = measureRef.current.getBoundingClientRect();
      gsap.set(boxRef.current, {
        width: width + 72,
        height: height + 44,
      });
    }

    function zoomIn(isSVG, onDone) {
      const tl = gsap.timeline({ onComplete: onDone });

      tl.to(glowRef.current, { opacity: 1, duration: 0.5 }, 0);

      if (isSVG) {
        tl.to(boxRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.35,
          ease: "expo.out",
        }, 0);
      }

      tl.to(slideRef.current, {
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.3,
        ease: "expo.out",
      }, 0.05);
    }

    function zoomOut(isSVG, onDone) {
      const tl = gsap.timeline({ onComplete: onDone });

      tl.to(slideRef.current, {
        scale: 0.01,
        opacity: 0,
        filter: "blur(10px)",
        duration: 0.25,
        ease: "expo.in",
      }, 0);

      if (isSVG) {
        tl.to(boxRef.current, {
          scale: 0.01,
          opacity: 0,
          duration: 0.25,
          ease: "expo.in",
        }, 0);
      }

      tl.to(glowRef.current, { opacity: 0, duration: 0.2 }, 0);
    }

    function tick() {
      const slide = SLIDES[idxRef.current];
      const isSVG = slide.type === "svg";

      setCurrentIdx(idxRef.current);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {

          if (isSVG) {
            fitBox();
            gsap.set(boxRef.current, {
              opacity: 0,
              scale: 0.01,
            });
          } else {
            gsap.set(boxRef.current, {
              opacity: 0,
              scale: 0,
              width: 0,
              height: 0,
            });
          }

          gsap.set(slideRef.current, {
            scale: 0.01,
            opacity: 0,
            filter: "blur(8px)",
          });

          gsap.set(glowRef.current, { opacity: 0 });

          zoomIn(isSVG, () => {
            timerRef.current = setTimeout(() => {
              zoomOut(isSVG, () => {
                idxRef.current = (idxRef.current + 1) % SLIDES.length;
                tick();
              });
            }, 50);
          });
        });
      });
    }

    colSweep(() => tick());

    return () => {
      clearTimeout(timerRef.current);
      gsap.killTweensOf([
        slideRef.current,
        glowRef.current,
        boxRef.current,
        ...tiles,
      ]);
    };
  }, []);

  const slide = SLIDES[currentIdx];

  const SlideContent = ({ s }) =>
    s.type === "text" ? (
      <span className="text-white font-black uppercase whitespace-nowrap text-[clamp(48px,10vw,120px)]">
        {s.content}
      </span>
    ) : (
      s.content
    );

  return (
    <div className="relative h-screen w-screen bg-[#080808] overflow-hidden">
      <div
        ref={gridRef}
        className="absolute inset-0 grid grid-cols-7 grid-rows-6"
      >
        {Array.from({ length: COLS * ROWS }).map((_, i) => {
          const isTopRow = Math.floor(i / COLS) === 0;
          const isCol5 = i % COLS === 5;
          const isCol6 = i % COLS === 6;
          const isTopRight = isTopRow && (isCol5 || isCol6);

          return (
            <div
              key={i}
              className="tile border border-[#1a1a1a]"
              style={{
                borderRight: isTopRight && isCol5 ? "none" : undefined,
                borderLeft: isTopRight && isCol6 ? "none" : undefined,
              }}
            />
          );
        })}
      </div>

      <div className="absolute flex items-center justify-center invisible">
        <div ref={measureRef}>
          <SlideContent s={slide} />
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          ref={glowRef}
          className="w-[50%] h-[55%] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse,rgba(255,255,255,0.15),transparent)",
            filter: "blur(18px)",
          }}
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          ref={boxRef}
          style={{
            position: "absolute",
            border: "1px solid rgba(255,255,255,0.9)",
            boxShadow: "0 0 18px rgba(255,255,255,0.15)",
            willChange: "transform, opacity, width, height",
          }}
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div ref={slideRef}>
          <SlideContent s={slide} />
        </div>
      </div>
    </div>
  );
}
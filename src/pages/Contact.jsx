import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const CONTACTS = [
  {
    label: "Email",
    value: "amanrautela@example.com",
    href: "mailto:amanrautela@example.com",
    // mail icon as inline SVG data URI
    image: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='200' height='200'><rect width='100' height='100' fill='%23111'/><rect x='10' y='25' width='80' height='55' rx='4' fill='none' stroke='white' stroke-width='4'/><polyline points='10,25 50,58 90,25' fill='none' stroke='white' stroke-width='4'/></svg>`,
  },
  {
    label: "GitHub",
    value: "github.com/amanrautela",
    href: "https://github.com/amanrautela",
    image: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='200' height='200'><rect width='100' height='100' fill='%23111'/><path fill='white' d='M50 12C28.9 12 12 28.9 12 50c0 16.8 10.9 31 26 36 1.9.3 2.6-.8 2.6-1.8v-6.4c-10.6 2.3-12.8-5.1-12.8-5.1-1.7-4.4-4.2-5.6-4.2-5.6-3.5-2.4.3-2.3.3-2.3 3.8.3 5.8 3.9 5.8 3.9 3.4 5.8 8.9 4.1 11.1 3.2.3-2.5 1.3-4.1 2.4-5-8.5-1-17.4-4.2-17.4-18.8 0-4.2 1.5-7.6 3.9-10.2-.4-1-1.7-4.8.4-10 0 0 3.2-1 10.4 3.9a36 36 0 0 1 19 0c7.2-4.9 10.4-3.9 10.4-3.9 2.1 5.2.8 9 .4 10 2.5 2.6 3.9 6 3.9 10.2 0 14.6-8.9 17.8-17.4 18.8 1.4 1.2 2.6 3.5 2.6 7v10.4c0 1 .7 2.2 2.6 1.8C77.1 81 88 66.8 88 50 88 28.9 71.1 12 50 12z'/></svg>`,
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/amanrautela",
    href: "https://linkedin.com/in/amanrautela",
    image: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='200' height='200'><rect width='100' height='100' fill='%230A66C2'/><rect x='14' y='35' width='16' height='51' fill='white'/><circle cx='22' cy='22' r='9' fill='white'/><path fill='white' d='M40 35h15v7s4-8 15-8c13 0 16 9 16 20v32H71V56c0-6-2-11-8-11s-9 5-9 11v30H40V35z'/></svg>`,
  },
  {
    label: "Twitter / X",
    value: "@amanrautela",
    href: "https://x.com/amanrautela",
    image: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='200' height='200'><rect width='100' height='100' fill='%23111'/><path fill='white' d='M18 18h19l13 18 15-18h8L54 44l26 38H61L47 62 31 82h-8l21-27L18 18zm8 6l36 52h8L34 24h-8z'/></svg>`,
  },
];

const Contact = ({ onClose }) => {
  const panelRef = useRef(null);
  const scrollRef = useRef(null);
  const sectionsRef = useRef([]);
  const buttonRef = useRef(null);
  // one ref per contact link row
  const linkRowRefs = useRef([]);

  const addToRefs = (el) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  // ✅ PANEL ENTRY
  useEffect(() => {
    gsap.fromTo(
      panelRef.current,
      { x: "-100%" },
      { x: "0%", duration: 0.6, ease: "power3.out" }
    );
  }, []);

  // ✅ SCROLLTRIGGER
  useEffect(() => {
    const ctx = gsap.context(() => {
      const container = scrollRef.current;
      const panels = sectionsRef.current.slice(0, -1);

      panels.forEach((panel) => {
        const inner = panel.querySelector(".section-inner");
        if (!inner) return;

        panel.style.willChange = "transform, opacity";
        inner.style.willChange = "transform";

        const panelHeight = inner.offsetHeight;
        const windowHeight = container.offsetHeight;
        const diff = panelHeight - windowHeight;
        const ratio = diff > 0 ? diff / (diff + windowHeight) : 0;

        if (ratio) {
          panel.style.marginBottom = panelHeight * ratio + "px";
        }

        const tl = gsap.timeline();

        ScrollTrigger.create({
          trigger: panel,
          scroller: container,
          start: "top top",
          end: ratio ? `+=${panelHeight}` : "+=100%",
          pin: true,
          pinSpacing: false,
          scrub: true,
          animation: tl,
          onUpdate: (self) => {
            panel.style.pointerEvents =
              self.progress > 0.1 ? "none" : "auto";
          },
          onLeaveBack: () => {
            panel.style.pointerEvents = "auto";
          },
        });

        if (ratio) {
          tl.to(inner, { y: -(panelHeight - windowHeight), ease: "none" });
        }

        tl.to(panel, { scale: 0.75, opacity: 0, ease: "power2.out" });
      });

      ScrollTrigger.refresh();
    }, panelRef);

    return () => ctx.revert();
  }, []);

  // ✅ CURSOR-FOLLOWING HOVER IMAGE on each contact link
  useEffect(() => {
    const cleanups = [];

    linkRowRefs.current.forEach((el) => {
      if (!el) return;

      const image = el.querySelector(".swipe-image");
      if (!image) return;

      // start image centered on cursor
      gsap.set(image, { xPercent: -100, yPercent: -150, autoAlpha: 0 });

      const setX = gsap.quickTo(image, "x", { duration: 0.4, ease: "power3" });
      const setY = gsap.quickTo(image, "y", { duration: 0.4, ease: "power3" });

      let firstEnter = false;

      const align = (e) => {
        if (firstEnter) {
          // snap immediately on first enter, no lerp
          setX(e.clientX, e.clientX);
          setY(e.clientY, e.clientY);
          firstEnter = false;
        } else {
          setX(e.clientX);
          setY(e.clientY);
        }
      };

      const fade = gsap.to(image, {
        autoAlpha: 1,
        ease: "none",
        paused: true,
        duration: 0.15,
        onReverseComplete: () =>
          document.removeEventListener("mousemove", align),
      });

      const onEnter = (e) => {
        firstEnter = true;
        fade.play();
        document.addEventListener("mousemove", align);
        align(e);
      };

      const onLeave = () => fade.reverse();

      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);

      cleanups.push(() => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
        document.removeEventListener("mousemove", align);
        fade.kill();
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  // ✅ FULL-SCREEN CURSOR TILT ON SEND BUTTON
  useEffect(() => {
    const btn = buttonRef.current;
    const container = scrollRef.current;
    if (!btn || !container) return;

    gsap.set(btn, { transformPerspective: 650 });

    const rotateX = gsap.quickTo(btn, "rotationX", { duration: 0.6, ease: "power3.out" });
    const rotateY = gsap.quickTo(btn, "rotationY", { duration: 0.6, ease: "power3.out" });
    const moveX   = gsap.quickTo(btn, "x", { duration: 0.6, ease: "power3.out" });
    const moveY   = gsap.quickTo(btn, "y", { duration: 0.6, ease: "power3.out" });

    const handleMove = (e) => {
      const xRatio = e.clientX / window.innerWidth;
      const yRatio = e.clientY / window.innerHeight;
      rotateX(gsap.utils.interpolate(15, -15, yRatio));
      rotateY(gsap.utils.interpolate(-15, 15, xRatio));
      moveX(gsap.utils.interpolate(-20, 20, xRatio));
      moveY(gsap.utils.interpolate(-20, 20, yRatio));
    };

    const handleLeave = () => {
      rotateX(0); rotateY(0); moveX(0); moveY(0);
    };

    container.addEventListener("pointermove", handleMove);
    container.addEventListener("pointerleave", handleLeave);

    return () => {
      container.removeEventListener("pointermove", handleMove);
      container.removeEventListener("pointerleave", handleLeave);
    };
  }, []);

  // ✅ CLOSE
  const handleClose = () => {
    gsap.to(panelRef.current, {
      x: "-100%",
      duration: 0.5,
      ease: "power3.in",
      onComplete: onClose,
    });
  };

  const sections = [
    // SECTION 1 — Hero
    <div
      key="hero"
      ref={addToRefs}
      className="section w-full h-full flex items-center justify-center bg-[#080808]"
    >
      <div className="section-inner px-12 flex flex-col gap-4">
        <p className="text-[11px] tracking-[0.3em] text-white/30 uppercase">
          Contact
        </p>
        <h1 className="text-[clamp(48px,8vw,96px)] font-black text-white uppercase leading-none">
          Let's<br />Talk.
        </h1>
        <p className="text-white/40 text-sm max-w-xs leading-relaxed">
          Whether it's a project, a collab, or just a hello — my inbox is always open.
        </p>
        <div className="mt-2 w-8 h-px bg-white/20" />
        <p className="text-white/20 text-xs tracking-widest animate-bounce">
          scroll ↓
        </p>
      </div>
    </div>,

    // SECTION 2 — Links with cursor-follow hover images
    <div
      key="links"
      ref={addToRefs}
      className="section w-full h-full flex items-center justify-center bg-[#080808]"
    >
      <div className="section-inner px-12 flex flex-col gap-6 w-full">
        <p className="text-[11px] tracking-[0.3em] text-white/30 uppercase mb-2">
          Reach me at
        </p>

        {CONTACTS.map(({ label, value, href, image }, i) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            // ✅ position:relative so the absolutely-positioned image is scoped
            // to the viewport (we use fixed for cursor tracking but need a stacking context)
            ref={(el) => (linkRowRefs.current[i] = el)}
            className="group flex flex-col border-b border-white/10 pb-4
                       hover:border-white/30 transition-colors relative"
            style={{ cursor: "none" }} // hide default cursor over rows
          >
            <span className="text-[10px] tracking-[0.25em] text-white/30 uppercase mb-1 pointer-events-none">
              {label}
            </span>
            <span className="text-white text-lg font-light tracking-wide group-hover:text-white/70 transition-colors pointer-events-none">
              {value}
            </span>

            {/*
              ✅ The hover image.
              position:fixed so it follows cursor coords relative to viewport.
              top/left:0 because GSAP sets x/y to e.clientX / e.clientY.
              pointer-events:none so it never blocks mouse events on the link.
            */}
            <img
              src={image}
              alt={label}
              className="swipe-image"
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: 180,
                height: 180,
                objectFit: "cover",
                pointerEvents: "none",
                zIndex: 9999,
                borderRadius: 8,
                visibility: "hidden", // gsap controls via autoAlpha
              }}
            />
          </a>
        ))}
      </div>
    </div>,

    // SECTION 3 — Form
    <div
      key="cta"
      ref={addToRefs}
      className="section w-full h-full flex items-center justify-center bg-[#080808]"
    >
      <div className="section-inner px-12 flex flex-col gap-4 w-full max-w-sm">
        <p className="text-[11px] tracking-[0.3em] text-white/30 uppercase">
          Prefer a form?
        </p>
        <h2 className="text-3xl font-black text-white uppercase leading-tight">
          Drop a<br />Message.
        </h2>

        <input
          type="text"
          placeholder="Your name"
          className="bg-transparent border border-white/15 text-white text-sm px-4 py-3
                     placeholder:text-white/25 focus:outline-none focus:border-white/40 transition-colors rounded-lg"
        />
        <input
          type="email"
          placeholder="Your email"
          className="bg-transparent border border-white/15 text-white text-sm px-4 py-3
                     placeholder:text-white/25 focus:outline-none focus:border-white/40 transition-colors rounded-lg"
        />
        <textarea
          rows={4}
          placeholder="Your message"
          className="bg-transparent border border-white/15 text-white text-sm px-4 py-3
                     placeholder:text-white/25 focus:outline-none focus:border-white/40 transition-colors resize-none rounded-lg"
        />

        {/* 🔥 3D TILT BUTTON */}
        <button
          ref={buttonRef}
          style={{ transformStyle: "preserve-3d" }}
          className="border border-white/30 text-white text-xs tracking-[0.2em] uppercase
                     px-6 py-3 will-change-transform hover:bg-white hover:text-black transition-colors rounded-lg"
        >
          Send →
        </button>
      </div>
    </div>,
  ];

  return (
    <div className="absolute inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-none" />

      <div
        ref={panelRef}
        className="absolute inset-0 bg-[#080808] text-white flex flex-col overflow-hidden"
      >
        <button
          onClick={handleClose}
          className="absolute top-5 right-6 z-10 text-white/40 hover:text-white
                     text-xs tracking-[0.2em] uppercase transition-colors"
        >
          ✕ close
        </button>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto overflow-x-hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {sections}
        </div>
      </div>
    </div>
  );
};

export default Contact;
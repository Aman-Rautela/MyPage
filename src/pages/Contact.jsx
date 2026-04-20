import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const CONTACTS = [
  {
    label: "Email",
    value: "amanrautela@example.com",
    href: "mailto:amanrautela@example.com",
  },
  {
    label: "GitHub",
    value: "github.com/amanrautela",
    href: "https://github.com/amanrautela",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/amanrautela",
    href: "https://linkedin.com/in/amanrautela",
  },
  {
    label: "Twitter / X",
    value: "@amanrautela",
    href: "https://x.com/amanrautela",
  },
];

const Contact = ({ onClose }) => {
  const panelRef = useRef(null);
  const scrollRef = useRef(null);
  const sectionsRef = useRef([]);
  const triggersRef = useRef([]);

  // RESET refs on render (important)
  // eslint-disable-next-line react-hooks/refs
  sectionsRef.current = [];

  useEffect(() => {
    // Entry animation
    gsap.fromTo(
      panelRef.current,
      { x: "-100%" },
      { x: "0%", duration: 0.7, ease: "power3.inOut" }
    );
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const container = scrollRef.current;
      if (!container) return;

      const panels = sectionsRef.current;
      const scrollPanels = panels.slice(0, -1);

      scrollPanels.forEach((panel) => {
        const inner = panel.querySelector(".section-inner");
        if (!inner) return;

        const panelHeight = inner.offsetHeight;
        const windowHeight = container.offsetHeight;
        const difference = panelHeight - windowHeight;

        const fakeScrollRatio =
          difference > 0 ? difference / (difference + windowHeight) : 0;

        if (fakeScrollRatio) {
          panel.style.marginBottom =
            panelHeight * fakeScrollRatio + "px";
        }

        const tl = gsap.timeline();

        const trigger = ScrollTrigger.create({
          trigger: panel,
          scroller: container,
          start: "bottom bottom",
          end: fakeScrollRatio
            ? `+=${inner.offsetHeight * 2}`
            : "+=100%",
          pin: true,
          pinSpacing: false,
          scrub: 5,
          animation: tl,
        });

        if (fakeScrollRatio) {
          tl.to(inner, {
            yPercent: -100,
            y: windowHeight,
            ease: "none",
          });
        }

        tl.fromTo(
          panel,
          { scale: 1, opacity: 1 },
          { scale: 0.7, opacity: 0.5, duration: 0.9 }
        ).to(panel, { opacity: 0, duration: 0.1 });

        triggersRef.current.push(trigger);
      });

      ScrollTrigger.refresh();
    }, 700);

    return () => {
      clearTimeout(timeout);
      triggersRef.current.forEach((t) => t.kill());
      triggersRef.current = [];
    };
  }, []);

  const handleClose = () => {
    triggersRef.current.forEach((t) => t.kill());

    gsap.to(panelRef.current, {
      x: "-100%",
      duration: 0.5,
      ease: "power3.in",
      onComplete: onClose,
    });
  };

  const sections = [
    // SECTION 1
    <div
      key="hero"
      className="section w-full h-full flex-shrink-0 flex items-center justify-center bg-[#080808]"
      ref={(el) => el && sectionsRef.current.push(el)}
    >
      <div className="section-inner flex flex-col items-start gap-4 px-12">
        <p className="text-[11px] tracking-[0.3em] text-white/30 uppercase">
          Contact
        </p>
        <h1 className="text-[clamp(48px,8vw,96px)] font-black text-white uppercase leading-none">
          Let's
          <br />
          Talk.
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

    // SECTION 2
    <div
      key="links"
      className="section w-full h-full flex-shrink-0 flex items-center justify-center bg-[#080808]"
      ref={(el) => el && sectionsRef.current.push(el)}
    >
      <div className="section-inner flex flex-col gap-6 px-12 w-full">
        <p className="text-[11px] tracking-[0.3em] text-white/30 uppercase mb-2">
          Reach me at
        </p>

        {CONTACTS.map(({ label, value, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="group flex flex-col border-b border-white/10 pb-4 hover:border-white/30 transition-colors"
          >
            <span className="text-[10px] tracking-[0.25em] text-white/30 uppercase mb-1">
              {label}
            </span>
            <span className="text-white text-lg font-light tracking-wide group-hover:text-white/70 transition-colors">
              {value}
            </span>
          </a>
        ))}
      </div>
    </div>, // ✅ FIXED COMMA HERE

    // SECTION 3
    <div
      key="cta"
      className="section w-full h-full flex-shrink-0 flex items-center justify-center bg-[#080808]"
      ref={(el) => el && sectionsRef.current.push(el)}
    >
      <div className="section-inner flex flex-col items-start gap-6 px-12">
        <p className="text-[11px] tracking-[0.3em] text-white/30 uppercase">
          Prefer a form?
        </p>
        <h2 className="text-3xl font-black text-white uppercase leading-tight">
          Drop a
          <br />
          Message.
        </h2>

        <div className="flex flex-col gap-3 w-full max-w-sm">
          <input
            type="text"
            placeholder="Your name"
            className="bg-transparent border border-white/15 text-white text-sm px-4 py-3 placeholder:text-white/25 focus:outline-none focus:border-white/40 transition-colors"
          />

          <input
            type="email"
            placeholder="Your email"
            className="bg-transparent border border-white/15 text-white text-sm px-4 py-3 placeholder:text-white/25 focus:outline-none focus:border-white/40 transition-colors"
          />

          <textarea
            rows={4}
            placeholder="Your message"
            className="bg-transparent border border-white/15 text-white text-sm px-4 py-3 placeholder:text-white/25 focus:outline-none focus:border-white/40 transition-colors resize-none"
          />

          <button className="border border-white/30 text-white text-xs tracking-[0.2em] uppercase px-6 py-3 hover:bg-white hover:text-black transition-all">
            Send →
          </button>
        </div>
      </div>
    </div>,
  ];

  return (
    <div className="absolute inset-0 z-50">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-none" />

      <div
        ref={panelRef}
        className="absolute left-0 top-0 h-full w-full bg-[#080808] text-white shadow-2xl flex flex-col"
      >
        <button
          onClick={handleClose}
          className="absolute top-5 right-6 z-10 text-white/30 hover:text-white text-xs tracking-[0.2em] uppercase transition-colors"
        >
          ✕ close
        </button>

        <div
          ref={scrollRef}
          className="relative flex-1 overflow-y-auto overflow-x-hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {sections}
        </div>
      </div>
    </div>
  );
};

export default Contact;
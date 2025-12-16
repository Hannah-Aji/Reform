// src/pages/home/Home.jsx
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, Button, Badge } from "../components/ui";

// --- scroll reveal hook reused from before ---
function useScrollReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setVisible(true);
          else setVisible(false);
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

function RevealSection({ children, className = "" }) {
  const [ref, visible] = useScrollReveal();

  return (
    <section
      ref={ref}
      className={`transform transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </section>
  );
}

// --- NEW: big ACTION marquee component ---
function ActionMarquee() {
  const [direction, setDirection] = useState(1); // 1 = normal (L→R), -1 = reverse (R→L)

  useEffect(() => {
    function handleWheel(e) {
      if (e.deltaY > 0) {
        // scroll down
        setDirection(1);
      } else if (e.deltaY < 0) {
        // scroll up
        setDirection(-1);
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  const wordStyle = {
    WebkitTextStroke: "3px #000000",
    color: "#0787d9",
  };

  return (
    <div className="mt-10 overflow-hidden w-screen relative left-1/2 right-1/2 -ml-[50vw]">

      <div
        className="whitespace-nowrap"
        style={{
          animation: "action-marquee 18s linear infinite",
          animationDirection: direction === 1 ? "normal" : "reverse",
        }}
      >
        {Array.from({ length: 8 }).map((_, idx) => (
          <span
            key={idx}
            className="inline-block text-[20vw] md:text-[10vw] font-black leading-none tracking-tight pr-8"
            style={wordStyle}
          >
            ACTION
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="bg-[#f5f0e6]">
      <div className="mx-auto max-w-5xl px-4 pt-6 pb-16 space-y-16 md:space-y-20">
        {/* Hero */}
        <RevealSection>
          <div className="grid gap-8 md:grid-cols-[3fr,2fr] items-start">
            {/* Left: centered hero text */}
            <div className="text-center flex flex-col items-center">
              <Badge>Neighborhood Edition</Badge>
              <h1 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
                The small jobs that keep a city alive.
              </h1>
              <p className="mt-4 text-base md:text-lg text-slate-800 leading-relaxed max-w-xl">
                Reform is a little logbook for painting fences, fixing taps,
                planting trees and all the quiet work that keeps our shared
                spaces from falling apart.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                <Link to="/work/create">
                  <Button>Start a work order</Button>
                </Link>
                <Link to="/work">
                  <Button variant="outline">Browse Works</Button>
                </Link>
              </div>
            </div>

            {/* 🔵 NEW: ACTION marquee directly under hero/buttons */}
            <ActionMarquee />

            {/* Right: side cards */}
            <div className="space-y-4">
              <Card className="bg-[#fff2bf] border-slate-800 shadow-md rotate-[-1.5deg]">
                <CardBody className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-800">
                    Today&apos;s tally
                  </p>
                  <p className="text-sm text-slate-900">
                    3 benches sanded, 1 clinic wall painted, 12 neighbors who
                    now know each other by name.
                  </p>
                </CardBody>
              </Card>
              <Card className="bg-[#c7f5e4] border-slate-800 shadow-md rotate-1.5deg">
                <CardBody className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-800">
                    What can be logged?
                  </p>
                  <ul className="text-xs text-slate-900 space-y-1">
                    <li>• Maintenance jobs</li>
                    <li>• Tiny renovation sprints</li>
                    <li>• “Let’s just fix this” Saturdays</li>
                  </ul>
                </CardBody>
              </Card>
            </div>
          </div>

          
        </RevealSection>

        {/* Rest of your sections stay the same */}
        <RevealSection>
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-700">
              Sections
            </p>
            <h2 className="text-xl md:text-2xl font-semibold">
              What belongs in Reform?
            </h2>
            <div className="mt-3 overflow-x-auto pb-2">
              <div className="flex gap-4 min-w-max">
                {[
                  {
                    title: "Paint & Patch",
                    bg: "bg-[#ffd6e8]",
                    text: "Chipped school walls, railings, gates, crossings.",
                  },
                  {
                    title: "Water & Fixtures",
                    bg: "bg-[#d1f5ff]",
                    text: "Drinking fountains, taps, handwashing stations.",
                  },
                  {
                    title: "Benches & Seating",
                    bg: "bg-[#ffeec2]",
                    text: "Park benches, bus stop seats, playground edges.",
                  },
                  {
                    title: "Green Pockets",
                    bg: "bg-[#d7f8cb]",
                    text: "Tree pits, planters, tiny gardens between the concrete.",
                  },
                  {
                    title: "Signs & Safety",
                    bg: "bg-[#fce3c8]",
                    text: "Wayfinding, crossing lines, slow-down reminders.",
                  },
                ].map((item) => (
                  <Card
                    key={item.title}
                    className={`w-64 border-slate-800 shadow-md ${item.bg}`}
                  >
                    <CardBody className="space-y-2">
                      <h3 className="text-sm font-semibold uppercase tracking-[0.18em]">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-900 leading-relaxed">
                        {item.text}
                      </p>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </RevealSection>

        <RevealSection>
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-700">
              How it runs
            </p>
            <h2 className="text-xl md:text-2xl font-semibold">
              From “someone should fix that” to “done”.
            </h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {[
                {
                  label: "1. Log the work",
                  text: "A fence, a tap, a patch of wall — capture the location, what’s wrong, and what’s needed.",
                },
                {
                  label: "2. Rally hands & tools",
                  text: "Neighbors add themselves, pick roles, and list the tools or materials they can bring.",
                },
                {
                  label: "3. Mark the outcome",
                  text: "Upload a quick before/after, mark it complete, and keep a quiet record of care.",
                },
              ].map((step, idx) => (
                <Card
                  key={step.label}
                  className="bg-[#fdf8ec] border-slate-800 shadow-sm"
                >
                  <CardBody className="space-y-2">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-900 text-xs font-semibold">
                      {idx + 1}
                    </span>
                    <p className="text-sm font-semibold">{step.label}</p>
                    <p className="text-xs text-slate-800 leading-relaxed">
                      {step.text}
                    </p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </RevealSection>

        <RevealSection>
          <Card className="border-slate-900 bg-[#111827] text-[#fef3b4]">
            <CardBody className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.1em] text-slate-900">
                  Quiet infrastructure
                </p>
                <p className="mt-2 text-lg md:text-xl font-semibold text-slate-900">
                  Start with one tiny improvement on one tiny corner.
                </p>
                <p className="mt-2 text-sm max-w-md text-slate-900">
                  It doesn’t need to be a big city plan. Just one school wall,
                  one bus stop, one garden bed that looks better after this
                  weekend than it did before.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Link to="/work/create">
                  <Button>Log your first work</Button>
                </Link>
                <Link to="/work">
                  <Button variant="ghost">
                    Or browse what others are fixing →
                  </Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        </RevealSection>
      </div>
    </div>
  );
}

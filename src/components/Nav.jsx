import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Nav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const isActive = (to) =>
    location.pathname === to ||
    location.pathname.startsWith(to + "/");

  function goAndClose(path) {
    navigate(path);
    setOpen(false);
  }

  return (
    <>
      {/* Top bar – blends into body, no divider */}
      <div className="sticky top-0 z-30 bg-[#f5f0e6]/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center px-4 py-3 relative">
          {/* Left spacer to keep title centered */}
          <div className="w-16 md:w-24" />

          {/* Centered brand */}
          <button
            type="button"
            onClick={() => goAndClose("/")}
            className="absolute left-1/2 -translate-x-1/2 text-center"
          >
            <div className="brand-title text-lg md:text-2xl font-black">
              REFORM
            </div>
            <div className="mt-0.5 text-[0.55rem] md:text-[0.7rem] tracking-[0.25em] uppercase text-slate-700">
              Community Works
            </div>
          </button>

          {/* Right menu button */}
          <div className="ml-auto flex items-center">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-900 bg-slate-900 px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[#fef3b4] shadow-sm hover:bg-black"
            >
              <span>Menu</span>
              <span
                className={`inline-block transform transition-transform duration-300 ${
                  open ? "-translate-y-[2px] rotate-180" : "translate-y-[2px]"
                }`}
              >
                ▾
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Full-screen yellow sheet */}
      <div
        className={`fixed inset-0 z-40 overflow-hidden transform transition-transform duration-500 ease-out ${
          open ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Main sheet background */}
        <div className="relative h-full w-full bg-[#fde68a]">
          <div className="flex h-full flex-col">
          
            {/* Top row: brand + LARGE standalone X */}
            <div className="flex items-center justify-between px-5 pt-4">
              <div className="brand-title text-sm tracking-[0.25em] uppercase">
                Reform
              </div>

              {/* BIG bold X (no circle) */}
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="text-7xl font-black leading-none hover:opacity-70 transition"
              >
                ×
              </button>
            </div>



            {/* Center area — nav stack is centered here */}
            <div className="flex-1 flex flex-col items-center justify-center px-6">
              {/* 🔹 Vertical stack, all same width, center-aligned with each other */}
              <nav className="space-y-4 flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => goAndClose("/")}
                  className={`w-48 text-center text-3xl md:text-4xl font-black tracking-[0.18em] uppercase ${
                    isActive("/")
                      ? "underline underline-offset-8 decoration-2"
                      : ""
                  }`}
                >
                  Home
                </button>
                <button
                  type="button"
                  onClick={() => goAndClose("/work")}
                  className={`w-48 text-center text-3xl md:text-4xl font-black tracking-[0.18em] uppercase ${
                    isActive("/work")
                      ? "underline underline-offset-8 decoration-2"
                      : ""
                  }`}
                >
                  Works
                </button>
                <button
                  type="button"
                  onClick={() => goAndClose("/account")}
                  className={`w-48 text-center text-3xl md:text-4xl font-black tracking-[0.18em] uppercase ${
                    isActive("/account")
                      ? "underline underline-offset-8 decoration-2"
                      : ""
                  }`}
                >
                  Account
                </button>
              </nav>

              <p className="mt-10 text-xs md:text-sm max-w-md text-slate-800/90 leading-relaxed text-center">
                Log the leaks, repaint the walls, fix the taps. Reform is for
                keeping the everyday infrastructure of a neighborhood alive.
              </p>
            </div>
          </div>

          {/* Splash / liquid bottom */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
            <div
              className={`absolute left-1/2 -translate-x-1/2 w-[140%] h-[200%] bg-[#facc15] rounded-[50%] transition-transform duration-700 ease-out ${
                open ? "scale-100" : "scale-y-0"
              }`}
            />
          </div>
        </div>
      </div>
    </>
  );
}

// src/pages/work/Works.jsx
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

function PageLift({ children }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <div
      className={`transform transition-all duration-700 ease-out ${
        ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {children}
    </div>
  );
}

export default function Works() {
  const location = useLocation();
  const [readyTabs, setReadyTabs] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setReadyTabs(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const isActive = (path) => location.pathname === path;

  const tabClasses = (path) => {
    const active = isActive(path);

    return [
      "rounded-full px-4 py-1.5 text-[0.7rem] md:text-sm uppercase tracking-tight",
      "transition-colors duration-200",
      active
        ? "bg-slate-900 text-[#fef3b4]"
        : "bg-[#fdf3d0] text-slate-900 hover:bg-slate-700 hover:text-[#fef3b4]",
    ].join(" ");
  };

  return (
    <>
      {/* Cream strip directly under the app bar */}
      <div className="bg-[#f5f0e6]">
        <div className="mx-auto max-w-5xl px-4">
          <div
            className={`mt-1 rounded-b-3xl bg-[#f5f0e6] pb-3 pt-2 transition-all duration-500 ease-out ${
              readyTabs ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            {/* Centered Tabs */}
            <div className="flex justify-center">
              <div className="flex gap-1.5">
                <Link to="/work">
                  <button type="button" className={tabClasses("/work")}>
                    Work
                  </button>
                </Link>
                <Link to="/work/activity">
                  <button
                    type="button"
                    className={tabClasses("/work/activity")}
                  >
                    Activity
                  </button>
                </Link>
                <Link to="/work/create">
                  <button
                    type="button"
                    className={tabClasses("/work/create")}
                  >
                    Create
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page content with "come up" animation */}
      <PageLift>
        <Outlet />
      </PageLift>
    </>
  );
}

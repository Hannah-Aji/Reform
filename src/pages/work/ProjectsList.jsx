// src/pages/work/ProjectsList.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import MultiSelect from "../../components/MultiSelect";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Input,
  Label,
} from "../../components/ui";


function ProjectImageCarousel({ locationText }) {
  const images = [
    "https://media.istockphoto.com/id/1433619092/photo/used-paint-cans.jpg?s=612x612&w=0&k=20&c=8zdrC3Vr5i0muJTFYdlmIdsXx8G93k-1bsWK1_PsCTc=",
    "https://images.pexels.com/photos/4240497/pexels-photo-4240497.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/4240494/pexels-photo-4240494.jpeg?auto=compress&cs=tinysrgb&w=1200",
  ];

  const [index, setIndex] = useState(0);

  function next() {
    setIndex((prev) => (prev + 1) % images.length);
  }

  function prev() {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  }

  return (
    <div className="relative h-56 overflow-hidden rounded-t-2xl">
      {/* Image */}
      <img
        src={images[index]}
        alt="Project visual"
        className="h-full w-full object-cover"
      />

      {/* Top-right location/category badge */}
      <div className="absolute top-3 right-3 rounded-md bg-black/60 px-2 py-1">
        <p className="max-w-[160px] overflow-hidden text-ellipsis whitespace-nowrap text-[0.65rem] font-medium text-white">
          {locationText}
        </p>
      </div>

      {/* Gradient bottom overlay */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/40 to-transparent" />

      {/* Controls + dots */}
      <div className="absolute inset-x-0 bottom-3 flex items-center justify-between px-3">
        <button
          type="button"
          onClick={prev}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white text-xl font-bold hover:bg-black/80 shadow-md transition"
        >
          ‹
        </button>

        <div className="flex gap-1.5">
          {images.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full ${
                i === index ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white text-xl font-bold hover:bg-black/80 shadow-md transition"
        >
          ›
        </button>
      </div>
    </div>
  );
}






export default function ProjectsList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [q, setQ] = useState("");
  const [roleOptions, setRoleOptions] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [tool, setTool] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: profs } = await supabase
        .from("professions")
        .select("id,title")
        .order("title", { ascending: true });
      if (!active) return;
      setRoleOptions(
        (profs || []).map((p) => ({ id: p.id, label: p.title }))
      );
    })();
    return () => {
      active = false;
    };
  }, []);

  async function load() {
    setLoading(true);
    setError("");

    let query = supabase
      .from("projects")
      .select("*")
      .order("created_on", { ascending: false });

    if (q.trim()) {
      const { data, error } = await query;
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      const text = q.toLowerCase();
      const filtered = (data || []).filter(
        (p) =>
          (p.name || "").toLowerCase().includes(text) ||
          (p.location || "").toLowerCase().includes(text) ||
          (p.category || "").toLowerCase().includes(text)
      );
      const roleSet = new Set(selectedRoles);
      const hasRoleFilter = selectedRoles.length > 0;
      const roleFiltered = hasRoleFilter
        ? filtered.filter(
            (p) =>
              Array.isArray(p.roles_required) &&
              p.roles_required.some((r) => roleSet.has(r))
          )
        : filtered;
      const toolText = tool.trim().toLowerCase();
      const toolFiltered = toolText
        ? roleFiltered.filter((p) =>
            (p.tools_needed || []).some((t) =>
              (t || "").toLowerCase().includes(toolText)
            )
          )
        : roleFiltered;
      setProjects(toolFiltered);
      setLoading(false);
      return;
    }

    const { data, error } = await query;
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    const roleSet = new Set(selectedRoles);
    const hasRoleFilter = selectedRoles.length > 0;
    const byRole = hasRoleFilter
      ? (data || []).filter(
          (p) =>
            Array.isArray(p.roles_required) &&
            p.roles_required.some((r) => roleSet.has(r))
        )
      : data || [];
    const toolText = tool.trim().toLowerCase();
    const byTool = toolText
      ? byRole.filter((p) =>
          (p.tools_needed || []).some((t) =>
            (t || "").toLowerCase().includes(toolText)
          )
        )
      : byRole;
    setProjects(byTool);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []); // initial

  useEffect(() => {
    load();
  }, [q, selectedRoles, tool]); // refetch on filter change

  const roleMap = useMemo(
    () => new Map(roleOptions.map((o) => [o.id, o.label])),
    [roleOptions]
  );

  return (
    <Container>
      <Card>
        <CardHeader
          title="Work"
          subtitle="Browse community refurbishment projects."
        />
        <CardBody className="grid gap-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="q">Search</Label>
              <Input
                id="q"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Name, location, category"
              />
            </div>
            <div>
              <Label htmlFor="tool">Tool contains</Label>
              <Input
                id="tool"
                value={tool}
                onChange={(e) => setTool(e.target.value)}
                placeholder="e.g., paint"
              />
            </div>
            <div>
              <Label>Roles</Label>
              <MultiSelect
                options={roleOptions}
                selectedIds={selectedRoles}
                onChange={setSelectedRoles}
                placeholder="Any role"
              />
            </div>
          </div>

          {loading && <div className="text-slate-500">Loading…</div>}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && projects.length === 0 && (
            <div className="rounded-xl border bg-slate-50 p-6 text-slate-600">
              No projects match your filters.
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {projects.map((p) => (
              <Card key={p.id}>
                {/* 🔹 New top image carousel */}
               
                <ProjectImageCarousel
                  locationText={`${p.location} • ${p.category}`}
                />

                <CardBody className="grid gap-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{p.name}</h3>

                      {/* Category Line */}
                      {Array.isArray(p.field_category) && p.field_category.length > 0 && (
                        <p className="text-sm font-semibold text-slate-500">
                          {p.field_category.join(" • ")}
                        </p>
                      )}
                      
                      <p className="text-sm font-semibold text-slate-500">
                          27 coming
                      </p>

                      {/* Clickable address line → opens Google Maps */}
                      <a
                        href="https://www.google.com/maps/search/?api=1&query=NYSC%20Permanent%20Orientation%20Camp%2C%20Iyana%20Ipaja%2C%20Agege%2C%20Lagos%20State"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 flex items-center text-sm overflow-hidden hover:underline underline-offset-2"
                      >
                        {/* Blue icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="#0077ff"
                          className="h-4 w-4 flex-shrink-0 mr-1"
                        >
                          <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 
                            9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 
                            11.5 12 11.5z"/>
                        </svg>

                        {/* Blue truncated address */}
                        <span className="truncate max-w-[200px] text-[#0077ff]">
                          NYSC Permanent Orientation Camp, Iyana Ipaja, Agege, Lagos State
                        </span>
                      </a>


                    </div>
                    <Link to={`/work/project/${p.id}`}>
                      <button
                        className="
                          text-sm
                          px-2 py-1
                          border border-slate-300
                          rounded-md
                          text-slate-600
                          hover:bg-slate-100
                          hover:border-slate-400
                          transition
                        "
                      >
                        View
                      </button>

                    </Link>
                  </div>

                  

                  {p.details && (
                    <p className="line-clamp-3 whitespace-pre-line text-xs text-slate-800">
                      {p.details}
                    </p>
                    
                  )}

            

                  {/* Inline "Authorized by" + badges (normal case) */}
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-700">
                    <span className="font-medium">Authorized by:</span>

                    <span className="inline-flex items-center rounded-full border border-slate-300 bg-white px-2 py-0.5 text-xs text-slate-700">
                      Commissioned by the Local Government LGA
                    </span>

                    <span className="inline-flex items-center rounded-full border border-slate-300 bg-white px-2 py-0.5 text-xs text-slate-700">
                      State Government
                    </span>

                    <span className="inline-flex items-center rounded-full border border-slate-300 bg-white px-2 py-0.5 text-xs text-slate-700">
                      Community Works Committee
                    </span>

                    <span className="inline-flex items-center rounded-full border border-slate-300 bg-white px-2 py-0.5 text-xs text-slate-700">
                      +2 more
                    </span>
                  </div>


                  <div className="text-xs text-slate-500">
                    Created on:{" "}
                    {p.created_on
                      ? new Date(p.created_on).toLocaleDateString()
                      : "—"}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </CardBody>
      </Card>
    </Container>
  );
}

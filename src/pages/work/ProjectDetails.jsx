

// src/pages/work/ProjectDetails.jsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../hooks/useAuth";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
} from "../../components/ui";

export default function ProjectDetails() {
  const { id } = useParams();
  const session = useAuth();

  const [project, setProject] = useState(null);
  const [roleTitles, setRoleTitles] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState("");

  const [warn, setWarn] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();
      if (!active) return;
      if (error) {
        setError(error.message);
        return;
      }
      setProject(data);

      if (
        Array.isArray(data?.roles_required) &&
        data.roles_required.length
      ) {
        const { data: profs } = await supabase
          .from("professions")
          .select("id, title")
          .in("id", data.roles_required);
        const titles = (profs || [])
          .sort(
            (a, b) =>
              data.roles_required.indexOf(a.id) -
              data.roles_required.indexOf(b.id)
          )
          .map((p) => p.title || p.id);
        setRoleTitles(titles);
      }

      const { data: ph } = await supabase
        .from("photo_entries")
        .select("id, photo_path, tag, created_at")
        .eq("project_id", id)
        .order("created_at", { ascending: true });
      setPhotos(ph || []);
    })();
    return () => {
      active = false;
    };
  }, [id]);

  async function onMarkClick() {
    setWarn("");
    if (!session) {
      setWarn("Please sign in to Mark this project.");
      return;
    }
    // TODO: implement mark logic (e.g. supabase.from("project_marks")...)
  }

  if (error) {
    return (
      <Container>
        <Card>
          <CardHeader title="Project Details" />
          <CardBody>
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          </CardBody>
        </Card>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container>
        <Card>
          <CardHeader title="Project Details" />
          <CardBody>
            <div className="text-slate-500">Loading…</div>
          </CardBody>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Card>
        <CardHeader
          title={project.name}
          subtitle={`${project.location} • ${project.category}`}
        />
        <CardBody className="grid gap-6">
          {project.details && (
            <section>
              <h3 className="mb-2 text-lg font-semibold">Details</h3>
              <p className="whitespace-pre-line text-slate-700">
                {project.details}
              </p>
            </section>
          )}

          {Array.isArray(project.tools_needed) &&
            project.tools_needed.length > 0 && (
              <section>
                <h3 className="mb-2 text-lg font-semibold">Tools Needed</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tools_needed.map((t, i) => (
                    <Badge key={i}>{t}</Badge>
                  ))}
                </div>
              </section>
            )}

          {roleTitles.length > 0 && (
            <section>
              <h3 className="mb-2 text-lg font-semibold">Roles Required</h3>
              <div className="flex flex-wrap gap-2">
                {roleTitles.map((t) => (
                  <Badge key={t}>{t}</Badge>
                ))}
              </div>
            </section>
          )}

          {project.outcome && (
            <section>
              <h3 className="mb-2 text-lg font-semibold">Outcome</h3>
              <p className="text-slate-700">{project.outcome}</p>
            </section>
          )}

          <section className="text-sm text-slate-500">
            <span className="mr-3">
              Created on:{" "}
              {project.created_on
                ? new Date(project.created_on).toLocaleDateString()
                : "—"}
            </span>
            {project.completed_on && (
              <span>
                • Completed on:{" "}
                {new Date(
                  project.completed_on
                ).toLocaleDateString()}
              </span>
            )}
          </section>

          {photos.length > 0 && (
            <section>
              <h3 className="mb-2 text-lg font-semibold">Photos</h3>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {photos.map((p) => (
                  <figure
                    key={p.id}
                    className="overflow-hidden rounded-xl border"
                  >
                    <img
                      src={p.photo_path}
                      alt={p.tag || "photo"}
                      className="h-40 w-full object-cover"
                    />
                    {p.tag && (
                      <figcaption className="p-2 text-center text-xs text-slate-500">
                        {p.tag}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </section>
          )}

          {warn && (
            <div
              className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800"
              role="alert"
              aria-live="polite"
            >
              {warn}
            </div>
          )}

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onMarkClick}>
              Mark
            </Button>
            <Link to="/work">
              <Button variant="ghost">Return</Button>
            </Link>
          </div>
        </CardBody>
      </Card>
    </Container>
  );
}

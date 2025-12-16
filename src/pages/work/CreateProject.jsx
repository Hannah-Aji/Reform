
// src/pages/work/CreateProject.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../hooks/useAuth";
import MultiSelect from "../../components/MultiSelect";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Helper,
  Input,
  Label,
  Textarea,
} from "../../components/ui";

export default function CreateProject() {
  const nav = useNavigate();
  const session = useAuth();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [details, setDetails] = useState("");
  const [toolsRaw, setToolsRaw] = useState("");

  const [rolesOptions, setRolesOptions] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("professions")
        .select("id, title")
        .order("title", { ascending: true });
      if (!active) return;
      if (error) setError(error.message);
      else
        setRolesOptions(
          (data || []).map((r) => ({ id: r.id, label: r.title }))
        );
    })();
    return () => {
      active = false;
    };
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (!session) {
      setError("Please sign in to create a project.");
      return;
    }

    if (!selectedRoles.length) {
      setError("Pick at least one role.");
      return;
    }

    const tools = toolsRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      name: name.trim(),
      location: location.trim(),
      category: category.trim(),
      details: details.trim() || null,
      tools_needed: tools,
      roles_required: selectedRoles,
      created_by: null,
    };

    setSubmitting(true);
    const { data, error } = await supabase
      .from("projects")
      .insert([payload])
      .select("id")
      .single();

    setSubmitting(false);

    if (error) {
      setError(error.message);
      return;
    }

    nav(`/work/project/${data.id}`);
  }

  return (
    <Container>
      <Card>
        <CardHeader
          title="Create Project"
          subtitle="Add a new community refurbishment project."
        />
        <CardBody>
          <form onSubmit={onSubmit} className="grid gap-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  placeholder="Ibadan – Bodija"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                placeholder="school / park / road / clinic / other"
              />
            </div>

            <div>
              <Label htmlFor="details">Details</Label>
              <Textarea
                id="details"
                rows={5}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="What are we fixing? What’s the plan?"
              />
              <Helper>
                Markdown-friendly — new lines are preserved on the details page.
              </Helper>
            </div>

            <div>
              <Label htmlFor="tools">Tools Needed (comma-separated)</Label>
              <Input
                id="tools"
                value={toolsRaw}
                onChange={(e) => setToolsRaw(e.target.value)}
                placeholder="hammer, paint, sandpaper"
              />
            </div>

            <div>
              <Label>Roles Required</Label>
              <MultiSelect
                options={rolesOptions}
                selectedIds={selectedRoles}
                onChange={setSelectedRoles}
                placeholder="Pick at least one profession"
              />
              <Helper>
                Options are loaded from the <code>professions</code> table.
              </Helper>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Creating…" : "Create Project"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => nav(-1)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </Container>
  );
}

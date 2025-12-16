








import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://sghjnrxawansuwzdeymq.supabase.co"; // TODO
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnaGpucnhhd2Fuc3V3emRleW1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5NzA2NDEsImV4cCI6MjA3NjU0NjY0MX0.M4YOOgbcVoEiTJBC7-Sr_0HbI3CYpUgyoScUgpMOWLY"; // TODO
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function useAuth() {
  const [session, setSession] = useState(null);
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => mounted && setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);
  return session;
}

const Container = ({ children }) => <div className="min-h-screen bg-slate-50"><div className="mx-auto max-w-5xl px-4 py-6">{children}</div></div>;
const Card = ({ children, className = "" }) => <div className={`rounded-2xl border bg-white shadow-sm ${className}`}>{children}</div>;
const CardHeader = ({ title, subtitle }) => (<div className="border-b p-6"><h2 className="text-2xl font-semibold tracking-tight">{title}</h2>{subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}</div>);
const CardBody = ({ children, className = "" }) => <div className={`p-6 ${className}`}>{children}</div>;
const Label = ({ children, htmlFor }) => <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-slate-700">{children}</label>;
const Input = ({ className = "", ...props }) => <input className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2 focus:border-slate-400 ${className}`} {...props} />;
const Textarea = ({ className = "", ...props }) => <textarea className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2 focus:border-slate-400 ${className}`} {...props} />;
const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const base = "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition";
  const styles = variant === "primary" ? "bg-indigo-600 text-white hover:bg-indigo-700" : variant === "outline" ? "border border-slate-300 bg-white hover:bg-slate-50" : variant === "ghost" ? "hover:bg-slate-100" : "";
  return <button className={`${base} ${styles} ${className}`} {...props}>{children}</button>;
};
const Badge = ({ children }) => <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-sm text-slate-700">{children}</span>;
const Helper = ({ children }) => <p className="text-sm text-slate-500">{children}</p>;

// === Intro page before actual Create form ===
function CreateIntro() {
  const session = useAuth();
  const cta = session ? { label: "Create Project →", to: "/create/new" } : { label: "Sign in to create a project →", to: "/profile" };
  return (
    <Container>
      <Card>
        <CardHeader title="Start a new project" subtitle="Rally your neighbors. Fix what we use. Document the impact." />
        <CardBody className="grid gap-4">
          <p className="text-slate-600">From repainting school walls to repairing park benches, Reform helps communities organize and refurbish public spaces.</p>
          <ul className="list-disc pl-6 text-slate-700">
            <li>Define the work: <span className="text-slate-500">details, location, category</span></li>
            <li>Ask for help: <span className="text-slate-500">pick roles from professions</span></li>
            <li>Bring tools: <span className="text-slate-500">list tools needed</span></li>
          </ul>
          <div><Link to={cta.to}><Button>{cta.label}</Button></Link></div>
        </CardBody>
      </Card>
    </Container>
  );
}

// === Project Details Page ===
function ProjectDetails() {
  const { id } = useParams();
  const session = useAuth();
  const [warn, setWarn] = useState("");
  const [project, setProject] = useState(null);
  const [roleTitles, setRoleTitles] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("projects").select("*").eq("id", id).single();
      if (error) { setError(error.message); return; }
      setProject(data);
      if (Array.isArray(data?.roles_required) && data.roles_required.length) {
        const { data: profs } = await supabase.from("professions").select("id, title").in("id", data.roles_required);
        setRoleTitles((profs || []).map(p => p.title));
      }
      const { data: ph } = await supabase.from("photo_entries").select("id, photo_path, tag, created_at").eq("project_id", id).order("created_at", { ascending: true });
      setPhotos(ph || []);
    })();
  }, [id]);

  function onMarkClick() {
    setWarn("");
    if (!session) {
      setWarn("Please sign in to Mark this project.");
      return;
    }
  }

  if (error) return <Container><Card><CardHeader title="Project Details" /><CardBody>{error}</CardBody></Card></Container>;
  if (!project) return <Container><Card><CardHeader title="Project Details" /><CardBody>Loading…</CardBody></Card></Container>;

  return (
    <Container>
      <Card>
        <CardHeader title={project.name} subtitle={`${project.location} • ${project.category}`} />
        <CardBody className="grid gap-6">
          {project.details && <section><h3 className="mb-2 text-lg font-semibold">Details</h3><p className="whitespace-pre-line text-slate-700">{project.details}</p></section>}
          {warn && <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">{warn}</div>}
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onMarkClick}>Mark</Button>
            <Link to="/projects"><Button variant="ghost">Return to Projects</Button></Link>
          </div>
        </CardBody>
      </Card>
    </Container>
  );
}

// === Profile Page ===
function Profile() {
  const session = useAuth();
  const user = session?.user ?? null;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMsg, setAuthMsg] = useState("");
  const [member, setMember] = useState(null);
  const [profOptions, setProfOptions] = useState([]);
  const [saving, setSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  useEffect(() => { supabase.from("professions").select("id,title").order("title", { ascending: true }).then(({ data }) => setProfOptions(data || [])); }, []);
  useEffect(() => {
    if (!user) { setMember(null); return; }
    supabase.from("members").select("*").eq("id", user.id).single().then(({ data, error }) => {
      if (error) setMember({ id: user.id, email: user.email, name: "", role: "member", profession_id: null, age: null, area: "" });
      else setMember(data);
    });
  }, [user]);

  async function handleUnifiedSignIn(e) {
    e.preventDefault(); setAuthMsg("");
    const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
    if (!signInErr) { setAuthMsg("✅ Signed in"); return; }
    const { error: signUpErr } = await supabase.auth.signUp({ email, password });
    if (signUpErr) setAuthMsg(`❌ ${signUpErr.message || signInErr.message}`);
    else setAuthMsg("✅ Account created. Check your inbox then sign in.");
  }

  async function saveProfile(e) {
    e.preventDefault(); setProfileMsg(""); setSaving(true);
    const payload = { id: user.id, email: member.email, name: member.name || null, role: member.role || "member", profession_id: member.profession_id || null, age: member.age ? Number(member.age) : null, area: member.area || null };
    const { error } = await supabase.from("members").upsert(payload, { onConflict: "id" });
    setSaving(false); setProfileMsg(error ? `❌ ${error.message}` : "✅ Profile saved");
  }

  async function handleSignOut() { await supabase.auth.signOut(); }

  return (
    <Container>
      <Card>
        <CardHeader title="myReform" subtitle={user ? "Manage your profile" : "Sign in — we’ll create your account if needed"} />
        <CardBody className="grid gap-8">
          {!user && (
            <form onSubmit={handleUnifiedSignIn} className="grid gap-3 rounded-2xl border p-4">
              <h3 className="text-lg font-semibold">Sign In</h3>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <Button type="submit">Continue</Button>
              {authMsg && <Helper>{authMsg}</Helper>}
            </form>
          )}
          {user && member && (
            <form onSubmit={saveProfile} className="grid gap-4">
              <div className="flex items-center justify-between"><Badge>{member.role}</Badge><Button variant="outline" type="button" onClick={handleSignOut}>Sign out</Button></div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2"><div><Label>Email</Label><Input value={member.email || ""} onChange={(e) => setMember({ ...member, email: e.target.value })} /></div><div><Label>Name</Label><Input value={member.name || ""} onChange={(e) => setMember({ ...member, name: e.target.value })} /></div></div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3"><div><Label>Profession</Label><select className="w-full rounded-xl border border-slate-200 px-3 py-2" value={member.profession_id || ""} onChange={(e) => setMember({ ...member, profession_id: e.target.value || null })}><option value="">— select —</option>{profOptions.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}</select></div><div><Label>Age</Label><Input type="number" min={13} max={120} value={member.age ?? ""} onChange={(e) => setMember({ ...member, age: e.target.value })} /></div><div><Label>Area</Label><Input value={member.area || ""} onChange={(e) => setMember({ ...member, area: e.target.value })} /></div></div>
              <div className="flex items-center gap-3"><Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save Profile"}</Button>{profileMsg && <Helper>{profileMsg}</Helper>}</div>
            </form>
          )}
        </CardBody>
      </Card>
    </Container>
  );
}

function Nav() {
  return (
    <div className="sticky top-0 z-10 mb-6 rounded-2xl border bg-white/80 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <Link to="/" className="text-xl font-semibold">reform<span className="text-indigo-600">🚸</span></Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link className="rounded-lg px-3 py-2 hover:bg-slate-100" to="/view">Projects</Link>
          <Link className="rounded-lg px-3 py-2 hover:bg-slate-100" to="/create">Create</Link>
          <Link className="rounded-lg px-3 py-2 hover:bg-slate-100" to="/profile">myReform</Link>
        </nav>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<CreateIntro />} />
        <Route path="/create" element={<CreateIntro />} />
        <Route path="/create/new" element={<CreateProject />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

const rootEl = document.getElementById("root");
if (rootEl) createRoot(rootEl).render(<App />);

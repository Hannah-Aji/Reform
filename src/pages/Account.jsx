// src/pages/Account.jsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../hooks/useAuth";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Helper,
  Input,
  Label,
} from "../components/ui";

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


export default function Account() {
  const session = useAuth();
  const user = session?.user ?? null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMsg, setAuthMsg] = useState("");

  const [member, setMember] = useState(null);
  const [profOptions, setProfOptions] = useState([]);
  const [saving, setSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  useEffect(() => {
    supabase
      .from("professions")
      .select("id,title")
      .order("title", { ascending: true })
      .then(({ data }) => setProfOptions(data || []));
  }, []);

  useEffect(() => {
    if (!user) {
      setMember(null);
      return;
    }
    supabase
      .from("members")
      .select("*")
      .eq("id", user.id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          setMember({
            id: user.id,
            email: user.email,
            name: "",
            role: "member",
            profession_id: null,
            age: null,
            area: "",
          });
        } else {
          setMember(data);
        }
      });
  }, [user]);

  async function handleUnifiedSignIn(e) {
    e.preventDefault();
    setAuthMsg("");

    const { error: signInErr } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });
    if (!signInErr) {
      setAuthMsg("✅ Signed in");
      return;
    }

    const { error: signUpErr } = await supabase.auth.signUp({
      email,
      password,
    });
    if (signUpErr) {
      setAuthMsg(`❌ ${signUpErr.message || signInErr.message}`);
    } else {
      setAuthMsg("✅ Account created. Check your inbox then sign in.");
    }
  }

  async function saveProfile(e) {
    e.preventDefault();
    setProfileMsg("");
    setSaving(true);

    const payload = {
      id: user.id,
      email: member.email,
      name: member.name || null,
      role: member.role || "member",
      profession_id: member.profession_id || null,
      age: member.age ? Number(member.age) : null,
      area: member.area || null,
    };

    const { error } = await supabase
      .from("members")
      .upsert(payload, { onConflict: "id" });

    setSaving(false);
    setProfileMsg(error ? `❌ ${error.message}` : "✅ Profile saved");
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  return (
    <PageLift>
      <Container>
        <Card>
          <CardHeader
            title="Account"
            subtitle={
              user
                ? "Manage your profile"
                : "Sign in — we’ll create your account if needed"
            }
          />
          <CardBody className="grid gap-8">
            {!user && (
              <form
                onSubmit={handleUnifiedSignIn}
                className="grid gap-3 rounded-2xl border p-4"
              >
                <h3 className="text-lg font-semibold">Sign In</h3>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Label>Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button type="submit">Continue</Button>
                {authMsg && <Helper>{authMsg}</Helper>}
              </form>
            )}

            {user && member && (
              <form onSubmit={saveProfile} className="grid gap-4">
                <div className="flex items-center justify-between">
                  <Badge>{member.role}</Badge>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={handleSignOut}
                  >
                    Sign out
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <Label>Email</Label>
                    <Input
                      value={member.email || ""}
                      onChange={(e) =>
                        setMember({ ...member, email: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={member.name || ""}
                      onChange={(e) =>
                        setMember({ ...member, name: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                  <div>
                    <Label>Profession</Label>
                    <select
                      className="w-full rounded-xl border border-slate-200 px-3 py-2"
                      value={member.profession_id || ""}
                      onChange={(e) =>
                        setMember({
                          ...member,
                          profession_id: e.target.value || null,
                        })
                      }
                    >
                      <option value="">— select —</option>
                      {profOptions.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Age</Label>
                    <Input
                      type="number"
                      min={13}
                      max={120}
                      value={member.age ?? ""}
                      onChange={(e) =>
                        setMember({ ...member, age: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Area</Label>
                    <Input
                      value={member.area || ""}
                      onChange={(e) =>
                        setMember({ ...member, area: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving…" : "Save Profile"}
                  </Button>
                  {profileMsg && <Helper>{profileMsg}</Helper>}
                </div>
              </form>
            )}
          </CardBody>
        </Card>
      </Container>
    </PageLift>
  );
}

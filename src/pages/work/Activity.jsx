

// src/pages/work/Activity.jsx
import { useAuth } from "../../hooks/useAuth";
import {
  Card,
  CardBody,
  CardHeader,
  Container,
} from "../../components/ui";

export default function Activity() {
  const session = useAuth();
  const user = session?.user ?? null;

  return (
    <Container>
      <Card>
        <CardHeader
          title="Activity"
          subtitle="Track the projects you’ve created, joined, or marked."
        />
        <CardBody className="grid gap-4">
          {!user && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              Sign in on the Account page to see your activity.
            </div>
          )}
          {user && (
            <p className="text-slate-600">
              Activity feed coming soon — this is where we’ll show projects you
              created, tools you pledged, marks, and before/after photos.
            </p>
          )}
        </CardBody>
      </Card>
    </Container>
  );
}

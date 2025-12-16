
// src/pages/work/CreateIntro.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
} from "../../components/ui";

export default function CreateIntro() {
  const session = useAuth();
  const cta = session
    ? { label: "Create Project →", to: "/work/create/new" }
    : { label: "Sign in to create a project", to: "/account" };

  return (
    <Container>
      <Card>
        <CardHeader
          title="Start a new project"
          subtitle="Rally your neighbors. Fix what we use. Document the impact."
        />
        <CardBody className="grid gap-4">
          <p className="text-slate-600">
            From repainting school walls to repairing park benches, Reform helps
            communities organize and refurbish public spaces.
          </p>
          <ul className="list-disc pl-6 text-slate-700">
            <li>
              Define the work:{" "}
              <span className="text-slate-500">
                details, location, category
              </span>
            </li>
            <li>
              Ask for help:{" "}
              <span className="text-slate-500">
                pick roles from professions
              </span>
            </li>
            <li>
              Bring tools:{" "}
              <span className="text-slate-500">
                list tools needed
              </span>
            </li>
          </ul>
          <div>
            <Link to={cta.to}>
              <Button>{cta.label}</Button>
            </Link>
          </div>
        </CardBody>
      </Card>
    </Container>
  );
}

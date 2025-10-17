import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

export default function PresentationPage() {
  return (
    <div>
      <Link to="/home/presentations">
        <ArrowLeft />
      </Link>
      <h2>Presentation ID: NULL</h2>
      <p>Name: "Untitled Presentation"</p>
    </div>
  );
}

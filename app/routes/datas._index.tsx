import { Link } from "@remix-run/react";

export default function DataIndexPage() {
  return (
    <p>
      No data selected. Select a data on the left, or{" "}
      <Link to="new" className="text-blue-500 underline">
        create a new data.
      </Link>
    </p>
  );
}

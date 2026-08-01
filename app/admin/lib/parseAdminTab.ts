import { AdminTab } from "../_components/AdminTabShell";

export function parseAdminTab(value: string | undefined): AdminTab {
  return value && isAdminTab(value) ? value : "blogs";
}

function isAdminTab(value: string): value is AdminTab {
  return (
    value === "blogs" ||
    value === "gallery" ||
    value === "reservations" ||
    value === "statistics"
  );
}

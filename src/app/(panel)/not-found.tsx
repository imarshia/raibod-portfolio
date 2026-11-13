// src/app/(panel)/not-found.tsx: the 404 for panel routes that do
// not exist yet (appointments, clients, accounting, inventory,
// users) and any other unknown panel URL. It renders inside the
// (panel) layout, so with a session the Figma shell (sidebar +
// header) stays and only the main content area shows the 404.
// Without a session the layout renders children bare.

import NotFoundContent from "@/components/NotFoundContent";

export default function PanelNotFound() {
  return <NotFoundContent />;
}

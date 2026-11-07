// src/components/print-button owns the print button only, so the print page
// itself can stay a server component and render the Jalali date on the server.

"use client";

import { Button } from "@heroui/react";

export function PrintButton() {
  return (
    <Button variant="primary" onPress={() => window.print()}>
      چاپ A5
    </Button>
  );
}

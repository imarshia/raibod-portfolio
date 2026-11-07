// components/ui/alert.tsx: Raibod Alert (Design System v3.2 section 5).
// Compound: Alert + Alert.Indicator + Alert.Content + Alert.Title +
// Alert.Description. status: default | accent | success | warning | danger.
// There is no info variant: use status="accent" for information.
// FormError renders a form error with status danger, Title and Description.
//
// NOTE: Alert is wrapped in a local function component, not re-exported
// directly (see the note in components/ui/card.tsx: direct re-export of a
// HeroUI v3 compound object makes its client reference undefined from a
// server component).

"use client";

import { Alert as HeroUIAlert } from "@heroui/react";
import type { ComponentProps, ReactNode } from "react";

export type AlertProps = ComponentProps<typeof HeroUIAlert>;

function AlertRoot(props: AlertProps) {
  return <HeroUIAlert {...props} />;
}

export const Alert = Object.assign(AlertRoot, {
  Root: HeroUIAlert.Root,
  Indicator: HeroUIAlert.Indicator,
  Content: HeroUIAlert.Content,
  Title: HeroUIAlert.Title,
  Description: HeroUIAlert.Description,
});

export function FormError({
  title,
  description,
}: {
  title: string;
  description?: ReactNode;
}) {
  return (
    <Alert status="danger">
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>{title}</Alert.Title>
        {description ? <Alert.Description>{description}</Alert.Description> : null}
      </Alert.Content>
    </Alert>
  );
}

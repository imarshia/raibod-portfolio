// components/ui/card.tsx: Raibod Card and Surface (Design System v3.4 section 5).
// Card: variant="default" (shown with surface-secondary per the docs).
// Surface: panels and surfaced containers; put forms inside it with
// variant="secondary". No product logic lives in components/ui.
//
// FLAT EXPORTS ONLY: no compound object (Card.Header, Card.Title, ...).
// Reason, verified 2026-11-07: in a server component, an imported client
// component is a client reference, and property access on it (Card.Header)
// is undefined. The production build prerender then fails with
// "Element type is invalid ... got: undefined" on every server-component
// page that uses Card.Header / Card.Title / Card.Content / Card.Footer.
// A Card with only a text child renders fine from a server component, and
// the compound notation works from a client component, which is how the
// bug was isolated. So server components (and, for one consistent pattern,
// client components too) import the flat pieces directly:
//   Card (root) + CardHeader + CardTitle + CardDescription + CardContent
//   + CardFooter, and Surface (root).
// The same rule applies to every HeroUI compound component used from a
// server component: import the flat piece, never the dot notation.

"use client";

import {
  CardRoot as HeroUICardRoot,
  CardHeader as HeroUICardHeader,
  CardTitle as HeroUICardTitle,
  CardDescription as HeroUICardDescription,
  CardContent as HeroUICardContent,
  CardFooter as HeroUICardFooter,
  SurfaceRoot as HeroUISurfaceRoot,
} from "@heroui/react";
import type { ComponentProps } from "react";

export type CardProps = ComponentProps<typeof HeroUICardRoot>;
export type CardHeaderProps = ComponentProps<typeof HeroUICardHeader>;
export type CardTitleProps = ComponentProps<typeof HeroUICardTitle>;
export type CardDescriptionProps = ComponentProps<typeof HeroUICardDescription>;
export type CardContentProps = ComponentProps<typeof HeroUICardContent>;
export type CardFooterProps = ComponentProps<typeof HeroUICardFooter>;
export type SurfaceProps = ComponentProps<typeof HeroUISurfaceRoot>;

export function Card(props: CardProps) {
  return <HeroUICardRoot {...props} />;
}

export function CardHeader(props: CardHeaderProps) {
  return <HeroUICardHeader {...props} />;
}

export function CardTitle(props: CardTitleProps) {
  return <HeroUICardTitle {...props} />;
}

export function CardDescription(props: CardDescriptionProps) {
  return <HeroUICardDescription {...props} />;
}

export function CardContent(props: CardContentProps) {
  return <HeroUICardContent {...props} />;
}

export function CardFooter(props: CardFooterProps) {
  return <HeroUICardFooter {...props} />;
}

export function Surface(props: SurfaceProps) {
  return <HeroUISurfaceRoot {...props} />;
}

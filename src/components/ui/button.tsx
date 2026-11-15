// components/ui/button.tsx: Raibod Button wrapper (Design System v3.3 section 5).
// HeroUI v3 Button. Raibod mapping: Primary = accent, Secondary = ink,
// Tertiary = surface-2, Danger = delete / cancel with confirmation.
// One Primary per view. No v2 patterns: variant only (no color prop),
// isPending (not isLoading), onPress (not onClick).

"use client";

import { Button as HeroUIButton } from "@heroui/react";
import type { ComponentProps } from "react";

export type ButtonProps = ComponentProps<typeof HeroUIButton>;

export function Button({ variant = "primary", size = "md", ...props }: ButtonProps) {
  return <HeroUIButton variant={variant} size={size} {...props} />;
}

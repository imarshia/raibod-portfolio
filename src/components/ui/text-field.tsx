// components/ui/text-field.tsx: Raibod form-field pieces (Design System v3.4 section 5).
// Composition: TextField > Label + Input (or TextArea) + Description + FieldError.
// Label is always visible above the field. Placeholder is not a label.
// Validation lives only on TextField; Input is a primitive with no validation
// props. Inside a Surface, use variant="secondary" on Input / TextArea.
//
// NOTE: the pieces are wrapped in local function components, not re-exported
// directly (see the note in components/ui/card.tsx: direct re-export of a
// HeroUI v3 compound object makes its client reference undefined from a
// server component).

"use client";

import {
  TextField as HeroUITextField,
  Input as HeroUIInput,
  TextArea as HeroUITextArea,
  Label as HeroUILabel,
  Description as HeroUIDescription,
  FieldError as HeroUIFieldError,
} from "@heroui/react";
import type { ComponentProps } from "react";

export type TextFieldProps = ComponentProps<typeof HeroUITextField>;
export type InputProps = ComponentProps<typeof HeroUIInput>;
export type TextAreaProps = ComponentProps<typeof HeroUITextArea>;
export type LabelProps = ComponentProps<typeof HeroUILabel>;
export type DescriptionProps = ComponentProps<typeof HeroUIDescription>;
export type FieldErrorProps = ComponentProps<typeof HeroUIFieldError>;

export function TextField(props: TextFieldProps) {
  return <HeroUITextField {...props} />;
}

export function Input(props: InputProps) {
  return <HeroUIInput {...props} />;
}

export function TextArea(props: TextAreaProps) {
  return <HeroUITextArea {...props} />;
}

export function Label(props: LabelProps) {
  return <HeroUILabel {...props} />;
}

export function Description(props: DescriptionProps) {
  return <HeroUIDescription {...props} />;
}

export function FieldError(props: FieldErrorProps) {
  return <HeroUIFieldError {...props} />;
}

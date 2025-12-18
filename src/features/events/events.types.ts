export type EventActionState =
  | { success: false; error: false }
  | { success: false; error: { message: string }[] }
  | { success: true; error: false }
  | { success: false; error: true }

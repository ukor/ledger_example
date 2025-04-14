import z from "zod";

export const AuthenticatedUser = z.object({
  // ---

  userId: z.string().min(12),

  sid: z.string().optional(),

  did: z.string().optional(),
});

export type AuthenticatedUser = z.infer<typeof AuthenticatedUser>;

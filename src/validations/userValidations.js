import { z } from "zod";

export const updateUserRoleSchema = z.object({
  role: z.enum(["ADMIN", "MANAGER", "MEMBER"], {
    message: "Role must be ADMIN, MANAGER, or MEMBER",
  }),
});

export const updateUserStatusSchema = z.object({
  isActive: z.boolean({
    message: "isActive must be true or false",
  }),
});

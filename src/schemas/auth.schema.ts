import { z } from "zod";

export const loginSchema = z.object({
    email: z.email(),
    password: z.string(),
});

export const registerSchema = z.object({
    pseudo: z
        .string()
        .min(1, "Le pseudo doit avoir au moins 1 caractère")
        .max(50, "Le pseudo doit avoir au plus 50 caractères"),
    email: z.email(),
    password: z
        .string()
        .min(8, "Le mot de passe doit avoir au moins 12 caractères")
        .max(100, "Le mot de passe doit avoir au plus 100 caractères"), // We could add mandatory mix of lowecase and uppercase
    confirm: z.string(),
    avatar: z.string().refine(
        (val) => {
            try {
                new URL(val);
                return true;
            } catch {
                return false;
            }
        },
        { message: "L'URL de l'avatar' est invalide" }
    ),
});

import z from "zod";

export const SignUpSchema = z.object({
  email: z.email(),
  username: z.string().min(3, "username is required"),
  password: z.string().min(8, "password has to be atleast 8 charactera"),
});

export const LoginSchema = z.object({
  username: z.string().min(3, "username is required"),
  password: z.string().min(8, "password has to be atleast 8 charactera"),
});

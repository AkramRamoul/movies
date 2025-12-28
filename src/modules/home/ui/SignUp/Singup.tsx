import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { SignUpSchema } from "@/lib/schema";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

export function CreateAccountButton() {
  const form = useForm<z.infer<typeof SignUpSchema>>({
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
    resolver: zodResolver(SignUpSchema),
  });

  async function onSubmit(data: z.infer<typeof SignUpSchema>) {
    try {
      axios
        .post("/api/register", data)
        .then(() => signIn("credentials", data))
        .catch(() => toast.error("Something went wrong"));
    } catch (error) {
      toast.error("Failed to create user: " + error);
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-transparent text-white/40 hover:bg-transparent hover:text-white font-bold text-transform: uppercase">
          create account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#445566] space-y-6">
        <DialogHeader>
          <DialogTitle className="font-thin text-transform: uppercase text-[#99a9ba] text-2xl">
            Join Letterboxd
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Email address</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    type="email"
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="grid gap-3 w-50">
                  <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="grid gap-3 w-50">
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    type="password"
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <DialogFooter className="sm:justify-start">
            <Button
              className="bg-[#00b020] hover:bg-[#00a01c] mt-3 text-white 
      h-8
      px-5 py-1 font-bold rounded-sm"
            >
              SIGN UP
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

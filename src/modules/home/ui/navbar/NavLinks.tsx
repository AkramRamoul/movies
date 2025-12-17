"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SearchBox from "./SearchBox";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { signIn, useSession } from "next-auth/react";
import { CreateAccountButton } from "../SignUp/Singup";
import { Dropdown } from "./DropDown";
import { FieldLabel } from "@/components/ui/field";
import { useForm } from "react-hook-form";
import z from "zod";
import { LoginSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const navBarItems = [
  { href: "/films", children: "Films" },
  { href: "/Lists", children: "Lists" },
  { href: "/Journal", children: "Journal" },
];

interface NavItemProps {
  children: React.ReactNode;
  href: string;
}

export const NavItem = ({ children, href }: NavItemProps) => {
  return (
    <Button className="bg-transparent text-white/40 hover:bg-transparent hover:text-white font-bold text-transform: uppercase">
      <Link href={href}>{children}</Link>
    </Button>
  );
};

const NavLinks = () => {
  const [signInToggle, setSignInToggle] = useState(false);
  const { data: session, status } = useSession();

  if (status === "authenticated") {
    return (
      <div className="flex items-center gap-4">
        <Dropdown username={session.user.username} />
        {navBarItems.map((item) => (
          <NavItem key={item.href} href={item.href}>
            {item.children}
          </NavItem>
        ))}
        <SearchBox />
      </div>
    );
  }

  return (
    <div className="flex items-center">
      {!signInToggle && (
        <Button
          className="bg-transparent text-white/40 hover:bg-transparent hover:text-white font-bold text-transform: uppercase"
          onClick={() => setSignInToggle(!signInToggle)}
        >
          sign in
        </Button>
      )}
      {signInToggle ? (
        <LoginComponent
          setSignInToggle={setSignInToggle}
          signInToggle={signInToggle}
        />
      ) : (
        <>
          <CreateAccountButton />
          {navBarItems.map((item) => (
            <NavItem key={item.href} href={item.href}>
              {item.children}
            </NavItem>
          ))}
          <SearchBox />
        </>
      )}
    </div>
  );
};

export default NavLinks;

const LoginComponent = ({
  setSignInToggle,
  signInToggle,
}: {
  setSignInToggle: Dispatch<SetStateAction<boolean>>;
  signInToggle: boolean;
}) => {
  const form = useForm<z.infer<typeof LoginSchema>>({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(LoginSchema),
  });
  const router = useRouter();

  const session = useSession();

  useEffect(() => {
    if (session?.status === "authenticated") {
      router.push("/users");
    }
  }, [session?.status, router]);

  const handleSubmit = async (data: z.infer<typeof LoginSchema>) => {
    signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false,
    }).then((callback) => {
      if (callback?.error) {
        return toast.error("Invalid credentials");
      }
      if (callback?.ok && !callback.error) {
        toast.success("Logged in");
        router.push("/users");
      }
    });
  };
  return (
    <div className="flex items-center gap-3 text-sm px-4 py-3 bg-transparent">
      <Button
        type="button"
        className="text-white/40 hover:text-white bg-transparent hover:bg-transparent text-xl px-2"
        onClick={() => setSignInToggle(!signInToggle)}
      >
        ×
      </Button>
      <form
        className="flex items-end gap-3"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className="flex flex-col">
          <FieldLabel className="text-white/50 mb-1" htmlFor="username">
            Username
          </FieldLabel>
          <Input
            {...form.register("username")}
            id="username"
            className="h-8 w-40 bg-[#2a2f38] border border-black/20 text-white placeholder:text-white/40"
          />
        </div>
        <div className="flex flex-col">
          <FieldLabel className="text-white/50 mb-1" htmlFor="password">
            Password
          </FieldLabel>
          <Input
            {...form.register("password")}
            id="password"
            type="password"
            className="h-8 w-40 bg-[#2a2f38] border border-black/20 text-white placeholder:text-white/40"
          />
        </div>
        <Button
          type="submit"
          className="bg-[#00b020] hover:bg-[#00a01c] text-white h-8 px-5 py-1 font-bold rounded-sm"
        >
          SIGN IN
        </Button>
      </form>
    </div>
  );
};

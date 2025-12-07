import Link from "next/link";
import Image from "next/image";
import logo from "../../../../../public/logo.png";
import NavLinks from "./NavLinks";
export const Nav = () => {
  return (
    <nav className="flex h-16 border-b items-center space-x-20 dark bg-[#202832]">
      <Link href={"/"} className="pl-35">
        <div className="relative">
          <Image src={logo} width={250} height={250} alt="logo" />
        </div>
      </Link>
      <NavLinks />
    </nav>
  );
};

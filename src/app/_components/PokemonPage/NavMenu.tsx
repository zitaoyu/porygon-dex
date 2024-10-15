import { PrimaryButton } from "@/app/_components/PrimaryButton";
import Link from "next/link";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

type NavMenuProps = {
  prevPokeapiId: number;
  nextPokeapiId: number;
  dexId?: number | undefined;
};

export const NavMenu = ({
  prevPokeapiId,
  nextPokeapiId,
  dexId = undefined,
}: NavMenuProps) => {
  return (
    <nav className="flex w-full items-center justify-between sm:justify-center sm:gap-20">
      <Link href={`/${prevPokeapiId}`}>
        <PrimaryButton className="text-2xl">
          <IoIosArrowBack />
        </PrimaryButton>
      </Link>
      <span className="text-nowrap font-semibold">No. {dexId}</span>
      <Link href={`/${nextPokeapiId}`}>
        <PrimaryButton className="text-2xl">
          <IoIosArrowForward />
        </PrimaryButton>
      </Link>
    </nav>
  );
};

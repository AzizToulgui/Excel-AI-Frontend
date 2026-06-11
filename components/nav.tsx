import Link from "next/link";
import Image from "next/image";
import { Book } from "lucide-react";

export function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-linear-to-b from-stone-900/20 to-transparent backdrop-blur-xs">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/excel.png"
              width={100}
              height={100}
              alt="Excel Logo"
              className="w-12.5"
            />
            <span className="text-4xl font-semibold">+</span>
            <Image
              src="/dash.svg"
              width={100}
              height={100}
              alt="Vercel Logo"
              className="w-25"
            />
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/AzizToulgui"
              target="_blank"
              className="flex items-center gap-2 text-xl font-bold text-white/80 transition-colors hover:text-white"
            >
              <Image
                src="/github.svg"
                width={100}
                height={100}
                alt="github Logo"
                className="w-6 h-6"
              />
              Github Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

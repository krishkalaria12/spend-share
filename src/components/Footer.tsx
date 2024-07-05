import { GitHubLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import { Link } from "next-view-transitions";
import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <div className="border-t w-full border-neutral-100 dark:border-white/[0.1] px-8 py-20 bg-white dark:bg-[#020817]">
      <div className="max-w-7xl mx-auto text-sm text-neutral-500 flex sm:flex-row flex-col justify-between items-start ">
        <div>
          <div className="mr-4  md:flex mb-4">
            <Link
              className="flex items-center justify-center space-x-2 text-2xl font-bold text-center text-neutral-600 dark:text-gray-100 selection:bg-emerald-500 mr-10 py-0"
              href="/"
            >
              <div className="relative h-8 w-8 md:h-6 md:w-6 bg-black border border-slate-800  text-white   flex items-center justify-center rounded-md text-sm antialiased">
                <div className="absolute h-10 w-full bg-white/[0.2] -top-10 inset-x-0 rounded-full blur-xl" />
                <div className="text-sm  text-emerald-500 relative z-20">
                  <Image
                    alt="Logo"
                    loading="lazy"
                    width={50}
                    height={50}
                    decoding="async"
                    data-nimg={1}
                    style={{ color: "transparent" }}
                    src={"/money-splitter.webp"}
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-black dark:text-white font-sans">
                  {" "}
                  {/* */}Spend Share
                </h1>
              </div>
            </Link>
          </div>
          <div>
            A product by{/* */}{" "}
            <a
              target="_blank"
              className="dark:text-sky-500 text-neutral-600 font-medium"
              href="https://spendshare.vercel.app"
            >
              Spend Share
            </a>
          </div>
          <div className="mt-2">
            Building in public at{/* */}{" "}
            <a
              className="dark:text-sky-500 font-medium text-neutral-600"
              target="_blank"
              href="https://krishkalaria.vercel.app"
            >
              @krishkalaria
            </a>
          </div>
        </div>
        <div className=" gap-10 items-start mt-10 md:mt-0">
          <div className="flex justify-center space-x-4 mt-4">
            <a
              target="_blank"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="https://x.com/KrishKalaria"
            >
              <TwitterLogoIcon className="hover:scale-125 transition-all ease-in-out h-8 w-8" />
            </a>
            <a
              target="_blank"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="https://github.com/krishkalaria12"
            >
              {/* Github */}
              <GitHubLogoIcon className="hover:scale-125 transition-all ease-in-out h-8 w-8" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;

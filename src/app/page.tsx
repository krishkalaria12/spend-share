import Footer from "@/components/Footer";
import { BentoGridDemo } from "@/components/acceternityui/bento-grid-demo";
import { HeroHighlightText } from "@/components/acceternityui/hero-highlight";
import { StickyScrollReveal } from "@/components/acceternityui/sticky-scroll-reveal";
import { TracingBeam } from "@/components/acceternityui/tracing-beam";
import { AnimatedShinyTextDemo } from "@/components/magicui/animated-shiny-text";
import { BackgroundDots } from "@/components/syntaxui/background-dots";
import Testimonals from "@/components/syntaxui/testimonial-grid";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-10">
      <BackgroundDots />
        <div>
          <AnimatedShinyTextDemo />
          <div className="mt-4">
            <h1 className="text-5xl text-center font-bold">
              Your Finance Agent to
              <span
                  className="block font-bold bg-gradient-to-r from-orange-700 via-blue-500 to-green-400 text-transparent bg-clip-text bg-300% animate-gradientText"
                >
                  supercharge your financial journey
                </span>
              </h1>
          </div>
          <p className="mt-4 text-sm lg:text-lg text-muted-foreground lg:px-0 px-6 lg:max-w-lg text-center w-full mx-auto">
          Introducing Money Splitter: Effortlessly track group expenses with secure access, intuitive navigation, and detailed reports.
          </p>
        </div>
        <div className="py-4 mt-20">
          {/* <StickyScrollReveal /> */}
          <BentoGridDemo />
        </div>
        <div className="py-4">
          <HeroHighlightText />
        </div>
        <div className="">
          <Testimonals />
        </div>
        <Footer />
    </main>
  );
}

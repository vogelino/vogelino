import { AppProps } from "next/app";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import "../src/styles/index.css";
import { useRouter } from "next/router";
import Link from "next/link";

function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  return (
    <>
      <header
        aria-label="Main header"
        className="fixed top-0 left-0 w-full z-40 text-black-negative mix-blend-exclusion"
      >
        <div className="container mx-auto px-8 py-4 flex">
          <Link href="/">
            <a
              className="uppercase text-3xl tracking-widest font-headline"
              aria-label="Logo (Link to Homepage)"
            >
              Vogelino
            </a>
          </Link>
        </div>
      </header>
      <LayoutGroup id={pathname}>
        <AnimatePresence mode="wait">
          <Component {...pageProps} />
        </AnimatePresence>
      </LayoutGroup>
      <div
        style={{
          backgroundImage: `url(/images/textures/film-grain.gif)`,
          backgroundSize: "400px auto",
        }}
        aria-initial="true"
        className="fixed inset-0 bg-cover opacity-5 z-50 pointer-events-none mix-blend-exclusion"
      />
    </>
  );
}

export default MyApp;

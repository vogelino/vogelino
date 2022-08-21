import { AppProps } from "next/app";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import "../src/styles/index.css";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  return (
    <LayoutGroup id={pathname}>
      <AnimatePresence mode="wait">
        <Component {...pageProps} />
      </AnimatePresence>
    </LayoutGroup>
  );
}

export default MyApp;

import React, { ReactNode } from "react";
import Link from "next/link";
import Head from "next/head";

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = "This is the default title" }: Props) => (
  <div>
    <div
      style={{
        backgroundImage: `url(/images/textures/film-grain.gif)`,
        backgroundSize: "400px auto",
      }}
      aria-initial="true"
      className="fixed inset-0 bg-cover opacity-5 z-50 pointer-events-none"
    />
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    {children}
  </div>
);

export default Layout;

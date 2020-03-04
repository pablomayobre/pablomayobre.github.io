import Link from "next/link";
import Head from "next/head";

interface HeaderProps {
  title: string | null;
}

export const Header = ({ title }: HeaderProps) => {
  return (
    <>
      <Head>
        <title>{"Pablo Mayobre" + (!title ? "" : ` - ${title}`)}</title>
      </Head>

      <svg></svg>
      <h1>Pablo Mayobre</h1>
      <nav>
        <Link href={"/portfolio"}>Portfolio</Link> }
        <Link href={"/about"}>About</Link> }
      </nav>
    </>
  );
};

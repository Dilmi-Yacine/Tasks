import { Fragment } from "react";
import Head from "next/head";
import Features from "../components/landingPage/features";
import Footer from "../components/landingPage/footer";
import Hero from "../components/landingPage/hero";
import NavBar from "../components/landingPage/navBar";
import Price from "../components/landingPage/price";

export default function Index() {
  return (
    <Fragment>
      <Head>
        <title>Tasks: Get your projects done</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta property="og:title" content="Tasks: Get your projects done" />
        <meta
          property="og:description"
          content="Tasks is a project management tool designed to help visualize the state of every piece of work at any time."
        />
        <meta property="og:image" content="/public/collaboration.png" />
      </Head>
      <NavBar /> <Hero /> <Features /> <Price /> <Footer />
    </Fragment>
  );
}

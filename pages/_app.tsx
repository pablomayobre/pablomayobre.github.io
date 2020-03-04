import { AppProps } from "next/app";
import { Background } from "../components/Background";
import { Header } from "../components/Header";

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header title={pageProps.query ? pageProps.query.title : null} />
      <Background />
      <Component {...pageProps} />
    </>
  );
}

export default App;

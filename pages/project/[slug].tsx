import { NextPage } from "next";
import {Dracula} from "../../components/styles/Dracula";

const Home: NextPage<{ userAgent: string; content: string }> = ({
  userAgent,
  content
}) => (
  <>
    <Dracula/>
    <h1>Hello world! - user agent: {userAgent}</h1>
    <div dangerouslySetInnerHTML={{ __html: content }}></div>
  </>
);

Home.getInitialProps = async context => {
  const { req } = context;
  console.log(context.query);

  const userAgent = req ? req.headers["user-agent"] || "" : navigator.userAgent;
  return { userAgent, content: context.query.content as string };
};

export default Home;

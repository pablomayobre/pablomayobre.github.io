import { NextPage } from 'next';

const Home: NextPage<{ userAgent: string }> = ({ userAgent }) => (
  <h1>Hello world! - user agent: {userAgent}</h1>
);

Home.getInitialProps = async (context) => {
  const { req } = context
  console.log(context.query)

  const userAgent = req ? req.headers['user-agent'] || '' : navigator.userAgent;
  return { userAgent };
};

export default Home;
import Head from '../components/Home/Head';
import { Sec1, Sec2, Sec3, Sec4, Sec5 } from '../components/Home/Section';
import React from 'react';

const LandingPage = (): JSX.Element => {
  return (
    <div className="relative scroll-smooth">
      <Head />
      <Sec1 />
      <Sec2 />
      <Sec3 />
      <Sec4 />
      <Sec5 />
    </div>
  );
};

export default LandingPage;

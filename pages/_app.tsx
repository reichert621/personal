import '@/styles/globals.css';
import type {AppProps} from 'next/app';
import Head from 'next/head';
import {Inter, Lato} from 'next/font/google';
import {init, useQuery, tx, transact} from '@instantdb/react';

const sans = Inter({
  variable: '--font-sans',
  display: 'swap',
  subsets: ['latin'],
});

init({appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!});

export default function App({Component, pageProps}: AppProps) {
  return (
    <>
      <Head>
        <title>2024 Goals</title>
      </Head>
      <style jsx global>
        {`
          :root {
            --font-sans: ${sans.style.fontFamily};
          }
        `}
      </style>
      <Component {...pageProps} />
    </>
  );
}

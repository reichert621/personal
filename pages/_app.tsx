import '@/styles/globals.css';
import type {AppProps} from 'next/app';
import Head from 'next/head';
import {Inter} from 'next/font/google';
import {init, useQuery, tx, transact} from '@instantdb/react';

const sans = Inter({
  variable: '--font-sans',
  display: 'swap',
  subsets: ['latin'],
});

const APP_ID = '776cf290-5f95-40e1-b28e-ebdff591af24';

init({appId: APP_ID});

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

import {NextPage} from 'next';
import Link from 'next/link';
import React from 'react';

import {cn} from '@/lib/utils';

const IndexPage: NextPage = () => {
  return (
    <div
      className={cn(
        'flex min-h-screen w-full flex-1 flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100'
      )}
    >
      <main className="mx-auto w-full max-w-7xl flex-1 bg-white px-8 py-12 dark:bg-zinc-900">
        <h1 className="text-5xl font-bold text-zinc-900 dark:text-zinc-100">
          Hi there!
        </h1>
        <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
          Website coming soon.
        </p>
      </main>
    </div>
  );
};

export default IndexPage;

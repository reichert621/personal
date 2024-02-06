import {NextPage} from 'next';
import React from 'react';
import {id, useQuery, tx, transact, useAuth} from '@instantdb/react';

import {goals as seed} from '@/lib/goals';
import {Button} from '@/components/ui/button';

const DebuggerPage: NextPage = () => {
  const {isLoading: isLoadingUser, user, error: authError} = useAuth();
  const {isLoading, error, data} = useQuery({
    goals: {logs: {}},
  });

  const handleSeedData = async () => {
    const txns = seed.map((goal: any) => {
      const uuid = id();

      return tx.goals[uuid].update(goal);
    });

    transact(txns);
  };

  const handleDeleteData = () => {
    const txns = data!.goals.map((goal: any) => {
      return tx.goals[goal.id].delete();
    });

    transact(txns);
  };

  return (
    <div className="flex min-h-screen w-full flex-1 flex-col bg-zinc-50 text-zinc-900">
      <main className="mx-auto w-full max-w-xl flex-1 bg-white px-6 py-12">
        <div className="">
          <div className="my-8 flex items-center gap-2">
            <Button onClick={handleSeedData}>Seed data</Button>
            <Button variant="destructive" onClick={handleDeleteData}>
              Delete data
            </Button>
          </div>
          <div className="rounded-md bg-black p-4 text-sm text-white">
            <pre>
              <code>{JSON.stringify({user, ...data}, null, 2)}</code>
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DebuggerPage;

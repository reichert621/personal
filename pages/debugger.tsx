import {NextPage} from 'next';
import React from 'react';
import {id, useQuery, tx, transact, useAuth} from '@instantdb/react';

import {goals as seed} from '@/lib/goals';
import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';

const EditGoalForm = () => {
  const [id, setGoalId] = React.useState('');
  const [updates, setGoalUpdates] = React.useState<Record<string, any>>({});
  const {isLoading, error, data} = useQuery({
    goals: {$: {where: {id}}},
  });
  const goal = data?.goals[0] || null;

  React.useEffect(() => {
    if (goal) {
      setGoalUpdates({...updates, ...goal});
    } else if (!id) {
      setGoalUpdates({});
    }
  }, [goal, id]);

  const clear = () => {
    setGoalId('');
    setGoalUpdates({});
  };

  const reset = () => {
    setGoalUpdates({...updates, ...goal});
  };

  const save = () => {
    if (!id) {
      return;
    }

    transact(tx.goals[id].update({...updates}));
  };

  return (
    <div className="my-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Edit goal</h2>
        <div className="flex items-center gap-1">
          <Button className="text-sm" size="sm" onClick={clear}>
            Clear
          </Button>
          <Button
            className="text-sm"
            variant="secondary"
            size="sm"
            onClick={reset}
          >
            Reset
          </Button>
        </div>
      </div>

      <div className="mb-2">
        <Label>Goal ID</Label>
        <Input
          className="mt-1"
          disabled={!!goal}
          value={id}
          onChange={(e) => setGoalId(e.target.value)}
        />
      </div>
      <div className="mb-2">
        <Label>Name</Label>
        <Input
          className="mt-1"
          value={updates.name || ''}
          onChange={(e) => setGoalUpdates({...updates, name: e.target.value})}
        />
      </div>
      <div className="mb-2">
        <Label>Question</Label>
        <Input
          className="mt-1"
          value={updates.question || ''}
          onChange={(e) =>
            setGoalUpdates({...updates, question: e.target.value})
          }
        />
      </div>
      <Button className="mb-8 mt-4 w-full" disabled={!id} onClick={save}>
        Save
      </Button>
    </div>
  );
};

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

  const handleMigrateCreatedAt = () => {
    const txns = data!.goals.map((goal) => {
      return tx.goals[goal.id].update({createdAt: +new Date('2024-01-01')});
    });

    transact(txns);
  };

  return (
    <div className="flex min-h-screen w-full flex-1 flex-col bg-zinc-50 text-zinc-900">
      <main className="mx-auto w-full max-w-xl flex-1 bg-white px-6 py-12">
        <div className="">
          <div className="my-8 flex items-center gap-2">
            {/* <Button onClick={handleSeedData}>Seed data</Button> */}
            {/* <Button variant="default" onClick={handleMigrateCreatedAt}>
              Migrate data
            </Button> */}
          </div>

          <EditGoalForm />

          <div className="rounded-md bg-black p-4 text-sm text-white">
            <pre>
              <code className="font-mono">
                {JSON.stringify({user, ...data}, null, 2)}
              </code>
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DebuggerPage;

import {auth, id, transact, tx, useAuth, useQuery} from '@instantdb/react';
import {NextPage} from 'next';
import {useRouter} from 'next/router';
import React from 'react';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  LightningBoltIcon,
  MoonIcon,
  SunIcon,
} from '@radix-ui/react-icons';
import Link from 'next/link';
import dayjs from 'dayjs';

import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Goal, comparator} from '@/lib/goals';
import {cn} from '@/lib/utils';
import {useDarkMode} from '@/lib/hooks';

const GoalInput = ({
  goal,
  onUpdate,
  onDelete,
}: {
  goal: any;
  onUpdate: (goal: any, value: number) => void;
  onDelete: (goal: any) => void;
}) => {
  const {logs = [], type} = goal;
  const [log] = logs;
  const label = goal.question || goal.name;
  const [value, setInputValue] = React.useState<string>(
    String(log?.value ?? '')
  );
  const v = log?.value ?? null;

  React.useEffect(() => {
    if (v) {
      setInputValue(v);
    } else {
      setInputValue('');
    }
  }, [v]);

  const handleChangeInput = (e: any) => {
    const value = e.target.value.replace(/\D/g, '');

    setInputValue(value);
  };

  if (type === 'binary' || type === 'aggregate') {
    const isDone = !!log && !!log.value;

    return (
      <div key={goal.id} className="mt-2 flex items-center gap-2">
        <Checkbox
          id={goal.id}
          checked={isDone}
          onCheckedChange={(isChecked) => onUpdate(goal, isChecked ? 1 : 0)}
        />

        <Label
          htmlFor={goal.id}
          className={cn(
            'text-base font-medium',
            isDone
              ? 'text-zinc-400 line-through dark:text-zinc-500'
              : 'text-zinc-700 dark:text-zinc-200'
          )}
        >
          {label}
        </Label>
        <Button
          className="hidden"
          size="sm"
          variant="destructive"
          onClick={() => onDelete(goal)}
        >
          Delete logs
        </Button>
      </div>
    );
  } else if (type === 'number') {
    return (
      <div key={goal.id} className="mt-4">
        <div className="flex items-center justify-between">
          <Label
            htmlFor={goal.id}
            className="text-base font-medium text-zinc-700 dark:text-zinc-200"
          >
            {label}
          </Label>
          <span className="whitespace-nowrap rounded-full bg-blue-700 px-2 py-0.5 text-xs font-medium tracking-wide text-blue-100">
            Target: {goal.value} {goal.unit}
          </span>
        </div>

        <div className="relative mt-1 flex items-center">
          <Input
            placeholder="0"
            value={value}
            onChange={handleChangeInput}
            onBlur={() => onUpdate(goal, Number(value))}
          />
          <span className="absolute right-4 text-sm text-zinc-400">
            {goal.unit}
          </span>
        </div>
      </div>
    );
  }
};

const LogDetails = ({className, date}: {className?: string; date: string}) => {
  const {isLoading, error, data} = useQuery({
    goals: {
      logs: {
        $: {
          where: {date},
        },
      },
    },
  });

  if (isLoading) {
    return null;
  } else if (error) {
    return <div>{error.message}</div>;
  }

  const {goals} = data;

  const handleDeleteLogs = (goal: any) => {
    const txns = goal.logs.map((log: any) => {
      return tx.logs[log.id].delete();
    });

    transact(txns);
  };

  const handleUpdateLog = (goal: any, value: number) => {
    const [log] = goal.logs;

    if (log) {
      transact(tx.logs[log.id].update({value}));
    } else {
      const logId = id();

      transact(
        tx.logs[logId]
          .update({goalId: goal.id, date, value})
          .link({goals: goal.id})
      );
    }
  };

  const daily = goals
    .filter((goal) => goal.cadence === 'daily')
    .sort(comparator);
  const weekly = goals
    .filter((goal) => goal.cadence === 'weekly')
    .sort(comparator);
  const monthly = goals
    .filter((goal) => goal.cadence === 'monthly')
    .sort(comparator);
  const eoy = goals.filter((goal) => goal.cadence === 'eoy').sort(comparator);

  return (
    <div className={className}>
      <div className="mb-12">
        <div className="">
          {daily.map((goal) => {
            return (
              <GoalInput
                key={goal.id}
                goal={goal}
                onUpdate={handleUpdateLog}
                onDelete={handleDeleteLogs}
              />
            );
          })}
        </div>
      </div>
      <div className="mb-12">
        <h2 className="mb-4 text-2xl font-bold text-zinc-800 dark:text-zinc-200">
          This week
        </h2>
        <div className="">
          {weekly.map((goal) => {
            return (
              <GoalInput
                key={goal.id}
                goal={goal}
                onUpdate={handleUpdateLog}
                onDelete={handleDeleteLogs}
              />
            );
          })}
        </div>
      </div>
      <div className="mb-12">
        <h2 className="mb-4 text-2xl font-bold text-zinc-800 dark:text-zinc-200">
          This month
        </h2>
        <div className="">
          {monthly.map((goal) => {
            return (
              <GoalInput
                key={goal.id}
                goal={goal}
                onUpdate={handleUpdateLog}
                onDelete={handleDeleteLogs}
              />
            );
          })}
        </div>
      </div>
      <div className="mb-12">
        <h2 className="mb-4 text-2xl font-bold text-zinc-800 dark:text-zinc-200">
          2024 goals
        </h2>
        <div className="">
          {eoy.map((goal) => {
            return (
              <GoalInput
                key={goal.id}
                goal={goal}
                onUpdate={handleUpdateLog}
                onDelete={handleDeleteLogs}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

const LogDetailsPage: NextPage = () => {
  const router = useRouter();
  const date = router.query.date as string;
  const {isDarkMode, toggle} = useDarkMode();
  // const {isLoading: isLoadingUser, user, error: authError} = useAuth();
  const isToday = dayjs(date).isSame(dayjs(), 'day');
  const prev = dayjs(date).subtract(1, 'day');
  const next = dayjs(date).add(1, 'day');

  return (
    <div className="flex min-h-screen w-full flex-1 flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <main className="mx-auto w-full max-w-xl flex-1 bg-white px-6 py-12 dark:bg-zinc-900">
        <Button className="hidden" onClick={() => auth.signOut()}>
          Sign out
        </Button>

        <div className="flex items-center justify-between">
          <Button className="text-sm" size="sm" variant="secondary" asChild>
            <Link
              className="inline-flex gap-2"
              href={`/logs/${prev.format('YYYY-MM-DD')}`}
            >
              <ArrowLeftIcon className="" />
              {dayjs(date).subtract(1, 'day').format('MMM D')}
            </Link>
          </Button>

          <div className="flex items-center gap-2">
            <Button
              className="text-sm"
              size="sm"
              variant={isToday ? 'default' : 'outline'}
              asChild
            >
              <Link className="inline-flex gap-2" href={`/goals`}>
                Dashboard
              </Link>
            </Button>

            {!isToday && (
              <Button className="text-sm" size="sm" variant="secondary" asChild>
                <Link
                  className="inline-flex gap-2"
                  href={`/logs/${next.format('YYYY-MM-DD')}`}
                >
                  {next.format('MMM D')}
                  <ArrowRightIcon className="" />
                </Link>
              </Button>
            )}
          </div>
        </div>
        <h1 className="mb-8 mt-8 text-4xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-5xl">
          {isToday ? 'Today' : dayjs(date).format('MMMM D')}
        </h1>

        {!!date && (
          <LogDetails
            className="w-full duration-500 animate-in fade-in-0"
            date={date}
          />
        )}
      </main>
      <footer className="mx-auto w-full max-w-xl bg-white px-6 py-4 dark:bg-zinc-900">
        <div className="flex items-end justify-between">
          <Button
            className={cn(
              'h-8 w-8',
              isDarkMode ? '' : 'border border-zinc-200'
            )}
            size="icon"
            variant={isDarkMode ? 'secondary' : 'secondary'}
            onClick={toggle}
          >
            {isDarkMode ? (
              <MoonIcon className="h-4 w-4 animate-in fade-in-0" />
            ) : (
              <SunIcon className="h-4 w-4 animate-in fade-in-0" />
            )}
          </Button>
          <span className="inline-flex items-center gap-1 text-sm text-zinc-400 dark:text-zinc-600">
            <LightningBoltIcon className="text-blue-500" />
            Powered by{' '}
            <a
              className="font-medium text-blue-400 hover:text-blue-500"
              href="https://www.instantdb.com/"
              target="_blank"
            >
              InstantDB
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LogDetailsPage;

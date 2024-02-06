import {NextPage} from 'next';
import Link from 'next/link';
import React from 'react';
import dayjs from 'dayjs';
import {ArrowRightIcon, CheckCircledIcon} from '@radix-ui/react-icons';
import {id, useQuery, tx, transact, useAuth} from '@instantdb/react';

import {cn, days, months, times, weeks} from '@/lib/utils';
import {
  Goal,
  calculateCompletionPercentage,
  comparator,
  getCountVsTarget,
  goals as seed,
} from '@/lib/goals';
import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

const getColorByPct = (pct: number) => {
  if (pct >= 100) {
    return 'bg-green-500';
  } else if (pct > 70) {
    return 'bg-blue-700';
  } else if (pct > 50) {
    return 'bg-blue-500';
  } else if (pct > 30) {
    return 'bg-blue-300';
  } else if (pct > 5) {
    return 'bg-blue-200';
  } else {
    return 'bg-red-200';
  }
};

const CheckCircle = ({className}: {className: string}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
        clipRule="evenodd"
      />
    </svg>
  );
};

const DatePreview = ({
  className,
  title,
  date,
  goals,
  logs,
}: {
  className?: string;
  title?: string;
  date: string;
  goals: any[];
  logs: any[];
}) => {
  return (
    <div className={className}>
      <div className="mb-2 font-bold">
        {title || dayjs(date).format('MMMM D')}
      </div>

      {goals.sort(comparator).map((g) => {
        const {count, target} = getCountVsTarget(
          g,
          logs.filter((l) => l.goalId === g.id)
        );
        const pct = Math.round((count / target) * 100);
        const hasProgress = pct > 0;
        const isComplete = pct >= 100;

        return (
          <div key={g.id} className="mb-0.5 flex items-center gap-1">
            <span>
              <CheckCircle
                className={cn(
                  'h-4 w-4',
                  isComplete
                    ? 'text-green-500'
                    : hasProgress
                      ? 'text-blue-300'
                      : 'text-zinc-300'
                )}
              />
            </span>
            <span
              className={cn(
                'whitespace-nowrap text-sm',
                isComplete
                  ? 'text-zinc-800'
                  : hasProgress
                    ? 'text-zinc-700'
                    : 'text-zinc-500'
              )}
            >
              {g.name}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const Dashboard = ({className}: {className?: string}) => {
  const {isLoading, error, data} = useQuery({
    goals: {},
    logs: {goals: {}},
  });

  if (isLoading) {
    return <div>{/* TODO: show spinner */}</div>;
  } else if (error) {
    return <div>{error.message}</div>;
  }

  const today = dayjs().format('YYYY-MM-DD');
  const {goals = [], logs = []} = data;
  const logsByDate = logs.reduce((acc: any, log: any) => {
    return {...acc, [log.date]: (acc[log.date] || []).concat(log)};
  }, {});
  const logsByGoal = logs.reduce((acc: any, log: any) => {
    return {...acc, [log.goalId]: (acc[log.goalId] || []).concat(log)};
  }, {});
  const eoy = goals.filter((g) => g.cadence === 'eoy').sort(comparator);

  const getPercentageByDate = (dates: string[], cadence: string) => {
    const logs = dates.flatMap((d) => logsByDate[d] || []);
    const pct = calculateCompletionPercentage(goals, logs, cadence);

    return Math.round(pct * 100);
  };

  const percentages = {
    day: getPercentageByDate([dayjs().format('YYYY-MM-DD')], 'daily'),
    week: getPercentageByDate(
      times(7).map((n) => {
        const date = dayjs()
          .startOf('week')
          .add(n + 1, 'days') // start from Monday
          .format('YYYY-MM-DD');

        return date;
      }),
      'weekly'
    ),
    month: getPercentageByDate(
      times(30).map((n) => {
        const date = dayjs()
          .startOf('month')
          .add(n, 'days')
          .format('YYYY-MM-DD');

        return date;
      }),
      'monthly'
    ),
  };

  return (
    <div className={className}>
      <div className="mb-8">
        {eoy.map((goal: any) => {
          const logs = logsByGoal[goal.id] || [];
          const {count, max, target} = getCountVsTarget(goal, logs);
          const percentage = Math.round((count / target) * 100);
          const isComplete = percentage >= 100;

          if (goal.type === 'binary') {
            return (
              <div key={goal.id} className="mt-2 flex items-center gap-1">
                <CheckCircle
                  className={cn(
                    'h-5 w-5',
                    isComplete ? 'text-green-500' : 'text-zinc-300'
                  )}
                />
                <Label
                  htmlFor={goal.id}
                  className={cn(
                    'text-base',
                    isComplete
                      ? 'font-medium text-zinc-900'
                      : 'font-normal text-zinc-500'
                  )}
                >
                  {goal.name}
                </Label>
              </div>
            );
          } else {
            return (
              <div key={goal.id} className="mt-6">
                <div className="flex items-end justify-between">
                  <div className="inline-flex items-center gap-1">
                    <CheckCircle
                      className={cn(
                        'h-5 w-5',
                        isComplete ? 'text-green-500' : 'text-zinc-300'
                      )}
                    />
                    <Label
                      className={cn(
                        'text-base',
                        isComplete
                          ? 'font-medium text-zinc-900'
                          : 'font-normal text-zinc-500'
                      )}
                    >
                      {goal.name}
                    </Label>
                  </div>
                  <span
                    className={cn(
                      'text-sm font-normal',
                      isComplete ? 'text-zinc-500' : 'text-zinc-300'
                    )}
                  >
                    {count}/{target} {goal.unit}
                  </span>
                </div>
                <div className="relative mt-1 h-2 w-full overflow-hidden rounded-full border border-zinc-100 shadow-sm">
                  <div
                    className={cn(
                      'h-full rounded bg-gradient-to-r transition-all',
                      isComplete
                        ? 'from-green-400 to-green-600'
                        : 'from-zinc-100 to-blue-300'
                    )}
                    style={{width: `${percentage}%`}}
                  />
                </div>
              </div>
            );
          }
        })}
      </div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Daily</h2>
          <Link href={`/logs/${today}`}>
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-xs font-medium',
                getColorByPct(percentages.day),
                percentages.day > 50 ? 'text-white' : 'text-zinc-900'
              )}
            >
              Today: {percentages.day}% complete
            </span>
          </Link>
        </div>

        <div
          style={{
            gridTemplateColumns: 'repeat(53, minmax(0, 1fr))',
            // gridTemplateRows: 'repeat(2, minmax(0, 1fr))',
          }}
          className="my-2 grid gap-px"
        >
          {times(53).map((i) => {
            const start = i * 7;
            const chunk = days.slice(start, start + 7);

            return (
              <div key={i} className="flex flex-col gap-px">
                {chunk.map((date) => {
                  const isToday = dayjs(date).isSame(dayjs(), 'day');
                  const logs = logsByDate[date] || [];
                  const pct = calculateCompletionPercentage(
                    goals,
                    logs,
                    'daily'
                  );
                  const percentage = Math.round(pct * 100);

                  return (
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Link key={date} href={`/logs/${date}`}>
                          <div
                            className={cn(
                              'aspect-square rounded-sm transition-colors hover:bg-zinc-700',
                              isToday ? 'animate-pulse' : '',
                              logs.length > 0
                                ? getColorByPct(percentage)
                                : 'bg-zinc-200'
                            )}
                          />
                        </Link>
                      </HoverCardTrigger>
                      <HoverCardContent
                        className="w-auto min-w-48 p-3"
                        side="top"
                        sideOffset={4}
                        align="start"
                      >
                        <DatePreview
                          className=""
                          date={date}
                          goals={goals.filter((g) => g.cadence === 'daily')}
                          logs={logs}
                        />
                      </HoverCardContent>
                    </HoverCard>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Weekly</h2>
          <Link href={`/logs/${today}`}>
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-xs font-medium',
                getColorByPct(percentages.week),
                percentages.week > 50 ? 'text-white' : 'text-zinc-900'
              )}
            >
              This week: {percentages.week}% complete
            </span>
          </Link>
        </div>

        <div
          style={{
            gridTemplateColumns: 'repeat(27, minmax(0, 1fr))',
            // gridTemplateRows: 'repeat(2, minmax(0, 1fr))',
          }}
          className="my-2 grid gap-0.5"
        >
          {times(27).map((i) => {
            const start = i * 2;
            const chunk = weeks.slice(start, start + 2);

            return (
              <div key={i} className="flex flex-col gap-0.5">
                {chunk.map((date, j) => {
                  const isThisWeek = dayjs(date).isSame(dayjs(), 'week');
                  const dates = times(7).map((n) =>
                    dayjs(date).add(n, 'days').format('YYYY-MM-DD')
                  );
                  const logs = dates.flatMap((d) => logsByDate[d] || []);
                  const pct = calculateCompletionPercentage(
                    goals,
                    logs,
                    'weekly'
                  );
                  const percentage = Math.round(pct * 100);

                  return (
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div
                          key={date}
                          className={cn(
                            'aspect-square rounded-sm transition-colors hover:bg-zinc-700',
                            isThisWeek ? 'animate-pulse' : '',
                            logs.length > 0
                              ? getColorByPct(percentage)
                              : 'bg-zinc-200'
                          )}
                        />
                      </HoverCardTrigger>
                      <HoverCardContent
                        className="w-auto p-3"
                        side="top"
                        sideOffset={4}
                        align="start"
                      >
                        <DatePreview
                          className=""
                          title={`Week of ${dayjs(date).format('MMMM D')}`}
                          date={date}
                          goals={goals.filter((g) => g.cadence === 'weekly')}
                          logs={logs}
                        />
                      </HoverCardContent>
                    </HoverCard>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Monthly</h2>
          <Link href={`/logs/${today}`}>
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-xs font-medium',
                getColorByPct(percentages.month),
                percentages.month > 50 ? 'text-white' : 'text-zinc-900'
              )}
            >
              This month: {percentages.month}% complete
            </span>
          </Link>
        </div>
        <div
          style={{
            gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
            // gridTemplateRows: 'repeat(2, minmax(0, 1fr))',
          }}
          className="my-2 grid gap-1"
        >
          {months.map((date) => {
            const isThisMonth = dayjs(date).isSame(dayjs(), 'month');
            // FIXME
            const dates = times(30).map((n) =>
              dayjs(date).add(n, 'days').format('YYYY-MM-DD')
            );
            const logs = dates.flatMap((d) => logsByDate[d] || []);
            const pct = calculateCompletionPercentage(goals, logs, 'monthly');
            const percentage = Math.round(pct * 100);

            return (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div
                    key={date}
                    className={cn(
                      'aspect-square rounded-sm transition-colors hover:bg-zinc-700',
                      isThisMonth ? 'animate-pulse' : '',
                      logs.length > 0
                        ? getColorByPct(percentage)
                        : 'bg-zinc-200'
                    )}
                  />
                </HoverCardTrigger>
                <HoverCardContent
                  className="w-auto p-3"
                  side="top"
                  sideOffset={4}
                  align="start"
                >
                  <DatePreview
                    className=""
                    title={`Month of ${dayjs(date).format('MMMM')}`}
                    date={date}
                    goals={goals.filter((g) => g.cadence === 'monthly')}
                    logs={logs}
                  />
                </HoverCardContent>
              </HoverCard>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const IndexPage: NextPage = () => {
  const {isLoading: isLoadingUser, user, error: authError} = useAuth();
  const {isLoading, error, data} = useQuery({
    goals: {},
    logs: {goals: {}},
  });

  // React.useEffect(() => {
  //   const prefetch = async () => {
  //     // cache logs from the past week so they load immediately
  //     // when I click into /logs/[date] for these recent dates
  //     const dates = times(7).map((n) =>
  //       dayjs().subtract(n, 'days').format('YYYY-MM-DD')
  //     );

  //     await Promise.all(
  //       // dates.map((date) => query({logs: {$: {where: {date}}}}))
  //       dates.map((date) => router.prefetch(`/logs/${date}`))
  //     );
  //   };

  //   prefetch();
  // }, []);

  return (
    <div className="flex min-h-screen w-full flex-1 flex-col bg-zinc-50 text-zinc-900">
      <main className="mx-auto w-full max-w-xl flex-1 bg-white px-6 py-12">
        <div className="flex justify-end">
          <Button className="text-sm" size="sm" variant="secondary" asChild>
            <Link
              className="inline-flex items-center gap-2"
              href={`/logs/${dayjs().format('YYYY-MM-DD')}`}
            >
              Today
              <ArrowRightIcon />
            </Link>
          </Button>
        </div>
        <div className="mb-8 mt-8 flex items-center justify-between">
          <h1 className="text-5xl font-bold text-zinc-900">2024 goals</h1>
        </div>

        <Dashboard className="w-full duration-500 animate-in fade-in-0" />
      </main>
    </div>
  );
};

export default IndexPage;

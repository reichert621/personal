// const raw: Record<string, string[]> = {
//   eoy: [
//     '50 pushups consecutively',
//     '20 pullups consecutively',
//     // 'Body weight: 200-210 lbs',
//     'Squat 250 lbs',
//     // 'Deadlift 280 lbs',
//     // 'Overhead press 140 lbs',
//     'Bench press 200 lbs',
//     'Launch 6 products',
//     'Join a dance class',
//     'Join a volleyball league',
//     // 'Try an improv/theater/toastmasters class (something out of comfort zone)',
//     // 'Make $100k through personal projects',
//     'Touch toes',
//     '3 domestic trips (Colorado? SF? Upstate?)',
//     '1 international trip (Europe! Maybe visit Jacky in Taiwan?)',
//   ],
//   daily: [
//     'Eat veggies (smoothie, asparagus, broccoli, kale salad, etc)',
//     'Eat eggs (at least 2)',
//     '150g protein (chicken/steak/salmon, beans, eggs, protein shake)',
//     '100 (bodyweight) squats',
//     '100 (bodyweight) lunges',
//     '100 pushups',
//     '2 min plank',
//     'Journal (min 10 mins)',
//     'Meditate (min 5 mins)',
//     'Read (min 10 mins)',
//   ],
//   weekly: [
//     'Yoga',
//     'Date night',
//     '2 quality hangs',
//     '2 work sessions with other people',
//     // '1 hour cumulative on essay writing',
//     // '1 30 min meditation',
//     'Write weekly reflection',
//   ],
//   monthly: [
//     'Go to a show (musical, theater, comedy) or visit museum',
//     "2 demos of progress in whatever project I'm working on",
//     '1 essay, share with at least 5 people',
//   ],
// };

const categories = [
  'Health & Fitness', // Diet & Exercise
  'Relationships & Community',
  'Reading & Writing',
  'Wellness & Spirituality',
  'Work & Career',
  'Travel & Culture', // Fun?
  'Reading List',
];

// const goals = Object.keys(raw).flatMap((key) => {
//   const items: string[] = raw[key];

//   return items.map((item) => {
//     return {
//       name: item,
//       cadence: key,
//       type: 'number',
//       value: 0,
//       unit: 'lbs',
//     };
//   });
// });

export type Goal = {
  id?: string;
  name: string;
  cadence: 'eoy' | 'monthly' | 'weekly' | 'daily';
  type: 'number' | 'binary' | 'aggregate';
  value: number;
  unit: string | null;
  question?: string | null;
};

export const goals: Goal[] = [
  {
    name: '50 pushups consecutively',
    cadence: 'eoy',
    type: 'number',
    value: 50,
    unit: 'reps',
    question: 'How many pushups can you do consecutively?',
  },
  {
    name: '20 pullups consecutively',
    cadence: 'eoy',
    type: 'number',
    value: 20,
    unit: 'reps',
    question: 'How many pullups can you do consecutively?',
  },
  {
    name: 'Squat 250 lbs',
    cadence: 'eoy',
    type: 'number',
    value: 250,
    unit: 'lbs',
    question: 'How much can you squat?',
  },
  {
    name: 'Bench press 200 lbs',
    cadence: 'eoy',
    type: 'number',
    value: 200,
    unit: 'lbs',
    question: 'How much can you bench?',
  },
  // {
  //   name: 'Launch 6 products',
  //   cadence: 'eoy',
  //   type: 'number',
  //   value: 6,
  //   unit: 'products',
  // },
  {
    name: 'Join a dance class',
    cadence: 'eoy',
    type: 'binary',
    value: 1, // true
    unit: null,
  },
  {
    name: 'Join a volleyball league',
    cadence: 'eoy',
    type: 'binary',
    value: 1,
    unit: null,
  },
  {
    name: 'Touch toes',
    cadence: 'eoy',
    type: 'binary',
    value: 1,
    unit: null,
  },
  // {
  //   name: '3 domestic trips (Colorado? SF? Upstate?)',
  //   cadence: 'eoy',
  //   type: 'number',
  //   value: 3,
  //   unit: 'trips',
  // },
  // {
  //   name: '1 international trip (Europe! Maybe visit Jacky in Taiwan?)',
  //   cadence: 'eoy',
  //   type: 'number',
  //   value: 1,
  //   unit: 'trips',
  // },
  {
    name: 'Eat veggies',
    cadence: 'daily',
    type: 'binary',
    value: 1,
    unit: null,
  },
  {
    name: 'Eat eggs',
    cadence: 'daily',
    type: 'binary',
    value: 1,
    unit: null,
  },
  // {
  //   name: '150g protein (chicken/steak/salmon, beans, eggs, protein shake)',
  //   cadence: 'daily',
  //   type: 'number',
  //   value: 0,
  //   unit: 'lbs',
  // },
  {
    name: '100 squats',
    cadence: 'daily',
    type: 'number',
    value: 100,
    unit: 'reps',
    question: 'How many squats did you do?',
  },
  {
    name: '100 lunges',
    cadence: 'daily',
    type: 'number',
    value: 100,
    unit: 'reps',
    question: 'How many lunges did you do?',
  },
  {
    name: '100 pushups',
    cadence: 'daily',
    type: 'number',
    value: 100,
    unit: 'reps',
    question: 'How many pushups did you do?',
  },
  {
    name: '2 min plank',
    cadence: 'daily',
    type: 'number',
    value: 2,
    unit: 'mins',
    question: 'How long did you plank?',
  },
  {
    name: 'Journal',
    cadence: 'daily',
    type: 'binary',
    value: 1,
    unit: null,
  },
  {
    name: 'Meditate',
    cadence: 'daily',
    type: 'binary',
    value: 1,
    unit: null,
  },
  {
    name: 'Read',
    cadence: 'daily',
    type: 'binary',
    value: 1,
    unit: null,
  },
  {
    name: 'Yoga',
    cadence: 'weekly',
    type: 'aggregate',
    value: 1,
    unit: 'classes',
    question: 'Did you go to yoga today?',
  },
  {
    name: 'Date night',
    cadence: 'weekly',
    type: 'binary',
    value: 1,
    unit: null,
    question: 'Did you have a date night?',
  },
  {
    name: '2 quality hangs',
    cadence: 'weekly',
    type: 'aggregate',
    value: 2,
    unit: 'meetups',
    question: 'Did you have a quality hang with friends?',
  },
  {
    name: '2 work sessions with other people',
    cadence: 'weekly',
    type: 'aggregate',
    value: 2,
    unit: 'meetups',
    question: 'Did you work with other people today?',
  },
  {
    name: 'Write reflection',
    cadence: 'weekly',
    type: 'binary',
    value: 1,
    unit: null,
  },
  {
    name: 'Go to a show',
    cadence: 'monthly',
    type: 'binary',
    value: 1,
    unit: null,
  },
  {
    name: 'Visit a museum',
    cadence: 'monthly',
    type: 'binary',
    value: 1,
    unit: null,
  },
  // {
  //   name: "Demo progress in whatever project I'm working on",
  //   cadence: 'monthly',
  //   type: 'binary',
  //   value: 1,
  //   unit: null,
  // },
  {
    name: 'Write 1 essay',
    cadence: 'monthly',
    type: 'binary',
    value: 1,
    unit: null,
  },
];

export function comparator(a: any, b: any) {
  const primary = a.type.localeCompare(b.type);

  if (primary === 0) {
    return a.name.localeCompare(b.name);
  } else {
    return primary;
  }
}

export function getCountVsTarget(goal: Goal, logs: any[]) {
  const completed = logs.filter((l: any) => !!l.value);

  if (completed.length === 0) {
    return {count: 0, max: 0, target: goal.value};
  }

  if (goal.type === 'binary') {
    const count = completed.length > 0 ? 1 : 0;

    return {count, max: count, target: 1};
  } else if (goal.type === 'aggregate') {
    return {count: completed.length, max: completed.length, target: goal.value};
  } else if (goal.type === 'number') {
    if (goal.cadence === 'eoy') {
      const [latest] = completed.sort(
        (a, b) => +new Date(b.date) - +new Date(a.date)
      );
      const [max] = completed.sort((a, b) => b.value - a.value);

      return {count: latest.value, max: max.value, target: goal.value};
    } else {
      const val = completed.reduce((total, l) => total + l.value, 0);

      return {count: val, max: val, target: goal.value};
    }
  } else {
    throw new Error('Unexpected goal type!');
  }
}

export function calculateCompletionPercentage(
  goals: any[],
  logs: any[],
  cadence: string
) {
  const logsByGoal = logs.reduce((acc, log) => {
    return {...acc, [log.goalId]: (acc[log.goalId] || []).concat(log)};
  }, {});
  const percentages = goals
    .filter((g) => g.cadence === cadence)
    .map((goal) => {
      const logs = logsByGoal[goal.id] || [];
      const {count, target} = getCountVsTarget(goal, logs);

      return {goal, count, target};
    });

  // take the average percentages (rather than the total overall)
  return (
    percentages
      .map((i) => (i.target ? i.count / i.target : 0))
      .reduce((total, p) => total + p, 0) / percentages.length
  );
}

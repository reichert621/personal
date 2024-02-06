import type {NextApiRequest, NextApiResponse} from 'next';
import {init, query, transact, tx} from '@instantdb/admin';

init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
  adminToken: process.env.INSTANT_ADMIN_TOKEN!,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const q = {goals: {logs: {}}} as any;
  const data = await query(q);

  res.status(200).json(data);
}

import { Context } from '../../../../types/index';

export const createUser = async (
  _: unknown,
  args: { input: { name: string; xp: number } },
  context: Context,
) => {
  const { db } = context;
  const { name, xp } = args.input;

  try {
    const existingUser = await db.user.findFirst({
      where: { name: name },
    });

    if (existingUser) {
      return existingUser;
    }

    return await db.user.create({
      data: {
        name,
        xp,
        level: 1,
      },
    });
  } catch (err: any) {
    throw new Error(`System err while joining: ${err.message || err}`);
  }
};

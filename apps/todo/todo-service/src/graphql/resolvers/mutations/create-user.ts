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
      return { message: 'User already existed' };
    }

    await db.user.create({
      data: {
        name,
        xp,
      },
    });
    return { message: 'Success created' };
  } catch (err: unknown) {
    if (err instanceof Error)
      throw new Error(`System err while joining: ${err.message || err}`);
  }
};

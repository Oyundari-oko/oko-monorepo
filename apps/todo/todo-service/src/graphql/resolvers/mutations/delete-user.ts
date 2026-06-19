import { Context } from '../../../../types/index';

type DeleteUserArgs = {
  id: string;
};

export const deleteUser = async (
  _: unknown,
  args: DeleteUserArgs,
  context: Context,
) => {
  const { db } = context;
  const { id } = args;

  try {
    await db.user.delete({
      where: { id },
    });

    return { message: 'Хэрэглэгчийг амжилттай устгалаа.' };
  } catch (err: any) {
    throw new Error(`System err while deleting user: ${err}`);
  }
};

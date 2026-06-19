import { Context } from '../../../../types/index';

type GetTodoArgs = {
  userId: string;
};

export const getTodoByUserId = async (
  _: unknown,
  args: GetTodoArgs,
  context: Context,
) => {
  const { db } = context;
  try {
    return await db.todo.findMany({
      where: { userId: args.userId },
    });
  } catch (err: any) {
    throw new Error(`System err while fetching todos: ${err}`);
  }
};

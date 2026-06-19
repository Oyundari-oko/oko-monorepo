import { Context } from '../../../../types/index';

type UpdateTodoArgs = {
  todoId: string;
  userId: string;
  input: {
    title: string;
    description?: string;
    xpReward: number;
  };
};

export const updateTodo = async (
  _: unknown,
  args: UpdateTodoArgs,
  context: Context,
) => {
  const { db } = context;
  const { todoId, userId, input } = args;

  try {
    return await db.todo.update({
      where: {
        id: todoId,
        userId: userId,
      },
      data: {
        title: input.title,
        description: input.description || null,
        xpReward: input.xpReward,
      },
    });
  } catch (err: any) {
    throw new Error(`System err while updating todo: ${err}`);
  }
};

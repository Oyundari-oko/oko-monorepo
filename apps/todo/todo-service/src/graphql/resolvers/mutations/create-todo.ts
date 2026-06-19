import { Context } from '../../../../types/index';

type CreateTodoArgs = {
  input: {
    title: string;
    description?: string;
    xpReward: number;
    userId: string;
  };
};

export const createTodo = async (
  _: unknown,
  args: CreateTodoArgs,
  context: Context,
) => {
  const { db } = context;
  const { title, description, xpReward, userId } = args.input;

  try {
    await db.todo.create({
      data: {
        title,
        description: description || null,
        xpReward: xpReward || 20,
        isCompleted: false,
        userId,
      },
    });
    return { message: 'Даалгавар амжилттай үүслээ!' };
  } catch (err: any) {
    throw new Error(`System err while creating todo: ${err}`);
  }
};

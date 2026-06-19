import { Context } from '../../../../types/index';
import { getLevel } from '../../../lib/xp';

export const deleteTodo = async (
  _: unknown,
  args: { todoId: string },
  context: Context,
) => {
  const { db } = context;
  const { todoId } = args;

  return await db.$transaction(async (tx) => {
    const todo = await tx.todo.findUnique({ where: { id: todoId } });
    if (!todo) throw new Error('Даалгавар олдсонгүй');

    const userId = todo.userId;

    if (todo.isCompleted) {
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (user) {
        const xpToDeduct = todo.xpReward || 20;

        const newXp = Math.max(0, user.xp - xpToDeduct);
        const newLevel = getLevel(newXp);

        await tx.user.update({
          where: { id: userId },
          data: {
            xp: Number(newXp),
            level: Number(newLevel),
          },
        });
      }
    }

    await tx.todo.delete({
      where: { id: todoId },
    });

    return {
      id: todoId,
      message: 'Даалгавар амжилттай устлаа, биелсэн байсан тул XP хасагдлаа.',
    };
  });
};

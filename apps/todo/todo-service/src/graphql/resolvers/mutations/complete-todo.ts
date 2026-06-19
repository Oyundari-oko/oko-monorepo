import { Context } from '../../../../types/index';
import { getLevel } from '../../../lib/xp';

export const completeTodo = async (
  _: unknown,
  args: { todoId: string; userId: string },
  context: Context,
) => {
  const { db } = context;
  const { todoId, userId } = args;

  return await db.$transaction(async (tx) => {
    const todo = await tx.todo.findUnique({ where: { id: todoId } });
    if (!todo) throw new Error('Quest олдсонгүй');
    if (todo.isCompleted)
      throw new Error('Энэ даалгавар аль хэдийн биелсэн байна');

    await tx.todo.update({
      where: { id: todoId },
      data: { isCompleted: true },
    });

    const user = await tx.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('Хэрэгалгч олдсонгүй');

    const xpGained = todo.xpReward || 20;
    const oldLevel = user.level;
    const newXp = user.xp + xpGained;
    const newLevel = getLevel(newXp);

    await tx.user.update({
      where: { id: userId },
      data: { xp: Number(newXp), level: Number(newLevel) },
    });

    return {
      message: 'Даалгавар амжилттай биеллээ!',
      xpGained,
      leveledUp: newLevel > oldLevel,
      newLevel,
      newXp,
    };
  });
};

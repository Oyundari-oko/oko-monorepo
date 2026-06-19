import { Context } from '../../../../types/index';
import { getLevel, xpWithinLevel } from '../../../lib/xp';

type UncompleteTodoArgs = {
  todoId: string;
  userId: string;
};

export const uncompleteTodo = async (
  _: unknown,
  args: UncompleteTodoArgs,
  context: Context,
) => {
  const { db } = context;
  const { todoId, userId } = args;

  return await db.$transaction(async (tx) => {
    const todo = await tx.todo.findUnique({ where: { id: todoId } });
    if (!todo) throw new Error('Quest олдсонгүй');
    if (!todo.isCompleted)
      throw new Error('Энэ даалгавар аль хэдийн цуцлагдсан байна');

    await tx.todo.update({
      where: { id: todoId },
      data: { isCompleted: false },
    });

    const user = await tx.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('Хэрэглэгч олдсонгүй');

    const xpLost = todo.xpReward || 100;
    let newXp = user.xp - xpLost;
    if (newXp < 0) newXp = 0;

    const oldLevel = user.level;
    const newLevel = getLevel(newXp);

    await tx.user.update({
      where: { id: userId },
      data: { xp: newXp, level: newLevel },
    });

    const { current, needed } = xpWithinLevel(newXp);

    return {
      message: 'Даалгаврыг цуцалж, идэвхтэй төлөвт орууллаа.',
      xpGained: -xpLost,
      leveledUp: newLevel < oldLevel,
      newLevel,
      newXp,
      currentLevelXp: current,
      xpToNextLevel: needed - current,
    };
  });
};

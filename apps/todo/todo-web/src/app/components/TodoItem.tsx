'use client';

import { Edit2, Trash2, Check } from 'lucide-react';

interface Todo {
  id: string;
  title: string;
  description?: string;
  xpReward: number;
  isCompleted: boolean;
}

interface TodoItemProps {
  todoItem: Todo;
  onToggle: (todoId: string, isCompleted: boolean) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (todoId: string) => void;
}

export const TodoItem = ({
  todoItem,
  onToggle,
  onEdit,
  onDelete,
}: TodoItemProps) => {
  return (
    <li
      className={`group p-3 rounded-2xl flex justify-between items-center border transition-all duration-200 ${
        todoItem.isCompleted
          ? 'bg-black/20 border-white/5 opacity-60'
          : 'bg-white/10 border-white/5 hover:bg-white/15 hover:translate-x-0.5'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <button
          type="button"
          onClick={() => onToggle(todoItem.id, todoItem.isCompleted)}
          className={`w-5 h-5 rounded-lg border flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${
            todoItem.isCompleted
              ? 'bg-emerald-500 border-emerald-400 text-white'
              : 'border-white/30 bg-transparent hover:border-white/60'
          }`}
        >
          {todoItem.isCompleted && <Check size={15} strokeWidth={3} />}
        </button>

        <div className="min-w-0">
          <p
            className={`font-semibold text-sm truncate text-white ${
              todoItem.isCompleted ? 'line-through text-stone-400' : ''
            }`}
          >
            {todoItem.title}
          </p>
          {todoItem.description && (
            <p
              className={`text-[11px] truncate max-w-[180px] ${
                todoItem.isCompleted ? 'text-stone-500' : 'text-emerald-200/60'
              }`}
            >
              {todoItem.description}
            </p>
          )}
          <span
            className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-md block w-max mt-0.5 ${
              todoItem.isCompleted
                ? 'bg-stone-500/20 text-stone-400'
                : 'bg-emerald-500/20 text-emerald-200'
            }`}
          >
            {todoItem.isCompleted ? `Биелсэн` : `+${todoItem.xpReward} XP`}
          </span>
        </div>
      </div>

      <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-200 ml-2">
        {!todoItem.isCompleted && (
          <button
            type="button"
            onClick={() => onEdit(todoItem)}
            className="p-1.5 hover:bg-white/10 text-emerald-200 hover:text-white rounded-lg cursor-pointer transition-colors"
          >
            <Edit2 size={17} />
          </button>
        )}
        <button
          type="button"
          onClick={() => onDelete(todoItem.id)}
          className="p-1.5 hover:bg-red-500/20 text-emerald-200 hover:text-red-300 rounded-lg cursor-pointer transition-colors"
        >
          <Trash2 size={17} />
        </button>
      </div>
    </li>
  );
};

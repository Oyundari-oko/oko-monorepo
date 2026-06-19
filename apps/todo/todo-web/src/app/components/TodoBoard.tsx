'use client';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@oko-monorepo/shadcn';
import { Plus } from 'lucide-react';
import { CreateQuestForm } from './CreateQuest';
import { TodoItem } from './TodoItem';
import { useTodoMutations } from '../hook/useTodoMutations';

interface Todo {
  id: string;
  title: string;
  description?: string;
  xpReward: number;
  isCompleted: boolean;
}

interface TodoBoardProps {
  user: {
    id: string;
    todos: Array<Todo>;
  };
}

export const TodoBoard = ({ user }: TodoBoardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const [todoIdToDelete, setTodoIdToDelete] = useState<string | null>(null);

  const { loading, handleFormSubmit, handleToggleTodo, handleDeleteTodo } =
    useTodoMutations(user.id);

  const allTodos = [...(user.todos || [])].sort((a, b) => {
    if (a.isCompleted === b.isCompleted) return 0;
    return a.isCompleted ? 1 : -1;
  });

  const confirmDelete = async () => {
    if (todoIdToDelete) {
      await handleDeleteTodo(todoIdToDelete);
      setTodoIdToDelete(null);
    }
  };

  return (
    <>
      <Card className="border-none bg-emerald-900/85 backdrop-blur-md shadow-2xl shadow-emerald-950/20 rounded-3xl text-white overflow-hidden transition-all duration-300">
        <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 border-b border-white/10">
          <CardTitle className="text-base font-bold tracking-tight text-white">
            Даалгавар ({allTodos.length})
          </CardTitle>
          <Button
            onClick={() => {
              setEditingTodo(null);
              setIsOpen(true);
            }}
            size="sm"
            className="h-8 w-8 p-0 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 active:scale-95 transition-all shadow-md cursor-pointer"
          >
            <Plus size={16} strokeWidth={2.5} />
          </Button>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          {allTodos.length > 0 ? (
            <ul className="space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/20">
              {allTodos.map((todoItem) => (
                <TodoItem
                  key={todoItem.id}
                  todoItem={todoItem}
                  onToggle={handleToggleTodo}
                  onEdit={(todo) => {
                    setEditingTodo(todo);
                    setIsOpen(true);
                  }}
                  onDelete={(id) => setTodoIdToDelete(id)}
                />
              ))}
            </ul>
          ) : (
            <div className="text-center py-6 text-emerald-100/60 text-xs font-extrabold">
              Хоосон байна
            </div>
          )}
        </CardContent>
      </Card>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 bg-white sm:max-w-[320px] w-[90vw] rounded-3xl p-5 border-none shadow-2xl">
          <DialogHeader className="hidden">
            <DialogTitle />
          </DialogHeader>
          <CreateQuestForm
            onSubmit={(formData) =>
              handleFormSubmit(editingTodo, formData, () => setIsOpen(false))
            }
            loading={loading}
            initialData={editingTodo as unknown as Record<string, unknown>}
          />
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={!!todoIdToDelete}
        onOpenChange={(open) => !open && setTodoIdToDelete(null)}
      >
        <AlertDialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 bg-white sm:max-w-[320px] w-[85vw] rounded-3xl p-6 border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-stone-800">
              Даалгавар устгах уу?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-stone-500 text-center pt-6">
              Та энэ даалгаврыг устгахдаа итгэлтэй байна уу? Устгасан тохиолдолд
              буцаах боломжгүй.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row gap-2 mt-4 sm:space-x-0">
            <AlertDialogCancel className="flex-1 m-0 h-10 rounded-xl border border-stone-200 text-stone-600 font-medium text-xs hover:bg-stone-50 transition-all cursor-pointer">
              Цуцлах
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="flex-1 m-0 h-10 rounded-xl bg-red-500 text-white font-medium text-xs hover:bg-red-600 transition-all shadow-md cursor-pointer"
            >
              Устгах
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

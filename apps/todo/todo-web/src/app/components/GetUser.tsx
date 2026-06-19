'use client';
import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@oko-monorepo/shadcn';
import { X, Trash2 } from 'lucide-react';
import { TodoBoard } from './TodoBoard';
import { DELETE_USER } from '../graphql/user';
import { xpWithinLevel } from '../../../../todo-service/src/lib/xp';

interface Todo {
  id: string;
  title: string;
  description?: string;
  xpReward: number;
  isCompleted: boolean;
}

interface GetUserProps {
  user: {
    id: string;
    name: string;
    xp: number;
    level: number;
    todos: Array<Todo>;
  };
  onSignOut: () => void;
}

export const GetUser = ({ user, onSignOut }: GetUserProps) => {
  const [isSignOutOpen, setIsSignOutOpen] = useState(false);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);

  const [deleteUserMutation] = useMutation(DELETE_USER);

  if (!user) {
    return (
      <div className="text-center p-4 text-stone-500 font-medium">
        Уншиж байна...
      </div>
    );
  }

  const {
    current: currentLevelXp,
    needed: xpTarget,
    level: calculatedLevel,
  } = xpWithinLevel(user.xp);
  let progress = Math.min(100, (currentLevelXp / xpTarget) * 100);
  if (currentLevelXp === 0 && user.xp > 0) {
    progress = 0;
  } else {
    progress = Math.min(100, progress);
  }

  const handleDeleteUser = async () => {
    try {
      await deleteUserMutation({
        variables: { deleteUserId: user.id },
      });
      setIsDeleteUserOpen(false);
      onSignOut();
    } catch (err) {
      console.error('Хэрэглэгчийг устгахад алдаа гарлаа:', err);
    }
  };

  return (
    <div className="w-full max-w-sm space-y-5 font-sans p-2 select-none">
      <Card className="border-none bg-white/70 backdrop-blur-md shadow-xl shadow-stone-200/50 rounded-3xl transition-all duration-300">
        <CardHeader className="text-center pb-1 pt-1.5 relative">
          <div className="flex justify-end absolute right-4 top-2">
            <Button
              size="sm"
              variant="ghost"
              className="text-stone-500 hover:text-red-400 hover:bg-stone-100 rounded-xl cursor-pointer transition-colors"
              onClick={() => setIsSignOutOpen(true)}
            >
              <X size={16} />
            </Button>
          </div>

          <div className="space-y-0.5 pt-4">
            <span className="text-[10px] font-bold tracking-widest text-stone-400 uppercase">
              Level Up Todo
            </span>
            <div className="flex items-center justify-center gap-2">
              <CardTitle className="text-xl font-black text-stone-800 tracking-tight">
                {user.name}
              </CardTitle>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200">
                LVL {calculatedLevel}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-5 pb-5">
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-bold text-stone-500">
              <span className="tracking-wide">Experience</span>
              <span className="font-mono">
                {currentLevelXp} / {xpTarget} XP
              </span>
            </div>

            <div className="w-full h-3 bg-stone-100 rounded-full p-[2px] border border-stone-200/40 overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all ${
                  currentLevelXp === 0 ? 'duration-0' : 'duration-700'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setIsDeleteUserOpen(true)}
                className="p-1.5 hover:bg-red-500/10 text-stone-400 hover:text-red-500 rounded-xl cursor-pointer transition-colors"
                title="Хэрэглэгч устгах"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <TodoBoard user={user} />

      <ConfirmModal
        isOpen={isSignOutOpen}
        onOpenChange={setIsSignOutOpen}
        title="Системээс гарах уу?"
        description="Та системээс гарахдаа итгэлтэй байна уу?"
        actionText="Тэгье"
        onAction={onSignOut}
        actionClassName="bg-green-800 hover:bg-emerald-900"
      />

      <ConfirmModal
        isOpen={isDeleteUserOpen}
        onOpenChange={setIsDeleteUserOpen}
        title="Бүртгэл устгах уу?"
        titleClassName="text-red-600"
        description="Та өөрийн бүртгэлийг устгахдаа итгэлтэй байна уу? Таны бүх даалгавар, цуглуулсан XP бүрмөсөн устах бөгөөд буцаах боломжгүй!"
        actionText="Устгах"
        onAction={handleDeleteUser}
        actionClassName="bg-red-500 hover:bg-red-600"
      />
    </div>
  );
};

interface ConfirmModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  titleClassName?: string;
  description: string;
  actionText: string;
  onAction: () => void;
  actionClassName: string;
}

const ConfirmModal = ({
  isOpen,
  onOpenChange,
  title,
  titleClassName = 'text-stone-800',
  description,
  actionText,
  onAction,
  actionClassName,
}: ConfirmModalProps) => (
  <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
    <AlertDialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 bg-white sm:max-w-[320px] w-[85vw] rounded-3xl p-6 border-none shadow-2xl">
      <AlertDialogHeader className="space-y-2">
        <AlertDialogTitle
          className={`text-base font-bold text-center ${titleClassName}`}
        >
          {title}
        </AlertDialogTitle>
        <AlertDialogDescription className="text-xs text-stone-500 text-center leading-relaxed">
          {description}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter className="flex flex-row gap-2 mt-4 sm:space-x-0">
        <AlertDialogCancel className="flex-1 m-0 h-10 rounded-xl border border-stone-200 text-stone-600 font-medium text-xs hover:bg-stone-50 transition-all cursor-pointer">
          Цуцлах
        </AlertDialogCancel>
        <AlertDialogAction
          onClick={onAction}
          className={`flex-1 m-0 h-10 rounded-xl text-white font-medium text-xs transition-all shadow-md cursor-pointer ${actionClassName}`}
        >
          {actionText}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

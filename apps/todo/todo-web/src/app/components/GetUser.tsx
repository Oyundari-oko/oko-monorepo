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
import { X, Trash2, ShieldAlert } from 'lucide-react';
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
      <div className="flex h-40 items-center justify-center font-sans text-emerald-700/60 font-bold animate-pulse tracking-wide">
        Уншиж байна...
      </div>
    );
  }

  const {
    current: currentLevelXp,
    needed: xpTarget,
    level: calculatedLevel,
  } = xpWithinLevel(user.xp);
  let progress = 0;
  if (xpTarget > 0) {
    progress = (currentLevelXp / xpTarget) * 100;
  }
  if (currentLevelXp >= xpTarget && xpTarget > 0) {
    progress = 100;
  } else {
    progress = Math.max(0, Math.min(100, progress));
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
    <div className="w-full max-w-sm space-y-4 font-sans p-2 select-none animate-in fade-in zoom-in-95 duration-500 text-stone-800">
      <Card className="border border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_15px_35px_rgba(47,79,79,0.05)] rounded-[32px] transition-all duration-300">
        <CardHeader className="text-center pb-1 pt-4 relative z-10">
          <div className="flex justify-end absolute right-4 top-3">
            <Button
              size="sm"
              variant="ghost"
              className="text-stone-400 hover:text-red-500 hover:bg-stone-100 active:scale-95 rounded-xl cursor-pointer transition-all duration-200"
              onClick={() => setIsSignOutOpen(true)}
            >
              <X size={16} />
            </Button>
          </div>

          <div className="space-y-0.5 pt-2">
            <span className="text-[10px] font-bold tracking-[0.15em] text-emerald-800/60 uppercase">
              🌿 Level Up Todo
            </span>
            <div className="flex items-center justify-center gap-2 pt-1">
              <CardTitle className="text-2xl font-black text-stone-800 tracking-tight">
                {user.name}
              </CardTitle>
              <span className="text-[11px] font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full shadow-sm tracking-wide">
                LVL {calculatedLevel}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-5 pb-5 relative z-10">
          <div className="space-y-3">
            <div className="flex justify-between text-[11px] font-bold text-stone-500 tracking-wide">
              <span className="uppercase">Experience Point</span>
              <span className="font-mono bg-white/80 px-2 py-0.5 rounded-md border border-stone-200/40 shadow-sm text-stone-700">
                {currentLevelXp} <span className="text-stone-300">/</span>{' '}
                {xpTarget} XP
              </span>
            </div>

            <div className="w-full h-3.5 bg-stone-200/60 rounded-full p-[2px] border border-stone-300/30 overflow-hidden shadow-inner relative">
              <div
                className={`h-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 rounded-full shadow-[0_1px_4px_rgba(16,185,129,0.2)] transition-all ${
                  currentLevelXp === 0 ? 'duration-0' : 'duration-1000 ease-out'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex justify-end pt-0.5">
              <button
                type="button"
                onClick={() => setIsDeleteUserOpen(true)}
                className="p-2 bg-stone-50 hover:bg-red-50 text-stone-400 hover:text-red-500 rounded-xl cursor-pointer transition-all duration-200 active:scale-90 border border-stone-200/40 hover:border-red-100 shadow-sm"
                title="Хэрэглэгч устгах"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="transition-all duration-300">
        <TodoBoard user={user} />
      </div>
      <ConfirmModal
        isOpen={isSignOutOpen}
        onOpenChange={setIsSignOutOpen}
        title="Системээс гарах уу?"
        description="Та системээс гарахдаа итгэлтэй байна уу? Хийж дуусаагүй даалгаврууд таныг хүлээж үлдэнэ шүү!"
        actionText="Тийм, гаръя"
        onAction={onSignOut}
        actionClassName="bg-stone-800 hover:bg-stone-900 text-white border-none rounded-xl"
      />
      <ConfirmModal
        isOpen={isDeleteUserOpen}
        onOpenChange={setIsDeleteUserOpen}
        title="Бүртгэлээ бүрмөсөн устгах уу?"
        titleClassName="text-red-500 font-black"
        description="Анхаар! Таны бүх даалгавар, цуглуулсан XP болон ололтууд бүрмөсөн устах бөгөөд буцаах ямар ч боломжгүй!"
        actionText="Тийм, устга"
        onAction={handleDeleteUser}
        actionClassName="bg-red-500 hover:bg-red-600 text-white border-none rounded-xl"
        icon={
          <ShieldAlert className="mx-auto text-red-400 mb-1 size-7 animate-pulse" />
        }
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
  icon?: React.ReactNode;
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
  icon,
}: ConfirmModalProps) => (
  <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
    <AlertDialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 bg-white/95 backdrop-blur-xl sm:max-w-[340px] w-[88vw] rounded-[28px] p-5 border border-stone-200/60 shadow-[0_20px_45px_rgba(0,0,0,0.08)] animate-in fade-in-50 zoom-in-95 duration-200 text-stone-800">
      <AlertDialogHeader className="space-y-1.5">
        {icon}
        <AlertDialogTitle
          className={`text-base font-black text-center tracking-tight ${titleClassName}`}
        >
          {title}
        </AlertDialogTitle>
        <AlertDialogDescription className="text-xs text-stone-500 text-center leading-relaxed font-medium">
          {description}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter className="flex flex-row gap-2 mt-4 sm:space-x-0">
        <AlertDialogCancel className="flex-1 m-0 h-9 rounded-xl border border-stone-200 text-stone-600 font-bold text-xs hover:bg-stone-50 transition-all cursor-pointer bg-transparent">
          Цуцлах
        </AlertDialogCancel>
        <AlertDialogAction
          onClick={onAction}
          className={`flex-1 m-0 h-9 rounded-xl text-white font-bold text-xs transition-all active:scale-95 cursor-pointer ${actionClassName}`}
        >
          {actionText}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

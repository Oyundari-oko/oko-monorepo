'use client';

import { Button } from '@oko-monorepo/shadcn';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@oko-monorepo/shadcn';
import { Input } from '@oko-monorepo/shadcn';
import { ChangeEvent, useState } from 'react';
import { CREATE_USER, GET_USERS } from '../graphql/user';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client/react';

export const CreateUser = () => {
  const router = useRouter();

  const [userName, setUserName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [createUser, { loading: mutationLoading }] = useMutation(CREATE_USER);

  const onChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
    if (error) setError('');
  };

  const onSubmit = async () => {
    if (!userName.trim()) {
      setError('Үргэлжлүүлэхийн тулд нэрээ заавал оруулна уу!');
      return;
    }
    try {
      const response = await createUser({
        variables: {
          input: {
            name: userName.trim(),
            xp: 0,
          },
        },
        refetchQueries: [{ query: GET_USERS }],
      });

      if (response.data?.createUser.message) {
        router.push(`/user?name=${encodeURIComponent(userName.trim())}`);
      }
    } catch (err) {
      console.error('Error joining journey:', err);
      setError('Бүртгэгдсэн нэр байна');
    }
  };

  return (
    <Card className="w-full max-w-sm border border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] rounded-[32px] p-2 select-none font-sans text-white">
      <CardHeader className="text-center pb-4 pt-5">
        <span className="text-[10px] font-black tracking-[0.2em] text-emerald-400/80 uppercase">
          🌿 Level Up Todo
        </span>
        <CardTitle className="text-2xl font-black text-white tracking-tight mt-1">
          Sign Up
        </CardTitle>
        <CardDescription className="text-emerald-100/60 font-medium text-xs pt-1.5">
          Үргэлжлүүлэхийн тулд нэрээ оруулна уу
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 px-5 pb-6">
        <div className="space-y-1.5">
          <Input
            value={userName}
            onChange={onChangeName}
            placeholder="Таны нэр..."
            className={`rounded-2xl bg-black/20 border-white/10 h-11 font-semibold text-white placeholder:text-stone-400 transition-all ${
              error
                ? 'border-red-400 focus-visible:ring-red-400/30'
                : 'focus-visible:border-emerald-400 focus-visible:ring-[3px] focus-visible:ring-emerald-400/20 shadow-inner'
            }`}
            autoComplete="off"
            onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
          />
          {error && (
            <p className="text-[11px] font-bold text-red-400 pl-1">{error}</p>
          )}
        </div>
        <Button
          type="button"
          className="w-full h-11 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-stone-950 font-black rounded-2xl active:scale-97 transition-all shadow-[0_4px_20px_rgba(52,211,153,0.3)] border-none cursor-pointer text-xs tracking-wide"
          disabled={mutationLoading}
          onClick={onSubmit}
        >
          {mutationLoading ? 'Бүртгэж байна...' : 'Эхлэх'}
        </Button>
        <div
          className="flex justify-center text-[10px] font-black text-emerald-200/80 hover:text-white active:scale-95 transition-all cursor-pointer tracking-[0.05em] uppercase bg-white/5 hover:bg-white/10 py-2 rounded-xl border border-white/5 shadow-sm"
          onClick={() => router.push('getUser')}
        >
          Нэвтрэх (Sign In)
        </div>
      </CardContent>
    </Card>
  );
};

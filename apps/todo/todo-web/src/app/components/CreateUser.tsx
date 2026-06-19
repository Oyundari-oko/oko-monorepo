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

      if (response.data?.createUser) {
        router.push(`/user?name=${encodeURIComponent(userName.trim())}`);
      }
    } catch (err) {
      console.error('Error joining journey:', err);
      setError('Бүртгэгдсэн нэр байна');
    }
  };

  return (
    <Card className="w-full max-w-sm border-none bg-white/70 backdrop-blur-md shadow-2xl shadow-stone-300/40 rounded-3xl p-2 select-none font-sans">
      <CardHeader className="text-center pb-4">
        <span className="text-[10px] font-bold tracking-widest text-stone-400 uppercase">
          Join the Journey
        </span>
        <CardTitle className="text-2xl font-black text-stone-800 tracking-tight mt-1">
          Sign Up
        </CardTitle>
        <CardDescription className="text-stone-500 font-medium text-xs pt-2">
          Үргэлжлүүлэхийн тулд нэрээ оруулна уу
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 px-5 pb-5">
        <div className="space-y-1.5">
          <Input
            value={userName}
            onChange={onChangeName}
            placeholder="Таны нэр..."
            className={`rounded-2xl bg-white/80 h-11 font-medium text-stone-700 transition-all ${
              error
                ? 'border-red-400 focus-visible:ring-red-400'
                : 'border-stone-200/60 focus-visible:ring-emerald-500'
            }`}
            autoComplete="off"
            onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
          />
          {error && (
            <p className="text-[11px] font-semibold text-red-500 pl-1 animate-in fade-in-50 slide-in-from-top-1 duration-200">
              {error}
            </p>
          )}
        </div>

        <Button
          type="button"
          className="w-full h-11 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-2xl active:scale-98 transition-all shadow-md cursor-pointer"
          disabled={mutationLoading}
          onClick={onSubmit}
        >
          {mutationLoading ? 'Бүртгэж байна...' : 'Эхлэх'}
        </Button>

        <div
          className="flex justify-center pt-1 text-xs font-bold text-stone-400 hover:text-emerald-800 transition-colors cursor-pointer tracking-wide uppercase"
          onClick={() => router.push('getUser')}
        >
          Нэвтрэх (Sign In)
        </div>
      </CardContent>
    </Card>
  );
};

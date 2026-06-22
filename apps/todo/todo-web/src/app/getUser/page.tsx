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
import { GET_USERS } from '../graphql/user';
import { useRouter } from 'next/navigation';
import { useLazyQuery } from '@apollo/client/react';

const GetUser = () => {
  const router = useRouter();
  const [userName, setUserName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [getUsersQuery, { loading: userLoading }] = useLazyQuery(GET_USERS);

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
      const { data } = await getUsersQuery();
      const allUsers = (data as any)?.getUsers || [];

      const userExists = allUsers.find(
        (user: any) =>
          user.name.toLowerCase() === userName.trim().toLowerCase(),
      );

      if (userExists) {
        router.push(`/user?name=${encodeURIComponent(userName.trim())}`);
      } else {
        setError('Уучлаарай, ийм нэртэй хэрэглэгч олдсонгүй!');
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      setError('Системийн алдаа гарлаа. Дараа дахин оролдоно уу.');
    }
  };

  return (
    <div className="flex h-screen w-full justify-center items-center bg-gradient-to-br from-stone-900 via-emerald-950 to-teal-900 p-4 select-none font-sans text-white">
      <Card className="w-full max-w-sm border border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] rounded-[32px] p-2 text-white animate-in fade-in zoom-in-95 duration-500">
        <CardHeader className="text-center pb-4 pt-5">
          <span className="text-[10px] font-black tracking-[0.2em] text-emerald-400/80 uppercase">
            🌿 Welcome Back
          </span>
          <CardTitle className="text-2xl font-black text-white tracking-tight mt-1">
            Sign In
          </CardTitle>
          <CardDescription className="text-emerald-100/60 font-medium text-xs pt-1.5">
            Нэвтрэхийн тулд бүртгэлтэй нэрээ оруулна уу
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
              <p className="text-[11px] font-bold text-red-400 pl-1 animate-in fade-in-50 slide-in-from-top-1 duration-200">
                {error}
              </p>
            )}
          </div>
          <Button
            type="button"
            className="w-full h-11 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-stone-950 font-black rounded-2xl active:scale-97 transition-all shadow-[0_4px_20px_rgba(52,211,153,0.3)] border-none cursor-pointer text-xs tracking-wide"
            disabled={userLoading}
            onClick={onSubmit}
          >
            {userLoading ? 'Хайж байна...' : 'Нэвтрэх'}
          </Button>
          <div
            className="flex justify-center text-[10px] font-black text-emerald-200/80 hover:text-white active:scale-95 transition-all cursor-pointer tracking-[0.05em] uppercase bg-white/5 hover:bg-white/10 py-2 rounded-xl border border-white/5 shadow-sm"
            onClick={() => router.push('./')}
          >
            Бүртгүүлэх (Sign Up)
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GetUser;

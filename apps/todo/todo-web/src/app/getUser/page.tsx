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
      const allUsers = data?.getUsers || [];

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
    <div
      className="flex h-screen justify-center items-center p-4 select-none font-sans"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/736x/df/4e/95/df4e9590e7672a7fb489a66a02d45f60.jpg')",
      }}
    >
      <Card className="w-full max-w-sm border-none bg-white/70 backdrop-blur-md shadow-2xl shadow-stone-300/40 rounded-3xl p-2">
        <CardHeader className="text-center pb-4">
          <span className="text-[10px] font-bold tracking-widest text-stone-400 uppercase">
            Welcome Back
          </span>
          <CardTitle className="text-2xl font-black text-stone-800 tracking-tight mt-1">
            Sign In
          </CardTitle>
          <CardDescription className="text-stone-500 font-medium text-xs pt-2">
            Нэвтрэхийн тулд бүртгэлтэй нэрээ оруулна уу
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
            disabled={userLoading}
            onClick={onSubmit}
          >
            {userLoading ? 'Хайж байна...' : 'Нэвтрэх'}
          </Button>

          <div
            className="flex justify-center pt-1 text-xs font-bold text-stone-400 hover:text-emerald-800 transition-colors cursor-pointer tracking-wide uppercase"
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

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { GetUser } from '../components/GetUser';
import { GET_USERS } from '../graphql/user';
import { useQuery } from '@apollo/client/react';

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const userName = searchParams.get('name') || '';

  const { data, loading, error } = useQuery(GET_USERS);

  const redirectToHome = () => {
    router.push('/');
  };

  if (loading)
    return (
      <div
        className="h-screen flex justify-center items-center font-sans font-extrabold"
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/736x/df/4e/95/df4e9590e7672a7fb489a66a02d45f60.jpg')",
        }}
      >
        Уншиж байна...
      </div>
    );
  if (error)
    return (
      <div className="h-screen bg-[#B2D1D7] flex justify-center items-center text-red-500">
        Алдаа: {error.message}
      </div>
    );

  const currentUser = data?.getUsers?.find(
    (user: any) => user.name.toLowerCase() === userName.toLowerCase(),
  );

  return (
    <div
      className=" h-screen w-screen flex flex-col justify-center items-center p-4 relative"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/736x/df/4e/95/df4e9590e7672a7fb489a66a02d45f60.jpg')",
      }}
    >
      {currentUser ? (
        <GetUser user={currentUser} onSignOut={redirectToHome} />
      ) : (
        <div className="text-center text-slate-700 bg-white p-6 rounded-lg shadow">
          <p className="mb-4">
            {userName
              ? `"${userName}" нэртэй хэрэглэгч олдсонгүй.`
              : 'Нэвтэрсэн хэрэглэгчийн мэдээлэл алга.'}
          </p>
          <button
            className="bg-slate-800 text-white px-4 py-2 rounded text-sm"
            onClick={redirectToHome}
          >
            Нэвтрэх хэсэг рүү очих
          </button>
        </div>
      )}
    </div>
  );
};

export default Page;

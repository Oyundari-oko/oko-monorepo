'use client';

import { useQuery } from '@apollo/client/react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react'; 
import { GET_USERS } from '../graphql/user';
import { GetUser } from '../components/GetUser';

function UserContent() {
  const searchParams = useSearchParams();
  const userName = searchParams.get('name') || '';

  const { data, loading, error } = useQuery<{ getUsers: any[] }>(GET_USERS, {
    skip: !userName,
  });

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center font-sans text-stone-500 font-medium">
        Уншиж байна...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center font-sans text-red-500 font-medium">
        Алдаа гарлаа: {error.message}
      </div>
    );
  }

  const currentUser = data?.getUsers?.find(
    (user: any) => user.name.toLowerCase() === userName.toLowerCase(),
  );

  if (!currentUser) {
    return (
      <div className="flex h-screen items-center justify-center font-sans text-stone-500 font-medium">
        Хэрэглэгч олдсонгүй.
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-stone-50">
      <GetUser
        user={currentUser}
        onSignOut={() => {
          window.location.href = '/';
        }}
      />
    </div>
  );
}
export default function UserPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center font-sans text-stone-500 font-medium">
          Аппликейшн ачаалж байна...
        </div>
      }
    >
      <UserContent />
    </Suspense>
  );
}

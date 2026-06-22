import { CreateUser } from './components/CreateUser';

const Page = () => {
  return (
    <div className="flex justify-center items-center h-screen w-full bg-gradient-to-br from-stone-900 via-emerald-950 to-teal-900">
      <div className="w-full flex justify-center px-4 animate-in fade-in duration-500">
        <CreateUser />
      </div>
    </div>
  );
};

export default Page;

import { CreateUser } from './components/CreateUser';

const Page = () => {
  return (
    <div
      className="flex justify-center items-center h-screen "
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/736x/df/4e/95/df4e9590e7672a7fb489a66a02d45f60.jpg')",
      }}
    >
      <CreateUser></CreateUser>
    </div>
  );
};
export default Page;

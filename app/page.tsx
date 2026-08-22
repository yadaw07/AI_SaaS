import { auth } from '@clerk/nextjs/server';

import Link from 'next/link';

import { LogIn } from 'lucide-react';

import { Button } from '@/components/ui/button';
import FileUpload from '@/components/FileUpload';
import { Header } from '@/components/Header';

export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;

  return (
    <div className='w-screen min-h-screen bg-linear-to-r from-rose-100 to-teal-100'>
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <div className='flex flex-col items-center text-center'>
          <Header />

          <div className='flex mt-2'>
            {isAuth && <Button>Go to Chats</Button>}
          </div>

          <p className='max-w-xl mt-1 text-lg text-slate-600'>
            Join millions of students, researchers and professionals to
            instantly answer questions and understand research with AI
          </p>

          <div className='w-full mt-4'>
            {isAuth ? (
              <FileUpload />
            ) : (
              <Link href='/sign-in'>
                <Button>
                  Login to Get Started!
                  <LogIn className='h-4 w-4 ml-2' />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

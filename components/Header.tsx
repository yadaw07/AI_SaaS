'use client';

import { UserButton, Show } from '@clerk/nextjs';

export const Header = () => {
  return (
    <div className='flex items-center'>
      <h1 className='mr-3 text-5xl font-semibold'>Chat with any PDF</h1>
      <Show when='signed-in'>
        <UserButton />
      </Show>
    </div>
  );
};

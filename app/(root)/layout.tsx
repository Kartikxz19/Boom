import StreamVideoProvider from '@/providers/StreamClientProvider';
import { Metadata } from 'next';
import React, { ReactNode } from 'react'
export const metadata: Metadata = {
  title: "BOOM",
  description: "Video calling app inspired by zoom, built using nextjs, stream, clerk, typescript and tailwind",
  icons:{
    icon:'/icons/logo.svg'
  }
};
const RootLayout = ({children}:{children:ReactNode}) => {
  return (
    <main>
      <StreamVideoProvider>
        {children}
        </StreamVideoProvider>
    </main>
  )
}

export default RootLayout;

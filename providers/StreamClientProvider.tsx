'use client';
import { tokenProvider } from '@/actions/stream.actions';
import Loader from '@/components/Loader';
import { useUser } from '@clerk/nextjs';
import {
    StreamVideo,
    StreamVideoClient,
    User,
  } from '@stream-io/video-react-sdk';
import { ReactNode, useEffect, useState } from 'react';
  
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
  const userId = 'user-id';
  const token = 'authentication-token';
  const user: User = { id: userId };
  
/*   const client = new StreamVideoClient({ apiKey, user, token });
  const call = client.call('default', 'my-first-call');
  call.join({ create: true }); */
  
const StreamVideoProvider = ({children}:{children:ReactNode}) => {
    //creating a video client that is needed to connect to Steam video servers
    //but who does that client belong to ? The current logged in user
    const [videoClient, setvideoClient] = useState<StreamVideoClient>();
    //we get the current logged in user via Clerk's useUser hook
    const {user,isLoaded}=useUser();
    //whenever the current user changes, we create a new videoclient for that user
    useEffect(() => {
        if(!isLoaded|| !user) return;
        if(!apiKey) throw new Error('Stream api key missing ! ');
        //clreating a client to access stream servers everytime a new user logs in
        const client =new StreamVideoClient({
            apiKey,
            user:{
                id:user?.id,
                name:user?.username||user?.id,
                image:user?.imageUrl
            },
            tokenProvider,
        })
        setvideoClient(client);
    }, [user,isLoaded]);
    //useEffect runs on component mounting but even before that <StreamVideo></StreamVideo> will try to access the videoClient state which will be undefined at that point.
    //To make sure <StreamVideo></StreamVideo> is not rendered before useEffect runs, we render  a loader component that will be returned instead.
    if(!videoClient) return <Loader/>;
    return (
      <StreamVideo client={videoClient}>
        {/* StreamVideo will wrap around other pages thus, it needs to show that there will be children inside it who can access streamVideo's features */}
        {children}
      </StreamVideo>
    );
  };
  export default StreamVideoProvider
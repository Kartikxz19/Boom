'use client';
import Loader from '@/components/Loader';
import MeetingRoom from '@/components/MeetingRoom';
import MeetingSetup from '@/components/MeetingSetup';
import {useGetCallByID} from '@/hooks/useGetCallByID';
import { useUser } from '@clerk/nextjs'
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import React, { useState } from 'react'
import { useParams } from 'next/navigation';

const Meeting = () => {
  const { id } = useParams();
  const {call,isCallLoading}=useGetCallByID(id);//get call deets using the id in the custom hook we created
  const {user,isLoaded}=useUser();//get user details from clerk
  const [isSetupComplete, setisSetupComplete] = useState(false);//if video room setup is complete show the actual meeting room, otherwise show meeting setup
  if(!isLoaded||isCallLoading)
    {
      /* if(!isLoaded)console.log("Not loaded")
      if(!isCallLoading)console.log("Not call loading") */
      //if user details or call details are not fetched yet, show a loading bar
      return <Loader/>
    }
  return (
    <main className='h-screen w-full'>
      {/* Stream call is given call details as which call to setup using our custom hook */}
      <StreamCall call={call}>
        <StreamTheme>
         {!isSetupComplete?(<MeetingSetup setisSetupComplete={setisSetupComplete}/>):(<MeetingRoom/>)}
        </StreamTheme>
      </StreamCall>
    </main>
  )
}

export default Meeting

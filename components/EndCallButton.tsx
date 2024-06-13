'use client'
import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk'
import React from 'react'
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

const EndCallButton = () => {
    const router=useRouter();
    const call=useCall();
    const {useLocalParticipant}=useCallStateHooks();//using this you can access all the call state hooks
    const localParticipant=useLocalParticipant();//A hook which provides a StreamVideoLocalParticipant object. It signals that I have joined a call.
    const isMeetingOwner=localParticipant && call?.state.createdBy && localParticipant.userId===call.state.createdBy.id;

    if(!isMeetingOwner) return null;

  return (
   <Button onClick={async()=>{
        await call.endCall()
        router.push('/')
        }} className='bg-red-500 text-white'>
            End call for everyone
   </Button>
  )
}

export default EndCallButton

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from '@/lib/utils';
import { CallControls, CallParticipantsList, CallStatsButton, CallingState, PaginatedGridLayout, SpeakerLayout, useCallStateHooks } from '@stream-io/video-react-sdk';
import { LayoutList, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from 'react'
import EndCallButton from "./EndCallButton";
import Loader from "./Loader";
type callLayoutType='grid' | 'speaker-left' | 'speaker-right'
const MeetingRoom = () => {
  const router=useRouter();
  //if search prameters have /meeting/id?perosnal=true
  // then 'personal' =>!'personal'= false=>!false=true
  // undefined => !undefined=true => !true=false
  const searchParams=useSearchParams();
  const isPersonalRoom=!!searchParams.get('personal');
  //the layout which user chooses
  const [layout, setLayout] = useState('speaker-left');
  //render the specific layout as per layout state
  const CallLayout=()=>{
    switch (layout) {
      case 'grid':
        return <PaginatedGridLayout/>
      case 'speaker-right':
        return <SpeakerLayout participantsBarPosition="left"/>
      default:
        return <SpeakerLayout participantsBarPosition='right'/>
    }
  }
  const [showParticipants, setshowParticipants] = useState(false);

  const {useCallCallingState}=useCallStateHooks();
  const callingState=useCallCallingState();
  //call join krne ke baad the time before actually entering the room, we can show a loader bar
  if(callingState!==CallingState.JOINED)
  {
    return <Loader/>
  }
  
  return (
    <section className='relative h-screen w-full overflow-hidden pt-4 text-white'>
      <div className='relative flex size-full items-center justify-center '>
        <div className='flex size-full max-w-[1000px] items-center'>
          <CallLayout/>
        </div>
        {/* to show participants */}
        <div className={cn('h-[calc(100vh-86px)] hidden ml-2',{'show-block':showParticipants})}>
          <CallParticipantsList onClose={()=>setshowParticipants(false)}/>
        </div>
      </div>
      <div className="fixed bottom-0 flex w-full items-center justify-center gap-5 flex-wrap">
        <CallControls onLeave={()=>{router.push('/')}}/>
        <DropdownMenu>

        <div className="flex items-center">
          <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
            <LayoutList size={20} className="text-white"/>
          </DropdownMenuTrigger>
        </div>
        
        <DropdownMenuContent className="border-dark-1 bg-dark-2 text-white">

          {['Grid','Speaker-Left','Speaker-Right'].map((item,index)=>(
            <div key={index}>
              <DropdownMenuItem className="cursor-pointer" onClick={()=>{setLayout(item.toLowerCase() as callLayoutType)}}>
                {item}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="border-dark-1" />
            </div>
          ))}

          

        </DropdownMenuContent>
      </DropdownMenu>
      <CallStatsButton/>
      <button onClick={()=>setshowParticipants
      (
        (prev)=>!prev
      )}>
        <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
          <Users size={20} className="text-white"/>
        </div>

      </button>
      {!isPersonalRoom&& <EndCallButton/>}
      </div>
    </section>
  )
}

export default MeetingRoom

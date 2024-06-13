'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation'
import MeetingModal from './MeetingModal'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useUser } from '@clerk/nextjs'
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from './ui/textarea'
import ReactDatePicker from 'react-datepicker'
import { Input } from './ui/input'
const MeetingTypeList = () => {
    const router=useRouter();
    const [meetingState, setMeetingState] = useState<'isScheduleMeeting'|'isJoinMeeting'|'isInstantMeeting'|undefined>();
    const {user}= useUser();
    const client=useStreamVideoClient();
    const [values, setValues] = useState({
      dateTime:new Date(),
      description:'',
      link:''
    });
    const [callDetails, setCallDetails] = useState<Call>();
    const { toast } = useToast()
    const createMeeting=async ()=>{
      if(!client||!user) return;
      try {
        if(!values.dateTime)//important when scheduling a meeting, we explicitly need from the user a specified date and time
        {
            toast({
                title: 'Please specify a date and time for the meeting',
            })
            return;
        }
        //generate a random ID for the new meeting call
        //for even that  we have a LIBRARY !
        const id=crypto.randomUUID();
        const call=client.call('default',id);
        if(!call) throw new Error('Meeting creation Failed');
        //get the time , the meeting starts at
        const startAt= values.dateTime.toISOString() || new Date(Date.now()).toISOString();
        //get desription of meeting
        const description=values.description || 'Instant meeting';
        await call.getOrCreate({
          data:{
            starts_at:startAt,
            custom:{
              description
            }
          }
        })
        //after creating the above call, we need to set it to the state
        //so that we can use it later to join the meeting
        setCallDetails(call);
        if(!values.description)//if it is an Instant meeting, then there would be no description(description provided only in case of schedule Meeting)
        {
            router.push(`/meeting/${call.id}`);
        }
        toast({
            title:"Meeting created Successfully",
            description:"Refer to meeting id: "+call.id
        })
      } catch (error) {
        console.log(error);
        toast({
            title:"Failed to Initialise a meeting.",
            description: "Something went wrong. Please try again later"
        })
      }
    }
    const meetingLink=`${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`;
    return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
        <HomeCard 
            img="/icons/add-meeting.svg"
            title="New Meeting"
            description="Start an instant meeting"
            handleClick={()=>{setMeetingState('isInstantMeeting')}}
            className="bg-orange-1"/>
        <HomeCard
            img="/icons/schedule.svg"
            title="Schedule Meeting"
            description="Plan your meeting"
            handleClick={()=>{setMeetingState('isScheduleMeeting')}}
            className="bg-blue-1"/>
        <HomeCard
            img="/icons/join-meeting.svg"
            title="Join Meeting"
            description="vis invitation link"
            handleClick={()=>{setMeetingState('isJoinMeeting')}}
            className="bg-purple-1"/>
        <HomeCard
            img="/icons/recordings.svg"
            title="View Recordings"
            description="Checkout Your Recordings"
            handleClick={()=>{router.push('/recordings')}}
            className="bg-yellow-1"/>

        {/* callDetails not exits show this modal, else show a different modal */}    
        {!callDetails ? (
          <MeetingModal
          isOpen={meetingState==='isScheduleMeeting'}
          onClose={()=>setMeetingState(undefined)}
          title="Create a Meeting"
          handleClick={createMeeting}
          className=''
          >
            <div className='flex flex-col gap-2.5'>
                <label className='text-base text-normal leading-[22px] text-sky-2'>Add a description</label>
                <Textarea className='border-none bg-dark-1 focus-visible:ring-0 focus-visible:ring-offset-0'
                  onChange={(e)=>{
                    setValues({...values,description:e.target.value})
                  }}/>     
            </div>
            <div className='flex w-full flex-col gap-2.5'>
              <label className='text-base text-normal leading-[22px] text-sky-2'>Select date and time</label>
              <ReactDatePicker 
                selected={values.dateTime}
                onChange={(date)=>setValues({...values,dateTime:date!})}
                showTimeSelect
                timeFormat='HH:mm'
                timeIntervals={15}
                timeCaption='time'
                dateFormat="MMMM d, yyyy h:mm aa"
                className='w-full rounded bg-dark-1 p-2 focus:outline-none'/>
            </div>
      </MeetingModal>
        ): (
          <MeetingModal
            isOpen={meetingState==='isScheduleMeeting'}
            onClose={()=>setMeetingState(undefined)}
            title="Meeting Created"
            className="text-center"
            buttonText="Copy Meeting Link"
            handleClick={()=>{
              navigator.clipboard.writeText(meetingLink);
              toast({title:'Link Copied'});
            }}
            image='/icons/checked.svg'
            buttonIcon='/icons/copy.svg'

        />
        )}
        <MeetingModal
            isOpen={meetingState==='isInstantMeeting'}
            onClose={()=>setMeetingState(undefined)}
            title="Start an Instant Meeting"
            className="text-center"
            buttonText="Start Meeting"
            handleClick={createMeeting}
        />
        <MeetingModal
            isOpen={meetingState==='isJoinMeeting'}
            onClose={()=>setMeetingState(undefined)}
            title="Type the link here"
            className="text-center"
            buttonText="Join Meeting"
            handleClick={()=>{router.push(values.link)}}
        >
          <Input placeholder='Meeting link' className='border-none bg-dark-1 focus-visible:ring-0 focus-visible:ring-offset-0' onChange={(e)=>{setValues({...values,link:e.target.value})}}/>
        </MeetingModal>
    </section>
  )
}

export default MeetingTypeList

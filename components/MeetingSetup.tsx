'use client'
import { DeviceSettings, VideoPreview, useCall } from '@stream-io/video-react-sdk'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';

const MeetingSetup = ({setisSetupComplete}:{setisSetupComplete:(value:boolean)=>void}) => {
    const [isMicCamToggledOn, setisMicCamToggledOn] = useState(false);
    const call=useCall();//because we provided the streamCall wrapper, a call instance
    if (!call) {
        throw new Error(
          'useStreamCall must be used within a StreamCall component.',
        );
      }
    useEffect(() => {
        if(isMicCamToggledOn)
            {
                call.camera.disable();
                call.microphone.disable();
            }
        else
        {
            //enable camera and mic 
            call.camera.enable();
            call.microphone.enable();
        }

    }, [isMicCamToggledOn,call.camera,call.microphone]);
  return (
    <div className='flex h-screen w-full flex-col items-center justify-center gap-3 text-white'>
    <h1 className="text-xl font-bold">Setup</h1>
    {/* Here we render a prebuilt component by stream sdk */}
    <VideoPreview/>
    <div className="flex items-center justify-center gap-3">
        <label className="flex items-center justify-center gap-2 font-medium">
            <input type="checkbox"
            checked={isMicCamToggledOn}
            onChange={(e)=>{setisMicCamToggledOn(e.target.checked)}} />
            Join with mic and camera off
        </label>
        <DeviceSettings/>
    </div>
    <Button className='rounded-md bg-green-500 px-4 py-2.5 text-white hover:text-black' onClick={()=>{
        //you click on join meeting and we set setisSetupComplete = true so that parent page knows that meeting setup is completed
        setisSetupComplete(true);
        call.join();
    }}>
        Join Meeting
    </Button>
    </div>
  )
}

export default MeetingSetup

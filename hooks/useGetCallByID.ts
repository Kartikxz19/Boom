
import { useEffect, useState } from 'react';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useToast } from "@/components/ui/use-toast"
///custom hook to get details a call/meeting using the call id
//Thing is, in your app, multiple calls might be going on concurrently, so If a person has the id of a call, then we have to find out, which call is he refering to
export const useGetCallByID = (id: string | string[]) => {
  const { toast } = useToast();
  const [call, setCall] = useState<Call>();
  const [isCallLoading, setIsCallLoading] = useState(true);
  const client = useStreamVideoClient();
    console.log("ID is : ",id,"\nClient : ",client);
  useEffect(() => {//everytime user(and thus client) changes, we need to establish a websocket connection using useStreamVideoClient, then fetch the avialble calls and see if the id provided actually refers to a call or not.
    console.log("Client or ID changed:", client, id);

    if (!client || !id) {
      toast({
        title:"Client or ID is not available yet."
      })
      console.log("Client or ID is not available yet.");
      return;
    }

    const loadCall = async () => {
      try {
        //query all calls available using id
        // https://getstream.io/video/docs/react/guides/querying-calls/#filters
        const { calls } = await client.queryCalls({ filter_conditions: { id } });

        if (calls.length > 0) {
          setCall(calls[0]);
        } else {
          toast({
            title:"No calls found"
          })
          console.log("No calls found");
        }

        setIsCallLoading(false);
      } catch (error) {
        toast({
          title:"Error loading call: "
        })
        console.error("Error loading call:", error);
        setIsCallLoading(false);
      }
    };

    loadCall();
  },[client,id]);

  return { call, isCallLoading };//these parameters will be used by the meetingsetup to determine whther we got the required call from id or not
};


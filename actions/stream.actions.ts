"use server";
import { StreamClient } from '@stream-io/node-sdk';
import { currentUser } from "@clerk/nextjs/server";

//A strict server side file to access secret keys and do stuff without exposing them to the client side for hackers.
const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret=process.env.STREAM_SECRET_KEY;
//here we will create a token provider for the current user. Basically we hand over a token to the current user, which he shows to Stream server and he gets access to create calls, attend meetings etc.
//Note: This is a strict server compnent, nothing related to React will be imported here. Only nodejs packages will be used

export const tokenProvider=async()=>{
    //take out current user via clerk
    const user=await currentUser();

    if(!user) throw new Error('User is not logged in');
    if(!apiKey) throw new Error('No API key');
    if(!apiSecret) throw new Error('No API Secret');
    
    //now to create a new stream CLient for this user, we cannot access the streamClient from Stream/React-SDK because that would make thhis file client side as well.
    //normally to do such a thing, you need to spin up a nodejs+express server and then do it. But in nextjs we can simply use all that by just write "use server" at top.
    //Go to stream Docs and choose simple API instead of React docs, there you will find a package to be installed for nodejs applications: npm install @stream-io/node-sdk
    const client=new StreamClient(apiKey,apiSecret);

    //Now that we have a client, we can create tokens for this user
    //Tokens need to be generated server-side. Typically, you integrate this into the part of your codebase where you log in or register users. The tokens provide a way to authenticate a user or give access to a specific set of video/audio calls.
    //Lets define an expiration date for the token:
    const exp = Math.round(new Date().getTime() / 1000) + 60 * 60;//token valid for 1 hr from now

    const issuedTime=Math.floor(Date.now()/1000-60);
    //token creation needs user id expiration date and issuedTime(optional, now if it is not not given it automatically sets the time=current system's time)
    const token=client.createToken(user.id,exp,issuedTime);
    return token;
}
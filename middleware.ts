import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
//declare routes which cannot be accessed without login first
const protectedRoutes=createRouteMatcher([
  '/',
  '/upcoming',
  '/previous',
  '/recordings',
  '/personal-room',
  '/meeting(.*)'

])
//callback function for the same

export default clerkMiddleware((auth,req)=>{
  if(protectedRoutes(req)){
    //if trying to access protected route
    auth().protect();
  }
  
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
import React,{useState} from 'react'
import bannerImg from '../assets/don.jpg'
const Banner = () => {

   const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
   <div className="relative  h-screen overflow-hidden">
      
   {/* Background illustration (optional image or vector) */}
   <div className="absolute inset-0">
     <img
       src={bannerImg} 
       alt="Banner Background"
       className="object-cover w-full h-full"
     />
   </div>

   {/* Overlay for tinting or coloring effect */}
   <div className="absolute inset-0 opacity-50 bg-green-200"></div>
   
   {/* Centered Content */}
   <div className="relative flex flex-col justify-center items-center h-full text-center z-10">
     <h1 className="text-4xl font-bold text-black-800">
       Together we can make a difference
     </h1>
     <p className="mt-4 text-gray-700 text-2xl  font-bold">
       Your home for help
     </p>
   
         {!isLoggedIn && (
              <div className="mt-10 space-x-4">
            <button className="bg-green-600 text-white px-7 py-4 rounded-lg hover:bg-green-700 ">
              Register Now
            </button>
            </div>
            )}
         
   </div>
 </div>
  )
}

export default Banner

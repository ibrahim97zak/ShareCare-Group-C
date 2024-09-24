import React from 'react'

const ProgressBar = ({ quantity, total }) => {
   const progress = Math.min((quantity / total) * 100, 100);
 
   return (
     <div className="my-2">
       <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
         {/* Filled progress bar */}
         <div
           className="absolute top-0 left-0 h-full bg-green-500 transition-all"
           style={{ width: `${progress}%` }}
         ></div>
       </div>
       <p className="mt-1 text-sm text-gray-600">
         {quantity} / {total} items donated
       </p>
     </div>
   );
 };
 

export default ProgressBar

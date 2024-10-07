import React from 'react'

const Footer = () => {
  return (
   <footer className="bg-green-600 text-white py-8">
   <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-8 justify-items-center items-center">
     {/* About Section */}
     <div>
       <h2 className="text-xl font-semibold mb-4">About Us</h2>
       <p className="text-white">
         We are dedicated to making donations accessible and impactful by connecting donors with those in need. 
         Every small contribution can make a big difference.
       </p>
     </div>

     {/* Quick Links */}
     <div>
       <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
       <ul>
         <li><a href="/" className="text-white hover:text-gray-300">Home</a></li>
         <li><a href="#" className="text-white hover:text-gray-300">Donate</a></li>
         <li><a href="#" className="text-white hover:text-gray-300">Request Help</a></li>
      
       </ul>
     </div>

     {/* Contact Section */}
     <div>
       <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
       <ul>
         <li className="text-white">Email: support@donations.com</li>
         <li className="text-white">Phone: +970 594567890</li>
         <li className="text-white">Address: 123 Nablus St, Palestine, PS</li>
       </ul>
     </div>

     {/* Social Media Links */}
     <div>
       <h2 className="text-xl font-semibold mb-4">Follow Us</h2>
       <ul className="flex space-x-4">
         <li>
           <a href="#" className="text-white hover:text-gray-300">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
               <path d="M22.54 6.42a8.33 8.33 0 0 1-2.36.65 4.15 4.15 0 0 0 1.82-2.29 8.3 8.3 0 0 1-2.63 1A4.15 4.15 0 0 0 16 4.75c-2.29 0-4.15 1.86-4.15 4.16 0 .33.04.66.11.98A11.77 11.77 0 0 1 3.17 5.1 4.13 4.13 0 0 0 2.7 7.78c0 1.44.73 2.7 1.84 3.44a4.15 4.15 0 0 1-1.88-.52v.05c0 2.02 1.44 3.71 3.34 4.09a4.14 4.14 0 0 1-1.87.07 4.16 4.16 0 0 0 3.88 2.88A8.33 8.33 0 0 1 2 19.83a11.77 11.77 0 0 0 6.38 1.87c7.65 0 11.84-6.34 11.84-11.83l-.01-.54a8.38 8.38 0 0 0 2.05-2.14z" />
             </svg>
           </a>
         </li>
         <li>
           <a href="#" className="text-white hover:text-gray-300">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
               <path d="M12 2.04c-5.51 0-9.96 4.45-9.96 9.96 0 4.39 2.83 8.09 6.76 9.42v-6.67H6.95V12h2.85v-1.81c0-2.82 1.67-4.36 4.23-4.36 1.23 0 2.51.22 2.51.22v2.77h-1.41c-1.39 0-1.82.87-1.82 1.76V12h3.12l-.5 2.75h-2.62v6.67a9.95 9.95 0 0 0 6.74-9.42c0-5.51-4.45-9.96-9.96-9.96z" />
             </svg>
           </a>
         </li>
        
       </ul>
     </div>
   </div>

   {/* Footer Bottom */}
   <div className="text-center text-white mt-8">
     <p>&copy; {new Date().getFullYear()} Donations Platform. All rights reserved.</p>
   </div>
 </footer>
  )
}

export default Footer

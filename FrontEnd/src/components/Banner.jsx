import React, { useState, useEffect, useRef } from "react";
import bannerImg from "../assets/don.webp"; // Use WebP format if available
import { useUserContext } from "../context/UserProvider";

const Banner = React.memo(() => {
  const { isLoggedIn } = useUserContext();
  const [imageLoaded, setImageLoaded] = useState(false);
  const bannerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setImageLoaded(true); // Load image when close to viewport
        }
      },
      { threshold: 0.1 } // Load when 10% of banner is visible
    );

    if (bannerRef.current) {
      observer.observe(bannerRef.current);
    }

    return () => {
      if (bannerRef.current) {
        observer.unobserve(bannerRef.current);
      }
    };
  }, []);

  return (
    <div ref={bannerRef} className="relative h-screen overflow-hidden">
      {/* Background Image (loads only if imageLoaded is true) */}
      {imageLoaded && (
        <div className="absolute inset-0">
          <img
            src={bannerImg}
            alt="Banner Background"
            className="object-cover w-full h-full"
            loading="lazy" // Native lazy loading for extra support
          />
        </div>
      )}

      {/* Overlay for tinting or coloring effect */}
      <div className="absolute inset-0 opacity-50 bg-green-200"></div>

      {/* Centered Content */}
      <div className="relative flex flex-col justify-center items-center h-full text-center z-0">
        <h1 className="text-4xl font-bold text-black-800">
          Together we can make a difference
        </h1>
        <p className="mt-4 text-gray-700 text-2xl font-bold">
          Your home for help
        </p>

        {!isLoggedIn && (
          <div className="mt-10 space-x-4">
            <a
              href="/signUp"
              className="bg-green-600 text-white px-7 py-4 rounded-lg hover:bg-green-700"
            >
              Register Now
            </a>
          </div>
        )}
      </div>
    </div>
  );
});

// Set displayName for better debugging
Banner.displayName = "Banner";

export default Banner;


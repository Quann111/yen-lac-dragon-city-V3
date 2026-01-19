import React, { useEffect, Suspense, lazy } from 'react';
import HeroSection from './HeroSection';
import ArchitectureSection from './ArchitectureSection';
import CollectionSection from './CollectionSection';
import AmenitiesSection from './AmenitiesSection';
import ContactSection from './ContactSection';

// Lazy load LocationSection to split Leaflet library
const LocationSection = lazy(() => import('./LocationSection'));

interface HomePageProps {
  isDarkMode: boolean;
}

const HomePage: React.FC<HomePageProps> = ({ isDarkMode }) => {
  // Intersection Observer for Reveal Animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // Only animate once
        }
      });
    }, observerOptions);

    // Small delay to ensure DOM is ready
    setTimeout(() => {
      const elements = document.querySelectorAll('.reveal-on-scroll');
      elements.forEach(el => observer.observe(el));
    }, 100);

    return () => observer.disconnect();
  }, [isDarkMode]);

  return (
    <>
      <div id="home"><HeroSection /></div>
      <div id="architecture"><ArchitectureSection /></div>
      <div id="collection"><CollectionSection /></div>
      <div id="amenities"><AmenitiesSection /></div>
      <div id="location">
        <Suspense fallback={<div className="h-[500px] w-full bg-gray-100 dark:bg-navy-900 animate-pulse flex items-center justify-center text-gray-400 dark:text-gray-600">Loading Map...</div>}>
          <LocationSection />
        </Suspense>
      </div>
      <div id="contact"><ContactSection /></div>
    </>
  );
};

export default HomePage;

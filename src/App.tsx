// HOOD BOYZ - official website
// This is the main file that controls the layout and background of the website
import React from 'react';
import logo from './assets/logo.svg';
// BACKGROUND IMAGE: The main background image
import bgImage from './assets/IMG_0854_50.jpg';
import boltLogo from './assets/made-in-bolt.png';
// MUSIC FILE: Change the filename below to use a different song
// Your audio file should be MP3 format and saved in src/assets/ folder
import audioFile from './assets/Challenge_Completed_no_lead_variation_MP3.mp3';
import { SocialLinks } from './components/SocialLinks';
import { ActionLinks } from './components/ActionLinks';
import { AudioControl } from './components/AudioControl';
import { ConfettiEffect } from './components/ConfettiEffect';
import { MerchandiseSection } from './components/MerchandiseSection';

function App() {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  
  // Check if device is mobile (this controls different layouts for phones vs computers)
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Confetti effect setup (the fun animation when you click the logo on desktop)
  const confettiEffect = ConfettiEffect({
    onTrigger: () => {
      console.log('Confetti triggered!');
    }
  });
  
  // Handle logo click (triggers confetti on desktop only)
  const handleClick = () => {
    if (!isMobile) {
      confettiEffect.triggerConfetti();
    }
  };
  
  // Handle mouse hover effects (only works on desktop, not mobile)
  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsHovered(true);
    }
  };
  
  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsHovered(false);
    }
  };

  return (
    <div 
      className="relative min-h-screen max-h-screen flex items-center justify-center overflow-hidden"
      style={{
        filter: (isHovered && !isMobile) ? 'grayscale(50%)' : 'grayscale(25%)',
        transition: 'filter 0.3s ease-out'
      }}
    >
      {/* BACKGROUND IMAGE SECTION - This displays the main background image with motion picture effect */}
      <div
        className="absolute inset-0 z-0 transition-all duration-300 ease-out"
        style={{
          // HOVER EFFECTS: These create the zoom and brightness effects when you hover over the logo
          transform: (isHovered && !isMobile) ? 'scale(1.02)' : 'scale(1)',
          filter: (isHovered && !isMobile) ? 'brightness(0.95)' : 'brightness(0.975)',
          backgroundColor: '#1a1a1a',
        }}
      >
        <div
          className="w-full h-full relative overflow-hidden"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%)',
          }}
        >
          <img
            src={bgImage}
            alt="HOOD BOYZ"
            className="w-full h-full object-cover"
            style={{
              objectPosition: 'center',
              animation: 'slowZoom 20s ease-in-out infinite alternate',
              filter: 'contrast(1.1) saturate(1.2)',
            }}
            onLoad={() => setImageLoaded(true)}
          />
          {/* Film grain overlay for motion picture effect */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
              opacity: 0.03,
              mixBlendMode: 'overlay',
            }}
          />
          {/* Vignette effect */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
            }}
          />
        </div>
      </div>
      
      {/* MOBILE LOGO - This shows the logo in the top-left corner on phones */}
      <div className="lg:hidden absolute top-4 left-4 z-30">
        <h1 
          className="font-zeyada text-[#F3DAC3] text-3xl font-normal"
          style={{
            filter: 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3))',
          }}
        >
          HOOD BOYZ
        </h1>
      </div>

      {/* DESKTOP LOGO - This shows the large logo on the left side on computers */}
      <div className="hidden lg:block absolute top-0 bottom-0 left-[8%] w-1/3 flex items-center justify-start z-30">
        <div 
          className="w-full h-full flex items-center justify-center"
        >
          <h1 
            className="font-zeyada text-[#F3DAC3] text-8xl font-normal transition-all duration-300 ease-out cursor-pointer"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            style={{
              filter: `drop-shadow(${(isHovered && !isMobile) ? '4px 4px 8px rgba(0, 0, 0, 0.5)' : '2px 2px 4px rgba(0, 0, 0, 0.3)'})`,
              transform: (isHovered && !isMobile) ? 'scale(1.2) rotate(1deg)' : 'scale(1) rotate(0deg)',
            }}
          >
            HOOD BOYZ
          </h1>
        </div>
      </div>
      
      {/* AUDIO ELEMENT - This is the invisible audio player that plays your music */}
      <audio
        ref={audioRef}
        preload="auto"
        loop
        src={audioFile}
      />
      
      <div className="fixed top-4 left-4 right-4 sm:top-8 sm:left-8 sm:right-8 z-20">
        <div className="flex justify-between items-center">
          <div></div>
          {/* BOLT.NEW LOGO - This shows the "Powered by Bolt.new" logo in the top-right */}
          <a
            href="https://bolt.new/"
            className="hover:opacity-75 transition-opacity"
            target="_blank"
            rel="noopener noreferrer"
            title="Powered with Bolt.new"
            aria-label="Website powered by Bolt.new"
          >
            <img src={boltLogo} alt="Made with Bolt.new" className="w-auto h-auto object-contain max-h-8 sm:max-h-full" />
          </a>
        </div>
      </div>
      
      {/* BOTTOM SECTION - This contains all the links, social media icons, and music controls */}
      <div className="fixed bottom-0 left-0 right-0 z-10">
        {/* Mobile gradient overlay - creates the dark fade effect at bottom on phones */}
        <div className="lg:hidden absolute inset-0 -top-[50vh] bg-gradient-to-t from-black/30 via-black/10 to-transparent pointer-events-none" />
        
        {/* Desktop gradient overlay - creates the dark fade effect at bottom on computers */}
        <div className="hidden lg:block absolute inset-0 -top-[30vh] bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
        
        {/* Content container - holds all the bottom elements */}
        <div className="relative z-20 pb-4 pt-2">
          <div className="mx-2 sm:mx-4 lg:mx-6">
            <div className="flex justify-between lg:flex-row items-end lg:items-center">
              
              {/* LEFT SIDE: Instagram Subscribe Link */}
              <div className="flex flex-col items-start lg:flex-shrink-0" style={{ width: window.innerWidth >= 1024 ? '307.453px' : 'auto' }}>
                <div className="flex flex-col gap-3">
                  <ActionLinks />
                  <MerchandiseSection />
                </div>
              </div>
              
              {/* CENTER: Social Media Icons (only visible on desktop computers) */}
              <div className="hidden lg:flex lg:flex-1 lg:justify-center lg:px-8">
                <div className="flex items-center justify-center w-full max-w-md">
                  <SocialLinks />
                </div>
              </div>
              
              {/* RIGHT SIDE: Music Controls + Social Icons (mobile layout) */}
              <div className="flex flex-col lg:flex-shrink-0 items-end" style={{ width: window.innerWidth >= 1024 ? '307.453px' : 'auto' }}>
                {/* Mobile phones: Show social icons and music controls stacked vertically */}
                <div className="lg:hidden flex flex-col items-end gap-4">
                  <div className="relative z-10">
                    <SocialLinks />
                  </div>
                  <div className="relative z-10 flex justify-end">
                    <AudioControl audioRef={audioRef} />
                  </div>
                </div>
                
                {/* Desktop computers: Show only music controls (social icons are in center) */}
                <div className="hidden lg:flex lg:items-center lg:justify-end w-full">
                  <AudioControl audioRef={audioRef} />
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { SocialLinks } from './components/SocialLinks';
import { ActionLinks } from './components/ActionLinks';
import { AudioControl } from './components/AudioControl';
import { MerchandiseSection } from './components/MerchandiseSection';
import bgVideo from './assets/Musician_Playing_Upright_Piano_In_Atmospheric_Vintage_Cafe_fhd_3381264.mp4';
import logoImage from './assets/logo.png';
import audioFile from './assets/audio.mp3';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile && audioRef.current) {
      // Auto-play on desktop only
      audioRef.current.play().catch(() => {
        // Auto-play failed, which is expected in many browsers
      });
    }
  }, [isMobile]);

  const handleLogoClick = () => {
    if (!isMobile) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={bgVideo} type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Mobile Header */}
        {isMobile && (
          <header className="p-4">
            <img
              src={logoImage}
              alt="Musician Logo"
              className="h-12 w-auto cursor-pointer"
              onClick={handleLogoClick}
            />
          </header>
        )}

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-6xl mx-auto">
            {isMobile ? (
              // Mobile Layout
              <div className="text-center space-y-8">
                <SocialLinks />
                <ActionLinks />
                <div className="flex justify-center gap-4">
                  <AudioControl 
                    isPlaying={isPlaying} 
                    onToggle={toggleAudio} 
                  />
                  <MerchandiseSection />
                </div>
              </div>
            ) : (
              // Desktop Layout
              <div className="grid grid-cols-2 gap-8 items-center">
                {/* Left Side - Logo */}
                <div className="flex justify-center">
                  <img
                    src={logoImage}
                    alt="Musician Logo"
                    className="max-w-full h-auto cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={handleLogoClick}
                  />
                </div>

                {/* Right Side - Links and Controls */}
                <div className="space-y-8">
                  <SocialLinks />
                  <ActionLinks />
                  <div className="flex gap-4">
                    <AudioControl 
                      isPlaying={isPlaying} 
                      onToggle={toggleAudio} 
                    />
                    <MerchandiseSection />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={audioFile}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
}

export default App;
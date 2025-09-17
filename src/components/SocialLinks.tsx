import React from 'react';

interface SocialLink {
  href: string;
  icon: string;
  alt: string;
}

const socialLinks: SocialLink[] = [
  {
    href: 'https://open.spotify.com/artist/YOUR_SPOTIFY_ID',
    icon: '/src/assets/icons/spotify.svg',
    alt: 'Listen on Spotify'
  },
  {
    href: 'https://music.apple.com/artist/YOUR_APPLE_MUSIC_ID',
    icon: '/src/assets/icons/apple-music.svg',
    alt: 'Listen on Apple Music'
  },
  {
    href: 'https://www.youtube.com/@YOUR_YOUTUBE_CHANNEL',
    icon: '/src/assets/icons/youtube.svg',
    alt: 'Watch on YouTube'
  },
  {
    href: 'https://www.instagram.com/YOUR_INSTAGRAM',
    icon: '/src/assets/icons/instagram.svg',
    alt: 'Follow on Instagram'
  },
  {
    href: 'https://www.tiktok.com/@YOUR_TIKTOK',
    icon: '/src/assets/icons/tiktok.svg',
    alt: 'Follow on TikTok'
  }
];

export function SocialLinks() {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {socialLinks.map((link, index) => (
        <a
          key={index}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white/10 backdrop-blur-sm border border-white/20 p-3 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110"
        >
          <img
            src={link.icon}
            alt={link.alt}
            className="w-6 h-6 filter brightness-0 invert"
          />
        </a>
      ))}
    </div>
  );
}
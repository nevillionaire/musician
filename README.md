# Musician website template

This is the Musician website Bolt template, built with modern web technologies and designed to showcase the artist's music and social media presence.

## 🎵 What This Website Does

- Displays musician' branding with a beautiful background image or video
- Provides links to all major music streaming platforms (Spotify, Apple Music, YouTube)
- Includes social media links (Instagram, TikTok)
- Features an audio player that auto-plays on desktop (but not mobile)
- Has interactive effects like confetti when clicking the logo on desktop
- Responsive design that works on both desktop and mobile devices

## 🛠️ How to Customize Key Elements

### 1. Changing Social Media and Streaming Links

**File to edit:** `src/components/SocialLinks.tsx`

Look for the `socialLinks` array around line 10. Each link has three parts:
- `href`: The web address to link to
- `icon`: The icon file (don't change this unless you have new icons)
- `alt`: Description text for accessibility

```javascript
const socialLinks: SocialLink[] = [
  {
    href: 'https://open.spotify.com/artist/YOUR_SPOTIFY_ID',  // ← Change this URL
    icon: spotify,
    alt: 'Listen to Parker Richards music on Spotify'
  },
  // ... more links
];
```

### 2. Changing the Instagram Subscribe Link

**File to edit:** `src/components/ActionLinks.tsx`

Look for the Instagram URL around line 8:
```javascript
href="https://www.instagram.com/parkerrichardsmusic/"  // ← Change this URL
```

### 3. Replacing the Background Image

**File to edit:** `src/App.tsx`

1. First, replace the image file:
   - Add your new background image to the `src/assets/` folder
   - Name it something descriptive like `new-background.jpg`

2. Then update the import at the top of the file (around line 4):
```javascript
import bgImage from './assets/new-background.jpg';  // ← Change filename here
```

**Important:** The background image should be high resolution (at least 1920x1080) and work well with text overlay.

### 4. Replacing the Logo

**File to edit:** `src/App.tsx`

1. Replace the logo file:
   - Add your new logo to the `src/assets/` folder
   - Make sure it's a PNG file with transparent background
   - Name it descriptively like `new-logo.png`

2. Update the import (around line 6):
```javascript
import logoImage from './assets/new-logo.png';  // ← Change filename here
```

**Important:** Logo should be white/light colored since it displays over a dark background.

### 5. Replacing the Audio File

**File to edit:** `src/App.tsx`

1. Replace the music file:
   - Add your new audio file to the `src/assets/` folder
   - Use MP3 format for best compatibility
   - Keep file size reasonable (under 10MB)
   - Name it descriptively like `new-song.mp3`

2. Update the import (around line 7):
```javascript
import audioFile from './assets/new-song.mp3';  // ← Change filename here
```

### 6. Changing the Website Title and Description

**File to edit:** `index.html`

Look for these lines in the `<head>` section:
```html
<title>Parker Richards Music - Official Website</title>  <!-- ← Change title here -->
<meta name="description" content="Official website for Parker Richards music..." />  <!-- ← Change description here -->
```

Also update the social media sharing text:
```html
<meta property="og:title" content="Parker Richards Music - Official Website" />  <!-- ← Change here too -->
<meta property="og:description" content="Official website for Parker Richards music..." />  <!-- ← And here -->
```

## 📁 File Structure Overview

```
src/
├── assets/                          # Images, audio, and other media files
│   ├── Musician_Playing_Upright_Piano_In_Atmospheric_Vintage_Cafe_fhd_3381264.mp4         # Main background video
│   ├── Musician_Playing_Upright_Piano_In_Atmospheric_Vintage_Cafe_fhd_3381264.mp4    # Audio file
│   └── icons/                      # Social media icons (don't change these)
├── components/
│   ├── SocialLinks.tsx             # Streaming platform and social media links
│   ├── ActionLinks.tsx             # Instagram subscribe link
│   └── AudioControl.tsx            # Music player controls
└── App.tsx                         # Main website layout and background
```


## 🎨 Design Features

- **Desktop**: Logo displays large on the left, music auto-plays, confetti effect on logo click
- **Mobile**: Logo in top-left corner, music requires manual play, social links stacked vertically
- **Responsive**: Automatically adapts to different screen sizes
- **Accessibility**: All images have descriptive text for screen readers



---

*This website was built with React, TypeScript, and Tailwind CSS

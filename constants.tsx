import React from 'react';
// FIX: Import SpoofedEvent to correctly type RISK_SCORES.
import { Pillar, Persona, SentryPacket, HydraScript, PrivateArchive, PillarId, SearchEngine, SpoofedEvent } from './types';
import { DashboardIcon, GhostIcon, KeyIcon, BeakerIcon, HistoryIcon, FilterIcon, DatabaseIcon, SettingsIcon, ShieldCheckIcon, ClipboardCheckIcon, MenuIcon } from './components/Icons';

export const PILLARS: Pillar[] = [
  {
    id: 'snufulufugus_menu',
    name: 'Menu',
    description: 'Main menu',
    icon: <MenuIcon className="w-6 h-6" />,
  },
  {
    id: 'snufulufugus_stats',
    name: 'Dashboard',
    description: 'Effectiveness dashboard',
    icon: <DashboardIcon className="w-6 h-6" />,
  },
  {
    id: 'snufulufugus_core',
    name: 'snufulufuguscore',
    description: 'Core systems',
    icon: <GhostIcon className="w-6 h-6" />,
  },
  {
    id: 'snufulufugus_database',
    name: 'snufulufugusdatabase',
    description: 'Persona management',
    icon: <DatabaseIcon className="w-6 h-6" />,
  },
    {
    id: 'snufulufugus_defense',
    name: 'snufulufugusdefense',
    description: 'Active protection systems',
    icon: <ShieldCheckIcon className="w-6 h-6" />,
  },
  {
    id: 'snufulufugus_key',
    name: 'snufulufuguskey',
    description: 'Automation engine',
    icon: <KeyIcon className="w-6 h-6" />,
  },
  {
    id: 'snufulufugus_toolkit',
    name: 'snufulufugustoolkit',
    description: 'Analysis tools',
    icon: <BeakerIcon className="w-6 h-6" />,
  },
  {
    id: 'snufulufugus_policy',
    name: 'snufulufuguspolicy',
    description: 'Policy integrity analysis',
    icon: <ClipboardCheckIcon className="w-6 h-6" />,
  },
  {
    id: 'snufulufugus_archive',
    name: 'snufulufugusarchive',
    description: 'Archival systems',
    icon: <HistoryIcon className="w-6 h-6" />,
  },
  {
    id: 'snufulufugus_purifier',
    name: 'snufulufuguspurifier',
    description: 'Deep cleaning tools',
    icon: <FilterIcon className="w-6 h-6" />,
  },
  {
    id: 'snufulufugus_settings',
    name: 'Settings',
    description: 'Application configuration',
    icon: <SettingsIcon className="w-6 h-6" />,
  },
];

export const VPN_REGIONS: string[] = ['US-West', 'US-East', 'EU-Central', 'EU-West', 'Asia-Pacific', 'South America'];

// FIX: Moved SPOOF_ORIGINS from App.tsx to be shared across components.
export const SPOOF_ORIGINS = ['doubleclick.net', 'google-analytics.com', 'track.adform.net', 'criteo.com', 'facebook.com', 'app-measurement.com', 'scorecardresearch.com', 'quantserve.com', 'amazon-adsystem.com'];

export const SEARCH_ENGINES: SearchEngine[] = [
  { name: 'Google', searchUrl: 'https://www.google.com/search?q=%s' },
  { name: 'Bing', searchUrl: 'https://www.bing.com/search?q=%s' },
  { name: 'DuckDuckGo', searchUrl: 'https://duckduckgo.com/?q=%s' },
  { name: 'StartPage', searchUrl: 'https://www.startpage.com/sp/search?q=%s' },
  { name: 'Yandex', searchUrl: 'https://yandex.com/search/?text=%s' },
  { name: 'Torch (Tor)', searchUrl: 'http://torchdeedp3i2jigzjdmfpn5ttjhthh5wbmda2rr3jvqjg5p77c54dqd.onion/search?query=%s' },
];


export const DEFAULT_PERSONAS: Persona[] = [
  {
    id: 'p1',
    name: 'Chadwick "Chaz" Worthington III',
    team: 'Crypto Enthusiasts',
    occupation: 'NFT Sommelier / Aspiring Finfluencer',
    backstory: 'Chaz spends his parents\' money on "digital art" and offers unsolicited financial advice on Discord. His entire personality is based on a single Bitcoin he bought in 2021.',
    region: 'Monaco',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 OPR/110.0.0.0',
    resolution: '3440x1440',
    language: 'en-US',
    timezone: 'Europe/Monaco',
    platform: 'Win32',
    asn: 'AS6663',
    asnDescription: 'MONACO-TELECOM, MC',
    colorDepth: 24,
    pixelDepth: 24,
    plugins: 'Metamask Wallet Extension, Phantom Wallet, VPN Blocker Blocker',
    incomeLevel: 'high',
    ethnicity: 'Caucasian',
    politicalAlignment: 'Anarcho-Capitalist',
    deviceMemory: 64,
    gpu: 'NVIDIA GeForce RTX 4090',
    touchSupport: false,
    browserVendor: 'Google Inc.',
    installedFonts: ['Papyrus', 'Comic Sans MS', 'Impact', 'Arial Black'],
    cookiesEnabled: true,
    doNotTrack: '0',
    connectionType: 'ethernet',
    downlink: 1000,
    educationLevel: 'Bachelors',
    interests: ['Vaping', 'Disrupting Paradigms', 'Lamborghinis', 'Shouting "HODL"'],
    shoppingHabits: 'Luxury',
    socialMediaPresence: 'High',
    acceptLanguages: 'en-US,en;q=0.9',
  },
  {
    id: 'p2',
    name: 'Brenda "B-REN" Reynolds',
    team: 'Multi-Level Marketers',
    occupation: 'Wellness Advocate & #BossBabe',
    backstory: 'Brenda floods Facebook with posts about essential oils and leggings. She believes she\'s the CEO of her own company, which is coincidentally shaped like a pyramid.',
    region: 'Utah, USA',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/125.0.6422.80 Mobile/15E148 Safari/604.1',
    resolution: '390x844',
    language: 'en-US',
    timezone: 'America/Denver',
    platform: 'iPhone',
    asn: 'AS7922',
    asnDescription: 'COMCAST-VADS, US',
    colorDepth: 24,
    pixelDepth: 24,
    plugins: 'No plugins reported',
    incomeLevel: 'low',
    ethnicity: 'Caucasian',
    politicalAlignment: 'Undeclared',
    deviceMemory: 6,
    gpu: 'Apple A15 GPU',
    touchSupport: true,
    browserVendor: 'Google Inc.',
    installedFonts: ['Helvetica Neue', 'Arial', 'San Francisco'],
    cookiesEnabled: true,
    doNotTrack: '1',
    connectionType: 'wifi',
    downlink: 50,
    educationLevel: 'High School',
    interests: ['Scrapbooking', 'Pyramid Schemes', 'Saying "Hun"', 'Live, Laugh, Love'],
    shoppingHabits: 'Budget',
    socialMediaPresence: 'High',
    acceptLanguages: 'en-US,en;q=0.9',
  },
   {
    id: 'p4',
    name: 'Agnes Weatherwax',
    team: 'Hobbyists & Retirees',
    occupation: 'Competitive Gardener / Neighborhood Watch Captain',
    backstory: 'Agnes spends her days cultivating prize-winning roses and her nights monitoring the neighborhood for suspicious squirrels. Her browser history is a mix of organic pesticide recipes and police scanner forums.',
    region: 'Ohio, USA',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.2535.67',
    resolution: '1366x768',
    language: 'en-US',
    timezone: 'America/New_York',
    platform: 'Win32',
    asn: 'AS30036',
    asnDescription: 'FRONTIER-FRTR, US',
    colorDepth: 24,
    pixelDepth: 24,
    plugins: 'Microsoft Office, Adobe Acrobat Reader',
    incomeLevel: 'middle',
    ethnicity: 'Caucasian',
    politicalAlignment: 'Centrist',
    deviceMemory: 8,
    gpu: 'Intel(R) UHD Graphics 620',
    touchSupport: false,
    browserVendor: 'Google Inc.',
    installedFonts: ['Times New Roman', 'Arial', 'Courier New', 'Calibri'],
    cookiesEnabled: true,
    doNotTrack: 'unspecified',
    connectionType: 'wifi',
    downlink: 25,
    educationLevel: 'High School',
    interests: ['Gardening', 'Bird Watching', 'Conspiracy Theories', 'Baking'],
    shoppingHabits: 'Mid-range',
    socialMediaPresence: 'Low',
    acceptLanguages: 'en-US',
   },
   {
    id: 'p5',
    name: 'Kaito Tanaka',
    team: 'Students & Researchers',
    occupation: 'Computer Science Undergrad',
    backstory: 'Kaito is fueled by instant noodles and the fear of failing his data structures class. He lives on Stack Overflow and believes sleep is a suggestion, not a requirement.',
    region: 'Tokyo, Japan',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    resolution: '1440x900',
    language: 'ja',
    timezone: 'Asia/Tokyo',
    platform: 'MacIntel',
    asn: 'AS4713',
    asnDescription: 'NTT-OCN, JP',
    colorDepth: 24,
    pixelDepth: 24,
    plugins: 'Grammarly, Dark Reader, AdBlock Plus',
    incomeLevel: 'low',
    ethnicity: 'Asian',
    politicalAlignment: 'Apolitical',
    deviceMemory: 16,
    gpu: 'Intel Iris Plus Graphics 645',
    touchSupport: false,
    browserVendor: 'Google Inc.',
    installedFonts: ['Hiragino Kaku Gothic ProN', 'Osaka', 'MS PGothic', 'Yu Gothic'],
    cookiesEnabled: true,
    doNotTrack: '1',
    connectionType: 'ethernet',
    downlink: 500,
    educationLevel: 'Bachelors',
    interests: ['Anime', 'Competitive Programming', 'Cybersecurity CTFs', 'Gacha Games'],
    shoppingHabits: 'Budget',
    socialMediaPresence: 'Medium',
    acceptLanguages: 'ja,en-US;q=0.9,en;q=0.8',
  }
];

// FIX: The `risk` property belongs to SpoofedEvent, not Persona.
export const RISK_SCORES: Record<SpoofedEvent['risk'], number> = {
    high: 5,
    medium: 2,
    low: 1
};

export const DEFAULT_SENTRY_PACKETS: SentryPacket[] = [
    { id: 'sp1', domain: 'g.co', solvedAt: '2025-03-15 10:30:11', type: 'CAPTCHA', region: 'US-West' },
    { id: 'sp2', domain: 'example.com', solvedAt: '2025-03-14 22:15:01', type: 'Age Gate', region: 'EU-Central' },
    { id: 'sp3', domain: 'another-site.net', solvedAt: '2025-03-13 08:05:45', type: 'CAPTCHA', region: 'Asia-Pacific' }
];

export const DEFAULT_HYDRA_SCRIPTS: HydraScript[] = [
    {
        id: 'hs1',
        name: 'Cookie Consent',
        description: 'Auto-clicks "Accept All" on cookie banners.',
        code: `
// Find all buttons with text suggesting acceptance and click them
const consentKeywords = ['Accept', 'Agree', 'OK', 'Allow'];
const buttons = Array.from(document.querySelectorAll('button, a[role="button"]'));
const consentButton = buttons.find(btn => 
    consentKeywords.some(keyword => btn.innerText.includes(keyword))
);
if (consentButton) {
    consentButton.click();
    console.log('Cookie consent clicked.');
}
        `
    },
    {
        id: 'hs2',
        name: 'Form Filler',
        description: 'Fills login forms with dummy data.',
        code: `
// A very basic example to fill common form fields
const emailInput = document.querySelector('input[type="email"], input[name="username"]');
const passwordInput = document.querySelector('input[type="password"], input[name="password"]');

if (emailInput) emailInput.value = 'user@example.com';
if (passwordInput) passwordInput.value = 'SecurePassword123!';

console.log('Forms filled with dummy data.');
        `
    }
];

export const DEFAULT_PRIVATE_ARCHIVES: PrivateArchive[] = [
    {
        id: 'pa1',
        domain: 'internal.corp.net',
        capturedAt: '2024-01-10',
        size: '1.2 GB',
        status: 'Completed',
        mediaAssets: [
            { name: 'Onboarding_Video_2024.mp4', type: 'video', url: 'https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.mp4' },
            { name: 'CEO_Town_Hall_Q1.mp3', type: 'audio', url: 'https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.mp4' },
            { name: 'Q1_Financials_DRAFT.pdf', type: 'document', url: '#' },
        ]
    },
    {
        id: 'pa2',
        domain: 'dev.api.example.com',
        capturedAt: '2024-02-22',
        size: '350 MB',
        status: 'Completed',
        mediaAssets: [
            { name: 'API_Demo_Walkthrough.mp4', type: 'video', url: 'https://storage.googleapis.com/web-dev-assets/video-and-source-tags/chrome.mp4' },
            { name: 'Rate_Limiting_Explanation.mp3', type: 'audio', url: '#' },
        ]
    },
    {
        id: 'pa3',
        domain: 'beta.webapp.io',
        capturedAt: '2024-03-01',
        size: '2.5 GB',
        status: 'Crawling...',
        mediaAssets: []
    }
];

// Data for Persona Genesis Module
export const NEUTRAL_REGIONS = [
  { name: 'Switzerland', timezone: 'Europe/Zurich', lang: 'de-CH', asn: 'AS3303', asnDesc: 'SWITCH, CH' },
  { name: 'New Zealand', timezone: 'Pacific/Auckland', lang: 'en-NZ', asn: 'AS9790', asnDesc: 'Spark, NZ' },
  { name: 'Costa Rica', timezone: 'America/Costa_Rica', lang: 'es-CR', asn: 'AS11816', asnDesc: 'ICE, CR' },
  { name: 'Finland', timezone: 'Europe/Helsinki', lang: 'fi-FI', asn: 'AS1741', asnDesc: 'Elisa, FI' },
  { name: 'Uruguay', timezone: 'America/Montevideo', lang: 'es-UY', asn: 'AS27735', asnDesc: 'ANTEL, UY' },
];

export const COMMON_GPUS = [
  'NVIDIA GeForce RTX 3060', 'Intel(R) Iris(R) Xe Graphics', 'AMD Radeon RX 6700 XT', 
  'NVIDIA GeForce GTX 1650', 'Apple M1', 'Qualcomm Adreno 650'
];

export const COMMON_CPUS = [
    'Intel Core i7-1165G7', 'AMD Ryzen 5 5600X', 'Apple M1', 'Intel Core i5-10400'
];

export const COMMON_PLATFORMS = ['Win32', 'MacIntel', 'Linux x86_64', 'iPhone'];

export const COMMON_RESOLUTIONS = ['1920x1080', '1366x768', '1440x900', '1536x864', '2560x1440', '360x640', '390x844'];

export const COMMON_USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:126.0) Gecko/20100101 Firefox/126.0'
];

export const FONT_PACKS: { [key: string]: string[] } = {
    windows: ['Arial', 'Calibri', 'Cambria', 'Consolas', 'Courier New', 'Segoe UI', 'Tahoma', 'Times New Roman', 'Verdana'],
    macos: ['Arial', 'Courier', 'Geneva', 'Georgia', 'Helvetica', 'Lucida Grande', 'San Francisco', 'Times', 'Verdana'],
    linux: ['DejaVu Sans', 'Liberation Mono', 'Noto Sans', 'Ubuntu', 'Cantarell', 'Fira Code'],
    ios: ['Arial', 'Courier New', 'Georgia', 'Helvetica Neue', 'San Francisco', 'Times New Roman', 'Verdana']
};

export const GENERATOR_DATA = {
    occupations: [
        { name: 'Software Developer', category: 'tech', income: ['middle', 'high'] },
        { name: 'Graphic Designer', category: 'creative', income: ['low', 'middle'] },
        { name: 'Marketing Manager', category: 'business', income: ['middle', 'high'] },
        { name: 'Accountant', category: 'business', income: ['middle'] },
        { name: 'High School Teacher', category: 'education', income: ['low', 'middle'] },
        { name: 'Registered Nurse', category: 'health', income: ['middle'] },
        { name: 'Retail Associate', category: 'service', income: ['low'] },
    ],
    interests: {
        tech: ['Open Source', 'Gaming', 'Sci-Fi Movies', 'Home Automation'],
        creative: ['Photography', 'Indie Music', 'Art Museums', 'DIY Crafts'],
        business: ['Investing', 'Podcasts', 'Networking Events', 'Golf'],
        education: ['Reading', 'Documentaries', 'Museums', 'Hiking'],
        health: ['Fitness', 'Healthy Cooking', 'Yoga', 'Outdoor Activities'],
        service: ['Watching TV', 'Social Media', 'Dining Out', 'Movies']
    },
    shoppingHabits: {
        low: ['Budget', 'Mid-range'],
        middle: ['Mid-range'],
        high: ['Mid-range', 'Luxury'],
        unknown: ['Unknown']
    }
};
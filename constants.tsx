import React from 'react';
import { Pillar, Persona, SentryPacket, HydraScript, PrivateArchive, PillarId } from './types';
import { DashboardIcon, GhostIcon, KeyIcon, BeakerIcon, HistoryIcon, FilterIcon, DatabaseIcon, SettingsIcon } from './components/Icons';

export const PILLARS: Pillar[] = [
  {
    id: 'snufulufugus_stats',
    name: 'snufulufugus stats',
    description: 'effectiveness dashboard',
    icon: <DashboardIcon className="w-6 h-6" />,
  },
  {
    id: 'snufulufugus_core',
    name: 'snufulufugus core',
    description: 'core systems',
    icon: <GhostIcon className="w-6 h-6" />,
  },
  {
    id: 'snufulufugus_database',
    name: 'snufulufugus database',
    description: 'persona management',
    icon: <DatabaseIcon className="w-6 h-6" />,
  },
  {
    id: 'snufulufugus_key',
    name: 'snufulufugus key',
    description: 'automation engine',
    icon: <KeyIcon className="w-6 h-6" />,
  },
  {
    id: 'snufulufugus_toolkit',
    name: 'snufulufugus toolkit',
    description: 'analysis tools',
    icon: <BeakerIcon className="w-6 h-6" />,
  },
  {
    id: 'snufulufugus_archive',
    name: 'snufulufugus archive',
    description: 'archival systems',
    icon: <HistoryIcon className="w-6 h-6" />,
  },
  {
    id: 'snufulufugus_purifier',
    name: 'snufulufugus purifier',
    description: 'deep cleaning tools',
    icon: <FilterIcon className="w-6 h-6" />,
  },
  {
    id: 'snufulufugus_settings',
    name: 'snufulufugus settings',
    description: 'application configuration',
    icon: <SettingsIcon className="w-6 h-6" />,
  },
];

export const VPN_REGIONS: string[] = ['US-West', 'US-East', 'EU-Central', 'EU-West', 'Asia-Pacific', 'South America'];

// FIX: Moved SPOOF_ORIGINS from App.tsx to be shared across components.
export const SPOOF_ORIGINS = ['doubleclick.net', 'google-analytics.com', 'track.adform.net', 'criteo.com', 'facebook.com', 'app-measurement.com', 'scorecardresearch.com', 'quantserve.com', 'amazon-adsystem.com'];

export const DEFAULT_PERSONAS: Persona[] = [
  {
    id: 'p1',
    name: 'Peter Oldring',
    team: 'The Network',
    occupation: 'Network Censor',
    backstory: 'Enjoys bleeping out curse words; tries to prevent offensive content.',
    region: 'USA',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    resolution: '1920x1080',
    language: 'en-US',
    timezone: 'America/Los_Angeles',
    platform: 'Win32',
  },
  {
    id: 'p2',
    name: 'Babaganoush',
    team: 'Unemployed',
    occupation: 'Pleasure Giver',
    backstory: 'Gives 110% to pleasure; three-time "fastest typist in the world."',
    region: 'USA',
    userAgent: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0',
    resolution: '1366x768',
    language: 'en-US',
    timezone: 'America/Chicago',
    platform: 'Linux x86_64',
  },
  {
    id: 'p3',
    name: 'Hacker Hank',
    team: 'Computer Nerds',
    occupation: 'Programmer',
    backstory: "Lives in his mom's basement; uses a VPN for everything.",
    region: 'USA',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    resolution: '2560x1440',
    language: 'en-US',
    timezone: 'America/New_York',
    platform: 'Linux x86_64',
  },
  {
    id: 'p4',
    name: 'Dr. Evil',
    team: 'Villains',
    occupation: 'Mastermind',
    backstory: 'Demands a ransom of... one million dollars.',
    region: 'Belgium',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0',
    resolution: '1920x1080',
    language: 'fr-BE',
    timezone: 'Europe/Brussels',
    platform: 'Win32',
  },
  {
    id: 'p5',
    name: 'Captain Kirk-Off',
    team: 'Sci-Fi',
    occupation: 'Starship Captain',
    backstory: 'Only communicates in overly dramatic pauses and cheesy wrestling moves.',
    region: 'USA',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Safari/605.1.15',
    resolution: '2880x1800',
    language: 'en-US',
    timezone: 'America/Los_Angeles',
    platform: 'MacIntel',
  },
  {
    id: 'p6',
    name: 'snufulufugus',
    team: 'Crypto-Anarchists',
    occupation: 'Digital Phantom',
    backstory: 'A ghost in the machine. Believed to be a myth, a rogue AI, or just a very paranoid developer.',
    region: 'Iceland',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Vivaldi/6.7.3329.21',
    resolution: '1680x1050',
    language: 'is-IS',
    timezone: 'Atlantic/Reykjavik',
    platform: 'Linux x86_64',
  },
];


export const DEFAULT_SENTRY_PACKETS: SentryPacket[] = [
    { id: 'sp1', domain: 'google.com', solvedAt: '2024-05-20 14:32 UTC', type: 'CAPTCHA', region: 'US-East' },
    { id: 'sp2', domain: 'cloudflare.com', solvedAt: '2024-05-19 08:11 UTC', type: 'CAPTCHA', region: 'US-West' },
    { id: 'sp3', domain: 'gaming.example', solvedAt: '2024-05-18 21:54 UTC', type: 'Age Gate', region: 'EU-Central' },
];

export const DEFAULT_HYDRA_SCRIPTS: HydraScript[] = [
    { 
        id: 'hs1', 
        name: 'OSINT-Username.js', 
        description: 'Sherlock-style username search across social networks.',
        code: `// snufulufugus Script: OSINT-Username.js
async function findUsernames(username) {
  const targets = ['twitter', 'instagram', 'github'];
  const results = {};
  for (const site of targets) {
    const url = \`https://\${site}.com/\${username}\`;
    const response = await snufulufugus.fetch(url, { method: 'HEAD' });
    results[site] = response.ok;
  }
  return results;
}
// To run: await findUsernames('example_user');`
    },
    { 
        id: 'hs2', 
        name: 'Subdomain-Enum.js', 
        description: 'Basic subdomain enumeration via dictionary.',
        code: `// snufulufugus Script: Subdomain-Enum.js
async function enumSubdomains(domain) {
  const subdomains = ['www', 'api', 'dev', 'staging'];
  const found = [];
  for (const sub of subdomains) {
    const url = \`https://\${sub}.\${domain}\`;
    try {
      await snufulufugus.fetch(url, { method: 'HEAD' });
      found.push(url);
    } catch (e) { /* ignore */ }
  }
  return found;
}
// To run: await enumSubdomains('example.com');`
    },
    { 
        id: 'hs3', 
        name: 'Daily-Diff.js', 
        description: 'Archives a target daily and alerts on changes.',
        code: `// snufulufugus Script: Daily-Diff.js
async function dailyDiff(url) {
  // Use archive to save the site
  const archiveId = await snufulufugus.archive.create(url, {
    authenticated: true
  });
  
  // Get yesterday's archive
  const previousArchive = snufulufugus.archive.getLatest(url, { before: '1d' });

  if (previousArchive) {
    // Run a diff
    const diff = await snufulufugus.archive.diff(previousArchive.id, archiveId);
    if (diff.hasChanges) {
      snufulufugus.notify(\`Changes detected on \${url}\`);
    }
  }
  return { newArchiveId: archiveId };
}
// To run: await dailyDiff('https://example.com');`
    },
];

export const DEFAULT_PRIVATE_ARCHIVES: PrivateArchive[] = [
    { 
        id: 'pa1', 
        domain: 'internal.corp.example', 
        capturedAt: '2024-05-21 10:05 UTC', 
        size: '1.2 GB', 
        status: 'Completed',
        mediaAssets: [
            { name: 'Q2_Strategy_Meeting.mp4', type: 'video', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
            { name: 'CEO_Town_Hall.mp3', type: 'audio', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' },
            { name: 'Project_Phoenix_Brief.pdf', type: 'document', url: '#' },
        ]
    },
    { 
        id: 'pa2', 
        domain: 'social.network.example', 
        capturedAt: '2024-05-20 18:45 UTC', 
        size: '874 MB', 
        status: 'Completed',
        mediaAssets: [
             { name: 'Leaked_Ad_Campaign.mp4', type: 'video', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
        ]
    },
    { id: 'pa3', domain: 'news.outlet.example', capturedAt: '2024-05-19 09:12 UTC', size: '2.5 GB', status: 'Failed' },
];

export const RISK_SCORES: { [key in 'low' | 'medium' | 'high']: number } = {
  low: 1,
  medium: 2,
  high: 5,
};
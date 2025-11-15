import React from 'react';

export type PillarId = 'snufulufugus_stats' | 'snufulufugus_core' | 'snufulufugus_key' | 'snufulufugus_toolkit' | 'snufulufugus_archive' | 'snufulufugus_purifier' | 'snufulufugus_database' | 'snufulufugus_settings' | 'snufulufugus_defense' | 'snufulufugus_policy';

export interface Pillar {
  id: PillarId;
  name: string;
  description: string;
  icon: React.ReactNode;
}

export interface Persona {
  id: string;
  name: string;
  team: string;
  occupation: string;
  backstory: string;
  region: string;
  userAgent: string;
  resolution: string;
  language: string;
  timezone: string;
  platform: string;
  asn: string;
  asnDescription: string;
  colorDepth: number;
  pixelDepth: number;
  plugins: string;
  incomeLevel: 'low' | 'middle' | 'high' | 'unknown';
  ethnicity: string;
  politicalAlignment: string;
  isGenerated?: boolean;

  // Hardware
  deviceMemory: number;
  gpu: string;
  touchSupport: boolean;

  // Software/Browser
  browserVendor: string;
  installedFonts: string[];
  cookiesEnabled: boolean;
  doNotTrack: '1' | '0' | 'unspecified';

  // Network
  connectionType: 'wifi' | 'cellular' | 'ethernet' | 'unknown';
  downlink: number; // in Mbps

  // Behavioral/Inferred
  educationLevel: 'High School' | 'Bachelors' | 'Masters' | 'PhD' | 'Unknown';
  interests: string[];
  shoppingHabits: 'Budget' | 'Mid-range' | 'Luxury' | 'Unknown';
  socialMediaPresence: 'High' | 'Medium' | 'Low' | 'None';

  // Locale
  acceptLanguages: string;
}


export interface SentryPacket {
  id:string;
  domain: string;
  solvedAt: string;
  type: 'CAPTCHA' | 'Age Gate';
  region: string;
}

export interface HydraScript {
  id: string;
  name: string;
  description: string;
  code: string;
}

export interface MediaAsset {
  name: string;
  type: 'video' | 'audio' | 'document';
  url: string; // Using a URL for simulation purposes
}

export interface DecontaminationAsset extends MediaAsset {
  originArchive: string;
}


export interface PrivateArchive {
  id: string;
  domain: string;
  capturedAt: string;
  size: string;
  status: 'Completed' | 'Crawling...' | 'Failed';
  mediaAssets?: MediaAsset[];
}

export interface SpoofedEvent {
  id: number;
  origin: string;
  query: string;
  risk: 'low' | 'medium' | 'high';
  spoofedValue: string; // What data was returned to the query
}

export interface AgentConfig {
  provider: 'gemini' | 'custom';
  endpoint?: string;
  apiKey?: string;
  collaborativeEndpoint1?: string;
  collaborativeEndpoint2?: string;
}

export interface SearchEngine {
  name: string;
  searchUrl: string; // URL template with %s for the query
}
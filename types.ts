import React from 'react';

export type PillarId = 'snufulufugus_stats' | 'snufulufugus_core' | 'snufulufugus_key' | 'snufulufugus_toolkit' | 'snufulufugus_archive' | 'snufulufugus_purifier' | 'snufulufugus_database' | 'snufulufugus_settings';

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
  platform: string; // Added for more spoofing variety
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
}
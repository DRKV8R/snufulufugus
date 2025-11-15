import { Persona } from '../types';
import { 
    NEUTRAL_REGIONS, 
    COMMON_GPUS,
    COMMON_PLATFORMS, 
    COMMON_RESOLUTIONS, 
    COMMON_USER_AGENTS 
} from '../constants';

const sample = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const randomName = (): string => {
    const first = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley'];
    const last = ['Smith', 'Jones', 'Williams', 'Brown', 'Davis', 'Miller'];
    return `${sample(first)} ${sample(last)}`;
}

export function generateRandomPersona(): Persona {
    const regionInfo = sample(NEUTRAL_REGIONS);
    const platform = sample(COMMON_PLATFORMS);
    const userAgent = sample(COMMON_USER_AGENTS.filter(ua => ua.toLowerCase().includes(platform.split(' ')[0].toLowerCase().replace('win32', 'windows'))));
    const memory = sample([8, 16, 32]);
    const connection = sample(['wifi', 'ethernet'] as const);

    return {
        id: `gen-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: randomName(),
        team: 'Generated',
        occupation: 'Consultant',
        backstory: 'A dynamically generated persona for short-term, non-attributable browsing operations. Designed to blend in with common user statistics.',
        region: regionInfo.name,
        userAgent: userAgent,
        resolution: sample(COMMON_RESOLUTIONS),
        language: regionInfo.lang,
        timezone: regionInfo.timezone,
        platform: platform,
        asn: regionInfo.asn,
        asnDescription: regionInfo.asnDesc,
        colorDepth: 24,
        pixelDepth: 24,
        plugins: 'No plugins reported',
        incomeLevel: 'unknown',
        ethnicity: 'Unknown',
        politicalAlignment: 'Undeclared',
        isGenerated: true,
        deviceMemory: memory,
        gpu: sample(COMMON_GPUS),
        touchSupport: platform === 'iPhone' || platform === 'Android',
        browserVendor: 'Google Inc.',
        installedFonts: ['Arial', 'Helvetica', 'Times New Roman', 'Courier New'],
        cookiesEnabled: true,
        doNotTrack: sample(['1', '0', 'unspecified']),
        connectionType: connection,
        downlink: connection === 'ethernet' ? randomInt(100, 1000) : randomInt(25, 150),
        educationLevel: 'Unknown',
        interests: ['General Browsing', 'News', 'Social Media'],
        shoppingHabits: 'Unknown',
        socialMediaPresence: 'Low',
        acceptLanguages: `${regionInfo.lang},en-US;q=0.9,en;q=0.8`,
    };
}

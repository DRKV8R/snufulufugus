import { Persona } from '../types';
import { 
    NEUTRAL_REGIONS, 
    COMMON_GPUS,
    COMMON_PLATFORMS, 
    COMMON_RESOLUTIONS, 
    COMMON_USER_AGENTS,
    FONT_PACKS,
    GENERATOR_DATA
} from '../constants';

const sample = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const randomName = (): string => {
    const first = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Jamie', 'Drew'];
    const last = ['Smith', 'Jones', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore'];
    return `${sample(first)} ${sample(last)}`;
}

export function generateRandomPersona(): Persona {
    const regionInfo = sample(NEUTRAL_REGIONS);
    const platform = sample(COMMON_PLATFORMS);
    
    let platformIdentifier = '';
    if (platform === 'Win32') platformIdentifier = 'windows';
    else if (platform === 'MacIntel') platformIdentifier = 'macintosh';
    else if (platform === 'Linux x86_64') platformIdentifier = 'linux';
    else if (platform === 'iPhone') platformIdentifier = 'iphone';

    const userAgent = sample(COMMON_USER_AGENTS.filter(ua => ua.toLowerCase().includes(platformIdentifier))) || sample(COMMON_USER_AGENTS);
    
    const memory = sample([8, 16, 32]);
    const isMobile = platform === 'iPhone';
    const connection = isMobile ? sample(['wifi', 'cellular'] as const) : sample(['wifi', 'ethernet'] as const);

    const occupationData = sample(GENERATOR_DATA.occupations);
    const incomeLevel = sample(occupationData.income) as Persona['incomeLevel'];
    const interests = sample(GENERATOR_DATA.interests[occupationData.category as keyof typeof GENERATOR_DATA.interests]);
    const shoppingHabits = sample(GENERATOR_DATA.shoppingHabits[incomeLevel as keyof typeof GENERATOR_DATA.shoppingHabits]) as Persona['shoppingHabits'];

    let fontPackKey = 'windows';
    if (platform === 'MacIntel') fontPackKey = 'macos';
    if (platform === 'Linux x86_64') fontPackKey = 'linux';
    if (platform === 'iPhone') fontPackKey = 'ios';
    const installedFonts = FONT_PACKS[fontPackKey];


    return {
        id: `gen-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: randomName(),
        team: 'Generated',
        occupation: occupationData.name,
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
        incomeLevel: incomeLevel,
        ethnicity: 'Unknown',
        politicalAlignment: 'Undeclared',
        isGenerated: true,
        deviceMemory: memory,
        gpu: sample(COMMON_GPUS),
        touchSupport: isMobile,
        browserVendor: 'Google Inc.',
        installedFonts: installedFonts,
        cookiesEnabled: true,
        doNotTrack: sample(['1', '0', 'unspecified']),
        connectionType: connection,
        downlink: connection === 'ethernet' ? randomInt(100, 1000) : randomInt(25, 150),
        educationLevel: 'Unknown',
        interests: [interests],
        shoppingHabits: shoppingHabits,
        socialMediaPresence: 'Low',
        acceptLanguages: `${regionInfo.lang},en-US;q=0.9,en;q=0.8`,
    };
}
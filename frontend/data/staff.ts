import type { StaffTemplate } from '../types';

/**
 * Tiered Staff System
 *
 * Each role (Manager, Booker, Promoter) has 4 tiers:
 * - Entry Level: $100/month - Basic bonuses, affordable for new artists
 * - Professional: $300/month - Moderate bonuses, for growing artists
 * - Expert: $600/month - Strong bonuses, for established artists
 * - Elite: $1200/month - Premium bonuses, for top-tier artists
 *
 * Staff are hired on contracts: 6 months or 12 months
 * Players can extend or terminate contracts with consequences
 */

export const staffTemplates: StaffTemplate[] = [
    // ==================== MANAGERS ====================
    {
        id: 'MANAGER_ENTRY',
        name: 'Jordan Brooks',
        role: 'Manager',
        tier: 'entry',
        salary: 100, // per month
        description: 'Fresh out of music business school, eager to prove themselves.',
        bonuses: [
            { stat: 'cash', value: 5, description: '+5% income from basic deal negotiations' },
        ],
        unlockRequirement: {
            type: 'feature',
            message: 'Unlock staff hiring system'
        }
    },
    {
        id: 'MANAGER_PROFESSIONAL',
        name: 'Alex "The Fixer" Chen',
        role: 'Manager',
        tier: 'professional',
        salary: 300,
        description: 'Mid-level manager with solid industry connections and proven track record.',
        bonuses: [
            { stat: 'cash', value: 10, description: '+10% income from gigs and deals' },
            { stat: 'fame', value: 1, description: '+1 Fame/week from industry connections' }
        ],
        unlockRequirement: {
            type: 'fame',
            value: 25,
            message: 'Requires 25 Fame'
        }
    },
    {
        id: 'MANAGER_EXPERT',
        name: 'Sarah "Powerhouse" Martinez',
        role: 'Manager',
        tier: 'expert',
        salary: 600,
        description: 'Veteran manager who has worked with platinum artists. Known for aggressive deal-making.',
        bonuses: [
            { stat: 'cash', value: 15, description: '+15% income from premium negotiations' },
            { stat: 'fame', value: 2, description: '+2 Fame/week from high-level connections' },
            { stat: 'hype', value: 1, description: '+1 Hype/week from strategic publicity' }
        ],
        unlockRequirement: {
            type: 'fame',
            value: 50,
            message: 'Requires 50 Fame'
        }
    },
    {
        id: 'MANAGER_ELITE',
        name: 'Marcus "The Kingmaker" Stone',
        role: 'Manager',
        tier: 'elite',
        salary: 1200,
        description: 'Elite manager to the stars. Has direct lines to major label executives and top promoters.',
        bonuses: [
            { stat: 'cash', value: 25, description: '+25% income from elite industry access' },
            { stat: 'fame', value: 3, description: '+3 Fame/week from A-list connections' },
            { stat: 'hype', value: 2, description: '+2 Hype/week from media mastery' }
        ],
        unlockRequirement: {
            type: 'fame',
            value: 75,
            message: 'Requires 75 Fame'
        }
    },

    // ==================== BOOKERS ====================
    {
        id: 'BOOKER_ENTRY',
        name: 'Casey Miller',
        role: 'Booker',
        tier: 'entry',
        salary: 100,
        description: 'Starting booking agent with connections to local venues and small festivals.',
        bonuses: [
            { stat: 'cash', value: 3, description: '+3% income from local gig bookings' },
        ],
        unlockRequirement: {
            type: 'feature',
            message: 'Unlock staff hiring system'
        }
    },
    {
        id: 'BOOKER_PROFESSIONAL',
        name: 'Maya "The Calendar" Singh',
        role: 'Booker',
        tier: 'professional',
        salary: 300,
        description: 'Experienced booker with regional venue relationships and tour routing expertise.',
        bonuses: [
            { stat: 'cash', value: 8, description: '+8% income from better routing and deals' },
            { stat: 'hype', value: 1, description: '+1 Hype/week from strategic show placement' }
        ],
        unlockRequirement: {
            type: 'fame',
            value: 25,
            message: 'Requires 25 Fame'
        }
    },
    {
        id: 'BOOKER_EXPERT',
        name: 'Ryan "The Route Master" O\'Connor',
        role: 'Booker',
        tier: 'expert',
        salary: 600,
        description: 'Expert tour manager who can book national tours and major festival slots.',
        bonuses: [
            { stat: 'cash', value: 12, description: '+12% income from national bookings' },
            { stat: 'hype', value: 2, description: '+2 Hype/week from high-profile shows' },
            { stat: 'fame', value: 1, description: '+1 Fame/week from festival exposure' }
        ],
        unlockRequirement: {
            type: 'fame',
            value: 50,
            message: 'Requires 50 Fame'
        }
    },
    {
        id: 'BOOKER_ELITE',
        name: 'Victoria "The Stadium Queen" Chen',
        role: 'Booker',
        tier: 'elite',
        salary: 1200,
        description: 'Top-tier booking agent with access to arenas, stadiums, and headline festival spots.',
        bonuses: [
            { stat: 'cash', value: 20, description: '+20% income from premium venue access' },
            { stat: 'hype', value: 3, description: '+3 Hype/week from major event bookings' },
            { stat: 'fame', value: 2, description: '+2 Fame/week from massive exposure' }
        ],
        unlockRequirement: {
            type: 'fame',
            value: 75,
            message: 'Requires 75 Fame'
        }
    },

    // ==================== PROMOTERS ====================
    {
        id: 'PROMOTER_ENTRY',
        name: 'Sam Taylor',
        role: 'Promoter',
        tier: 'entry',
        salary: 100,
        description: 'Junior publicist with social media savvy and grassroots marketing skills.',
        bonuses: [
            { stat: 'hype', value: 2, description: '+2 Hype/week from social media campaigns' },
        ],
        unlockRequirement: {
            type: 'feature',
            message: 'Unlock staff hiring system'
        }
    },
    {
        id: 'PROMOTER_PROFESSIONAL',
        name: 'Leo "The Mouthpiece" Petrov',
        role: 'Promoter',
        tier: 'professional',
        salary: 300,
        description: 'Skilled PR professional with media contacts and proven campaign strategies.',
        bonuses: [
            { stat: 'hype', value: 4, description: '+4 Hype/week from consistent PR work' },
            { stat: 'fame', value: 1, description: '+1 Fame/week from media placements' }
        ],
        unlockRequirement: {
            type: 'fame',
            value: 25,
            message: 'Requires 25 Fame'
        }
    },
    {
        id: 'PROMOTER_EXPERT',
        name: 'Nina "The Narrative" Rodriguez',
        role: 'Promoter',
        tier: 'expert',
        salary: 600,
        description: 'Expert publicist who shapes public perception and controls media narratives.',
        bonuses: [
            { stat: 'hype', value: 6, description: '+6 Hype/week from strategic PR campaigns' },
            { stat: 'fame', value: 2, description: '+2 Fame/week from premium media access' },
        ],
        unlockRequirement: {
            type: 'fame',
            value: 50,
            message: 'Requires 50 Fame'
        }
    },
    {
        id: 'PROMOTER_ELITE',
        name: 'Diana "The Legend" Washington',
        role: 'Promoter',
        tier: 'elite',
        salary: 1200,
        description: 'Elite publicist with direct access to major media outlets and celebrity networks.',
        bonuses: [
            { stat: 'hype', value: 8, description: '+8 Hype/week from elite media mastery' },
            { stat: 'fame', value: 3, description: '+3 Fame/week from A-list media coverage' },
            { stat: 'cash', value: 5, description: '+5% income from brand partnerships' }
        ],
        unlockRequirement: {
            type: 'fame',
            value: 75,
            message: 'Requires 75 Fame'
        }
    }
];

/**
 * Get staff templates filtered by what the player can currently unlock
 */
export function getAvailableStaff(playerFame: number, staffHiringUnlocked: boolean): StaffTemplate[] {
    return staffTemplates.filter(template => {
        // Feature-locked staff (entry level) require staff hiring to be unlocked
        if (template.unlockRequirement.type === 'feature') {
            return staffHiringUnlocked;
        }

        // Fame-locked staff require both staff hiring unlock AND fame threshold
        if (template.unlockRequirement.type === 'fame') {
            return staffHiringUnlocked && playerFame >= template.unlockRequirement.value;
        }

        return false;
    });
}

/**
 * Get all staff of a specific tier
 */
export function getStaffByTier(tier: 'entry' | 'professional' | 'expert' | 'elite'): StaffTemplate[] {
    return staffTemplates.filter(s => s.tier === tier);
}

/**
 * Get staff by role
 */
export function getStaffByRole(role: 'Manager' | 'Booker' | 'Promoter'): StaffTemplate[] {
    return staffTemplates.filter(s => s.role === role);
}

/**
 * Find a specific staff template by ID
 */
export function getStaffTemplate(id: string): StaffTemplate | undefined {
    return staffTemplates.find(s => s.id === id);
}

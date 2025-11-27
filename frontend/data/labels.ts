import type { RecordLabel } from '../types';

export const labels: RecordLabel[] = [
    {
        id: 'INDIE',
        name: 'SIRYUS A.M Collective',
        type: 'indie',
        reputation: 75,
        description: 'We are a creative collective and indie label focused on artist development. We believe in building careers, not just releasing singles. You will maintain creative control and own your masters after the contract period. We are selective about who we sign because we invest deeply in each artist.',
        terms: {
            advance: 5000,
            royaltyRate: 15,
            albumCommitment: 2,
            contractLength: 3,
            creativeControl: 85,
            recoupmentRate: 70,
            crossCollateralized: false,
            optionClause: false,
            advanceRecoupable: true,
            marketingBudget: 8000,
            tourSupport: 3000,
            territories: ['Nigeria', 'Ghana', 'Kenya', 'South Africa']
        },
        redFlags: [
            'The advance is small - only $5,000 to cover recording costs',
            'Limited to African territories only - no international distribution power',
            'You must recoup the $5,000 advance before seeing royalty payments',
            'Small marketing budget means limited promotional push'
        ],
        greenFlags: [
            'High creative control (85%) - you maintain artistic vision',
            'No cross-collateralization - each album is separate financially',
            'Fair royalty rate (15%) - above industry average for indie labels',
            'No option clause - you are free to leave after 3 years',
            'You will own your masters after the contract expires',
            'Label has strong relationships with African streaming platforms',
            'Only 70% of revenue goes to recoupment - 30% is yours immediately'
        ],
        dealBreakers: []
    },
    {
        id: 'MAJOR_ADVANCE',
        name: 'Global Records',
        type: 'major',
        reputation: 60,
        description: 'Global Records is a major label with worldwide distribution and massive marketing power. We have launched the careers of international superstars. This deal includes a substantial advance, global promotion, and access to the best producers and studios. We invest heavily in our artists and expect major returns.',
        terms: {
            advance: 250000,
            royaltyRate: 8,
            albumCommitment: 5,
            contractLength: 7,
            creativeControl: 25,
            recoupmentRate: 100,
            crossCollateralized: true,
            optionClause: true,
            advanceRecoupable: true,
            marketingBudget: 150000,
            tourSupport: 50000,
            territories: ['Worldwide']
        },
        redFlags: [
            'MAJOR RED FLAG: Cross-collateralization means if Album 1 flops, Album 2-5 must pay back Album 1\'s costs too. One failure affects everything.',
            'MAJOR RED FLAG: You must recoup the full $250,000 advance before earning ANY royalty payments. Most artists never recoup.',
            'Very low royalty rate (8%) - below industry standard',
            'Option clause gives THEM the power to extend your contract, not you. You could be trapped for 10+ years.',
            'Committed to 5 albums over 7 years - that is extremely difficult to deliver',
            'Very low creative control (25%) - they control your sound, image, features, and release schedule',
            '100% recoupment rate means every dollar of marketing, production, and promotion comes out of YOUR royalties first'
        ],
        greenFlags: [
            'Huge advance ($250,000) provides immediate financial security',
            'Massive marketing budget ($150,000 per album) means serious promotional push',
            'Worldwide distribution - your music will be available everywhere',
            'Access to top-tier producers, studios, and industry connections',
            'Significant tour support ($50,000) for live performances'
        ],
        dealBreakers: [
            'Many artists sign deals like this and never see another dollar after the advance',
            'You may be locked in for a decade with no creative freedom',
            'The label can drop you at any time but you cannot leave'
        ]
    },
    {
        id: 'MAJOR_ROYALTIES',
        name: 'Visionary Music Group',
        type: 'major',
        reputation: 85,
        description: 'Visionary Music Group is a forward-thinking label that partners with artists rather than controlling them. We offer major label resources with independent label respect. Our contracts are transparent, our royalty rates are fair, and we believe your creative vision is what makes you valuable. We invest in long-term careers, not quick hits.',
        terms: {
            advance: 50000,
            royaltyRate: 18,
            albumCommitment: 3,
            contractLength: 5,
            creativeControl: 70,
            recoupmentRate: 80,
            crossCollateralized: false,
            optionClause: false,
            advanceRecoupable: true,
            marketingBudget: 75000,
            tourSupport: 25000,
            territories: ['Worldwide']
        },
        redFlags: [
            'Moderate advance ($50,000) - not the life-changing money of major labels',
            'Still must recoup $50,000 before royalty payments kick in',
            'Committed to 3 albums in 5 years - still a significant output requirement',
            '80% recoupment rate is better than 100%, but still means most revenue goes to recoupment first'
        ],
        greenFlags: [
            'Excellent royalty rate (18%) - among the highest in the industry',
            'High creative control (70%) - you maintain your artistic vision',
            'No cross-collateralization - each album stands alone financially',
            'No option clause - clean exit after 5 years if you choose',
            'Strong marketing budget shows commitment to your success',
            'Worldwide distribution with major label infrastructure',
            'Only 80% goes to recoupment - you keep 20% from dollar one',
            'Label has reputation for artist-friendly practices'
        ],
        dealBreakers: []
    },
    {
        id: '360_DEAL',
        name: 'Empire Sound Entertainment',
        type: 'major',
        reputation: 50,
        description: 'Empire Sound Entertainment offers a comprehensive 360 deal where we invest in every aspect of your career. We take a percentage of ALL your income streams - music sales, touring, merch, endorsements, and more. In return, we provide full-service career management, marketing, touring support, and industry connections.',
        terms: {
            advance: 100000,
            royaltyRate: 10,
            albumCommitment: 4,
            contractLength: 6,
            creativeControl: 40,
            recoupmentRate: 100,
            crossCollateralized: true,
            optionClause: true,
            advanceRecoupable: true,
            marketingBudget: 100000,
            tourSupport: 40000,
            territories: ['Worldwide']
        },
        redFlags: [
            'CRITICAL: 360 deal means they take 20-30% of ALL income - touring, merch, endorsements, everything',
            'MAJOR RED FLAG: Cross-collateralization means all projects are financially linked',
            'Low royalty rate (10%) on music sales',
            'Option clause gives them power to extend contract',
            'Low creative control (40%) - they control most decisions',
            '100% recoupment means every marketing dollar comes from YOUR earnings first',
            'You must recoup $100,000 advance before ANY royalty payments'
        ],
        greenFlags: [
            'Large advance ($100,000) provides immediate financial security',
            'Strong marketing budget ($100,000) means serious promotional push',
            'Significant tour support ($40,000) for live performances',
            'Worldwide distribution and industry connections',
            'Full-service career management included'
        ],
        dealBreakers: [
            '360 deals are controversial - you give up percentage of income streams you could control yourself',
            'Many artists regret 360 deals once they become successful and realize how much money they\'re losing',
            'The label profits from your work even after the contract ends on some streams'
        ]
    },
    {
        id: 'DISTRIBUTION_ONLY',
        name: 'DistroFlow Digital',
        type: 'indie',
        reputation: 70,
        description: 'DistroFlow Digital is a modern distribution company, not a traditional label. We get your music on all platforms worldwide while you keep full ownership and control. We don\'t own your masters, we don\'t control your creative, and we don\'t recoup costs. You just pay us a percentage of distribution revenue.',
        terms: {
            advance: 0,
            royaltyRate: 85,
            albumCommitment: 1,
            contractLength: 2,
            creativeControl: 100,
            recoupmentRate: 0,
            crossCollateralized: false,
            optionClause: false,
            advanceRecoupable: false,
            marketingBudget: 0,
            tourSupport: 0,
            territories: ['Worldwide']
        },
        redFlags: [
            'No advance - you fund everything yourself',
            'No marketing budget - you handle all promotion',
            'No tour support - you finance tours yourself',
            'You take on all financial risk',
            'Limited career support or industry connections'
        ],
        greenFlags: [
            'HUGE: You keep 85% of streaming/sales revenue (we only take 15% distribution fee)',
            'HUGE: 100% creative control - complete artistic freedom',
            'You own your masters forever - the music is YOURS',
            'No recoupment - every dollar earned goes straight to your pocket',
            'Short 2-year contract - easy exit if you want to change',
            'No cross-collateralization - financial independence',
            'No option clause - you control your future',
            'Only 1 album commitment - minimal obligation'
        ],
        dealBreakers: []
    },

    // --- NEW INDIE LABELS (1-3 years) ---
    {
        id: 'SUNSET_BOULEVARD',
        name: 'Sunset Boulevard Records',
        type: 'indie',
        reputation: 72,
        description: 'A local indie label with a solid reputation for artist development. We focus on long-term careers rather than quick hits. Small advances, but fair royalties and genuine support.',
        terms: {
            advance: 8000,
            royaltyRate: 16,
            albumCommitment: 1,
            contractLength: 2,
            creativeControl: 80,
            recoupmentRate: 75,
            crossCollateralized: false,
            optionClause: false,
            advanceRecoupable: true,
            marketingBudget: 12000,
            tourSupport: 5000,
            territories: ['United States', 'Canada']
        },
        redFlags: [
            'Small advance ($8,000) - limited upfront capital',
            'Regional focus only - no international reach',
            'Must recoup $8,000 before royalty payments begin',
            'Modest marketing budget limits promotional reach'
        ],
        greenFlags: [
            'Strong royalty rate (16%) - fair for indie label',
            'High creative control (80%) - your vision matters',
            'Only 1 album commitment - low pressure',
            'Short 2-year contract - flexibility to move on',
            'No cross-collateralization - clean financial structure',
            'No option clause - you control your future',
            'Strong local connections and grassroots promotion skills',
            '25% of revenue is yours immediately (75% recoupment rate)'
        ],
        dealBreakers: []
    },
    {
        id: 'RHYTHM_SOUL',
        name: 'Rhythm & Soul Collective',
        type: 'indie',
        reputation: 78,
        description: 'Genre specialists with deep industry connections in your scene. We live and breathe this music. Our roster is curated, our fanbase is loyal, and our A&Rs actually understand the culture.',
        terms: {
            advance: 12000,
            royaltyRate: 17,
            albumCommitment: 2,
            contractLength: 3,
            creativeControl: 82,
            recoupmentRate: 70,
            crossCollateralized: false,
            optionClause: false,
            advanceRecoupable: true,
            marketingBudget: 15000,
            tourSupport: 8000,
            territories: ['United States', 'United Kingdom', 'Canada']
        },
        redFlags: [
            'Moderate advance ($12,000) - not life-changing money',
            '2 album commitment in 3 years - consistent output required',
            'Must recoup advance before royalties kick in',
            'Limited to primarily English-speaking markets'
        ],
        greenFlags: [
            'Excellent royalty rate (17%) - above average',
            'Very high creative control (82%) - artistic freedom',
            'Genre-specific expertise - they understand your music',
            'No cross-collateralization - albums financially separate',
            'No option clause - clean exit after 3 years',
            'Strong genre-specific fanbase and connections',
            'Better marketing budget than most indie labels',
            '30% of revenue is yours immediately'
        ],
        dealBreakers: []
    },
    {
        id: 'CREATIVE_ALLIANCE',
        name: 'Creative Alliance Records',
        type: 'indie',
        reputation: 82,
        description: 'A boutique indie label famous for transparency and artist-first philosophy. We publish our contract terms publicly, we pay on time, and we treat artists as partners. Our reputation speaks for itself.',
        terms: {
            advance: 10000,
            royaltyRate: 19,
            albumCommitment: 1,
            contractLength: 2,
            creativeControl: 88,
            recoupmentRate: 65,
            crossCollateralized: false,
            optionClause: false,
            advanceRecoupable: true,
            marketingBudget: 18000,
            tourSupport: 7000,
            territories: ['Worldwide']
        },
        redFlags: [
            'Moderate advance ($10,000) - not a huge upfront payment',
            'Must recoup $10,000 before seeing royalty payments',
            'Worldwide distribution but indie-level infrastructure',
            'Only 1 album - might feel rushed to deliver'
        ],
        greenFlags: [
            'EXCELLENT royalty rate (19%) - among the best in indie scene',
            'VERY high creative control (88%) - near total freedom',
            'Outstanding industry reputation - trusted by artists',
            'Only 1 album commitment - minimal pressure',
            'Short 2-year contract - maximum flexibility',
            'No cross-collateralization - clean financials',
            'No option clause - you\'re free after 2 years',
            'Strong marketing budget for an indie label',
            'Only 65% recoupment - you keep 35% from day one',
            'Worldwide distribution despite indie status'
        ],
        dealBreakers: []
    },

    // --- MID-LEVEL LABELS (2-4 years) ---
    {
        id: 'ATLANTIC_SHORES',
        name: 'Atlantic Shores Entertainment',
        type: 'major',
        reputation: 70,
        description: 'A growing mid-sized label with regional dominance and expanding national reach. We have major label resources without the corporate bureaucracy. Well-funded, hungry, and ready to invest in hits.',
        terms: {
            advance: 35000,
            royaltyRate: 13,
            albumCommitment: 2,
            contractLength: 3,
            creativeControl: 55,
            recoupmentRate: 85,
            crossCollateralized: false,
            optionClause: true,
            advanceRecoupable: true,
            marketingBudget: 45000,
            tourSupport: 18000,
            territories: ['United States', 'Canada', 'Mexico']
        },
        redFlags: [
            'Moderate royalty rate (13%) - not the best',
            'Option clause - they can extend, you cannot',
            '$35,000 advance must be recouped before royalties',
            'Moderate creative control (55%) - they have significant say',
            '85% recoupment rate - most revenue goes to recoupment first',
            'Limited to North American markets'
        ],
        greenFlags: [
            'Solid advance ($35,000) - real money upfront',
            'Strong marketing budget ($45,000) - serious promotional push',
            'Good tour support ($18,000) - helps with live shows',
            'No cross-collateralization - albums stand alone',
            'Growing label with momentum and ambition',
            '2 albums in 3 years - reasonable pace',
            'North American coverage - strong regional infrastructure'
        ],
        dealBreakers: []
    },
    {
        id: 'LEGACY_SOUND',
        name: 'Legacy Sound Group',
        type: 'major',
        reputation: 80,
        description: 'Founded by a legendary producer with 40+ years in the industry. We combine major label connections with boutique label attention. Our founder personally mentors every artist on our roster.',
        terms: {
            advance: 40000,
            royaltyRate: 15,
            albumCommitment: 2,
            contractLength: 4,
            creativeControl: 65,
            recoupmentRate: 80,
            crossCollateralized: false,
            optionClause: false,
            advanceRecoupable: true,
            marketingBudget: 60000,
            tourSupport: 25000,
            territories: ['Worldwide']
        },
        redFlags: [
            'Moderate advance ($40,000) - not major label money',
            '4-year commitment is significant',
            'Must recoup $40,000 before earning royalties',
            '80% recoupment rate - most revenue to recoupment',
            '2 albums in 4 years - steady output required'
        ],
        greenFlags: [
            'Good royalty rate (15%) - fair for mid-level',
            'Solid creative control (65%) - meaningful input',
            'Access to legendary founder/producer mentorship',
            'Major label connections without corporate control',
            'Strong marketing budget ($60,000) per album',
            'Excellent tour support ($25,000)',
            'Worldwide distribution - global reach',
            'No cross-collateralization - clean structure',
            'No option clause - you control exit',
            '20% of revenue is yours immediately'
        ],
        dealBreakers: []
    },
    {
        id: 'NEXTWAVE',
        name: 'NextWave Records',
        type: 'major',
        reputation: 75,
        description: 'An innovative hybrid label pioneering artist-partnership models. We split profits more fairly, give artists ownership stakes, and operate transparently. It\'s the future of music business.',
        terms: {
            advance: 30000,
            royaltyRate: 20,
            albumCommitment: 2,
            contractLength: 3,
            creativeControl: 75,
            recoupmentRate: 70,
            crossCollateralized: false,
            optionClause: false,
            advanceRecoupable: true,
            marketingBudget: 50000,
            tourSupport: 20000,
            territories: ['Worldwide']
        },
        redFlags: [
            'Moderate advance ($30,000) - smaller upfront',
            'Hybrid model is unproven long-term',
            'Must recoup $30,000 advance first',
            '3-year commitment to experimental model',
            '2 albums required - steady work needed'
        ],
        greenFlags: [
            'EXCELLENT royalty rate (20%) - profit-sharing partnership',
            'High creative control (75%) - strong artist input',
            'Innovative partnership model - you have ownership stake',
            'Strong marketing budget ($50,000)',
            'Good tour support ($20,000)',
            'Worldwide distribution',
            'Only 70% recoupment - 30% is yours immediately',
            'No cross-collateralization',
            'No option clause - freedom after 3 years',
            'Transparent operations - you see the numbers'
        ],
        dealBreakers: []
    },

    // --- LARGE/GLOBAL LABELS (3-5 years) ---
    {
        id: 'WORLDWIDE_MUSIC',
        name: 'Worldwide Music Corp',
        type: 'major',
        reputation: 55,
        description: 'One of the big three major labels. Unlimited resources, global reach, and proven hit-making machinery. Our contracts heavily favor us, but we can make you a household name internationally.',
        terms: {
            advance: 200000,
            royaltyRate: 9,
            albumCommitment: 4,
            contractLength: 5,
            creativeControl: 30,
            recoupmentRate: 100,
            crossCollateralized: true,
            optionClause: true,
            advanceRecoupable: true,
            marketingBudget: 180000,
            tourSupport: 60000,
            territories: ['Worldwide']
        },
        redFlags: [
            'MAJOR RED FLAG: Cross-collateralization - all albums financially linked',
            'MAJOR RED FLAG: Must recoup $200,000 before ANY royalty payments',
            'Very low royalty rate (9%) - below industry standard',
            'Very low creative control (30%) - they control your music',
            'Option clause - they can extend indefinitely',
            '4 albums in 5 years - extremely demanding',
            '100% recoupment - every dollar of costs from your earnings',
            'Most artists never recoup and never see royalties'
        ],
        greenFlags: [
            'Massive advance ($200,000) - immediate financial security',
            'Huge marketing budget ($180,000) - global promotional campaign',
            'Excellent tour support ($60,000)',
            'True worldwide distribution - every country',
            'Access to top producers, studios, A-list features',
            'Major label prestige and credibility',
            'Resources to make you an international star'
        ],
        dealBreakers: [
            'Artists often remain in debt despite success',
            'Label can drop you but you cannot leave',
            'Creative freedom is minimal'
        ]
    },
    {
        id: 'PLATINUM_HEIGHTS',
        name: 'Platinum Heights Records',
        type: 'major',
        reputation: 83,
        description: 'A major label that does things differently. We offer major resources with significantly better terms than competitors. We\'re selective - we only sign artists we believe in long-term.',
        terms: {
            advance: 120000,
            royaltyRate: 14,
            albumCommitment: 3,
            contractLength: 4,
            creativeControl: 58,
            recoupmentRate: 85,
            crossCollateralized: false,
            optionClause: false,
            advanceRecoupable: true,
            marketingBudget: 140000,
            tourSupport: 55000,
            territories: ['Worldwide']
        },
        redFlags: [
            'Large advance ($120,000) must be recouped',
            '3 albums in 4 years - consistent output required',
            'Moderate creative control (58%) - not full freedom',
            '85% recoupment rate - most revenue to costs',
            'Moderate royalty rate (14%) - not exceptional'
        ],
        greenFlags: [
            'Generous advance ($120,000) - financial security',
            'Better royalty rate (14%) than most majors',
            'Reasonable creative control (58%) for a major',
            'No cross-collateralization - rare for major label',
            'No option clause - clean exit after 4 years',
            'Massive marketing budget ($140,000)',
            'Excellent tour support ($55,000)',
            'Worldwide distribution and infrastructure',
            'Reputation for treating artists fairly',
            '15% of revenue is yours immediately',
            'Selective roster - they invest in success'
        ],
        dealBreakers: []
    },
    {
        id: 'COLUMBIA_SOUND',
        name: 'Columbia Sound House',
        type: 'major',
        reputation: 88,
        description: 'One of the most historic and prestigious labels in music. Legends have recorded here. Countless Grammys. The prestige is real, but so are the demanding expectations and traditional practices.',
        terms: {
            advance: 150000,
            royaltyRate: 11,
            albumCommitment: 3,
            contractLength: 5,
            creativeControl: 45,
            recoupmentRate: 95,
            crossCollateralized: true,
            optionClause: true,
            advanceRecoupable: true,
            marketingBudget: 200000,
            tourSupport: 75000,
            territories: ['Worldwide']
        },
        redFlags: [
            'RED FLAG: Cross-collateralization - albums financially linked',
            'Option clause - they control contract length',
            'Low royalty rate (11%) for this level',
            'Moderate creative control (45%) - traditional control',
            'Must recoup $150,000 advance before royalties',
            '95% recoupment rate - almost everything to costs',
            '3 albums in 5 years with high expectations',
            'Traditional major label practices - less flexibility'
        ],
        greenFlags: [
            'Huge advance ($150,000) - major financial boost',
            'MASSIVE marketing budget ($200,000) - premium promotion',
            'Excellent tour support ($75,000)',
            'Ultimate industry prestige - legendary label',
            'World-class studios and producers',
            'Grammy-winning team and track record',
            'Worldwide infrastructure and connections',
            'Cultural cachet and credibility',
            'Access to elite industry events and opportunities'
        ],
        dealBreakers: [
            'Traditional major label structure with all the pros and cons',
            'High expectations and pressure to perform'
        ]
    },
    {
        id: 'CHART_DYNASTY',
        name: 'Chart Dynasty Records',
        type: 'major',
        reputation: 68,
        description: 'The label behind countless Billboard #1 hits. We have the formula, the machinery, and the connections to create chart-toppers. Commercial success is our specialty, but artistic compromise is expected.',
        terms: {
            advance: 180000,
            royaltyRate: 10,
            albumCommitment: 4,
            contractLength: 5,
            creativeControl: 35,
            recoupmentRate: 100,
            crossCollateralized: true,
            optionClause: true,
            advanceRecoupable: true,
            marketingBudget: 220000,
            tourSupport: 70000,
            territories: ['Worldwide']
        },
        redFlags: [
            'MAJOR RED FLAG: Cross-collateralization across all albums',
            'MAJOR RED FLAG: Option clause - they control your future',
            'Very low creative control (35%) - heavy commercial pressure',
            'Low royalty rate (10%) despite success focus',
            'Must recoup $180,000 before any royalties',
            '100% recoupment - every cost from your earnings',
            '4 albums in 5 years - intense schedule',
            'Formula-driven approach - artistic compromise expected',
            'Commercial pressure over artistic integrity'
        ],
        greenFlags: [
            'Large advance ($180,000) - substantial upfront',
            'HIGHEST marketing budget ($220,000) - maximum exposure',
            'Excellent tour support ($70,000)',
            'Proven track record of creating hits',
            'Radio connections and playlist placements',
            'Major chart success infrastructure',
            'Worldwide distribution',
            'Access to hit-making producers and writers',
            'Focus on commercial success and Billboard charts'
        ],
        dealBreakers: [
            'Artistic vision will be compromised for commercial appeal',
            'High pressure to deliver radio hits'
        ]
    }
];

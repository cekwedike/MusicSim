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
    }
];
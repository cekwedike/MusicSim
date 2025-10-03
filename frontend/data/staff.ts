import type { Staff } from '../types';

export const staff: Staff[] = [
    {
        name: 'Alex "The Fixer" Chen',
        role: 'Manager',
        salary: 500,
        contractLength: 52, // 1 year
        bonuses: [
            { stat: 'cash', value: 10, description: "+10% income from gigs" },
            { stat: 'fame', value: 1, description: "+1 Fame/week from industry connections" }
        ],
    },
    {
        name: 'Maya "The Calendar" Singh',
        role: 'Booker',
        salary: 300,
        contractLength: 26, // 6 months
        bonuses: [
            { stat: 'cash', value: 5, description: "+5% income from better negotiated deals" },
        ],
    },
    {
        name: 'Leo "The Mouthpiece" Petrov',
        role: 'Promoter',
        salary: 400,
        contractLength: 26,
        bonuses: [
            { stat: 'hype', value: 3, description: "+3 Hype/week from constant PR" },
        ],
    }
];
import type { Achievement } from "../types";

export const achievements: Omit<Achievement, 'unlocked'>[] = [
    // Milestones
    { id: 'CASH_10K', name: 'Making Bank', description: 'Accumulate $10,000.' },
    { id: 'CASH_100K', name: 'Seriously Rich', description: 'Accumulate $100,000.' },
    { id: 'CASH_1M', name: 'Music Millionaire', description: 'Accumulate $1,000,000.' },
    { id: 'FAME_25', name: 'Local Hero', description: 'Reach 25 Fame.' },
    { id: 'FAME_50', name: 'Rising Star', description: 'Reach 50 Fame.' },
    { id: 'FAME_100', name: 'Superstar', description: 'Reach 100 Fame (Max). ' },
    { id: 'HYPE_50', name: 'Talk of the Town', description: 'Reach 50 Hype.' },
    { id: 'HYPE_100', name: 'Zeitgeist', description: 'Reach 100 Hype (Max).' },
    { id: 'CAREER_50', name: 'Seasoned Pro', description: 'Reach 50 Career Progress.' },
    { id: 'CAREER_100', name: 'Living Legend', description: 'Reach 100 Career Progress (Max).' },
    
    // Project Achievements
    { id: 'PROJECT_SINGLE_1', name: 'First Pressing', description: 'Release your debut single.' },
    { id: 'PROJECT_EP_1', name: 'Extended Play', description: 'Release your debut EP.' },
    { id: 'PROJECT_ALBUM_1', name: 'The Big One', description: 'Release your debut album.' },
    { id: 'PROJECT_ALBUM_2', name: 'Sophomore Success', description: 'Release your second album.' },

    // Business Achievements
    { id: 'SIGNED_VINYL_HEART_RECORDS', name: 'Indie Darling', description: 'Sign with Vinyl Heart Records, maintaining your creative independence.' },
    { id: 'SIGNED_GLOBAL_RECORDS', name: 'Big Money', description: 'Sign with Global Records for a massive advance.' },
    { id: 'SIGNED_VISIONARY_MUSIC_GROUP', name: 'The Smart Deal', description: 'Sign with Visionary Music Group for fair terms and creative control.' },
    { id: 'STAFF_MANAGER', name: 'Got a Manager', description: 'Hire your first manager.'},
    { id: 'STAFF_BOOKER', name: 'On the Books', description: 'Hire your first booker.'},
    { id: 'STAFF_PROMOTER', name: 'Hype Machine', description: 'Hire your first promoter.'},
    { id: 'STAFF_FULL_TEAM', name: 'Assemble the A-Team', description: 'Have a Manager, Booker, and Promoter all at once.' },
    
    // Contract Achievements
    { id: 'CONTRACT_REVIEWER', name: 'Due Diligence', description: 'Review your first record label contract carefully.' },
    { id: 'CONTRACT_EXPERT', name: 'Contract Whisperer', description: 'Review contracts from 3 different record labels.' },
    { id: 'WALKED_AWAY', name: 'The Power of No', description: 'Walk away from a record label contract offer.' },
    
    // Event Achievements
    { id: 'SELLOUT', name: 'Corporate Shill', description: 'License a song for a major ad campaign.' },
    { id: 'BATTLE_WINNER', name: 'Best in Show', description: 'Win the Battle of the Bands.' },
    { id: 'VIRAL_HIT', name: 'Viral Sensation', description: 'Have a song go viral online.' },
    { id: 'CRITICAL_DARLING', name: 'For the Critics', description: 'Receive a glowing review for a daring performance.' },
    { id: 'BURNOUT_RECOVERY', name: 'Bounced Back', description: 'Recover from a serious burnout.' },
    
    // Learning Achievements
    { id: 'EAGER_STUDENT', name: 'Eager Student', description: 'View 10 different lessons from game scenarios.' },
    { id: 'KNOWLEDGE_SEEKER', name: 'Knowledge Seeker', description: 'View 25 different lessons from game scenarios.' },
];
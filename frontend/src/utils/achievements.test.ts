import { describe, it, expect } from 'vitest';
import { checkAchievementsLite } from './achievements';

const baseState = () => ({
  achievements: [
    { id: 'CASH_10K', unlocked: false },
    { id: 'CASH_100K', unlocked: false },
    { id: 'FAME_50', unlocked: false },
    { id: 'DIFFICULTY_MASTER', unlocked: false },
  ],
  unseenAchievements: [],
  statistics: {
    totalGamesPlayed: 0,
    careersByDifficulty: { beginner: 0, realistic: 0, hardcore: 0 }
  }
} as any);

describe('achievements', () => {
  it('unlocks cash thresholds', () => {
    const state = baseState();
    const res = checkAchievementsLite(state, { cash: 15000, fame: 0, hype: 0, wellBeing: 0, careerProgress: 0 } as any);
    const a = res.achievements.find(x => x.id === 'CASH_10K');
    expect(a?.unlocked).toBe(true);
  });

  it('does not duplicate unlocks', () => {
    const state = baseState();
    state.achievements[0].unlocked = true;
    const res = checkAchievementsLite(state, { cash: 20000, fame: 0, hype: 0, wellBeing: 0, careerProgress: 0 } as any);
    const unseen = res.unseenAchievements.filter(id => id === 'CASH_10K');
    expect(unseen.length).toBe(0);
  });

  it('unlocks difficulty master with careers in all modes', () => {
    const state = baseState();
    state.statistics.careersByDifficulty = { beginner: 1, realistic: 1, hardcore: 1 };
    const res = checkAchievementsLite(state, { cash: 0, fame: 0, hype: 0, wellBeing: 0, careerProgress: 0 } as any);
    const a = res.achievements.find(x => x.id === 'DIFFICULTY_MASTER');
    expect(a?.unlocked).toBe(true);
  });
});

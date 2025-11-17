import { describe, it, expect } from 'vitest';
import { checkAchievementsLite } from './achievements';

function makeState(overrides: Partial<any> = {}) {
  return {
    achievements: [
      { id: 'CASH_10K', unlocked: false },
      { id: 'CASH_100K', unlocked: false },
      { id: 'CASH_1M', unlocked: false },
      { id: 'FAME_25', unlocked: false },
      { id: 'FAME_50', unlocked: false },
      { id: 'FAME_100', unlocked: false },
      { id: 'HYPE_50', unlocked: false },
      { id: 'HYPE_100', unlocked: false },
      { id: 'CAREER_50', unlocked: false },
      { id: 'CAREER_100', unlocked: false },
      { id: 'DIFFICULTY_MASTER', unlocked: false },
    ],
    unseenAchievements: [],
    statistics: {
      careersByDifficulty: { beginner: 0, realistic: 0, hardcore: 0 },
    },
    ...overrides,
  } as any;
}

describe('achievements deep', () => {
  it('unlocks multiple progressive thresholds simultaneously', () => {
    const state = makeState();
    const stats = { cash: 1_200_000, fame: 120, hype: 150, careerProgress: 120, wellBeing: 0 } as any;
    const { achievements, unseenAchievements } = checkAchievementsLite(state, stats);
    const unlockedIds = achievements.filter(a => a.unlocked).map(a => a.id);
    expect(unlockedIds).toEqual(expect.arrayContaining([
      'CASH_10K','CASH_100K','CASH_1M','FAME_25','FAME_50','FAME_100','HYPE_50','HYPE_100','CAREER_50','CAREER_100'
    ]));
    // ensure all added to unseen once
    expect(new Set(unseenAchievements).size).toBe(unseenAchievements.length);
  });

  it('does not re-add already unlocked achievements to unseen', () => {
    const state = makeState();
    // Pre-unlock some
    state.achievements.find(a => a.id === 'CASH_10K')!.unlocked = true;
    const { unseenAchievements } = checkAchievementsLite(state, { cash: 20_000, fame: 0, hype: 0, careerProgress: 0, wellBeing: 0 } as any);
    expect(unseenAchievements.includes('CASH_10K')).toBe(false);
  });

  it('unlocks difficulty master only when all difficulties played', () => {
    const state = makeState();
    state.statistics.careersByDifficulty = { beginner: 2, realistic: 0, hardcore: 1 };
    let res = checkAchievementsLite(state, { cash: 0, fame: 0, hype: 0, careerProgress: 0, wellBeing: 0 } as any);
    expect(res.achievements.find(a => a.id === 'DIFFICULTY_MASTER')!.unlocked).toBe(false);
    state.statistics.careersByDifficulty.realistic = 1;
    res = checkAchievementsLite(state, { cash: 0, fame: 0, hype: 0, careerProgress: 0, wellBeing: 0 } as any);
    expect(res.achievements.find(a => a.id === 'DIFFICULTY_MASTER')!.unlocked).toBe(true);
  });

  it('partial thresholds only unlock those met', () => {
    const state = makeState();
    const stats = { cash: 55_000, fame: 60, hype: 40, careerProgress: 10, wellBeing: 0 } as any;
    const { achievements } = checkAchievementsLite(state, stats);
    const unlocked = achievements.filter(a => a.unlocked).map(a => a.id);
    expect(unlocked).toEqual(expect.arrayContaining(['CASH_10K','FAME_25','FAME_50']));
    expect(unlocked).not.toEqual(expect.arrayContaining(['CASH_1M','FAME_100','HYPE_50','HYPE_100','CAREER_50','CAREER_100']));
  });

  it('unlocks nothing when below all thresholds', () => {
    const state = makeState();
    const stats = { cash: 100, fame: 1, hype: 0, careerProgress: 1, wellBeing: 0 } as any;
    const { achievements } = checkAchievementsLite(state, stats);
    expect(achievements.filter(a => a.unlocked).length).toBe(0);
  });
});

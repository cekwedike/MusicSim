import type { GameState, PlayerStats } from '../../types';

export function checkAchievementsLite(state: GameState, newStats: PlayerStats) {
  const achievements = [...state.achievements];
  const unseen = new Set(state.unseenAchievements);

  const unlock = (id: string, cond: boolean) => {
    const a = achievements.find(x => x.id === id);
    if (a && !a.unlocked && cond) {
      a.unlocked = true;
      unseen.add(id);
    }
  };

  unlock('CASH_10K', newStats.cash >= 10000);
  unlock('CASH_100K', newStats.cash >= 100000);
  unlock('CASH_1M', newStats.cash >= 1000000);

  unlock('FAME_25', newStats.fame >= 25);
  unlock('FAME_50', newStats.fame >= 50);
  unlock('FAME_100', newStats.fame >= 100);

  unlock('HYPE_50', newStats.hype >= 50);
  unlock('HYPE_100', newStats.hype >= 100);

  unlock('CAREER_50', newStats.careerProgress >= 50);
  unlock('CAREER_100', newStats.careerProgress >= 100);

  const beginnerCareers = state.statistics.careersByDifficulty.beginner;
  const realisticCareers = state.statistics.careersByDifficulty.realistic;
  const hardcoreCareers = state.statistics.careersByDifficulty.hardcore;
  unlock('DIFFICULTY_MASTER', beginnerCareers > 0 && realisticCareers > 0 && hardcoreCareers > 0);

  return { achievements, unseenAchievements: Array.from(unseen) };
}

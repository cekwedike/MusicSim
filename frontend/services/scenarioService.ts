import { scenarioBank, fallbackScenario } from '../data/scenarioBank';
import type { GameState, Scenario } from '../types';

/**
 * Checks if a scenario's conditions are met by the current game state.
 * @param scenario The scenario to check.
 * @param state The entire current game state.
 * @returns True if the conditions are met, false otherwise.
 */
const checkConditions = (scenario: Scenario, state: GameState): boolean => {
    if (!scenario.conditions) {
        return true; // No conditions, always available
    }

    const { playerStats, artistGenre, achievements, currentProject, staff } = state;
    const { 
        minFame, maxFame, minCash, maxCash, minWellBeing, maxWellBeing, 
        requiredGenre, minCareerProgress, minHype, maxHype, 
        requiredAchievementId, projectRequired, noProjectRequired,
        requiresStaff, missingStaff
    } = scenario.conditions;

    if (minFame !== undefined && playerStats.fame < minFame) return false;
    if (maxFame !== undefined && playerStats.fame > maxFame) return false;
    if (minCash !== undefined && playerStats.cash < minCash) return false;
    if (maxCash !== undefined && playerStats.cash > maxCash) return false;
    if (minWellBeing !== undefined && playerStats.wellBeing < minWellBeing) return false;
    if (maxWellBeing !== undefined && playerStats.wellBeing > maxWellBeing) return false;
    if (minCareerProgress !== undefined && playerStats.careerProgress < minCareerProgress) return false;
    if (minHype !== undefined && playerStats.hype < minHype) return false;
    if (maxHype !== undefined && playerStats.hype > maxHype) return false;

    if (requiredGenre && !requiredGenre.map(g => g.toLowerCase()).includes(artistGenre.toLowerCase())) {
        return false;
    }
    
    if (requiredAchievementId) {
        const achievement = achievements.find(a => a.id === requiredAchievementId);
        if (!achievement || !achievement.unlocked) return false;
    }

    if (projectRequired !== undefined && projectRequired && !currentProject) return false;
    if (noProjectRequired !== undefined && noProjectRequired && currentProject) return false;

    const currentStaffRoles = staff.map(s => s.role);
    if (requiresStaff) {
        if (!requiresStaff.every(role => currentStaffRoles.includes(role))) return false;
    }
    if (missingStaff) {
        if (missingStaff.some(role => currentStaffRoles.includes(role))) return false;
    }

    return true;
};

/**
 * Selects a new scenario for the player.
 * Filters the scenario bank based on current game state and avoids repeating scenarios.
 * @param state The current game state.
 * @returns A new Scenario object.
 */
export const getNewScenario = (state: GameState): Scenario => {
    const { usedScenarioTitles } = state;

    // Filter out scenarios marked as 'once' that have already been used
    const availableScenarios = scenarioBank.filter(s => {
        if (s.once) {
            return !usedScenarioTitles.includes(s.title);
        }
        return true;
    });

    const fittingScenarios = availableScenarios.filter(s => checkConditions(s, state));
    
    // If there are scenarios that fit the current state, pick one at random
    if (fittingScenarios.length > 0) {
        const randomIndex = Math.floor(Math.random() * fittingScenarios.length);
        return fittingScenarios[randomIndex];
    }
    
    // If no fitting scenarios, check if we've had too many fallbacks in a row.
    if (state.consecutiveFallbackCount >= 3) {
        // Force a different scenario to break the loop. Pick a random one from all available.
        const nonFittingButAvailable = availableScenarios.filter(s => s.title !== "An Uneventful Week");
        if (nonFittingButAvailable.length > 0) {
            const randomIndex = Math.floor(Math.random() * nonFittingButAvailable.length);
            return nonFittingButAvailable[randomIndex];
        }
    }
    
    // As a final resort, return the default fallback scenario
    return fallbackScenario;
};
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

    const { playerStats, artistGenre, achievements, currentProject, staff, difficulty } = state;
    const {
        minFame, maxFame, minFameByDifficulty, minCash, maxCash, minWellBeing, maxWellBeing,
        requiredGenre, minCareerProgress, minHype, maxHype,
        requiredAchievementId, projectRequired, noProjectRequired,
        requiresStaff, missingStaff
    } = scenario.conditions;

    // Check difficulty-based fame requirement (overrides minFame if present)
    if (minFameByDifficulty !== undefined) {
        const requiredFame = minFameByDifficulty[difficulty];
        if (playerStats.fame < requiredFame) return false;
    } else {
        // Fall back to standard minFame if no difficulty scaling
        if (minFame !== undefined && playerStats.fame < minFame) return false;
    }
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
 * Calculates a weight for a scenario based on how recently it was seen.
 * More recently seen scenarios get lower weights.
 * @param scenario The scenario to check
 * @param usedScenarioTitles Array of used scenario titles (most recent last)
 * @returns A weight multiplier (0.1 to 1.0)
 */
const getScenarioWeight = (scenario: Scenario, usedScenarioTitles: string[]): number => {
    const titleIndex = usedScenarioTitles.lastIndexOf(scenario.title);

    // If never seen, full weight
    if (titleIndex === -1) return 1.0;

    // Calculate how many scenarios ago this was seen
    const scenariosAgo = usedScenarioTitles.length - titleIndex;

    // Weight based on recency:
    // Just seen (1 ago): 0.1x weight
    // 2 ago: 0.2x weight
    // 3 ago: 0.3x weight
    // 4-5 ago: 0.5x weight
    // 6-7 ago: 0.7x weight
    // 8+ ago: 1.0x weight (full weight)
    if (scenariosAgo === 1) return 0.05; // Very unlikely to repeat immediately
    if (scenariosAgo === 2) return 0.15;
    if (scenariosAgo === 3) return 0.3;
    if (scenariosAgo <= 5) return 0.5;
    if (scenariosAgo <= 7) return 0.7;
    return 1.0;
};

/**
 * Performs weighted random selection from an array of scenarios.
 * @param scenarios Array of scenarios to choose from
 * @param usedScenarioTitles Array of recently used scenario titles
 * @returns Selected scenario
 */
const weightedRandomSelect = (scenarios: Scenario[], usedScenarioTitles: string[]): Scenario => {
    // Calculate weights for each scenario
    const weights = scenarios.map(s => getScenarioWeight(s, usedScenarioTitles));
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);

    // Select random value between 0 and total weight
    let random = Math.random() * totalWeight;

    // Find the scenario that corresponds to this random value
    for (let i = 0; i < scenarios.length; i++) {
        random -= weights[i];
        if (random <= 0) {
            return scenarios[i];
        }
    }

    // Fallback (should never reach here, but just in case)
    return scenarios[scenarios.length - 1];
};

/**
 * Selects a new scenario for the player with improved randomization.
 * Filters the scenario bank based on current game state and avoids repeating recent scenarios.
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

    // Get scenarios that fit the current game state
    const fittingScenarios = availableScenarios.filter(s => checkConditions(s, state));

    // If there are scenarios that fit, use weighted random selection to avoid repetition
    if (fittingScenarios.length > 0) {
        // Use weighted random selection to prefer scenarios not seen recently
        return weightedRandomSelect(fittingScenarios, usedScenarioTitles);
    }

    // If no fitting scenarios, check if we've had too many fallbacks in a row
    if (state.consecutiveFallbackCount >= 3) {
        // Force a different scenario to break the loop
        const nonFittingButAvailable = availableScenarios.filter(s => s.title !== "An Uneventful Week");
        if (nonFittingButAvailable.length > 0) {
            // Still use weighted selection even for forced scenarios
            return weightedRandomSelect(nonFittingButAvailable, usedScenarioTitles);
        }
    }

    // As a final resort, return the default fallback scenario
    return fallbackScenario;
};
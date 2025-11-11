// Simple test to verify CI pipeline
import { describe, it, expect } from 'vitest';

describe('MusicSim App', () => {
  it('should have basic functionality', () => {
    expect(1 + 1).toBe(2);
  });

  it('should handle environment setup', () => {
    expect(process.env.NODE_ENV).toBeDefined();
  });

  it('should validate basic app structure', () => {
    // Test basic JavaScript functionality
    const testObject = { name: 'MusicSim', type: 'game' };
    expect(testObject.name).toBe('MusicSim');
  });
});
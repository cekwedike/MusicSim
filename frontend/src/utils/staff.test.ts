import { describe, it, expect } from 'vitest';
import { hireStaffFromTemplate, updateStaffContractTime } from './staff';

describe('staff utils', () => {
  it('hires staff from template with correct fields', () => {
    const template = { id: 'MANAGER_ENTRY', name: 'Manager', role: 'Manager', tier: 'Entry', salary: 1000, bonuses: [] } as any;
    const hired = hireStaffFromTemplate(template, 3, new Date('2025-01-01'));
    expect(hired.role).toBe('Manager');
    expect(hired.monthsRemaining).toBe(3);
  });

  it('updates months remaining based on current date', () => {
    const template = { id: 'BOOKER_ENTRY', name: 'Booker', role: 'Booker', tier: 'Entry', salary: 800, bonuses: [] } as any;
    const hired = hireStaffFromTemplate(template, 2, new Date('2025-01-01'));
    const updated = updateStaffContractTime([hired], new Date('2025-02-15'))[0];
    expect(updated.monthsRemaining).toBeGreaterThan(0);
  });
});

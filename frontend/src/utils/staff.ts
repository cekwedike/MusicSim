import type { ContractDuration, HiredStaff, StaffTemplate } from '../../types';

export function hireStaffFromTemplate(template: StaffTemplate, contractDuration: ContractDuration, hiredDate: Date = new Date()): HiredStaff {
  const contractExpiresDate = new Date(hiredDate);
  contractExpiresDate.setMonth(contractExpiresDate.getMonth() + contractDuration);

  return {
    templateId: template.id,
    name: template.name,
    role: template.role,
    tier: template.tier,
    salary: template.salary,
    bonuses: [...template.bonuses],
    hiredDate: new Date(hiredDate),
    contractDuration,
    contractExpiresDate,
    monthsRemaining: contractDuration
  } as HiredStaff;
}

export function updateStaffContractTime(staff: HiredStaff[], currentDate: Date): HiredStaff[] {
  return staff.map(s => {
    const monthsRemaining = Math.max(0, Math.ceil(
      (s.contractExpiresDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
    ));
    return { ...s, monthsRemaining } as HiredStaff;
  });
}

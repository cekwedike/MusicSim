import { describe, it, expect } from 'vitest';
import { createLog, appendLogToArray } from './logUtils';

describe('logUtils', () => {
  it('createLog returns a LogEntry with expected fields', () => {
    const now = new Date();
  const log = createLog('Test message', 'success', now, '');
    expect(log.message).toBe('Test message');
    expect(log.type).toBe('success');
  expect(log.icon).toBe('');
    expect(log.timestamp).toBe(now);
  });

  it('appendLogToArray appends to existing array', () => {
    const l1 = createLog('one');
    const l2 = createLog('two');
    const arr = appendLogToArray([l1], l2);
    expect(arr.length).toBe(2);
    expect(arr[1].message).toBe('two');
  });
});

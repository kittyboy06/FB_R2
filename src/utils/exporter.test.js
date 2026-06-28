import { describe, test, expect, vi } from 'vitest';
import { exportSnapshot } from './exporter.js';

describe('exportSnapshot Utility', () => {
  test('exportSnapshot returns undefined immediately if pool is empty', () => {
    const result = exportSnapshot([]);
    expect(result).toBeUndefined();
  });

  test('exportSnapshot spawns Worker when pool is present', () => {
    const mockWorker = {
      postMessage: vi.fn(),
      terminate: vi.fn(),
      addEventListener: vi.fn()
    };
    
    const originalWorker = global.Worker;
    global.Worker = vi.fn().mockImplementation(() => mockWorker);
    global.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock');

    const mockPool = [
      { project_id: 'PRJ1', project_name: 'Name1' }
    ];

    exportSnapshot(mockPool);

    expect(global.Worker).toHaveBeenCalled();
    expect(mockWorker.postMessage).toHaveBeenCalledWith(expect.objectContaining({
      pool: mockPool,
      headers: expect.any(Array)
    }));

    global.Worker = originalWorker;
  });
});

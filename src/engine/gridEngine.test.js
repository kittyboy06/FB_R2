import { describe, test, expect, beforeEach } from 'vitest';
import gridEngine from './gridEngine.js';
import { masterMap } from './masterMap.js';

describe('gridEngine Ingestion', () => {
  beforeEach(() => {
    masterMap.clear();
  });

  test('process merges batch updates into masterMap and clones objects', () => {
    const mockBatch = [
      { internal_uid: 'uid_1', project_id: 'PRJ001', robots_deployed: 10 },
      { internal_uid: 'uid_2', project_id: 'PRJ002', robots_deployed: 20 }
    ];

    gridEngine.process(mockBatch);

    expect(masterMap.size).toBe(2);
    expect(masterMap.get('uid_1').project_id).toBe('PRJ001');
    expect(masterMap.get('uid_1')).not.toBe(mockBatch[0]);
    expect(masterMap.get('uid_1').robots_deployed).toBe(10);
  });
});

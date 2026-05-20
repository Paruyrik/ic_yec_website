import * as migration_20260515_102156 from './20260515_102156';
import * as migration_20260517_102734 from './20260517_102734';
import * as migration_20260520_131726 from './20260520_131726';
import * as migration_20260520_180000 from './20260520_180000';
import * as migration_20260520_190000 from './20260520_190000';

export const migrations = [
  {
    up: migration_20260515_102156.up,
    down: migration_20260515_102156.down,
    name: '20260515_102156',
  },
  {
    up: migration_20260517_102734.up,
    down: migration_20260517_102734.down,
    name: '20260517_102734',
  },
  {
    up: migration_20260520_131726.up,
    down: migration_20260520_131726.down,
    name: '20260520_131726',
  },
  {
    up: migration_20260520_180000.up,
    down: migration_20260520_180000.down,
    name: '20260520_180000',
  },
  {
    up: migration_20260520_190000.up,
    down: migration_20260520_190000.down,
    name: '20260520_190000',
  },
];

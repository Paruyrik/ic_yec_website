import * as migration_20260515_102156 from './20260515_102156';
import * as migration_20260517_102734 from './20260517_102734';

export const migrations = [
  {
    up: migration_20260515_102156.up,
    down: migration_20260515_102156.down,
    name: '20260515_102156',
  },
  {
    up: migration_20260517_102734.up,
    down: migration_20260517_102734.down,
    name: '20260517_102734'
  },
];

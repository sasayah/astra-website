import * as migration_20260719_215957_initial from './20260719_215957_initial';

export const migrations = [
  {
    up: migration_20260719_215957_initial.up,
    down: migration_20260719_215957_initial.down,
    name: '20260719_215957_initial'
  },
];

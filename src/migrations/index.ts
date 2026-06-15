import * as migration_20260515_102156 from './20260515_102156';
import * as migration_20260517_102734 from './20260517_102734';
import * as migration_20260520_131726 from './20260520_131726';
import * as migration_20260520_180000 from './20260520_180000';
import * as migration_20260520_190000 from './20260520_190000';
import * as migration_20260520_200000 from './20260520_200000';
import * as migration_20260520_210000 from './20260520_210000';
import * as migration_20260521_090000 from './20260521_090000';
import * as migration_20260521_100000 from './20260521_100000';
import * as migration_20260521_110000 from './20260521_110000';
import * as migration_20260521_120000 from './20260521_120000';
import * as migration_20260521_130000 from './20260521_130000';
import * as migration_20260521_140000 from './20260521_140000';
import * as migration_20260609_000000 from './20260609_000000';
import * as migration_20260613_053207_contact_and_footer_settings from './20260613_053207_contact_and_footer_settings';
import * as migration_20260613_060000_rename_about_story_paragraph_cols from './20260613_060000_rename_about_story_paragraph_cols';
import * as migration_20260615_111953_about_page_full_config from './20260615_111953_about_page_full_config';
import * as migration_20260615_131248_newsletter_slug from './20260615_131248_newsletter_slug';

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
  {
    up: migration_20260520_200000.up,
    down: migration_20260520_200000.down,
    name: '20260520_200000',
  },
  {
    up: migration_20260520_210000.up,
    down: migration_20260520_210000.down,
    name: '20260520_210000',
  },
  {
    up: migration_20260521_090000.up,
    down: migration_20260521_090000.down,
    name: '20260521_090000',
  },
  {
    up: migration_20260521_100000.up,
    down: migration_20260521_100000.down,
    name: '20260521_100000',
  },
  {
    up: migration_20260521_110000.up,
    down: migration_20260521_110000.down,
    name: '20260521_110000',
  },
  {
    up: migration_20260521_120000.up,
    down: migration_20260521_120000.down,
    name: '20260521_120000',
  },
  {
    up: migration_20260521_130000.up,
    down: migration_20260521_130000.down,
    name: '20260521_130000',
  },
  {
    up: migration_20260521_140000.up,
    down: migration_20260521_140000.down,
    name: '20260521_140000',
  },
  {
    up: migration_20260609_000000.up,
    down: migration_20260609_000000.down,
    name: '20260609_000000',
  },
  {
    up: migration_20260613_053207_contact_and_footer_settings.up,
    down: migration_20260613_053207_contact_and_footer_settings.down,
    name: '20260613_053207_contact_and_footer_settings',
  },
  {
    up: migration_20260613_060000_rename_about_story_paragraph_cols.up,
    down: migration_20260613_060000_rename_about_story_paragraph_cols.down,
    name: '20260613_060000_rename_about_story_paragraph_cols',
  },
  {
    up: migration_20260615_111953_about_page_full_config.up,
    down: migration_20260615_111953_about_page_full_config.down,
    name: '20260615_111953_about_page_full_config',
  },
  {
    up: migration_20260615_131248_newsletter_slug.up,
    down: migration_20260615_131248_newsletter_slug.down,
    name: '20260615_131248_newsletter_slug'
  },
];

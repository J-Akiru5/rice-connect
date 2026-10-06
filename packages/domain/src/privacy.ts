/* Privacy notice constants (Phase 4 readiness, RA 10173). Bump the version whenever the notice text changes:
   every consent row stores the version the person actually accepted, so an old consent always names its text. */
export const PRIVACY_VERSION = '2026-10-07';

/** Notice sections, in reading order; the screen renders `privacy.<section>.title` and `.body` for each. */
export const PRIVACY_SECTIONS = ['collect', 'why', 'who', 'retention', 'rights', 'contact', 'changes'] as const;
export type PrivacySection = (typeof PRIVACY_SECTIONS)[number];

import type {
  CmsMediaSlot,
  HomeContent,
  MissionStage,
  Solution,
} from './mock';

/**
 * The approved homepage contract is derived directly from its safe fallback
 * payload. The Apostrophe adapter must return this same shape so CMS wiring
 * cannot silently drift away from the visual implementation.
 */
export type HomePageContent = HomeContent;
export type HomeMedia = CmsMediaSlot;
export type HomeSolution = Solution;
export type HomeMissionStage = MissionStage;
export type HomeCapability = HomeContent['capabilities'][number];
export type HomeMetric = HomeContent['metrics'][number];
export type HomeSupportMode = HomeContent['support']['modes'][number];

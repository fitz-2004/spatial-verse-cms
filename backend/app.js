import 'dotenv/config';
import apostrophe from 'apostrophe';

apostrophe({
  root: import.meta,
  shortName: 'spatial-verse-cms',
  bundles: [ '@apostrophecms/blog' ],
  modules: {
    // Apostrophe module configuration
    // *******************************
    //
    // NOTE: most configuration occurs in the respective modules' directories.
    // See modules/@apostrophecms/page/index.js for an example.
    //
    // Any modules that are not present by default in Apostrophe must at least
    // have a minimal configuration here to turn them on: `moduleName: {}`
    // ***********************************************************************
    '@apostrophecms/vite': {},
    '@apostrophecms/rich-text-widget': {},
    '@apostrophecms/image-widget': {},
    '@apostrophecms/video-widget': {},
    // Home-only singleton widgets. Keep this registration block together so
    // the integration branch can resolve app.js conflicts without touching
    // another owner's content model. Area configuration uses these names
    // without the required `-widget` module suffix.
    'home-brand-widget': {},
    'home-hero-widget': {},
    'home-solutions-widget': {},
    'home-capabilities-widget': {},
    'home-why-widget': {},
    'home-support-widget': {},
    // The project's first custom page type.
    'default-page': {},
    'solution-page': {},
    'core-competency-page': {},
    'research-archive-page': {},
    'research-paper': {},
    'core-research-import': {},
    'dataset-library-page': {},
    // Shared registration file: keep Dataset registrations in a separate commit.
    'dataset-item': {},
    'dataset-import': {},
    'about-page': {},
    // Shared registration file: keep About import in a separate commit.
    'about-import': {},
    '@apostrophecms/blog': {},
    '@apostrophecms/blog-page': {},
    'nested-layout-widget': {},
    'nested-column-widget': {}
  }
});

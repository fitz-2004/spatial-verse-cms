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
    // Homepage content shared with future detail pages.
    product: {},
    capability: {},
    // Fixed homepage section widgets. Each is restricted to its matching area
    // in @apostrophecms/home-page.
    'hero-widget': {},
    'why-widget': {},
    'solutions-widget': {},
    'capabilities-widget': {},
    'support-modes-widget': {},
    'contact-widget': {},
    'home-content-import': {},
    // The project's first custom page type.
    'default-page': {},
    '@apostrophecms/blog': {},
    '@apostrophecms/blog-page': {},
    'nested-layout-widget': {},
    'nested-column-widget': {}
  }
});

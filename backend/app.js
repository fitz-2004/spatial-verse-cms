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
    // Allow video uploads for solution page hero media (shared infra change)
    '@apostrophecms/file': {
      options: {
        accepts: [
          // Apostrophe default list
          'jpg', 'jpeg', 'png', 'gif', 'svg', 'webp',
          'txt', 'rtf', 'pdf', 'xls', 'ppt', 'doc',
          'pptx', 'sldx', 'ppsx', 'potx', 'xlsx', 'xltx',
          'csv', 'docx', 'dotx',
          // Video extensions required by solution pages
          'mp4', 'mov', 'webm', 'm4v', 'avi', 'mkv'
        ]
      }
    },
    // The project's first custom page type.
    'default-page': {},
    'solution-page': {},
    'core-competency-page': {},
    'research-archive-page': {},
    'dataset-library-page': {},
    'about-page': {},
    '@apostrophecms/blog': {},
    '@apostrophecms/blog-page': {},
    'nested-layout-widget': {},
    'nested-column-widget': {}
  }
});

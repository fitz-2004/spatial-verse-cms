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
    // Allow video uploads for solution page hero media (shared infra change).
    // NOTE: `accepts` on @apostrophecms/file is NOT honored by this Apostrophe
    // version; the supported mechanism is `addFileGroups` on the attachment
    // module (see apostrophe/test/attachments.js).
    '@apostrophecms/attachment': {
      options: {
        addFileGroups: [
          {
            name: 'video',
            label: 'Video',
            extensions: [ 'mp4', 'mov', 'webm', 'm4v', 'avi', 'mkv' ],
            extensionMaps: {},
            // uploadfs should just accept this file as-is
            image: false
          }
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

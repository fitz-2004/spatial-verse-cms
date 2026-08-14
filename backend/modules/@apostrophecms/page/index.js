// This configures the @apostrophecms/page module to add a "home" page type to the
// pages menu

export default {
  options: {
    types: [
      {
        name: 'default-page',
        label: 'Default'
      },
      {
        name: '@apostrophecms/blog-page',
        label: 'Blog Page'
      },
      {
        name: '@apostrophecms/home-page',
        label: 'Home'
      },
      {
        name: 'solution-page',
        label: 'Solution Page'
      },
      {
        name: 'core-competency-page',
        label: 'Core Competency Page'
      },
      {
        name: 'research-archive-page',
        label: 'Research Archive Page'
      },
      {
        name: 'dataset-library-page',
        label: 'Dataset Library Page'
      },
      {
        name: 'about-page',
        label: 'About Page'
      }
    ]
  }
};

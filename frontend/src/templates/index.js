// Template registry — maps backend page type names to Astro components.
// Keys MUST match the backend module name exactly (e.g. '@apostrophecms/home-page', 'default-page').
// A wrong or missing key silently falls back to a default renderer — the page
// will appear blank in the frontend with no console warning or error thrown.
// Piece show/index pages use the 'module-name:show' / 'module-name:index' pattern.
import HomePage from './HomePage.astro';
import DefaultPage from './DefaultPage.astro';
import BlogIndexPage from './BlogIndexPage.astro';
import BlogShowPage from './BlogShowPage.astro';
import NotFoundPage from './NotFoundPage.astro';
import SolutionPage from './SolutionPage.astro';
import CoreCompetencyPage from './CoreCompetencyPage.astro';
import ResearchArchivePage from './ResearchArchivePage.astro';
import DatasetLibraryPage from './DatasetLibraryPage.astro';
import AboutPage from './AboutPage.astro';

const templateComponents = {
  '@apostrophecms/home-page': HomePage,
  'default-page': DefaultPage,
  'solution-page': SolutionPage,
  'core-competency-page': CoreCompetencyPage,
  'research-archive-page': ResearchArchivePage,
  'dataset-library-page': DatasetLibraryPage,
  'about-page': AboutPage,
  '@apostrophecms/blog-page:index': BlogIndexPage,
  '@apostrophecms/blog-page:show': BlogShowPage,
  '@apostrophecms/page:notFound': NotFoundPage
};

export default templateComponents;

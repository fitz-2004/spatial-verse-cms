// Widget registry — maps backend module names to Astro components.
// Keys MUST match the backend module name exactly (e.g. '@apostrophecms/rich-text', 'hero').
// A wrong or missing key silently falls back to a default renderer — the widget
// will appear blank in the frontend with no console warning or error thrown.
import RichTextWidget from './RichTextWidget.astro';
import ImageWidget from './ImageWidget.astro';
import VideoWidget from './VideoWidget.astro';
import LayoutWidget from '@apostrophecms/apostrophe-astro/widgets/LayoutWidget.astro';
import LayoutColumnWidget from '@apostrophecms/apostrophe-astro/widgets/LayoutColumnWidget.astro';
import NestedLayoutWidget from '@apostrophecms/apostrophe-astro/widgets/LayoutWidget.astro';
import NestedLayoutColumnWidget from '@apostrophecms/apostrophe-astro/widgets/LayoutColumnWidget.astro';
import FileWidget from './FileWidget.astro';
// Homepage-only contextual widgets. Keeping these mappings in one isolated block
// avoids coupling another page team's template to the homepage content model.
import HomeBrandWidget from './home/HomeBrandWidget.astro';
import HomeHeroWidget from './home/HomeHeroWidget.astro';
import HomeSolutionsWidget from './home/HomeSolutionsWidget.astro';
import HomeCapabilitiesWidget from './home/HomeCapabilitiesWidget.astro';
import HomeWhyWidget from './home/HomeWhyWidget.astro';
import HomeSupportWidget from './home/HomeSupportWidget.astro';

const widgetComponents = {
  '@apostrophecms/rich-text': RichTextWidget,
  '@apostrophecms/image': ImageWidget,
  '@apostrophecms/video': VideoWidget,
  '@apostrophecms/layout': LayoutWidget,
  '@apostrophecms/layout-column': LayoutColumnWidget,
  'nested-layout': NestedLayoutWidget,
  'nested-column': NestedLayoutColumnWidget,
  '@apostrophecms/file': FileWidget,
  'home-brand': HomeBrandWidget,
  'home-hero': HomeHeroWidget,
  'home-solutions': HomeSolutionsWidget,
  'home-capabilities': HomeCapabilitiesWidget,
  'home-why': HomeWhyWidget,
  'home-support': HomeSupportWidget,
};

export default widgetComponents;

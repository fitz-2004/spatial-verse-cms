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
import HeroWidget from './HeroWidget.astro';
import WhyWidget from './WhyWidget.astro';
import SolutionsWidget from './SolutionsWidget.astro';
import CapabilitiesWidget from './CapabilitiesWidget.astro';
import SupportModesWidget from './SupportModesWidget.astro';
import ContactWidget from './ContactWidget.astro';

const widgetComponents = {
  '@apostrophecms/rich-text': RichTextWidget,
  '@apostrophecms/image': ImageWidget,
  '@apostrophecms/video': VideoWidget,
  '@apostrophecms/layout': LayoutWidget,
  '@apostrophecms/layout-column': LayoutColumnWidget,
  'nested-layout-widget': NestedLayoutWidget,
  'nested-column-widget': NestedLayoutColumnWidget,
  '@apostrophecms/file': FileWidget,
  'hero': HeroWidget,
  'why': WhyWidget,
  'solutions': SolutionsWidget,
  'capabilities': CapabilitiesWidget,
  'support-modes': SupportModesWidget,
  'contact': ContactWidget,
};

export default widgetComponents;

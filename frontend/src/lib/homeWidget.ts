export function areaText(area: any, fallback = '') {
  const html = area?.items?.find((item: any) => item?.type === '@apostrophecms/rich-text')?.content;
  if (typeof html !== 'string' || !html.trim()) return fallback;
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, ' ')
    .trim() || fallback;
}

export function attachmentUrl(attachment: any) {
  return attachment?._url
    || attachment?._urls?.original
    || attachment?.attachment?._url
    || attachment?.attachment?._urls?.original;
}

export function hasSingleton(area: any, type: string) {
  return Boolean(area?.items?.some((item: any) => item?.type === type));
}

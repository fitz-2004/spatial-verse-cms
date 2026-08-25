export const datasetSeedMedia: Record<string, { cover: string; gallery?: string[] }> = {
  'electrical-appliances': { cover: 'electrical-appliances.png' },
  'professional-electrical-appliances': { cover: 'professional-electrical-appliances.png' },
  furniture: { cover: 'furniture.jpg' },
  'professional-furniture': { cover: 'professional-furniture.jpg' },
  teapot: { cover: 'teapot.gif' },
  wardrobe: { cover: 'wardrobe.gif' },
  oven: { cover: 'oven.gif' },
  'flexible-deformation': { cover: 'flexible-deformation.gif' },
  'splashing-deformation': { cover: 'splashing-deformation.gif' },
  'fractured-deformation': { cover: 'fractured-deformation.jpg' },
  'indoor-scene': { cover: 'indoor-scene.jpg' },
  'commercial-space-scene': { cover: 'commercial-space-scene.png' },
  'object-recognition': {
    cover: 'object-recognition-rgb.jpg',
    gallery: [ 'object-recognition-rgb.jpg', 'object-recognition-mask.png', 'object-recognition-depth.png' ]
  },
  'bow-shaped-trajectory': {
    cover: 'bow-shaped-trajectory-rgb.jpg',
    gallery: [
      'bow-shaped-trajectory-rgb.jpg', 'bow-shaped-trajectory-semantic.png',
      'bow-shaped-trajectory-depth.png', 'bow-shaped-trajectory-normal.png',
      'bow-shaped-trajectory-texture.png'
    ]
  },
  'random-roaming': {
    cover: 'random-roaming-rgb.jpg',
    gallery: [
      'random-roaming-rgb.jpg', 'random-roaming-semantic.png',
      'random-roaming-depth.png', 'random-roaming-normal.png',
      'random-roaming-texture.png'
    ]
  }
};

export const datasetSeedMediaUrl = (filename?: string) => filename
  ? `/media/datasets/${encodeURIComponent(filename)}`
  : undefined;

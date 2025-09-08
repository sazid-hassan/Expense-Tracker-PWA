import { BackgroundImageInfo } from '../types';

// Configuration for background images
// This array defines the available background images and their properties
// To add a new background image, simply add a new entry to this array
const backgroundImageConfig: BackgroundImageInfo[] = [
  {
    id: 'paper-desktop',
    name: 'Paper',
    path: 'paper',
    imagePath: '/bg-images/paper/paper-desktop.jpg'
  },
  {
    id: 'green-bg',
    name: 'Ever Green',
    path: 'ever-green',
    imagePath: '/bg-images/ever-green/green-bg.jpg'
  },
  {
    id: 'dark-studio',
    name: 'Dark Studio',
    path: 'dark-studio',
    imagePath: '/bg-images/dark-studio/dark-studio.png'
  },
  {
    id: 'dark-studio-2',
    name: 'Dark Studio 2',
    path: 'dark-studio-2',
    imagePath: '/bg-images/dark-studio-2/dark-studio-2.png'
  }
];

// Function to get all available background images
export const getAllBackgroundImages = (): BackgroundImageInfo[] => {
  return backgroundImageConfig;
};

// Function to get background image info by ID
export const getBackgroundImageInfo = (id: string): BackgroundImageInfo | undefined => {
  return backgroundImageConfig.find(bg => bg.id === id);
};

// Function to get background image path by ID
export const getBackgroundImagePath = (id: string | null | undefined): string => {
  if (!id) return '/bg-images/paper/paper-desktop.jpg'; // fallback for null/undefined
  
  const bgInfo = getBackgroundImageInfo(id);
  return bgInfo ? bgInfo.imagePath : '/bg-images/paper/paper-desktop.jpg'; // fallback
};

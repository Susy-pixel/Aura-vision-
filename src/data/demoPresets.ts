import { DemoPreset } from '../types/vision';
import tigerImage from '../assets/images/demo_tiger_1790448505069.jpg';
import infantImage from '../assets/images/demo_infant_1790448520741.jpg';
import sportsCarImage from '../assets/images/demo_sports_car_1790448532095.jpg';
import flowerImage from '../assets/images/demo_flower_1790448543252.jpg';

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: 'tiger',
    title: 'Bengal Tiger',
    category: 'Animal',
    description: 'Crisp subject with visible vertical striping, feline facial structure, and clear diagnostic anatomy.',
    imageSrc: tigerImage,
    expectedConfidence: 'HIGH CONFIDENCE',
    difficultyNote: 'Tests specific species disambiguation (identifying "Bengal tiger" rather than a generic "Cat").',
  },
  {
    id: 'infant',
    title: 'Human Infant',
    category: 'Human',
    description: 'High-detail close-up of a newborn child in soft window light with fine facial features.',
    imageSrc: infantImage,
    expectedConfidence: 'HIGH CONFIDENCE',
    difficultyNote: 'Tests demographic specificity (identifying "Human infant" rather than generic "Person").',
  },
  {
    id: 'sports_car',
    title: 'Supercar at Dusk',
    category: 'Vehicle',
    description: 'Aerodynamic automotive design with sunset reflections, alloy wheels, and distinct silhouette.',
    imageSrc: sportsCarImage,
    expectedConfidence: 'HIGH CONFIDENCE',
    difficultyNote: 'Tests machine recognition under complex ambient sunset lighting.',
  },
  {
    id: 'dahlia',
    title: 'Sunset Dahlia Bloom',
    category: 'Plant',
    description: 'Macro floral photography with concentric geometric petals and water droplet microtextures.',
    imageSrc: flowerImage,
    expectedConfidence: 'HIGH CONFIDENCE',
    difficultyNote: 'Tests botanical and textural pattern analysis.',
  },
];

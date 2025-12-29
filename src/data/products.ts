import { Product } from '@/types';
import aavarampooSoap from '@/assets/aavarampoo-soap.png';
import herbalSoap from '@/assets/herbal-soap.png';
import herbalHairOil from '@/assets/herbal-hair-oil.png';
import dandruffOil from '@/assets/dandruff-oil.png';

export const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Aavarampoo Soap',
    description: 'Deeply cleanses & helps brighten skin naturally with the goodness of Aavarampoo flowers.',
    price: 120,
    image: aavarampooSoap,
    images: [aavarampooSoap],
    specification: '75 g',
    ingredients: ['Aavarampoo', 'Coconut Oil', 'Glycerine', 'Natural Perfume'],
    category: 'soap',
    inStock: true,
  },
  {
    id: '2',
    name: 'Herbal Neem Soap',
    description: 'Fights skin infections & acne with powerful antibacterial herbs and aloe vera.',
    price: 99,
    image: herbalSoap,
    images: [herbalSoap],
    specification: '75 g',
    ingredients: ['Neem', 'Acalypha Indica', 'Aloe Vera', 'Coconut Oil', 'Glycerine'],
    category: 'soap',
    inStock: true,
  },
  {
    id: '3',
    name: 'Herbal Hair Oil',
    description: 'Strengthens roots & reduces hair fall with traditional herbal formulation.',
    price: 250,
    image: herbalHairOil,
    images: [herbalHairOil],
    specification: '100 ml',
    ingredients: ['Curry Leaf', 'Indigo', 'Aavarampoo', 'Kesavardhini', 'Bhringraj', 'Coconut Oil', 'Hibiscus', 'Henna'],
    category: 'oil',
    inStock: true,
  },
  {
    id: '4',
    name: 'Anti-Dandruff Hair Oil',
    description: 'Reduces dandruff & nourishes scalp with herbal anti-dandruff formulation.',
    price: 280,
    image: dandruffOil,
    images: [dandruffOil],
    specification: '100 ml',
    ingredients: ['Neem Oil', 'Tea Tree', 'Bhringraj', 'Coconut Oil', 'Natural Herbs'],
    category: 'oil',
    inStock: true,
  },
];

import { Product } from '@/types';
import herbalsoapbox from '@/assets/herbal_soap_box.webp';
import herbalSoap from '@/assets/herbal_soap.webp';
import aavarampooSoapbox from '@/assets/aavarampoo_soap_box.webp';
import aavarampooSoap from '@/assets/aavarampoo_soap.webp';
import papayasoapbox from '@/assets/papaya_soap_box.webp';
import papayasoap from '@/assets/papaya_soap.webp';
import herbalhairoil100ml from '@/assets/hair_oil_100ml.webp';
import herbalhairoil200ml from '@/assets/hair_oil_200ml.webp';
import herbalshampoo from '@/assets/herbal_shampoo.webp';

export const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Herbal Soap',
    description: 'Deeply cleanses & helps prevent acne naturally with the goodness of Neem and Kuppaimeni herbs.',
    price: 60,
    image: herbalsoapbox,
    images: [herbalsoapbox, herbalSoap],
    specification: '100 g',
    ingredients: ['Neem', 'Acalypha Indica (Kuppaimeni)', 'Coconut Oil', 'Aloe Vera', 'Glycerine', 'Perfume'],
    category: 'soap',
    inStock: true,
  },
  {
    id: '2',
    name: 'Aavarampoo Soap',
    description: 'Deeply cleanses & helps brighten skin naturally with the goodness of Aavarampoo flowers.',
    price: 60,
    image: aavarampooSoapbox,
    images: [aavarampooSoapbox, aavarampooSoap],
    specification: '100 g',
    ingredients: ['Aavarampoo', 'Coconut Oil', 'Glycerine', 'Perfume'],
    category: 'soap',
    inStock: true,
  },
  {
    id: '3',
    name: 'Papaya Soap',
    description: 'Gently exfoliates & reveals natural glow with the goodness of Papaya and Honey.',
    price: 60,
    image: papayasoapbox,
    images: [papayasoapbox, papayasoap],
    specification: '100 g',
    ingredients: ['Papaya', 'Honey', 'Coconut Oil', 'Glycerine', 'Perfume'],
    category: 'soap',
    inStock: true,
  },
  {
    id: '4',
    name: 'Herbal Hair Oil',
    description: 'Strengthens roots & promotes healthy hair growth naturally with the goodness of traditional herbal oils.',
    price: 240,
    image: herbalhairoil200ml,
    images: [herbalhairoil200ml],
    specification: '200 ml',
    ingredients: ['Curry Leaf', 'Indigo', 'Aavarampoo', 'Kesavardhini', 'Bhringraj', 'Coconut Oil', 'Hibiscus', 'Henna'],
    category: 'oil',
    inStock: true,
  },
  {
    id: '5',
    name: 'Herbal Shampoo',
    description: 'Helps control dandruff & promotes healthy hair growth with the goodness of traditional herbal extracts.',
    price: 130,
    image: herbalshampoo,
    images: [herbalshampoo],
    specification: '220 ml',
    ingredients: ['Curry Leaf', 'Indigo', 'Aavarampoo', 'Kesavardhini', 'Bhringraj', 'Shampoo Base'],
    category: 'shampoo',
    inStock: true,
  }
];

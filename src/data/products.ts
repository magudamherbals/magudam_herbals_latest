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
import shikakaiShampoo from '@/assets/Shikakai_Shampoo.webp';
import nalanguPowder1 from '@/assets/nalagu_maavu_1.jpg';
import nalanguPowder2 from '@/assets/nalagu_maavu_2.jpg';
import hairDyePowderBlack1 from '@/assets/hair_dye_black_1.jpg';
import hairDyePowderBlack2 from '@/assets/hair_dye_black_2.jpg';
import faceCream1 from '@/assets/face_cream_1.jpg';
import faceCream2 from '@/assets/face_cream_2.jpg';
import kneePainOil1 from '@/assets/knee_pain_oil_1.jpg';
import kneePainOil2 from '@/assets/knee_pain_oil_2.jpg';


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
    price: 120,
    image: herbalhairoil100ml,
    images: [herbalhairoil100ml],
    specification: '100 ml',
    ingredients: ['Curry Leaf', 'Indigo', 'Aavarampoo', 'Kesavardhini', 'Bhringraj', 'Coconut Oil', 'Hibiscus', 'Henna'],
    category: 'oil',
    inStock: true,
  },
  {
    id: '5',
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
    id: '6',
    name: 'Herbal Shampoo',
    description: 'Helps control dandruff & promotes healthy hair growth with the goodness of traditional herbal extracts.',
    price: 130,
    image: herbalshampoo,
    images: [herbalshampoo],
    specification: '220 ml',
    ingredients: ['Curry Leaf', 'Indigo', 'Aavarampoo', 'Kesavardhini', 'Bhringraj', 'Shampoo Base'],
    category: 'shampoo',
    inStock: true,
  },
  {
    id: '7',
    name: 'Shikakai Shampoo',
    description: 'Helps control dandruff & promotes healthy hair growth with the goodness of traditional herbal extracts.',
    price: 150,
    image: shikakaiShampoo,
    images: [shikakaiShampoo],
    specification: '220 ml',
    ingredients: ['Curry Leaf', 'Indigo', 'Aavarampoo', 'Kesavardhini', 'Bhringraj', 'Shampoo Base', 'Shikakai', 'Fenugreek', 'Moong Dal', 'Bengal Gram', 'Soapnut'],
    category: 'shampoo',
    inStock: true,
  },
  {
    id: '8',
    name: 'Hair Dye Powder - Black Colour',
    description: '100% natural herbal hair dye for a rich black colour with 0% chemicals.',
    price: 100,
    image: hairDyePowderBlack1,
    images: [hairDyePowderBlack1, hairDyePowderBlack2],
    specification: '50 gm',
    ingredients: ['Avuri', 'Katha'],
    category: 'powder',
    inStock: true,
  },
  // {
  //   id: '9',
  //   name: 'Hair Dye Powder - Brown Colour',
  //   description: '100% natural herbal hair dye for a beautiful brown shade with 0% chemicals.',
  //   price: 100,
  //   image: hairDyePowderBrown,
  //   images: [hairDyePowderBrown],
  //   specification: '50 gm',
  //   ingredients: ['Avuri', 'Katha', 'Maruthani', 'Kariya Polam'],
  //   category: 'powder',
  //   inStock: true,
  // },
  {
    id: '9',
    name: 'Nalangu Powder',
    description: 'Gently cleanses and softens the skin, promotes a natural glow, helps reduce acne & dark spots, and is ideal for daily bathing.',
    price: 80,
    image: nalanguPowder1,
    images: [nalanguPowder1, nalanguPowder2],
    specification: '50 gm',
    ingredients: ['Manjistha', 'Aavarampoo', 'Rose Petals', 'Magizham Flower', 'Orange Peel', 'Green Gram', 'Mysore Dal', 'Vetiver Root', 'Nut Grass', 'Poolan Kilangu'],
    category: 'powder',
    inStock: true,
  },
  {
    id: '10',
    name: 'Pigmentation & Night Cream',
    description: 'Nourishes overnight, brightens uneven skin tone & reveals a naturally radiant glow.',
    price: 80,
    image: faceCream1,
    images: [faceCream1, faceCream2],
    specification: '15 gm',
    ingredients: ['Badam', 'Manjistha', 'Kumkumboo', 'Poovarsu Leaves', 'Orange Peel', 'Carrot', 'Beeswax', 'etc'],
    category: 'cream',
    inStock: true,
  },
  {
    id: '11',
    name: 'Knee Pain Oil',
    description: 'Soothes stiff joints & supports comfortable movement with the goodness of traditional herbal ingredients.',
    price: 150,
    image: kneePainOil1,
    images: [kneePainOil1, kneePainOil2],
    specification: '120 ml',
    ingredients: ['Mudakathan Leaves', 'Thumbai', 'Pirandai', 'Pudina Salt', 'Pachai Karpooram', 'Ooma Salt', 'etc'],
    category: 'oil',
    inStock: true,
  }

];

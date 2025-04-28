import { ArchaeologicalSite } from '../types';

export const siteData: ArchaeologicalSite[] = [
  {
    id: '1',
    name: 'Ancient Settlement Alpha',
    era: 'Bronze Age',
    category: 'Settlement',
    description: 'A well-preserved Bronze Age settlement featuring remains of circular dwellings and storage facilities.',
    coordinates: [51.505, -0.09],
    image: 'https://images.pexels.com/photos/6033675/pexels-photo-6033675.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    has3DTour: true
  },
  {
    id: '2',
    name: 'Burial Mound Beta',
    era: 'Iron Age',
    category: 'Burial',
    description: 'A significant Iron Age burial mound containing artifacts suggesting high-status individuals.',
    coordinates: [51.51, -0.1],
    image: 'https://images.pexels.com/photos/13580470/pexels-photo-13580470.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    has3DTour: false
  },
  {
    id: '3',
    name: 'Roman Fortress Gamma',
    era: 'Roman',
    category: 'Fortress',
    description: 'The remains of a strategic Roman fortress guarding an important river crossing.',
    coordinates: [51.515, -0.09],
    image: 'https://images.pexels.com/photos/5227307/pexels-photo-5227307.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    has3DTour: true
  },
  {
    id: '4',
    name: 'Medieval Abbey Delta',
    era: 'Medieval',
    category: 'Religious',
    description: 'A partially restored medieval abbey with impressive architectural features.',
    coordinates: [51.52, -0.095],
    image: 'https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    has3DTour: true
  },
  {
    id: '5',
    name: 'Stone Circle Epsilon',
    era: 'Stone Age',
    category: 'Religious',
    description: 'A ceremonial stone circle with astronomical alignments.',
    coordinates: [51.525, -0.085],
    image: 'https://images.pexels.com/photos/5242506/pexels-photo-5242506.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    has3DTour: false
  },
  {
    id: '6',
    name: 'Viking Settlement Zeta',
    era: 'Medieval',
    category: 'Settlement',
    description: 'A Viking trading post with evidence of international contacts.',
    coordinates: [51.508, -0.11],
    image: 'https://images.pexels.com/photos/6338366/pexels-photo-6338366.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    has3DTour: false
  },
  {
    id: '7',
    name: 'Bronze Age Barrow Eta',
    era: 'Bronze Age',
    category: 'Burial',
    description: 'A cluster of burial mounds containing well-preserved grave goods.',
    coordinates: [51.513, -0.105],
    image: 'https://images.pexels.com/photos/2397652/pexels-photo-2397652.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    has3DTour: true
  },
  {
    id: '8',
    name: 'Iron Age Hillfort Theta',
    era: 'Iron Age',
    category: 'Fortress',
    description: 'A strategically positioned hillfort with multiple defensive banks and ditches.',
    coordinates: [51.502, -0.095],
    image: 'https://images.pexels.com/photos/789867/pexels-photo-789867.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    has3DTour: true
  },
  {
    id: '9',
    name: 'Roman Villa Iota',
    era: 'Roman',
    category: 'Settlement',
    description: 'A luxurious Roman villa with well-preserved mosaic floors.',
    coordinates: [51.498, -0.08],
    image: 'https://images.pexels.com/photos/14011677/pexels-photo-14011677.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    has3DTour: true
  },
  {
    id: '10',
    name: 'Modern Industrial Site Kappa',
    era: 'Modern',
    category: 'Other',
    description: 'The archaeological remains of an early industrial revolution factory.',
    coordinates: [51.495, -0.115],
    image: 'https://images.pexels.com/photos/4125354/pexels-photo-4125354.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    has3DTour: false
  }
];

export const eras: string[] = [
  'Каменный век',
  'Бронзовый век',
  'Железный век',
  'Римская эпоха',
  'Средневековье',
  'Современность'
];

export const categories: string[] = [
  'Поселения',
  'Захоронения',
  'Артифакты',
  'Крепости',
  'Религиозные',
  'Остальное'
];
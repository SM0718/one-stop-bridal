import type { FaithConfig } from '@/types';
import { event, seed } from './shared';

export const jain: FaithConfig = {
  id: 'JAIN',
  slug: 'jain',
  name: 'Jain',
  shortName: 'Jain',
  regions: ['Gujarat', 'Rajasthan', 'Maharashtra', 'Karnataka', 'Madhya Pradesh', 'Diaspora'],
  summary:
    'A Jain wedding is conducted with a priest and follows ahimsa, which usually means a vegetarian menu and restrained ceremony.',
  introduction:
    'Jain weddings follow the same broad structure as other Indian weddings but are shaped by ahimsa. Ceremonies are usually vegetarian, often sober, and frequently held in the morning. Rename or remove anything that does not match your family.',
  customisable: true,
  guidance: [
    {
      title: 'Ahimsa shapes the details',
      body: 'Menus are vegetarian and many families keep ceremonies free of alcohol. Confirm these with your caterer and venue early.',
    },
    {
      title: 'Often a daytime ceremony',
      body: 'Many Jain ceremonies are held in the morning. Set your timings per event.',
    },
  ],
  terminology: {
    weddingDay: 'Vivah',
    ceremony: 'Vivah',
    reception: 'Reception',
    couple: 'The couple',
    bridalOutfit: 'Lehenga, panetar or saree',
    groomOutfit: 'Sherwani or kurta',
  },
  accent: { label: 'Saffron cream', token: '--faith-saffron', hex: '#AC9C63' },
  events: [
    event('jain-engagement', 'Lagna & Engagement', 'The families formally agree the marriage.', 240, 'couple', 'home'),
    event('jain-mehendi', 'Mehendi', 'Henna for the bride and guests.', 4, 'bride', 'home'),
    event('jain-haldi', 'Haldi', 'Turmeric is applied in blessing before the wedding.', 3, 'couple', 'home'),
    event('jain-sangeet', 'Sangeet', 'An evening of music for both families.', 2, 'family', 'venue', true),
    event('jain-vivah', 'Vivah', 'The wedding ceremony, conducted by a priest.', 0, 'couple', 'venue'),
    event('jain-reception', 'Reception', 'A vegetarian celebration after the ceremony.', -1, 'couple', 'venue'),
  ],
  leadCategoryIds: ['bridal-lehenga', 'bridal-saree', 'bridal-jewellery', 'sherwani', 'ritual-items'],
  leadVendorCategoryIds: ['bridalwear', 'jewellery', 'catering', 'decor', 'photography', 'ritual-services'],
  ritualServices: [
    {
      id: 'jain-priest',
      name: 'Jain priest',
      description: 'Priests who can conduct the vivah.',
      vendorCategoryId: 'ritual-services',
    },
    {
      id: 'jain-vegetarian-catering',
      name: 'Vegetarian and Jain catering',
      description: 'Caterers who can cook without onion, garlic and root vegetables.',
      vendorCategoryId: 'catering',
    },
    {
      id: 'jain-decor',
      name: 'Restrained ceremony decor',
      description: 'Decorators working with a simple, floral palette.',
      vendorCategoryId: 'decor',
    },
  ],
  personalizedSections: [
    {
      id: 'jain-bridal',
      title: 'Panetar, lehenga and saree',
      description: 'Bridal pieces in the colours your family uses.',
      ctaLabel: 'Explore bridal',
      href: '/collections/bridal',
      mediaKey: 'bridal-roses',
    },
    {
      id: 'jain-catering',
      title: 'Jain and vegetarian catering',
      description: 'Caterers who will cook to your restrictions, not around them.',
      ctaLabel: 'Find caterers',
      href: '/vendors/catering',
      mediaKey: 'decor-table-detailed',
    },
    {
      id: 'jain-jewellery',
      title: 'Ceremony jewellery',
      description: 'Pieces for the vivah and for everyday wear afterwards.',
      ctaLabel: 'Find jewellery',
      href: '/collections/jewellery',
      mediaKey: 'jewellery-ring-ornate',
    },
    {
      id: 'jain-decor',
      title: 'Ceremony decor',
      description: 'Florals and structures for a restrained ceremony.',
      ctaLabel: 'Book decor',
      href: '/vendors/decor',
      mediaKey: 'flowers-small-centrepiece',
    },
  ],
  checklist: [
    seed('jain-1', 'Book the priest for the vivah', 9, 'nine-months', 'couple', 'jain-vivah'),
    seed('jain-2', 'Confirm a fully vegetarian menu with the caterer', 9, 'nine-months', 'family', 'jain-reception'),
    seed('jain-3', 'Confirm the venue has no alcohol service', 6, 'six-months', 'couple', 'jain-reception'),
    seed('jain-4', 'Order bridal attire', 9, 'nine-months', 'bride', 'jain-vivah'),
    seed('jain-5', 'Book the mehendi artist', 6, 'six-months', 'bride', 'jain-mehendi'),
    seed('jain-6', 'Agree whether a sangeet is part of your wedding', 6, 'six-months', 'couple', 'jain-sangeet'),
    seed('jain-7', 'Arrange haldi ingredients and timings', 3, 'three-months', 'family', 'jain-haldi'),
    seed('jain-8', 'Confirm the morning ceremony timings', 1, 'one-month', 'couple', 'jain-vivah'),
  ],
};

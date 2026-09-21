import type { FaithConfig } from '@/types';
import { event, seed } from './shared';

export const buddhist: FaithConfig = {
  id: 'BUDDHIST',
  slug: 'buddhist',
  name: 'Buddhist',
  shortName: 'Buddhist',
  regions: ['Sri Lanka', 'Thailand', 'Myanmar', 'Japan', 'Tibet', 'Nepal', 'Vietnam', 'Diaspora'],
  summary:
    'Buddhist weddings are not a single rite. Most couples arrange a blessing from monks alongside a family ceremony.',
  introduction:
    'There is no one Buddhist wedding. Traditions differ enormously — a Sri Lankan poruwa ceremony, a Thai blessing with monks, a Japanese ceremony, or a secular service with a blessing. Because of that, this configuration offers a blessing ceremony as a starting point and expects you to shape the rest yourself.',
  customisable: true,
  guidance: [
    {
      title: 'No single rite exists',
      body: 'What a Buddhist wedding looks like depends on country and tradition. Build your own sequence rather than assuming a standard.',
    },
    {
      title: 'Monastic involvement varies',
      body: 'Where monks are invited, the temple will set its own requirements for timings and offerings.',
    },
  ],
  terminology: {
    weddingDay: 'Wedding day',
    ceremony: 'Blessing ceremony',
    reception: 'Reception',
    couple: 'The couple',
    bridalOutfit: 'Sari, gown or traditional dress',
    groomOutfit: 'Suit or traditional dress',
  },
  accent: { label: 'Ochre', token: '--faith-ochre', hex: '#91674F' },
  events: [
    event('buddhist-engagement', 'Engagement', 'The families agree the marriage and celebrate.', 240, 'couple', 'home'),
    event('buddhist-blessing', 'Blessing Ceremony', 'Monks or elders offer chanting and blessings.', 1, 'couple', 'place-of-worship'),
    event('buddhist-ceremony', 'Wedding Ceremony', 'The marriage ceremony itself, in the form your tradition uses.', 0, 'couple', 'venue'),
    event('buddhist-reception', 'Reception', 'A celebration for family and friends.', -1, 'couple', 'venue'),
  ],
  leadCategoryIds: ['bridal-saree', 'bridal-gown', 'bridal-jewellery', 'groom-suit', 'ritual-items'],
  leadVendorCategoryIds: ['bridalwear', 'photography', 'venues', 'catering', 'florists', 'ritual-services'],
  ritualServices: [
    {
      id: 'buddhist-temple',
      name: 'Temple coordination',
      description: 'Arranging a blessing and the offerings it requires.',
      vendorCategoryId: 'ritual-services',
    },
    {
      id: 'buddhist-officiant',
      name: 'Officiant or celebrant',
      description: 'Celebrants for a secular ceremony, with or without a blessing.',
      vendorCategoryId: 'planners',
    },
    {
      id: 'buddhist-florals',
      name: 'Lotus and ceremony florals',
      description: 'Florists working with the flowers your tradition uses.',
      vendorCategoryId: 'florists',
    },
  ],
  personalizedSections: [
    {
      id: 'buddhist-ceremony',
      title: 'Ceremony attire',
      description: 'Pieces that suit both a temple blessing and a reception.',
      ctaLabel: 'Explore bridal',
      href: '/collections/bridal',
      mediaKey: 'ritual-temple',
    },
    {
      id: 'buddhist-blessing',
      title: 'Arrange the blessing',
      description: 'Plan the blessing ceremony and what it requires.',
      ctaLabel: 'Plan the blessing',
      href: '/planning/events',
      mediaKey: 'church-light',
    },
    {
      id: 'buddhist-jewellery',
      title: 'Gold and gemstone jewellery',
      description: 'Pieces chosen for the ceremony and kept afterwards.',
      ctaLabel: 'Find jewellery',
      href: '/collections/jewellery',
      mediaKey: 'jewellery-ring-rose',
    },
    {
      id: 'buddhist-catering',
      title: 'Ceremony catering',
      description: 'Caterers who can work with vegetarian and temple menus.',
      ctaLabel: 'Find caterers',
      href: '/vendors/catering',
      mediaKey: 'decor-table-outdoor',
    },
  ],
  checklist: [
    seed('buddhist-1', 'Decide whether you are having a blessing ceremony', 12, 'twelve-months', 'couple', 'buddhist-blessing'),
    seed('buddhist-2', 'Contact the temple about timings and offerings', 9, 'nine-months', 'couple', 'buddhist-blessing'),
    seed('buddhist-3', 'Agree the order of the ceremony', 9, 'nine-months', 'couple', 'buddhist-ceremony'),
    seed('buddhist-4', 'Order bridal and groom attire', 9, 'nine-months', 'couple', 'buddhist-ceremony'),
    seed('buddhist-5', 'Book the reception venue', 9, 'nine-months', 'couple', 'buddhist-reception'),
    seed('buddhist-6', 'Arrange flowers and offerings', 3, 'three-months', 'family', 'buddhist-blessing'),
    seed('buddhist-7', 'Confirm dietary requirements for the reception menu', 3, 'three-months', 'couple', 'buddhist-reception'),
  ],
};

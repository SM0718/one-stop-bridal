import type { FaithConfig } from '@/types';
import { event, seed } from './shared';

export const parsi: FaithConfig = {
  id: 'PARSI',
  slug: 'parsi',
  name: 'Parsi',
  shortName: 'Parsi',
  regions: ['Mumbai', 'Gujarat', 'Pune', 'United Kingdom', 'Canada', 'Diaspora'],
  summary:
    'A Parsi wedding centres on the Lagan ceremony, conducted by priests, with family customs around it.',
  introduction:
    'Parsi weddings are conducted by priests and usually include the achumichu and haath boravanu customs before the main Lagan ceremony. Ceremonies are often intimate and held earlier in the day, with a reception following. Adjust the events here to match your family.',
  customisable: true,
  guidance: [
    {
      title: 'Priests and practice vary',
      body: 'The sequence of rituals and the requirements for a Parsi marriage differ between families and priests. Confirm the specifics with the priests officiating.',
    },
    {
      title: 'Often a smaller ceremony',
      body: 'Many Parsi ceremonies are intimate, with a larger reception afterwards. Set your guest counts per event rather than assuming one number.',
    },
  ],
  terminology: {
    weddingDay: 'Lagan',
    ceremony: 'Lagan',
    reception: 'Reception',
    couple: 'The couple',
    bridalOutfit: 'Sari or gara',
    groomOutfit: 'Dagli and feta',
  },
  accent: { label: 'Soft rose', token: '--faith-rose', hex: '#A8747E' },
  events: [
    event('parsi-engagement', 'Engagement', 'The families agree the marriage and celebrate.', 240, 'couple', 'home'),
    event('parsi-achumichu', 'Achumichu', 'A pre-wedding ritual performed by the women of the family.', 2, 'bride', 'home', true),
    event('parsi-lagan', 'Lagan Ceremony', 'The marriage ceremony, conducted by priests.', 0, 'couple', 'place-of-worship'),
    event('parsi-reception', 'Reception', 'A celebration for family and friends.', -1, 'couple', 'venue'),
  ],
  leadCategoryIds: ['bridal-saree', 'bridal-jewellery', 'fine-jewellery', 'groom-accessories'],
  leadVendorCategoryIds: ['bridalwear', 'jewellery', 'catering', 'photography', 'florists', 'ritual-services'],
  ritualServices: [
    {
      id: 'parsi-priests',
      name: 'Parsi priests',
      description: 'Priests who conduct the Lagan and advise on ritual sequence.',
      vendorCategoryId: 'ritual-services',
    },
    {
      id: 'parsi-sari-draping',
      name: 'Sari draping',
      description: 'Draping services for a Parsi sari or gara.',
      vendorCategoryId: 'bridalwear',
    },
    {
      id: 'parsi-florals',
      name: 'Ceremony florals',
      description: 'Florists working with the white and jasmine palette common to Parsi ceremonies.',
      vendorCategoryId: 'florists',
    },
    {
      id: 'parsi-catering',
      name: 'Parsi catering',
      description: 'Caterers who cook Parsi menus, including traditional wedding dishes.',
      vendorCategoryId: 'catering',
    },
  ],
  personalizedSections: [
    {
      id: 'parsi-lagan-looks',
      title: 'Lagan looks',
      description: 'Saris, garas and the jewellery worn with them.',
      ctaLabel: 'Explore bridal',
      href: '/collections/bridal?category=bridal-saree',
      mediaKey: 'editorial-veil',
    },
    {
      id: 'parsi-jewellery',
      title: 'Fine jewellery',
      description: 'Pieces for the ceremony and for keeping afterwards.',
      ctaLabel: 'Find jewellery',
      href: '/collections/jewellery',
      mediaKey: 'jewellery-earrings-pearl',
    },
    {
      id: 'parsi-catering',
      title: 'Parsi menus',
      description: 'Caterers who cook the dishes your family expects.',
      ctaLabel: 'Find caterers',
      href: '/vendors/catering',
      mediaKey: 'decor-venue-table',
    },
    {
      id: 'parsi-flowers',
      title: 'Jasmine and white florals',
      description: 'Florists for a restrained, fragrant ceremony.',
      ctaLabel: 'Find florists',
      href: '/vendors/florists',
      mediaKey: 'flowers-pale',
    },
  ],
  checklist: [
    seed('parsi-1', 'Confirm the Lagan date with the priests', 12, 'twelve-months', 'couple', 'parsi-lagan'),
    seed('parsi-2', 'Arrange the ceremonial items required by the priests', 6, 'six-months', 'couple', 'parsi-lagan'),
    seed('parsi-3', 'Order or alter the bridal sari or gara', 6, 'six-months', 'bride', 'parsi-lagan'),
    seed('parsi-4', 'Order the groom’s dagli and feta', 6, 'six-months', 'groom', 'parsi-lagan'),
    seed('parsi-5', 'Book a Parsi caterer and agree the menu', 6, 'six-months', 'family', 'parsi-reception'),
    seed('parsi-6', 'Arrange the achumichu with the family', 3, 'three-months', 'family', 'parsi-achumichu'),
    seed('parsi-7', 'Book florals for the ceremony', 3, 'three-months', 'couple', 'parsi-lagan'),
    seed('parsi-8', 'Arrange sari draping on the day', 1, 'one-month', 'bride', 'parsi-lagan'),
  ],
};

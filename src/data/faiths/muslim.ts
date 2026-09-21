import type { FaithConfig } from '@/types';
import { event, seed } from './shared';

export const muslim: FaithConfig = {
  id: 'MUSLIM',
  slug: 'muslim',
  name: 'Muslim',
  shortName: 'Muslim',
  regions: ['South Asia', 'Middle East', 'Southeast Asia', 'North Africa', 'Central Asia', 'Diaspora'],
  summary:
    'A Muslim wedding centres on the nikah, the marriage contract, with family celebrations before and after depending on culture.',
  introduction:
    'The nikah is the religious marriage contract, and everything around it — the mehndi, the dholki nights, the walima — comes from culture and region rather than religious requirement. This configuration reflects common South Asian practice, and every part of it is editable.',
  customisable: true,
  guidance: [
    {
      title: 'Nikah is the constant',
      body: 'The nikah is the marriage contract. The celebrations around it vary enormously between families and countries, so nothing beyond the nikah should be treated as fixed.',
    },
    {
      title: 'Dress codes vary',
      body: 'Modest bridalwear means different things in different communities. Filter by what you actually want to wear rather than by an assumed standard.',
    },
  ],
  terminology: {
    weddingDay: 'Nikah',
    ceremony: 'Nikah',
    reception: 'Walima',
    couple: 'The couple',
    bridalOutfit: 'Modest bridalwear',
    groomOutfit: 'Sherwani or suit',
  },
  accent: { label: 'Emerald', token: '--faith-emerald', hex: '#3F665E' },
  events: [
    event('muslim-engagement', 'Mangni & Engagement', 'The families formally agree the marriage.', 240, 'couple', 'home'),
    event('muslim-dholki', 'Dholki', 'An informal evening of singing and dhol.', 6, 'family', 'home', true),
    event('muslim-mehndi', 'Mehndi', 'Henna for the bride and her guests.', 3, 'bride', 'home'),
    event('muslim-nikah', 'Nikah', 'The marriage contract, agreed before witnesses.', 0, 'couple', 'place-of-worship'),
    event('muslim-walima', 'Walima', 'The reception hosted by the groom’s family.', -1, 'couple', 'venue'),
  ],
  leadCategoryIds: ['modest-bridalwear', 'bridal-anarkali', 'bridal-jewellery', 'mehendi', 'sherwani'],
  leadVendorCategoryIds: ['bridalwear', 'mehendi', 'jewellery', 'catering', 'decor', 'photography', 'ritual-services'],
  ritualServices: [
    {
      id: 'muslim-imam',
      name: 'Imam or nikah officiant',
      description: 'Officiants who can perform the nikah and advise on the contract.',
      vendorCategoryId: 'ritual-services',
    },
    {
      id: 'muslim-modest-bridal',
      name: 'Modest bridalwear',
      description: 'Designers working with modest cuts, sleeves and coverage.',
      vendorCategoryId: 'bridalwear',
    },
    {
      id: 'muslim-halal-catering',
      name: 'Halal catering',
      description: 'Caterers able to confirm halal preparation and certification.',
      vendorCategoryId: 'catering',
    },
    {
      id: 'muslim-women-photography',
      name: 'Women-only photography teams',
      description: 'Photographers who can cover segregated celebrations.',
      vendorCategoryId: 'photography',
    },
  ],
  personalizedSections: [
    {
      id: 'muslim-nikah-looks',
      title: 'Nikah looks',
      description: 'Bridal pieces with the coverage, sleeves and drape you want.',
      ctaLabel: 'Explore nikah looks',
      href: '/collections/bridal?category=modest-bridalwear',
      mediaKey: 'bridal-rear-view',
    },
    {
      id: 'muslim-modest',
      title: 'Modest bridalwear',
      description: 'Designers who build for modesty without compromise on detail.',
      ctaLabel: 'Explore modest bridalwear',
      href: '/collections/bridal?category=modest-bridalwear',
      mediaKey: 'bridal-detailed-gown',
    },
    {
      id: 'muslim-mehndi',
      title: 'Find mehendi artists',
      description: 'Artists for the bridal mehndi and for guests.',
      ctaLabel: 'Find artists',
      href: '/vendors/mehendi',
      mediaKey: 'mehendi-palms',
    },
    {
      id: 'muslim-walima',
      title: 'Plan your walima',
      description: 'Venues, catering and decor for the reception.',
      ctaLabel: 'Plan the walima',
      href: '/planning/events',
      mediaKey: 'decor-table-light',
    },
    {
      id: 'muslim-halal',
      title: 'Halal catering',
      description: 'Caterers who will confirm how the kitchen is run.',
      ctaLabel: 'Find caterers',
      href: '/vendors/catering',
      mediaKey: 'context-iftar',
    },
  ],
  checklist: [
    seed('muslim-1', 'Agree the nikah date with the officiant', 12, 'twelve-months', 'couple', 'muslim-nikah'),
    seed('muslim-2', 'Confirm the mahr and the contract in writing', 9, 'nine-months', 'couple', 'muslim-nikah'),
    seed('muslim-3', 'Book the walima venue', 9, 'nine-months', 'family', 'muslim-walima'),
    seed('muslim-4', 'Choose bridal attire and confirm coverage and sleeve length', 9, 'nine-months', 'bride', 'muslim-nikah'),
    seed('muslim-5', 'Book the mehndi artist', 6, 'six-months', 'bride', 'muslim-mehndi'),
    seed('muslim-6', 'Confirm halal certification with the caterer', 6, 'six-months', 'couple', 'muslim-walima'),
    seed('muslim-7', 'Agree whether celebrations are segregated and plan accordingly', 6, 'six-months', 'couple'),
    seed('muslim-8', 'Book a photography team that suits the arrangements', 6, 'six-months', 'couple', 'muslim-nikah'),
    seed('muslim-9', 'Arrange witnesses for the nikah', 1, 'one-month', 'couple', 'muslim-nikah'),
    seed('muslim-10', 'Confirm the dholki or mehndi night arrangements', 1, 'one-month', 'family', 'muslim-mehndi'),
  ],
};

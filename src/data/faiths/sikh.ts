import type { FaithConfig } from '@/types';
import { event, seed } from './shared';

export const sikh: FaithConfig = {
  id: 'SIKH',
  slug: 'sikh',
  name: 'Sikh',
  shortName: 'Sikh',
  regions: ['Punjab', 'North India', 'United Kingdom', 'Canada', 'United States', 'Australia', 'Diaspora'],
  summary:
    'A Sikh wedding is the Anand Karaj, held in a gurdwara, with celebrations around it drawn from Punjabi family tradition.',
  introduction:
    'The Anand Karaj takes place in the presence of the Guru Granth Sahib, usually in a gurdwara, and many families arrange a langar and a reception around it. The jaggo, mehndi and choora are Punjabi family traditions rather than religious requirements, so keep only what belongs to your wedding.',
  customisable: true,
  guidance: [
    {
      title: 'The gurdwara sets its own arrangements',
      body: 'Gurdwaras differ in what they allow for photography, decoration and timings. Confirm the practical details with the gurdwara directly.',
    },
    {
      title: 'Family traditions are optional',
      body: 'Jaggo, choora and other Punjabi customs are family traditions. Keep, rename or remove them freely.',
    },
  ],
  terminology: {
    weddingDay: 'Anand Karaj',
    ceremony: 'Anand Karaj',
    reception: 'Reception',
    couple: 'The couple',
    bridalOutfit: 'Salwar suit, lehenga or saree',
    groomOutfit: 'Sherwani or kurta with turban',
  },
  accent: { label: 'Indigo', token: '--faith-indigo', hex: '#4E5C88' },
  events: [
    event('sikh-roka', 'Roka & Engagement', 'The families formally agree the match.', 240, 'couple', 'home'),
    event('sikh-mehndi', 'Mehndi', 'Henna for the bride and guests.', 4, 'bride', 'home'),
    event('sikh-jaggo', 'Jaggo', 'A Punjabi celebration, traditionally the night before.', 1, 'family', 'home', true),
    event('sikh-choora', 'Choora', 'Bangles are placed on the bride by her maternal family.', 2, 'bride', 'home', true),
    event('sikh-anand-karaj', 'Anand Karaj', 'The wedding ceremony in the gurdwara.', 0, 'couple', 'place-of-worship'),
    event('sikh-reception', 'Reception', 'A celebration for extended family and friends.', -1, 'couple', 'venue'),
  ],
  leadCategoryIds: ['bridal-lehenga', 'bridal-saree', 'bridal-jewellery', 'sherwani', 'mehendi'],
  leadVendorCategoryIds: ['bridalwear', 'groomwear', 'mehendi', 'decor', 'catering', 'entertainment', 'ritual-services'],
  ritualServices: [
    {
      id: 'sikh-granthi',
      name: 'Granthi and gurdwara arrangements',
      description: 'Coordination with the gurdwara for the Anand Karaj.',
      vendorCategoryId: 'ritual-services',
    },
    {
      id: 'sikh-ragi',
      name: 'Ragi jatha and kirtan',
      description: 'Musicians who perform kirtan during the ceremony.',
      vendorCategoryId: 'entertainment',
    },
    {
      id: 'sikh-langar',
      name: 'Langar catering',
      description: 'Caterers able to prepare vegetarian langar at scale.',
      vendorCategoryId: 'catering',
    },
    {
      id: 'sikh-turban',
      name: 'Turban tying',
      description: 'Services for the groom and his family.',
      vendorCategoryId: 'groomwear',
    },
  ],
  personalizedSections: [
    {
      id: 'sikh-anand-karaj',
      title: 'Anand Karaj attire',
      description: 'Suit, lehenga and saree pieces suited to the gurdwara.',
      ctaLabel: 'Explore bridal',
      href: '/collections/bridal',
      mediaKey: 'editorial-arches',
    },
    {
      id: 'sikh-groom',
      title: 'Sherwanis and turbans',
      description: 'Groomwear and the finishing pieces for the day.',
      ctaLabel: 'Explore groomwear',
      href: '/collections/groom',
      mediaKey: 'couple-showing-style',
    },
    {
      id: 'sikh-mehendi',
      title: 'Mehndi and jaggo',
      description: 'Artists and entertainers for the nights before the wedding.',
      ctaLabel: 'Find mehendi artists',
      href: '/vendors/mehendi',
      mediaKey: 'mehendi-designs',
    },
    {
      id: 'sikh-langar-catering',
      title: 'Langar and catering',
      description: 'Caterers who understand langar and large guest counts.',
      ctaLabel: 'Find caterers',
      href: '/vendors/catering',
      mediaKey: 'decor-celebration-table',
    },
    {
      id: 'sikh-jewellery',
      title: 'Jewellery and choora',
      description: 'Necklaces, bangles and the pieces set aside for the bride.',
      ctaLabel: 'Find jewellery',
      href: '/collections/jewellery',
      mediaKey: 'bangles-hands',
    },
  ],
  checklist: [
    seed('sikh-1', 'Confirm arrangements and timings with the gurdwara', 12, 'twelve-months', 'couple', 'sikh-anand-karaj'),
    seed('sikh-2', 'Agree which family traditions you are keeping', 9, 'nine-months', 'couple'),
    seed('sikh-3', 'Order the bridal suit, lehenga or saree', 9, 'nine-months', 'bride', 'sikh-anand-karaj'),
    seed('sikh-4', 'Order the sherwani and arrange turban tying', 9, 'nine-months', 'groom', 'sikh-anand-karaj'),
    seed('sikh-5', 'Book the ragi jatha for kirtan', 6, 'six-months', 'couple', 'sikh-anand-karaj'),
    seed('sikh-6', 'Arrange langar or catering', 6, 'six-months', 'family', 'sikh-anand-karaj'),
    seed('sikh-7', 'Plan the jaggo and confirm entertainers', 3, 'three-months', 'family', 'sikh-jaggo'),
    seed('sikh-8', 'Arrange the choora ceremony with the maternal family', 3, 'three-months', 'bride', 'sikh-choora'),
    seed('sikh-9', 'Confirm whether photography is permitted inside the gurdwara', 1, 'one-month', 'couple', 'sikh-anand-karaj'),
    seed('sikh-10', 'Agree head covering and shoe arrangements for guests', 1, 'one-month', 'family', 'sikh-anand-karaj'),
  ],
};

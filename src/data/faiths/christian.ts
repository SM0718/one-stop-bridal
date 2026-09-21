import type { FaithConfig } from '@/types';
import { event, seed } from './shared';

export const christian: FaithConfig = {
  id: 'CHRISTIAN',
  slug: 'christian',
  name: 'Christian',
  shortName: 'Christian',
  regions: ['United Kingdom', 'Europe', 'North America', 'South India', 'Africa', 'Latin America', 'Diaspora'],
  summary:
    'A Christian wedding is held in a church or licensed venue, with the ceremony followed by a reception.',
  introduction:
    'Christian weddings vary between denominations and countries — an Anglican service, a Catholic nuptial mass and a South Indian church wedding are different occasions. This configuration covers the structure most couples plan around, and you can change any part of it.',
  customisable: true,
  guidance: [
    {
      title: 'Denomination changes the service',
      body: 'Whether you can marry in a church, whether a mass is said, and what paperwork is required all depend on the denomination and the building.',
    },
    {
      title: 'Two families, often two countries',
      body: 'Many couples plan across countries. Use the guest tools to keep invitations and travel in one place.',
    },
  ],
  terminology: {
    weddingDay: 'Wedding day',
    ceremony: 'Ceremony',
    reception: 'Reception',
    couple: 'Bride and groom',
    bridalOutfit: 'Wedding dress',
    groomOutfit: 'Suit or morning coat',
  },
  accent: { label: 'Blue grey', token: '--faith-blue', hex: '#5E7286' },
  events: [
    event('christian-engagement', 'Engagement', 'The engagement is announced and celebrated.', 270, 'couple', 'venue'),
    event('christian-shower', 'Bridal Shower', 'A gathering for the bride before the wedding.', 60, 'bride', 'home', true),
    event('christian-rehearsal', 'Rehearsal Dinner', 'A meal after the rehearsal, usually for close family.', 1, 'family', 'venue', true),
    event('christian-ceremony', 'Church Ceremony', 'The marriage service.', 0, 'couple', 'place-of-worship'),
    event('christian-reception', 'Reception', 'The celebration after the service.', -1, 'couple', 'venue'),
  ],
  leadCategoryIds: ['bridal-gown', 'veils', 'bridal-jewellery', 'groom-suit', 'headpieces'],
  leadVendorCategoryIds: ['bridalwear', 'groomwear', 'photography', 'venues', 'florists', 'catering', 'wedding-cakes'],
  ritualServices: [
    {
      id: 'christian-officiant',
      name: 'Minister or priest',
      description: 'Officiants and the requirements their building sets.',
      vendorCategoryId: 'ritual-services',
    },
    {
      id: 'christian-church-florals',
      name: 'Church florals',
      description: 'Florists experienced with church interiors and pew ends.',
      vendorCategoryId: 'florists',
    },
    {
      id: 'christian-choir',
      name: 'Choir and church music',
      description: 'Choirs, organists and musicians for the service.',
      vendorCategoryId: 'entertainment',
    },
    {
      id: 'christian-transport',
      name: 'Wedding cars',
      description: 'Transport for the couple and the wedding party.',
      vendorCategoryId: 'transportation',
    },
  ],
  personalizedSections: [
    {
      id: 'christian-ceremony-looks',
      title: 'Ceremony looks',
      description: 'Dresses, veils and the finishing pieces for the service.',
      ctaLabel: 'Explore ceremony looks',
      href: '/collections/bridal?category=bridal-gown',
      mediaKey: 'church-altar',
    },
    {
      id: 'christian-accessories',
      title: 'Bridal accessories',
      description: 'Veils, headpieces, gloves and shoes that finish the look.',
      ctaLabel: 'Shop accessories',
      href: '/collections/accessories',
      mediaKey: 'bridal-flatlay',
    },
    {
      id: 'christian-reception-styling',
      title: 'Reception styling',
      description: 'Tables, candles and florals for the evening.',
      ctaLabel: 'Style the reception',
      href: '/collections/ceremony',
      mediaKey: 'decor-table-flowers',
    },
    {
      id: 'christian-photography',
      title: 'Wedding photography',
      description: 'Photographers who know how to work with church light.',
      ctaLabel: 'Find photographers',
      href: '/vendors/photography',
      mediaKey: 'church-light',
    },
    {
      id: 'christian-groomwear',
      title: 'Groom and groomsmen',
      description: 'Suits, morning coats and tailoring.',
      ctaLabel: 'Explore groomwear',
      href: '/collections/groom',
      mediaKey: 'groom-three-piece',
    },
  ],
  checklist: [
    seed('christian-1', 'Confirm you can marry in the church and what it requires', 12, 'twelve-months', 'couple', 'christian-ceremony'),
    seed('christian-2', 'Book the officiant and the rehearsal date', 12, 'twelve-months', 'couple', 'christian-ceremony'),
    seed('christian-3', 'Order the wedding dress and book alterations', 12, 'twelve-months', 'bride', 'christian-ceremony'),
    seed('christian-4', 'Book the reception venue and caterer', 12, 'twelve-months', 'couple', 'christian-reception'),
    seed('christian-5', 'Arrange banns or the licence', 6, 'six-months', 'couple', 'christian-ceremony'),
    seed('christian-6', 'Book the choir or musicians for the service', 6, 'six-months', 'couple', 'christian-ceremony'),
    seed('christian-7', 'Choose readings and hymns', 3, 'three-months', 'couple', 'christian-ceremony'),
    seed('christian-8', 'Order the cake', 3, 'three-months', 'couple', 'christian-reception'),
    seed('christian-9', 'Confirm order of service and print the sheets', 1, 'one-month', 'couple', 'christian-ceremony'),
    seed('christian-10', 'Brief the photographer on church restrictions', 1, 'one-month', 'couple', 'christian-ceremony'),
  ],
};

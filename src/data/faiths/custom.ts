import type { FaithConfig } from '@/types';
import { event, seed } from './shared';

/**
 * Custom exists for weddings that do not fit a preset: regional traditions,
 * mixed heritage, secular ceremonies, or something entirely personal.
 */
export const custom: FaithConfig = {
  id: 'CUSTOM',
  slug: 'custom',
  name: 'Other / Build your own',
  shortName: 'Custom',
  regions: ['Everywhere'],
  summary:
    'For traditions that do not fit a preset, or for a wedding that is entirely your own.',
  introduction:
    'Some weddings are regional, some are secular, some combine three traditions, and some are simply personal. Start from a blank plan: add your own events, name them what you call them, and bring in collections and vendors as you need them.',
  customisable: true,
  guidance: [
    {
      title: 'Start from nothing',
      body: 'You begin with an empty event list. Add and name your own celebrations, and reorder them as your plans settle.',
    },
    {
      title: 'Blend later',
      body: 'You can add traditions from any faith at any time from your wedding profile without losing what you have already planned.',
    },
  ],
  terminology: {
    weddingDay: 'Wedding day',
    ceremony: 'Ceremony',
    reception: 'Reception',
    couple: 'The couple',
    bridalOutfit: 'Bridal outfit',
    groomOutfit: 'Groom outfit',
  },
  accent: { label: 'Taupe', token: '--faith-taupe', hex: '#8C8378' },
  events: [
    event('custom-wedding', 'Wedding Day', 'Your main ceremony.', 0, 'couple', 'venue'),
    event('custom-reception', 'Reception', 'Your celebration afterwards.', -1, 'couple', 'venue', true),
  ],
  leadCategoryIds: ['bridal-gown', 'bridal-lehenga', 'modest-bridalwear', 'sherwani', 'groom-suit'],
  leadVendorCategoryIds: ['bridalwear', 'groomwear', 'venues', 'photography', 'catering', 'decor', 'planners'],
  ritualServices: [
    {
      id: 'custom-celebrant',
      name: 'Celebrant or officiant',
      description: 'Celebrants who will write a ceremony around you.',
      vendorCategoryId: 'ritual-services',
    },
    {
      id: 'custom-planner',
      name: 'Wedding planner',
      description: 'Planners for a wedding with no existing template.',
      vendorCategoryId: 'planners',
    },
  ],
  personalizedSections: [
    {
      id: 'custom-start',
      title: 'Start your plan',
      description: 'Add the celebrations you are having and build the plan from there.',
      ctaLabel: 'Open your wedding plan',
      href: '/planning',
      mediaKey: 'editorial-overlook',
    },
    {
      id: 'custom-collections',
      title: 'Browse everything',
      description: 'Bridal, groom, jewellery and beauty without a preset filter.',
      ctaLabel: 'Explore collections',
      href: '/collections',
      mediaKey: 'bridal-gown-elegant',
    },
    {
      id: 'custom-vendors',
      title: 'Find wedding professionals',
      description: 'Search every category and filter by what you actually need.',
      ctaLabel: 'Browse vendors',
      href: '/vendors',
      mediaKey: 'moment-love',
    },
  ],
  checklist: [
    seed('custom-1', 'Write down the celebrations you are having', 12, 'twelve-months', 'couple'),
    seed('custom-2', 'Choose who will conduct the ceremony', 9, 'nine-months', 'couple'),
    seed('custom-3', 'Agree your own order of events for the day', 6, 'six-months', 'couple'),
  ],
};

import type { FaithConfig } from '@/types';
import { event, seed } from './shared';

/**
 * Interfaith is not a faith of its own — it is a *merging* strategy. The
 * registry combines the two (or more) traditions the couple selects and the
 * planner, catalogue and vendor filters are drawn from all of them at once.
 */
export const interfaith: FaithConfig = {
  id: 'INTERFAITH',
  slug: 'interfaith',
  name: 'Interfaith & Multi-faith',
  shortName: 'Interfaith',
  regions: ['Everywhere'],
  summary:
    'Two traditions, one wedding. Pick the ceremonies you are keeping from each and the platform will plan around both.',
  introduction:
    'An interfaith wedding takes the parts you both want and leaves the rest. Choose the traditions you are combining — Hindu and Christian, Muslim and Sikh, Jewish and secular — and the event list, checklist, vendors and collections below will draw from all of them. You can remove anything that does not belong to your wedding.',
  customisable: true,
  guidance: [
    {
      title: 'Two officiants, one sequence',
      body: 'Many interfaith couples involve officiants from both traditions and agree the order of ceremonies well in advance. Use the timeline to sequence them.',
    },
    {
      title: 'Explain as much or as little as you want',
      body: 'Guests from both sides may be unfamiliar with parts of the day. Guidance articles include explainer formats you can share.',
    },
  ],
  terminology: {
    weddingDay: 'Wedding weekend',
    ceremony: 'Ceremonies',
    reception: 'Reception',
    couple: 'The couple',
    bridalOutfit: 'Bridal outfits',
    groomOutfit: 'Groom outfits',
  },
  accent: { label: 'Champagne gold', token: '--faith-champagne', hex: '#A08454' },
  events: [
    event('interfaith-engagement', 'Engagement', 'The families meet and the engagement is agreed.', 240, 'couple', 'home'),
    event('interfaith-mehendi', 'Mehendi', 'Henna for the bride and guests, where it is part of your traditions.', 3, 'bride', 'home', true),
    event('interfaith-ritual-one', 'Ceremony — Tradition One', 'The first ceremony, from one side of the family.', 0, 'couple', 'venue'),
    event('interfaith-ritual-two', 'Ceremony — Tradition Two', 'The second ceremony, from the other side.', 0, 'couple', 'venue'),
    event('interfaith-reception', 'Reception', 'A celebration for everyone, from both families.', -1, 'couple', 'venue'),
  ],
  leadCategoryIds: ['bridal-lehenga', 'bridal-gown', 'modest-bridalwear', 'bridal-jewellery', 'sherwani', 'groom-suit'],
  leadVendorCategoryIds: [
    'bridalwear',
    'groomwear',
    'jewellery',
    'mehendi',
    'photography',
    'decor',
    'catering',
    'planners',
  ],
  ritualServices: [
    {
      id: 'interfaith-planner',
      name: 'Interfaith wedding planner',
      description: 'Planners who have sequenced weddings across two traditions before.',
      vendorCategoryId: 'planners',
    },
    {
      id: 'interfaith-multiple-officiants',
      name: 'Multiple officiants',
      description: 'Officiants from both traditions who are willing to co-officiate.',
      vendorCategoryId: 'ritual-services',
    },
    {
      id: 'interfaith-multi-menu',
      name: 'Multi-tradition catering',
      description: 'Caterers who can serve two menus, including vegetarian and halal or kosher sections.',
      vendorCategoryId: 'catering',
    },
  ],
  personalizedSections: [
    {
      id: 'interfaith-merge',
      title: 'Both traditions, one plan',
      description: 'Events, tasks and vendors merged from every tradition you selected.',
      ctaLabel: 'Open your wedding plan',
      href: '/planning',
      mediaKey: 'couple-showing-style',
    },
    {
      id: 'interfaith-attire',
      title: 'Outfits for each ceremony',
      description: 'Pieces for both ceremonies, in both palettes.',
      ctaLabel: 'Explore collections',
      href: '/collections',
      mediaKey: 'editorial-pillars',
    },
    {
      id: 'interfaith-planners',
      title: 'Planners who have done this before',
      description: 'Planners experienced with two-officiant, multi-ceremony weddings.',
      ctaLabel: 'Find planners',
      href: '/vendors/planners',
      mediaKey: 'moment-photography',
    },
    {
      id: 'interfaith-catering',
      title: 'Two menus, one kitchen',
      description: 'Caterers who can serve both sides without compromise.',
      ctaLabel: 'Find caterers',
      href: '/vendors/catering',
      mediaKey: 'decor-table-flowers',
    },
  ],
  checklist: [
    seed('interfaith-1', 'Agree which ceremonies you are keeping from each tradition', 12, 'twelve-months', 'couple'),
    seed('interfaith-2', 'Find officiants willing to co-officiate', 12, 'twelve-months', 'couple'),
    seed('interfaith-3', 'Agree the order of ceremonies and how guests will move between them', 9, 'nine-months', 'couple'),
    seed('interfaith-4', 'Brief the photographer on both ceremonies', 6, 'six-months', 'couple'),
    seed('interfaith-5', 'Agree how each family is represented in the ceremony', 9, 'nine-months', 'couple'),
    seed('interfaith-6', 'Confirm catering covers both traditions', 6, 'six-months', 'couple'),
    seed('interfaith-7', 'Write an explainer for guests new to either tradition', 3, 'three-months', 'couple'),
    seed('interfaith-8', 'Agree how you will be introduced and named', 3, 'three-months', 'couple'),
  ],
};

import type { FaithConfig } from '@/types';
import { event, seed } from './shared';

export const jewish: FaithConfig = {
  id: 'JEWISH',
  slug: 'jewish',
  name: 'Jewish',
  shortName: 'Jewish',
  regions: ['Israel', 'United States', 'United Kingdom', 'France', 'Argentina', 'India', 'Diaspora'],
  summary:
    'A Jewish wedding takes place under the chuppah, with the ketubah signed beforehand and the sheva brachot recited during the ceremony.',
  introduction:
    'The chuppah is the centre of a Jewish wedding, and the ketubah is signed before the ceremony, usually at a kabbalat panim where guests greet the couple. Practice differs between Orthodox, Conservative, Reform, Masorti and secular households, and between Ashkenazi and Sephardi families. Adjust everything here to match yours.',
  customisable: true,
  guidance: [
    {
      title: 'Denomination changes the service',
      body: 'Whether both partners are called to the Torah, who can officiate, and what is required for a Jewish divorce all differ by denomination.',
    },
    {
      title: 'Ashkenazi and Sephardi customs differ',
      body: 'Traditions vary considerably between communities. Keep the ones that belong to your family.',
    },
  ],
  terminology: {
    weddingDay: 'Wedding day',
    ceremony: 'Chuppah',
    reception: 'Seudah',
    couple: 'The couple',
    bridalOutfit: 'Wedding dress or gown',
    groomOutfit: 'Suit or tuxedo',
  },
  accent: { label: 'Deep blue', token: '--faith-deep-blue', hex: '#44587D' },
  events: [
    event('jewish-engagement', 'Vort & Engagement', 'The engagement is formally agreed and celebrated.', 270, 'couple', 'home'),
    event('jewish-aufruf', 'Aufruf', 'The couple are called to the Torah before the wedding.', 7, 'couple', 'place-of-worship', true),
    event('jewish-kabbalat', 'Kabbalat Panim', 'Guests greet the couple before the ceremony.', 1, 'family', 'venue'),
    event('jewish-chuppah', 'Chuppah', 'The wedding ceremony, under the chuppah.', 0, 'couple', 'venue'),
    event('jewish-seudah', 'Seudah & Reception', 'The celebratory meal after the ceremony.', -1, 'couple', 'venue'),
  ],
  leadCategoryIds: ['bridal-gown', 'veils', 'fine-jewellery', 'groom-suit', 'tuxedo'],
  leadVendorCategoryIds: ['bridalwear', 'groomwear', 'catering', 'photography', 'entertainment', 'venues', 'ritual-services'],
  ritualServices: [
    {
      id: 'jewish-officiant',
      name: 'Rabbi or officiant',
      description: 'Officiants and the documents their denomination requires.',
      vendorCategoryId: 'ritual-services',
    },
    {
      id: 'jewish-kosher-catering',
      name: 'Kosher catering',
      description: 'Caterers able to confirm kosher supervision and kitchen arrangements.',
      vendorCategoryId: 'catering',
    },
    {
      id: 'jewish-klezmer',
      name: 'Klezmer and simcha music',
      description: 'Bands and musicians for the hora and the dancing.',
      vendorCategoryId: 'entertainment',
    },
    {
      id: 'jewish-chuppah',
      name: 'Chuppah hire and design',
      description: 'Chuppah structures and the fabric or florals to dress them.',
      vendorCategoryId: 'decor',
    },
  ],
  personalizedSections: [
    {
      id: 'jewish-chuppah-looks',
      title: 'Chuppah looks',
      description: 'Dresses, veils and finishing pieces for the ceremony.',
      ctaLabel: 'Explore bridal',
      href: '/collections/bridal?category=bridal-gown',
      mediaKey: 'editorial-aisle',
    },
    {
      id: 'jewish-kosher',
      title: 'Kosher catering',
      description: 'Caterers who will confirm supervision and kitchen setup.',
      ctaLabel: 'Find caterers',
      href: '/vendors/catering',
      mediaKey: 'decor-menu-table',
    },
    {
      id: 'jewish-music',
      title: 'Music and dancing',
      description: 'Bands for the hora and the rest of the night.',
      ctaLabel: 'Find entertainment',
      href: '/vendors/entertainment',
      mediaKey: 'music-venue',
    },
    {
      id: 'jewish-chuppah-design',
      title: 'Chuppah and florals',
      description: 'Structures, fabric and flowers for under the chuppah.',
      ctaLabel: 'Book decor',
      href: '/vendors/decor',
      mediaKey: 'flowers-custom-arch',
    },
    {
      id: 'jewish-jewellery',
      title: 'Fine jewellery',
      description: 'Rings and fine pieces for the ceremony.',
      ctaLabel: 'Find jewellery',
      href: '/collections/jewellery',
      mediaKey: 'rings-set',
    },
  ],
  checklist: [
    seed('jewish-1', 'Confirm the officiant and their requirements', 12, 'twelve-months', 'couple', 'jewish-chuppah'),
    seed('jewish-2', 'Arrange the ketubah', 9, 'nine-months', 'couple', 'jewish-chuppah'),
    seed('jewish-3', 'Confirm kosher supervision with the caterer', 9, 'nine-months', 'couple', 'jewish-seudah'),
    seed('jewish-4', 'Order the wedding dress and book alterations', 12, 'twelve-months', 'bride', 'jewish-chuppah'),
    seed('jewish-5', 'Book the band or musicians', 6, 'six-months', 'couple', 'jewish-seudah'),
    seed('jewish-6', 'Arrange the chuppah structure and florals', 6, 'six-months', 'couple', 'jewish-chuppah'),
    seed('jewish-7', 'Agree who is called up at the aufruf', 3, 'three-months', 'family', 'jewish-aufruf'),
    seed('jewish-8', 'Plan the kabbalat panim and the tisch', 3, 'three-months', 'family', 'jewish-kabbalat'),
    seed('jewish-9', 'Arrange sheva brachot hosts for the week after', 1, 'one-month', 'family'),
  ],
};

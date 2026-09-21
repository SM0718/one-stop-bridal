import type { MediaKey } from '@/data/media';
import { routes } from './routes';

/**
 * Navigation is data, not markup.
 *
 * Links carry `to` plus a structured `search` object rather than a query string
 * glued onto the path, so filters survive routing correctly and the URL stays
 * shareable.
 */
export interface NavLink {
  label: string;
  to: string;
  search?: Record<string, string>;
}

export interface NavColumn {
  title: string;
  links: NavLink[];
}

export interface NavItem {
  id: string;
  label: string;
  to: string;
  search?: Record<string, string>;
  /** Mega menu columns. Items without columns are plain links. */
  columns?: NavColumn[];
  feature?: {
    eyebrow: string;
    title: string;
    description: string;
    to: string;
    search?: Record<string, string>;
    mediaKey: MediaKey;
  };
}

export const PRIMARY_NAV: NavItem[] = [
  {
    id: 'bride',
    label: 'Bride',
    to: routes.collectionsBridal,
    columns: [
      {
        title: 'Bridalwear',
        links: [
          { label: 'Bridal lehengas', to: routes.collectionsBridal, search: { category: 'bridal-lehenga' } },
          { label: 'Bridal sarees', to: routes.collectionsBridal, search: { category: 'bridal-saree' } },
          { label: 'Wedding gowns', to: routes.collectionsBridal, search: { category: 'bridal-gown' } },
          { label: 'Anarkalis & suits', to: routes.collectionsBridal, search: { category: 'bridal-anarkali' } },
          { label: 'Modest bridalwear', to: routes.collectionsBridal, search: { category: 'modest-bridalwear' } },
          { label: 'Made to measure', to: routes.collectionsBridal, search: { category: 'custom-bridal' } },
        ],
      },
      {
        title: 'Beauty',
        links: [
          { label: 'Makeup', to: routes.collectionsBeauty, search: { category: 'makeup' } },
          { label: 'Hair', to: routes.collectionsBeauty, search: { category: 'hair' } },
          { label: 'Mehendi', to: routes.collectionsBeauty, search: { category: 'mehendi' } },
          { label: 'Bridal skincare', to: routes.collectionsBeauty, search: { category: 'skincare' } },
        ],
      },
      {
        title: 'Shop by ceremony',
        links: [
          { label: 'Mehendi', to: routes.collectionsBridal, search: { event: 'hindu-mehendi' } },
          { label: 'Sangeet', to: routes.collectionsBridal, search: { event: 'hindu-sangeet' } },
          { label: 'Nikah', to: routes.collectionsBridal, search: { event: 'muslim-nikah' } },
          { label: 'Church ceremony', to: routes.collectionsBridal, search: { event: 'christian-ceremony' } },
          { label: 'Anand Karaj', to: routes.collectionsBridal, search: { event: 'sikh-anand-karaj' } },
          { label: 'Chuppah', to: routes.collectionsBridal, search: { event: 'jewish-chuppah' } },
        ],
      },
    ],
    feature: {
      eyebrow: 'The bridal edit',
      title: 'Pieces that work on the day, not just in the photograph',
      description: 'Every piece here is chosen for how it behaves across a long ceremony.',
      to: routes.collectionsBridal,
      mediaKey: 'editorial-pillars',
    },
  },
  {
    id: 'groom',
    label: 'Groom',
    to: routes.collectionsGroom,
    columns: [
      {
        title: 'Groomwear',
        links: [
          { label: 'Sherwanis', to: routes.collectionsGroom, search: { category: 'sherwani' } },
          { label: 'Suits', to: routes.collectionsGroom, search: { category: 'groom-suit' } },
          { label: 'Tuxedos', to: routes.collectionsGroom, search: { category: 'tuxedo' } },
          { label: 'Traditional groomwear', to: routes.collectionsGroom, search: { category: 'groom-traditional' } },
        ],
      },
      {
        title: 'Accessories',
        links: [
          { label: 'Cufflinks & ties', to: routes.collectionsGroom, search: { category: 'groom-accessories' } },
          { label: 'Shoes', to: routes.collectionsAccessories, search: { category: 'shoes' } },
          { label: 'Clutches & bags', to: routes.collectionsAccessories, search: { category: 'clutch-bags' } },
        ],
      },
      {
        title: 'Services',
        links: [
          { label: 'Tailors & designers', to: routes.vendorCategory('groomwear') },
          { label: 'Ritual services', to: routes.vendorCategory('ritual-services') },
        ],
      },
    ],
    feature: {
      eyebrow: 'Groom edit',
      title: 'Tailoring that survives a long ceremony',
      description: 'Cut properly at the shoulder, so you can raise your arms without lifting the hem.',
      to: routes.collectionsGroom,
      mediaKey: 'couple-showing-style',
    },
  },
  {
    id: 'accessories',
    label: 'Accessories',
    to: routes.collectionsAccessories,
    columns: [
      {
        title: 'Finishing pieces',
        links: [
          { label: 'Veils & dupattas', to: routes.collectionsAccessories, search: { category: 'veils' } },
          { label: 'Headpieces & tikka', to: routes.collectionsAccessories, search: { category: 'headpieces' } },
          { label: 'Shoes', to: routes.collectionsAccessories, search: { category: 'shoes' } },
          { label: 'Clutches & bags', to: routes.collectionsAccessories, search: { category: 'clutch-bags' } },
        ],
      },
      {
        title: 'Jewellery',
        links: [
          { label: 'Bridal jewellery', to: routes.collectionsJewellery, search: { category: 'bridal-jewellery' } },
          { label: 'Fine jewellery', to: routes.collectionsJewellery, search: { category: 'fine-jewellery' } },
          { label: 'Jewellers near you', to: routes.vendorCategory('jewellery') },
        ],
      },
      {
        title: 'Ceremony',
        links: [
          { label: 'Ritual items', to: routes.collectionsCeremony, search: { category: 'ritual-items' } },
          { label: 'Ceremony essentials', to: routes.collectionsCeremony, search: { category: 'ceremony-essentials' } },
        ],
      },
    ],
    feature: {
      eyebrow: 'Accessories',
      title: 'The pieces that finish the outfit',
      description: 'Veils, headpieces and shoes, chosen to work with the outfit rather than against it.',
      to: routes.collectionsAccessories,
      mediaKey: 'bridal-flatlay',
    },
  },
  {
    id: 'wedding',
    label: 'Wedding',
    to: routes.vendors,
    columns: [
      {
        title: 'Find suppliers',
        links: [
          { label: 'All vendors', to: routes.vendors },
          { label: 'Venues', to: routes.vendorCategory('venues') },
          { label: 'Photography', to: routes.vendorCategory('photography') },
          { label: 'Decor & florals', to: routes.vendorCategory('decor') },
          { label: 'Catering', to: routes.vendorCategory('catering') },
          { label: 'Ritual services', to: routes.vendorCategory('ritual-services') },
        ],
      },
      {
        title: 'Ceremonies',
        links: [
          { label: 'Your events', to: routes.planningEvents },
          { label: 'Ceremony guides', to: routes.inspiration, search: { category: 'ceremonies' } },
          { label: 'Cultural guides', to: routes.inspiration, search: { category: 'cultural-guides' } },
        ],
      },
      {
        title: 'Plan',
        links: [
          { label: 'Planning dashboard', to: routes.planning },
          { label: 'Checklist', to: routes.planningChecklist },
          { label: 'Budget', to: routes.planningBudget },
          { label: 'Guest list', to: routes.planningGuests },
        ],
      },
    ],
    feature: {
      eyebrow: 'Vendor directory',
      title: 'Wedding professionals who understand your traditions',
      description: 'Filter by the ceremonies you are holding, not just by category.',
      to: routes.vendors,
      mediaKey: 'moment-photography',
    },
  },
  {
    id: 'collections',
    label: 'Collections',
    to: routes.collections,
    columns: [
      {
        title: 'By group',
        links: [
          { label: 'Bride', to: routes.collectionsBridal },
          { label: 'Groom', to: routes.collectionsGroom },
          { label: 'Accessories', to: routes.collectionsAccessories },
          { label: 'Jewellery', to: routes.collectionsJewellery },
          { label: 'Beauty', to: routes.collectionsBeauty },
          { label: 'Ceremony', to: routes.collectionsCeremony },
        ],
      },
      {
        title: 'Edits',
        links: [
          { label: 'The Bridal Edit', to: routes.collection('the-bridal-edit') },
          { label: 'Modest Bridalwear', to: routes.collection('modest-bridalwear') },
          { label: 'South Asian Bridal', to: routes.collection('south-asian-bridal') },
          { label: 'Church Ceremony', to: routes.collection('church-ceremony') },
          { label: 'The Groom Edit', to: routes.collection('the-groom-edit') },
          { label: 'Ceremony & Ritual', to: routes.collection('ceremony-and-ritual') },
        ],
      },
    ],
    feature: {
      eyebrow: 'Collections',
      title: 'Browse by tradition, ceremony or silhouette',
      description: 'Collections built around what a wedding actually involves.',
      to: routes.collections,
      mediaKey: 'editorial-arches',
    },
  },
  {
    id: 'vendors',
    label: 'Vendors',
    to: routes.vendors,
    columns: [
      {
        title: 'Most searched',
        links: [
          { label: 'Bridalwear', to: routes.vendorCategory('bridalwear') },
          { label: 'Makeup artists', to: routes.vendorCategory('makeup') },
          { label: 'Mehendi artists', to: routes.vendorCategory('mehendi') },
          { label: 'Wedding planners', to: routes.vendorCategory('planners') },
        ],
      },
      {
        title: 'Celebration',
        links: [
          { label: 'Entertainment', to: routes.vendorCategory('entertainment') },
          { label: 'Choreographers', to: routes.vendorCategory('choreographers') },
          { label: 'Wedding cakes', to: routes.vendorCategory('wedding-cakes') },
          { label: 'Transportation', to: routes.vendorCategory('transportation') },
        ],
      },
      {
        title: 'Stationery & flowers',
        links: [
          { label: 'Invitations', to: routes.vendorCategory('invitations') },
          { label: 'Florists', to: routes.vendorCategory('florists') },
          { label: 'Bridal accessories', to: routes.vendorCategory('bridal-accessories') },
          { label: 'Videography', to: routes.vendorCategory('videography') },
        ],
      },
    ],
    feature: {
      eyebrow: 'For businesses',
      title: 'Sell to couples who are ready to book',
      description: 'List your business, publish products and receive enquiries directly.',
      to: routes.retailers,
      mediaKey: 'groom-business',
    },
  },
  {
    id: 'planning',
    label: 'Planning',
    to: routes.planning,
    columns: [
      {
        title: 'Your wedding',
        links: [
          { label: 'Dashboard', to: routes.planning },
          { label: 'Events', to: routes.planningEvents },
          { label: 'Checklist', to: routes.planningChecklist },
          { label: 'Timeline', to: routes.planningTimeline },
        ],
      },
      {
        title: 'Money & guests',
        links: [
          { label: 'Budget', to: routes.planningBudget },
          { label: 'Guest list', to: routes.planningGuests },
        ],
      },
      {
        title: 'Reading',
        links: [
          { label: 'Planning guides', to: routes.inspiration, search: { category: 'planning' } },
          { label: 'Real weddings', to: routes.inspiration, search: { category: 'real-weddings' } },
        ],
      },
    ],
    feature: {
      eyebrow: 'Planning',
      title: 'A checklist that matches your ceremonies',
      description: 'Tasks seeded from the traditions you selected, editable from the first day.',
      to: routes.planningChecklist,
      mediaKey: 'editorial-arrival',
    },
  },
  {
    id: 'inspiration',
    label: 'Inspiration',
    to: routes.inspiration,
  },
];

export const FOOTER_NAV: NavColumn[] = [
  {
    title: 'Shop',
    links: [
      { label: 'Bride', to: routes.collectionsBridal },
      { label: 'Groom', to: routes.collectionsGroom },
      { label: 'Accessories', to: routes.collectionsAccessories },
      { label: 'Jewellery', to: routes.collectionsJewellery },
      { label: 'Beauty', to: routes.collectionsBeauty },
      { label: 'Ceremony', to: routes.collectionsCeremony },
    ],
  },
  {
    title: 'Wedding',
    links: [
      { label: 'Vendors', to: routes.vendors },
      { label: 'Planning', to: routes.planning },
      { label: 'Checklist', to: routes.planningChecklist },
      { label: 'Budget', to: routes.planningBudget },
      { label: 'Inspiration', to: routes.inspiration },
    ],
  },
  {
    title: 'For businesses',
    links: [
      { label: 'Become a retailer', to: routes.retailers },
      { label: 'Apply', to: routes.retailersApply },
      { label: 'Retailer login', to: routes.retailersLogin },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: routes.about },
      { label: 'Contact', to: routes.contact },
      { label: 'FAQ', to: routes.faq },
    ],
  },
  {
    title: 'Policies',
    links: [
      { label: 'Privacy', to: routes.privacy },
      { label: 'Terms', to: routes.terms },
      { label: 'Shipping', to: routes.shipping },
      { label: 'Returns', to: routes.returns },
    ],
  },
];

export const TAB_NAV = [
  { label: 'Overview', to: routes.account },
  { label: 'Wedding profile', to: routes.accountProfile },
  { label: 'Saved items', to: routes.accountSaved },
  { label: 'Wishlist', to: routes.accountWishlist },
  { label: 'Preferences', to: routes.accountPreferences },
];

export const RETAILER_NAV = [
  { label: 'Dashboard', to: routes.retailersDashboard },
  { label: 'Products', to: routes.retailersProducts },
  { label: 'Enquiries', to: routes.retailersEnquiries },
  { label: 'Orders', to: routes.retailersOrders },
  { label: 'Analytics', to: routes.retailersAnalytics },
  { label: 'Business profile', to: routes.retailersProfile },
];

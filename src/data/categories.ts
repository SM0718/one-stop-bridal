import type { CategoryGroup, ProductCategory, VendorCategory } from '@/types';

export const CATEGORY_GROUPS: { id: CategoryGroup; name: string; slug: string; description: string }[] = [
  { id: 'bridal', name: 'Bride', slug: 'bridal', description: 'Bridal outfits and the pieces worn with them.' },
  { id: 'groom', name: 'Groom', slug: 'groom', description: 'Groomwear, tailoring and finishing pieces.' },
  { id: 'accessories', name: 'Accessories', slug: 'accessories', description: 'Shoes, veils, headpieces and bags.' },
  { id: 'jewellery', name: 'Jewellery', slug: 'jewellery', description: 'Bridal sets and fine jewellery.' },
  { id: 'beauty', name: 'Beauty', slug: 'beauty', description: 'Makeup, hair, mehendi and skincare.' },
  { id: 'ceremony', name: 'Ceremony', slug: 'ceremony', description: 'Ritual items and ceremony essentials.' },
];

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    id: 'bridal-lehenga',
    name: 'Bridal Lehengas',
    slug: 'bridal-lehenga',
    group: 'bridal',
    description: 'Embroidered and tailored lehenga sets for the wedding day.',
    mediaKey: 'editorial-pillars',
  },
  {
    id: 'bridal-saree',
    name: 'Bridal Sarees',
    slug: 'bridal-saree',
    group: 'bridal',
    description: 'Saris woven, embroidered and draped for weddings.',
    mediaKey: 'bridal-roses',
  },
  {
    id: 'bridal-gown',
    name: 'Wedding Gowns',
    slug: 'bridal-gown',
    group: 'bridal',
    description: 'Gowns and dresses for church, civil and modern ceremonies.',
    mediaKey: 'bridal-gown-elegant',
  },
  {
    id: 'bridal-anarkali',
    name: 'Anarkalis & Bridal Suits',
    slug: 'bridal-anarkali',
    group: 'bridal',
    description: 'Anarkalis, ghararas and full bridal suit sets.',
    mediaKey: 'bridal-detailed-gown',
  },
  {
    id: 'modest-bridalwear',
    name: 'Modest Bridalwear',
    slug: 'modest-bridalwear',
    group: 'bridal',
    description: 'Coverage, sleeves and drape without losing the detail.',
    mediaKey: 'bridal-rear-view',
  },
  {
    id: 'bridal-suit',
    name: 'Bridal Suits & Shararas',
    slug: 'bridal-suit',
    group: 'bridal',
    description: 'Suit sets and shararas for the nikah, mehndi and reception.',
    mediaKey: 'bridal-lace-back',
  },
  {
    id: 'veils',
    name: 'Veils & Dupattas',
    slug: 'veils',
    group: 'bridal',
    description: 'Veils, dupattas and the fabric that finishes a look.',
    mediaKey: 'hero-veil',
  },
  {
    id: 'custom-bridal',
    name: 'Made to Measure',
    slug: 'custom-bridal',
    group: 'bridal',
    description: 'Commissions built to your measurements and your brief.',
    mediaKey: 'bridal-lace-detail',
  },
  {
    id: 'sherwani',
    name: 'Sherwanis',
    slug: 'sherwani',
    group: 'groom',
    description: 'Sherwanis and achkans for the ceremony.',
    mediaKey: 'couple-showing-style',
  },
  {
    id: 'groom-suit',
    name: 'Groom Suits',
    slug: 'groom-suit',
    group: 'groom',
    description: 'Tailored suits for the wedding and the days around it.',
    mediaKey: 'groom-suit',
  },
  {
    id: 'tuxedo',
    name: 'Tuxedos',
    slug: 'tuxedo',
    group: 'groom',
    description: 'Black tie and evening tailoring.',
    mediaKey: 'groom-three-piece',
  },
  {
    id: 'groom-traditional',
    name: 'Traditional Groomwear',
    slug: 'groom-traditional',
    group: 'groom',
    description: 'Kurtas, daglis and traditional groom dress.',
    mediaKey: 'groom-prep',
  },
  {
    id: 'groom-accessories',
    name: 'Groom Accessories',
    slug: 'groom-accessories',
    group: 'groom',
    description: 'Cufflinks, ties, pocket squares and shoes.',
    mediaKey: 'groom-cufflinks',
  },
  {
    id: 'bridal-jewellery',
    name: 'Bridal Jewellery',
    slug: 'bridal-jewellery',
    group: 'jewellery',
    description: 'Necklaces, earrings and sets for the ceremony.',
    mediaKey: 'jewellery-necklace-worn',
  },
  {
    id: 'fine-jewellery',
    name: 'Fine Jewellery',
    slug: 'fine-jewellery',
    group: 'jewellery',
    description: 'Gold, gemstone and fine pieces made to last.',
    mediaKey: 'jewellery-ring-ornate',
  },
  {
    id: 'shoes',
    name: 'Bridal Shoes',
    slug: 'shoes',
    group: 'accessories',
    description: 'Heels, flats and everything the dance floor needs.',
    mediaKey: 'bridal-shoes',
  },
  {
    id: 'headpieces',
    name: 'Headpieces & Tikka',
    slug: 'headpieces',
    group: 'accessories',
    description: 'Tikka, headbands, pins and hair pieces.',
    mediaKey: 'jewellery-earrings-pearl',
  },
  {
    id: 'clutch-bags',
    name: 'Clutches & Bags',
    slug: 'clutch-bags',
    group: 'accessories',
    description: 'Clutches and small bags for the day.',
    mediaKey: 'jewellery-deconstructed',
  },
  {
    id: 'makeup',
    name: 'Makeup',
    slug: 'makeup',
    group: 'beauty',
    description: 'Bridal makeup services and the products used.',
    mediaKey: 'beauty-artist',
  },
  {
    id: 'hair',
    name: 'Hair',
    slug: 'hair',
    group: 'beauty',
    description: 'Bridal hair styling and treatments.',
    mediaKey: 'beauty-hair',
  },
  {
    id: 'mehendi',
    name: 'Mehendi',
    slug: 'mehendi',
    group: 'beauty',
    description: 'Mehendi artists and bridal designs.',
    mediaKey: 'mehendi-hands',
  },
  {
    id: 'skincare',
    name: 'Bridal Skincare',
    slug: 'skincare',
    group: 'beauty',
    description: 'Treatments and routines in the months before.',
    mediaKey: 'beauty-products',
  },
  {
    id: 'ritual-items',
    name: 'Ritual Items',
    slug: 'ritual-items',
    group: 'ceremony',
    description: 'Items the ceremony needs, by tradition.',
    mediaKey: 'ritual-aarti',
  },
  {
    id: 'ceremony-essentials',
    name: 'Ceremony Essentials',
    slug: 'ceremony-essentials',
    group: 'ceremony',
    description: 'Archways, aisle pieces and the structure of the ceremony.',
    mediaKey: 'flowers-custom-arch',
  },
];

const PRODUCT_CATEGORY_MAP = new Map(PRODUCT_CATEGORIES.map((c) => [c.id, c]));
const PRODUCT_CATEGORY_SLUG_MAP = new Map(PRODUCT_CATEGORIES.map((c) => [c.slug, c]));

export function getProductCategory(id: string): ProductCategory | undefined {
  return PRODUCT_CATEGORY_MAP.get(id as ProductCategory['id']);
}

export function getProductCategoryBySlug(slug: string): ProductCategory | undefined {
  return PRODUCT_CATEGORY_SLUG_MAP.get(slug);
}

export function productCategoriesInGroup(group: CategoryGroup): ProductCategory[] {
  return PRODUCT_CATEGORIES.filter((c) => c.group === group);
}

/* ==========================================================================
   Vendor categories
   ========================================================================== */

export const VENDOR_CATEGORIES: VendorCategory[] = [
  {
    id: 'bridalwear',
    name: 'Bridalwear',
    slug: 'bridalwear',
    description: 'Designers, boutiques and boutiques offering bridal appointments.',
    mediaKey: 'bridal-gown-elegant',
  },
  {
    id: 'groomwear',
    name: 'Groomwear',
    slug: 'groomwear',
    description: 'Tailors and designers for groom and groomsmen.',
    mediaKey: 'groom-suit',
  },
  {
    id: 'jewellery',
    name: 'Jewellery',
    slug: 'jewellery',
    description: 'Jewellers, goldsmiths and fine jewellery houses.',
    mediaKey: 'jewellery-ring-ornate',
  },
  {
    id: 'makeup',
    name: 'Makeup',
    slug: 'makeup',
    description: 'Makeup artists for bridal and family.',
    mediaKey: 'beauty-artist',
  },
  {
    id: 'hair',
    name: 'Hair',
    slug: 'hair',
    description: 'Hair stylists for bridal styling.',
    mediaKey: 'beauty-hair',
  },
  {
    id: 'mehendi',
    name: 'Mehendi',
    slug: 'mehendi',
    description: 'Mehendi artists for bridal and guest designs.',
    mediaKey: 'mehendi-designs',
  },
  {
    id: 'photography',
    name: 'Photography',
    slug: 'photography',
    description: 'Photographers and photography teams.',
    mediaKey: 'moment-photography',
  },
  {
    id: 'videography',
    name: 'Videography',
    slug: 'videography',
    description: 'Filmmakers and videography teams.',
    mediaKey: 'moment-portraits',
  },
  {
    id: 'venues',
    name: 'Venues',
    slug: 'venues',
    description: 'Hotels, estates, halls and outdoor venues.',
    mediaKey: 'venue-tent',
  },
  {
    id: 'decor',
    name: 'Decor',
    slug: 'decor',
    description: 'Decorators, mandap builders and stylists.',
    mediaKey: 'decor-table-flowers',
  },
  {
    id: 'catering',
    name: 'Catering',
    slug: 'catering',
    description: 'Caterers for every menu requirement.',
    mediaKey: 'decor-venue-table',
  },
  {
    id: 'invitations',
    name: 'Invitations',
    slug: 'invitations',
    description: 'Stationery designers and printers.',
    mediaKey: 'invite-reception',
  },
  {
    id: 'florists',
    name: 'Florists',
    slug: 'florists',
    description: 'Florists for bouquets, arches and installations.',
    mediaKey: 'flowers-arch',
  },
  {
    id: 'planners',
    name: 'Wedding Planners',
    slug: 'planners',
    description: 'Planners and on-the-day coordinators.',
    mediaKey: 'editorial-hands',
  },
  {
    id: 'choreographers',
    name: 'Choreographers',
    slug: 'choreographers',
    description: 'Choreographers for sangeet and first dances.',
    mediaKey: 'dance-beach',
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    slug: 'entertainment',
    description: 'Bands, DJs, dhol players and performers.',
    mediaKey: 'music-venue',
  },
  {
    id: 'transportation',
    name: 'Transportation',
    slug: 'transportation',
    description: 'Wedding cars and guest transport.',
    mediaKey: 'editorial-arrival',
  },
  {
    id: 'bridal-accessories',
    name: 'Bridal Accessories',
    slug: 'bridal-accessories',
    description: 'Shoes, headpieces, veils and finishing pieces.',
    mediaKey: 'bridal-flatlay',
  },
  {
    id: 'wedding-cakes',
    name: 'Wedding Cakes',
    slug: 'wedding-cakes',
    description: 'Cake makers and dessert tables.',
    mediaKey: 'cake-two-tier',
  },
  {
    id: 'ritual-services',
    name: 'Ritual Services',
    slug: 'ritual-services',
    description: 'Officiants and the services a ceremony requires.',
    mediaKey: 'ritual-aarti',
  },
];

const VENDOR_CATEGORY_MAP = new Map(VENDOR_CATEGORIES.map((c) => [c.id, c]));
const VENDOR_CATEGORY_SLUG_MAP = new Map(VENDOR_CATEGORIES.map((c) => [c.slug, c]));

export function getVendorCategory(id: string): VendorCategory | undefined {
  return VENDOR_CATEGORY_MAP.get(id as VendorCategory['id']);
}

export function getVendorCategoryBySlug(slug: string): VendorCategory | undefined {
  return VENDOR_CATEGORY_SLUG_MAP.get(slug);
}

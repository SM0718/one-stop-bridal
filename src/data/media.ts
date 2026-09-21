/**
 * Demo photography library.
 *
 * All imagery is sourced from Shopify Burst (free for commercial use) and is
 * deliberately isolated in this one file. Swapping the platform to licensed
 * brand/retailer photography — or to a real CDN with AVIF/WebP derivatives —
 * means editing `MEDIA` and `mediaSrcSet` here and nothing else.
 *
 * The library is placeholder art direction: it stands in for real bridal
 * photography and retailer product shots, and should be replaced before launch.
 */

interface MediaAsset {
  /** Filename on the CDN, without extension */
  slug: string;
  /** Meaningful alternative text, required everywhere the asset is rendered */
  alt: string;
}

export const MEDIA = {
  /* ---- Editorial & hero ------------------------------------------------ */
  'hero-portrait': {
    slug: 'bride-and-groom-taking-a-moment',
    alt: 'A bride and groom pausing together in a quiet moment during their wedding',
  },
  'hero-aisle': {
    slug: 'bride-walks-down-aisle-through-archway',
    alt: 'A bride walking down the aisle beneath a flower-covered archway',
  },
  'hero-silhouette': {
    slug: 'sunset-silhouettes-a-bride-and-groom-facing-each-other',
    alt: 'A bride and groom silhouetted against the sunset, facing each other',
  },
  'hero-veil': {
    slug: 'a-bride-through-a-veil',
    alt: 'A bride photographed through the soft texture of her veil',
  },
  'editorial-pillars': {
    slug: 'wedding-fashion-and-stone-pillars',
    alt: 'Bridal fashion photographed against carved stone pillars',
  },
  'editorial-arches': {
    slug: 'bridal-fashion-near-antique-pillars',
    alt: 'A bride standing beside antique architectural arches',
  },
  'editorial-hands': {
    slug: 'newly-weds-hold-hands-close-up',
    alt: 'A newly married couple holding hands, photographed close up',
  },
  'editorial-overlook': {
    slug: 'a-bride-overlooking-her-wedding',
    alt: 'A bride looking out over her wedding celebration',
  },
  'editorial-hands-ribbon': {
    slug: 'always-your-hands',
    alt: 'Two pairs of hands tied with ribbon in a wedding tradition',
  },
  'editorial-arrival': {
    slug: 'bride-and-groom-on-steps',
    alt: 'A bride and groom arriving together at the top of a stone stairway',
  },

  /* ---- Bridal ----------------------------------------------------------- */
  'bridal-gown-modern': {
    slug: 'bridal-fashion-model-in-modern-wedding-gown',
    alt: 'A model wearing a modern wedding gown with clean, sculpted lines',
  },
  'bridal-gown-elegant': {
    slug: 'bride-in-elegant-gown',
    alt: 'A bride in an elegantly cut wedding gown',
  },
  'bridal-lace-bouquet': {
    slug: 'bride-in-lace-wedding-dress-holding-bouquet',
    alt: 'A bride in a lace wedding dress holding her bouquet',
  },
  'bridal-lace-back': {
    slug: 'back-of-bride-showing-their-white-lace-dress',
    alt: 'The back of a white lace wedding dress, showing button detailing',
  },
  'bridal-beaded': {
    slug: 'beaded-wedding-dress-with-white-bouquet',
    alt: 'A beaded wedding dress photographed with a white bouquet',
  },
  'bridal-bodice': {
    slug: 'wedding-gown-with-beaded-bodice',
    alt: 'A wedding gown with a hand-beaded bodice',
  },
  'bridal-flowing': {
    slug: 'flowing-skirt-and-beaded-bodice-wedding-dress',
    alt: 'A wedding dress with a flowing skirt and beaded bodice in motion',
  },
  'bridal-seated': {
    slug: 'bride-sits-in-flowing-wedding-dress',
    alt: 'A bride seated in a flowing wedding dress',
  },
  'bridal-rear-view': {
    slug: 'woman-in-wedding-dress-stands-with-her-back-to-the-camera',
    alt: 'A woman in a wedding dress standing with her back to the camera',
  },
  'bridal-detailed-gown': {
    slug: 'bride-in-detailed-wedding-gown',
    alt: 'A bride in a wedding gown with fine structural detail',
  },
  'bridal-roses': {
    slug: 'bride-wearing-wedding-dress-with-roses',
    alt: 'A bride in a wedding dress framed by roses',
  },
  'bridal-sneakers': {
    slug: 'modern-bride-in-dress-and-sneakers',
    alt: 'A bride pairing a wedding dress with trainers',
  },
  'bridal-hanging': {
    slug: 'wedding-dress-hung-up-by-a-window',
    alt: 'A wedding dress hanging by a window before the ceremony',
  },
  'bridal-lace-detail': {
    slug: 'close-up-of-lace-wedding-dress-detail',
    alt: 'Close detail of lace appliqué on a wedding dress',
  },
  'bridal-lace-bodice': {
    slug: 'lace-up-bodice-on-wedding-gown',
    alt: 'The lace-up bodice of a wedding gown',
  },
  'bridal-bead-detail': {
    slug: 'beaded-detail-on-wedding-dress',
    alt: 'Hand-beaded embellishment on a wedding dress',
  },
  'bridal-flatlay': {
    slug: 'bridal-wedding-flatlay',
    alt: 'Bridal accessories arranged as a flat lay',
  },
  'bridal-dress-ring': {
    slug: 'wedding-dress-wedding-ring',
    alt: 'A wedding dress photographed with wedding rings',
  },
  'bridal-beach': {
    slug: 'white-wedding-dress-on-a-beach',
    alt: 'A white wedding dress photographed on a beach',
  },
  'bridal-princess': {
    slug: 'bride-in-princess-gown-on-the-beach',
    alt: 'A bride in a full-skirted gown on the shoreline',
  },
  'bridal-beach-fashion': {
    slug: 'bridal-fashion-beach-photo',
    alt: 'Bridal fashion photographed in coastal light',
  },
  'bridal-shore': {
    slug: 'bridal-fashion-on-beach',
    alt: 'Bridal fashion on the shore at golden hour',
  },
  'bridal-billowing': {
    slug: 'bouquet-billowing-skirt-and-beaded-bodice-wedding-dress',
    alt: 'A wedding dress with billowing skirt and beaded bodice',
  },
  'bridal-gown-bouquet': {
    slug: 'wedding-gown-and-bridal-bouquet',
    alt: 'A wedding gown shown with a matching bridal bouquet',
  },
  'bridal-archway': {
    slug: 'bride-in-wedding-dress-near-archway',
    alt: 'A bride in her wedding dress standing near a garden archway',
  },
  'bridal-warm-day': {
    slug: 'warm-summer-wedding-day-bride',
    alt: 'A bride photographed on a warm summer wedding day',
  },
  'bridal-smiling': {
    slug: 'smiling-bride-on-wedding-day',
    alt: 'A smiling bride on her wedding day',
  },
  'bridal-sunlight': {
    slug: 'sunlight-on-bride-on-wedding-day',
    alt: 'A bride lit by low sunlight on her wedding day',
  },
  'bridal-hair': {
    slug: 'woman-with-braided-hair-and-wedding-dress',
    alt: 'A bride with braided hair worn with her wedding dress',
  },
  'bridal-shoes': {
    slug: 'clear-bridal-shoes-with-crystal-decoration',
    alt: 'Bridal shoes with crystal decoration',
  },

  /* ---- Ceremony, ritual & cultural context ------------------------------ */
  'mehendi-hands': {
    slug: 'fresh-mehendi-art',
    alt: 'Freshly applied mehendi designs on a pair of hands',
  },
  'mehendi-palm': {
    slug: 'henna-on-palm',
    alt: 'Henna worked into an intricate pattern across a palm',
  },
  'mehendi-palms': {
    slug: 'henna-mehndi-design-on-palms',
    alt: 'Henna mehendi designs on both palms',
  },
  'mehendi-designs': {
    slug: 'mehndi-designs-on-a-persons-palms',
    alt: 'Mehndi designs covering a person’s palms',
  },
  'mehendi-detail': {
    slug: 'mehndi-design-with-henna-tattoo',
    alt: 'Detail of a mehndi design in henna',
  },
  'mehendi-drying': {
    slug: 'drying-henna-on-persons-palms',
    alt: 'Henna drying on a person’s palms',
  },
  'mehendi-delicate': {
    slug: 'floral-design-on-hand',
    alt: 'A delicate floral design drawn on the back of a hand',
  },
  'mehendi-presented': {
    slug: 'an-indian-woman-in-robes-presents-henna-painted-palms',
    alt: 'A woman presenting her henna-painted palms',
  },
  'bangles-hands': {
    slug: 'two-people-holding-bangle-adorned-hands',
    alt: 'Two people holding hands adorned with bangles',
  },
  'marigolds': {
    slug: 'an-arm-surrounded-by-marigolds',
    alt: 'An arm encircled by marigold garlands',
  },
  'ritual-aarti': {
    slug: 'a-man-lights-the-wick-of-a-aarti',
    alt: 'A man lighting the wick of an aarti lamp',
  },
  'ritual-temple': {
    slug: 'temples-treetops',
    alt: 'Temple rooftops rising above trees',
  },
  'ritual-india-arches': {
    slug: 'looking-back-through-arches-in-india',
    alt: 'Looking back through a sequence of carved arches',
  },
  'context-mosque': {
    slug: 'young-boy-holds-hands-up-outside-mosque',
    alt: 'A young boy raising his hands in prayer outside a mosque',
  },
  'context-islamic-pattern': {
    slug: 'islamic-ordaments-on-dark-blue',
    alt: 'Islamic geometric ornamentation on a deep blue ground',
  },
  'context-iftar': {
    slug: 'ramadan-iftar',
    alt: 'A table laid for iftar during Ramadan',
  },
  'church-altar': {
    slug: 'candle-lit-church-altar',
    alt: 'A church altar lit by candles',
  },
  'church-stone': {
    slug: 'stone-church-front',
    alt: 'The stone frontage of an old church',
  },
  'church-ceiling': {
    slug: 'golden-catholic-church-ceiling',
    alt: 'A gilded church ceiling',
  },
  'church-light': {
    slug: 'sunlight-in-church',
    alt: 'Sunlight falling through a church window onto the pews',
  },
  'church-window': {
    slug: 'a-gothic-church-window',
    alt: 'A gothic church window with stained glass',
  },
  'church-courtyard': {
    slug: 'courtyard-on-a-sunny-day-with-a-large-white-church',
    alt: 'A courtyard on a sunny day beside a large white church',
  },
  'church-blue-tiled': {
    slug: 'blue-and-white-tiled-church',
    alt: 'A church facade finished in blue and white tile',
  },
  'worship-house': {
    slug: 'elegant-white-green-house',
    alt: 'An elegant white building with deep green shutters',
  },

  /* ---- Groom ------------------------------------------------------------ */
  'groom-prep': {
    slug: 'grooms-prep-kit-for-wedding',
    alt: 'A groom’s preparation kit laid out before the wedding',
  },
  'groom-cufflinks': {
    slug: 'groom-adjusting-cufflinks',
    alt: 'A groom adjusting his cufflinks',
  },
  'groom-suit': {
    slug: 'mens-grey-black-suit',
    alt: 'A man wearing a grey and black tailored suit',
  },
  'groom-three-piece': {
    slug: 'three-piece-suit',
    alt: 'A three-piece suit photographed in detail',
  },
  'groom-portrait': {
    slug: 'man-looking-down-in-suit',
    alt: 'A man in a suit looking down, photographed in profile',
  },
  'groom-thinking': {
    slug: 'man-in-suit-thinking',
    alt: 'A man in a suit photographed in thought',
  },
  'groom-fashion': {
    slug: 'mens-fashion-close-up-shirt-tucked-in-leaning',
    alt: 'Detail of a shirt tucked into tailored trousers',
  },
  'groom-business': {
    slug: 'mens-business-fashion',
    alt: 'Menswear photographed against a plain backdrop',
  },
  'groom-laughing': {
    slug: 'man-sits-and-laughs',
    alt: 'A man in formalwear seated and laughing',
  },
  'couple-side-by-side': {
    slug: 'bride-and-groom-side-by-side',
    alt: 'A bride and groom standing side by side',
  },
  'couple-showing-style': {
    slug: 'a-bride-and-groom-show-off-their-style',
    alt: 'A bride and groom dressed in complementary outfits',
  },

  /* ---- Jewellery -------------------------------------------------------- */
  'jewellery-ring-rose': {
    slug: 'rose-gold-wedding-ring',
    alt: 'A rose gold wedding ring photographed on a soft surface',
  },
  'jewellery-ring-ornate': {
    slug: 'rose-gold-ornate-wedding-ring',
    alt: 'An ornate rose gold wedding ring',
  },
  'jewellery-engagement': {
    slug: 'beautiful-engagement-ring-on-display-with-ribbon',
    alt: 'An engagement ring displayed on ribbon',
  },
  'jewellery-earrings-pearl': {
    slug: 'double-pearl-earrings',
    alt: 'A pair of double pearl earrings',
  },
  'jewellery-earrings-table': {
    slug: 'pearl-earrings-on-table',
    alt: 'Pearl earrings resting on a table',
  },
  'jewellery-modern': {
    slug: 'modern-jewelry-hanging-on-blue-with-reflection',
    alt: 'Contemporary jewellery hanging against a reflection',
  },
  'jewellery-deconstructed': {
    slug: 'deconstructed-jewelry',
    alt: 'Jewellery components laid out for inspection',
  },
  'jewellery-necklace': {
    slug: 'rings-on-necklace-close-up',
    alt: 'Rings threaded onto a fine necklace, photographed close up',
  },
  'jewellery-necklace-worn': {
    slug: 'bride-holds-her-necklace-close',
    alt: 'A bride holding her necklace close to her collarbone',
  },
  'jewellery-bench': {
    slug: 'jewelers-workbench-in-white-space',
    alt: 'A jeweller’s workbench with tools laid out',
  },
  'jewellery-desk': {
    slug: 'neatly-kept-jewelers-desk',
    alt: 'A jeweller’s desk kept in careful order',
  },
  'jewellery-tools': {
    slug: 'jeweler-holds-up-tools',
    alt: 'A jeweller holding up a pair of fine tools',
  },
  'jewellery-work-in-progress': {
    slug: 'jeweler-working-at-workbench',
    alt: 'A jeweller shaping a piece at the workbench',
  },

  /* ---- Rings & vows ----------------------------------------------------- */
  'rings-set': {
    slug: 'a-set-of-wedding-rings-set-on-white-table',
    alt: 'A set of wedding rings arranged on a white table',
  },
  'rings-vows': {
    slug: 'wedding-rings-with-wedding-vows',
    alt: 'Wedding rings resting on printed vows',
  },
  'rings-i-do': {
    slug: 'i-do-with-wedding-rings',
    alt: 'The words I do arranged with wedding rings',
  },
  'rings-roses': {
    slug: 'wedding-ring-in-roses',
    alt: 'A wedding ring nestled among roses',
  },
  'rings-band': {
    slug: 'a-close-up-of-the-brides-wedding-ring-and-band',
    alt: 'Close up of a bride’s wedding ring and band',
  },
  'rings-held': {
    slug: 'bride-holds-up-wedding-ring',
    alt: 'A bride holding up her wedding ring',
  },
  'rings-couple': {
    slug: 'the-brides-and-her-wedding-ring',
    alt: 'A wedding ring worn on the bride’s hand',
  },
  'rings-exchanged': {
    slug: 'bride-groom-wedding-ring-vows',
    alt: 'A couple at the moment of exchanging rings',
  },
  'rings-rested': {
    slug: 'rested-hands-showing-off-rings',
    alt: 'Rested hands showing wedding rings',
  },
  'rings-flowers': {
    slug: 'wedding-flowers-and-rings',
    alt: 'Wedding rings placed among flowers',
  },

  /* ---- Flowers ---------------------------------------------------------- */
  'flowers-bouquet': {
    slug: 'bridal-bouquet',
    alt: 'A bridal bouquet photographed against a plain ground',
  },
  'flowers-rose-bouquet': {
    slug: 'bridal-rose-bouquet',
    alt: 'A rose bridal bouquet',
  },
  'flowers-pink-roses': {
    slug: 'bridal-bouquet-pink-roses',
    alt: 'A bridal bouquet of pink roses',
  },
  'flowers-held': {
    slug: 'pink-rose-wedding-bouquet-held-by-bride',
    alt: 'A bride holding a bouquet of pink roses',
  },
  'flowers-pale': {
    slug: 'pale-and-elegant-bridal-bouquet',
    alt: 'A pale, elegant bridal bouquet',
  },
  'flowers-romantic': {
    slug: 'pale-pink-romantic-bouquet-for-wedding',
    alt: 'A soft pink romantic wedding bouquet',
  },
  'flowers-seasonal': {
    slug: 'seasonal-wedding-bouquet-close-up',
    alt: 'Seasonal wedding flowers photographed close up',
  },
  'flowers-large': {
    slug: 'large-wedding-bouquet-held-up',
    alt: 'A large wedding bouquet held up to the light',
  },
  'flowers-in-hands': {
    slug: 'beautiful-flowers-in-brides-hands',
    alt: 'Wedding flowers held in a bride’s hands',
  },
  'flowers-holding': {
    slug: 'a-bride-holds-her-bouquet',
    alt: 'A bride holding her bouquet at her waist',
  },
  'flowers-clasped': {
    slug: 'bride-clasps-her-bouquet',
    alt: 'A bride clasping her bouquet',
  },
  'flowers-table': {
    slug: 'wedding-bouquet-on-table',
    alt: 'A bridal bouquet resting on a table',
  },
  'flowers-centrepiece': {
    slug: 'deep-colors-of-floral-wedding-centre-piece',
    alt: 'A wedding centrepiece in deep seasonal colour',
  },
  'flowers-small-centrepiece': {
    slug: 'small-floral-center-piece-for-wedding',
    alt: 'A small floral centrepiece for a wedding table',
  },
  'flowers-arch': {
    slug: 'flowered-wedding-arch-under-tree',
    alt: 'A flower-covered wedding arch beneath a tree',
  },
  'flowers-custom-arch': {
    slug: 'a-custom-flowered-wedding-archway',
    alt: 'A custom flowered archway built for a ceremony',
  },
  'flowers-green-accents': {
    slug: 'a-table-bouquet-with-green-accents',
    alt: 'A table arrangement with green accents',
  },

  /* ---- Venues & decor --------------------------------------------------- */
  'venue-tent': {
    slug: 'a-wedding-venue-under-the-tent',
    alt: 'A wedding venue laid out beneath a marquee',
  },
  'venue-waiting-room': {
    slug: 'a-white-wedding-waiting-room',
    alt: 'A white room prepared for a wedding party',
  },
  'venue-courtyard': {
    slug: 'elegant-white-green-house',
    alt: 'An elegant house with shutters used as a wedding venue',
  },
  'decor-table-detailed': {
    slug: 'a-detailed-wedding-table-setting',
    alt: 'A detailed wedding table setting',
  },
  'decor-table-flowers': {
    slug: 'a-wedding-table-decorated-with-flowers',
    alt: 'A wedding table decorated with flowers',
  },
  'decor-table-pink': {
    slug: 'close-up-of-pink-and-white-wedding-table-setting',
    alt: 'A pink and white wedding table setting photographed close up',
  },
  'decor-table-light': {
    slug: 'light-floral-wedding-table-setting',
    alt: 'A light floral wedding table setting',
  },
  'decor-table-outdoor': {
    slug: 'outdoor-wedding-reception-table-setting',
    alt: 'An outdoor reception table set for guests',
  },
  'decor-table-crystals': {
    slug: 'pink-wedding-table-setting-with-crystals',
    alt: 'A pink wedding table setting with crystal glassware',
  },
  'decor-venue-table': {
    slug: 'table-setting-at-wedding-venue',
    alt: 'A table setting inside a wedding venue',
  },
  'decor-menu-table': {
    slug: 'table-setup-with-menu-at-wedding',
    alt: 'A wedding place setting with a printed menu',
  },
  'decor-head-table': {
    slug: 'wedding-place-setting-at-head-table',
    alt: 'A place setting at the head table',
  },
  'decor-reception-setting': {
    slug: 'wedding-receiption-setting-with-menu',
    alt: 'A reception place setting with menu card',
  },
  'decor-vine-settings': {
    slug: 'green-vine-between-place-settings',
    alt: 'Trailing greenery between two place settings',
  },
  'decor-place-setting': {
    slug: 'place-setting-on-white-table',
    alt: 'A single place setting on a white table',
  },
  'decor-place-card': {
    slug: 'a-place-card-on-a-dinner-table',
    alt: 'A handwritten place card on a dinner table',
  },
  'decor-celebration-table': {
    slug: 'celebration-table',
    alt: 'A table laid out for a celebration',
  },
  'decor-table-two': {
    slug: 'a-small-wedding-table-for-two',
    alt: 'A small wedding table set for two',
  },
  'decor-dessert-table': {
    slug: 'a-wedding-dessert-table',
    alt: 'A wedding dessert table with cakes and sweets',
  },
  'decor-sunlit-reception': {
    slug: 'sunlit-outdoor-wedding-reception',
    alt: 'A sunlit outdoor wedding reception',
  },
  'decor-menu-napkin': {
    slug: 'a-linen-napkin-topped-with-a-gold-lettered-menu',
    alt: 'A linen napkin topped with a gold lettered menu',
  },

  /* ---- Catering & cakes ------------------------------------------------- */
  'cake-two-tier': {
    slug: 'two-tier-white-wedding-cake',
    alt: 'A two tier white wedding cake',
  },
  'cake-gold-marble': {
    slug: 'gold-and-marbled-wedding-cake',
    alt: 'A gold and marbled wedding cake',
  },
  'cake-presented': {
    slug: 'bride-holding-out-white-wedding-cake',
    alt: 'A bride holding out a slice of white wedding cake',
  },
  'cake-stand': {
    slug: 'white-cake-on-a-black-cake-stand',
    alt: 'A white cake presented on a black stand',
  },
  'cake-celebration': {
    slug: 'a-decadent-cake-at-outdoor-celebration',
    alt: 'A decorated cake at an outdoor celebration',
  },
  'cake-top-view': {
    slug: 'top-view-of-two-tier-cake',
    alt: 'A two tier cake photographed from above',
  },

  /* ---- Beauty ----------------------------------------------------------- */
  'beauty-artist': {
    slug: 'makeup-artist-at-work',
    alt: 'A makeup artist working on a client',
  },
  'beauty-kit': {
    slug: 'makeup-artists-kit',
    alt: 'A makeup artist’s kit laid out',
  },
  'beauty-products': {
    slug: 'makeup-and-beauty-products',
    alt: 'Beauty products arranged together',
  },
  'beauty-flatlay': {
    slug: 'makeup-beauty-flatlay',
    alt: 'Makeup arranged as a flat lay',
  },
  'beauty-in-progress': {
    slug: 'woman-getting-makeup-done',
    alt: 'A woman having her makeup applied',
  },
  'beauty-artist-pink': {
    slug: 'pink-makeup-by-artist',
    alt: 'An artist applying pink makeup',
  },
  'beauty-eyes': {
    slug: 'blue-eyes-getting-makeup-close-up',
    alt: 'Close up of eye makeup being applied',
  },
  'beauty-brushes': {
    slug: 'makeup-brushes-close-up',
    alt: 'A set of makeup brushes photographed close up',
  },
  'beauty-shadows': {
    slug: 'makeup-shadows-and-blushes',
    alt: 'Eyeshadows and blushers in an open palette',
  },
  'beauty-jewellery': {
    slug: 'makeup-and-jewelry',
    alt: 'Makeup arranged alongside jewellery',
  },
  'beauty-hair': {
    slug: 'bride-adjusts-hair-wedding-photography',
    alt: 'A bride adjusting her hair',
  },

  /* ---- Stationery ------------------------------------------------------- */
  'invite-reception': {
    slug: 'fancy-wedding-reception-invitation',
    alt: 'A formally printed wedding reception invitation',
  },
  'invite-flower': {
    slug: 'a-flower-and-a-wedding-invite',
    alt: 'A wedding invitation photographed with a flower',
  },
  'invite-fabric': {
    slug: 'an-invite-lays-surrounded-by-soft-pink-fabric',
    alt: 'An invitation resting on soft pink fabric',
  },

  /* ---- Entertainment & movement ----------------------------------------- */
  'music-venue': {
    slug: 'guitarist-plays-in-a-smokey-venue',
    alt: 'A guitarist playing in a dimly lit venue',
  },
  'music-crowd': {
    slug: 'music-fans-at-a-venue',
    alt: 'A crowd gathered at a live music venue',
  },
  'dance-beach': {
    slug: 'two-people-in-formal-wear-dance-on-the-beach',
    alt: 'Two people in formalwear dancing on a beach',
  },

  /* ---- Details ---------------------------------------------------------- */
  'detail-shoes': {
    slug: 'wedding-day-photo-of-shoes',
    alt: 'Wedding shoes photographed on the day',
  },
  'detail-couple-shoes': {
    slug: 'bride-and-groom-shoes',
    alt: 'A bride’s and groom’s shoes photographed side by side',
  },
  'detail-sign': {
    slug: 'large-sign-saying-best-day-ever-at-wedding',
    alt: 'A large decorative sign reading best day ever',
  },
  'detail-silk-robe': {
    slug: 'person-with-brown-hair-in-a-white-silk-robe',
    alt: 'A person wearing a white silk robe while getting ready',
  },
  'detail-silk': {
    slug: 'person-with-brown-hair-in-a-white-silk-robe',
    alt: 'Silk fabric photographed in soft light',
  },
  'moment-kiss': {
    slug: 'bride-groom-wedding-kiss',
    alt: 'A bride and groom sharing a kiss',
  },
  'moment-love': {
    slug: 'bride-groom-love',
    alt: 'A bride and groom photographed together',
  },
  'moment-walking': {
    slug: 'bride-and-groom-walking-on-the-grass',
    alt: 'A bride and groom walking together across grass',
  },
  'moment-beach-walk': {
    slug: 'bride-and-groom-walk-the-beach',
    alt: 'A bride and groom walking along the shoreline',
  },
  'moment-playful': {
    slug: 'bride-groom-play-at-wedding',
    alt: 'A bride and groom playing together at their wedding',
  },
  'moment-hands': {
    slug: 'holding-hands-on-wedding-day',
    alt: 'A couple holding hands on their wedding day',
  },
  'moment-married-hands': {
    slug: 'married-couple-holding-hands',
    alt: 'A married couple holding hands',
  },
  'moment-engagement': {
    slug: 'engagement-photo',
    alt: 'A couple photographed at their engagement',
  },
  'moment-photography': {
    slug: 'wedding-photography-bride-groom',
    alt: 'A photographer framing a bride and groom',
  },
  'moment-portraits': {
    slug: 'outdoor-wedding-photos-with-bride',
    alt: 'Outdoor wedding portraits with the bride',
  },
} as const satisfies Record<string, MediaAsset>;

export type MediaKey = keyof typeof MEDIA;

const CDN_BASE = 'https://burst.shopifycdn.com/photos/';

/** Widths used for responsive `srcset` on editorial and product imagery. */
export const MEDIA_WIDTHS = [480, 768, 1024, 1440, 1920] as const;

export function isMediaKey(key: string): key is MediaKey {
  return Object.prototype.hasOwnProperty.call(MEDIA, key);
}

/** Returns the alt text for a media key, falling back safely for unknown keys. */
export function mediaAlt(key: string): string {
  return isMediaKey(key) ? MEDIA[key].alt : '';
}

/**
 * Builds a CDN URL at a given width. Returns `null` for unknown keys so
 * components can render a tonal placeholder instead of a broken image.
 */
export function mediaUrl(key: string, width: number = 1024): string | null {
  if (!isMediaKey(key)) return null;
  return `${CDN_BASE}${MEDIA[key].slug}.jpg?width=${width}`;
}

/** Builds a responsive `srcset` string for a media key. */
export function mediaSrcSet(key: string, widths: readonly number[] = MEDIA_WIDTHS): string | undefined {
  if (!isMediaKey(key)) return undefined;
  const { slug } = MEDIA[key];
  return widths.map((w) => `${CDN_BASE}${slug}.jpg?width=${w} ${w}w`).join(', ');
}

/** Curated multi-image galleries for product records. */
export function galleryKeys(keys: string[]): { mediaKey: MediaKey; alt: string }[] {
  return keys.filter(isMediaKey).map((k) => ({ mediaKey: k, alt: MEDIA[k].alt }));
}

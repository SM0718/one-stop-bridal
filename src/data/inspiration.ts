import type { Collection, InspirationArticle, InspirationCategory } from '@/types';

export const INSPIRATION_CATEGORIES: InspirationCategory[] = [
  { id: 'bridal-looks', name: 'Bridal Looks', slug: 'bridal-looks', description: 'Outfits, styling and the details that finish them.' },
  { id: 'wedding-decor', name: 'Wedding Decor', slug: 'wedding-decor', description: 'Tables, structures, flowers and lighting.' },
  { id: 'jewellery', name: 'Jewellery', slug: 'jewellery', description: 'How to choose, commission and wear bridal jewellery.' },
  { id: 'ceremonies', name: 'Ceremonies', slug: 'ceremonies', description: 'What happens, why, and how to sequence it.' },
  { id: 'beauty', name: 'Beauty', slug: 'beauty', description: 'Skin, hair and makeup in the months before.' },
  { id: 'real-weddings', name: 'Real Weddings', slug: 'real-weddings', description: 'Weddings planned on this platform, with the detail behind them.' },
  { id: 'planning', name: 'Planning', slug: 'planning', description: 'Budgets, timelines, guest lists and the practical work.' },
  { id: 'cultural-guides', name: 'Cultural Guides', slug: 'cultural-guides', description: 'Explainers for guests, and for couples combining traditions.' },
];

export const INSPIRATION: InspirationArticle[] = [
  {
    id: 'art-1',
    slug: 'choosing-a-bridal-silhouette-that-works',
    title: 'Choosing a bridal silhouette that actually works',
    standfirst:
      'Silhouette matters more than embroidery. A short guide to picking a shape for the ceremony you are actually having.',
    categoryId: 'bridal-looks',
    faiths: ['HINDU', 'MUSLIM', 'CHRISTIAN', 'SIKH', 'JAIN', 'PARSI', 'INTERFAITH', 'CUSTOM'],
    author: 'Meera Vasant',
    authorRole: 'Bridal designer, Mumbai',
    publishedAt: '2025-02-18',
    readingMinutes: 6,
    heroMediaKey: 'bridal-gown-elegant',
    sections: [
      {
        body: [
          'Most brides arrive with a photograph of embroidery. It is the embroidery that gets discussed, photographed and pinned, and it is the silhouette that decides whether you can sit, kneel, walk and be embraced by three hundred people over the course of a day.',
          'So start with the ceremony, not the outfit.',
        ],
      },
      {
        heading: 'What the ceremony asks of you',
        body: [
          'A vivah involves sitting cross-legged on a low platform for a long stretch. A skirt with a heavy boned waist will not do that comfortably, however good it looks standing up.',
          'A church service involves kneeling, and often a period standing in one spot. A column or bias-cut gown photographs beautifully and will let you kneel without rearranging yourself.',
          'A nikah may involve sitting on a raised stage for a long period, frequently photographed from below. Weight distribution through the hips matters more than the shoulder line.',
        ],
      },
      {
        heading: 'Fit over fashion',
        body: [
          'The single biggest difference between an outfit that looks expensive and one that does not is whether it fits at the shoulder and the waist. Everything else is decoration.',
          'If you are choosing between spending on heavier embroidery or on a proper made-to-measure fitting, spend it on the fitting. Embroidery does not photograph nearly as well as a garment that sits correctly.',
        ],
      },
    ],
    relatedProductIds: ['prod-nr-4401', 'prod-mv-1042', 'prod-zm-6601'],
    relatedVendorIds: ['ven-marigold-room'],
  },
  {
    id: 'art-2',
    slug: 'how-to-sequence-a-multi-day-wedding',
    title: 'How to sequence a multi-day wedding',
    standfirst:
      'The running order is the hardest document to get right, and the one that saves the most money.',
    categoryId: 'planning',
    faiths: ['HINDU', 'SIKH', 'MUSLIM', 'JAIN', 'INTERFAITH'],
    author: 'Priya Raghunathan',
    authorRole: 'Wedding planner, London',
    publishedAt: '2025-02-09',
    readingMinutes: 8,
    heroMediaKey: 'editorial-arrival',
    sections: [
      {
        body: [
          'A three-day wedding has four logistical problems that a one-day wedding does not: guest accommodation across multiple nights, vendor availability across multiple days, the couple’s energy, and outfit changes.',
          'Write the running order before you book anything. It will tell you what you actually need.',
        ],
      },
      {
        heading: 'Build backwards from the ceremony',
        body: [
          'Fix the wedding ceremony first. Everything else is scheduled relative to it, and a mehendi the night before a morning vivah is a decision you should make deliberately rather than by accident.',
          'Then place the recovery. If the vivah finishes at 2am, do not schedule a brunch at 9am, however much the family wants one.',
        ],
      },
      {
        heading: 'Keep one day empty',
        body: [
          'On a four-day wedding, put a quiet day in the middle. Couples who do not do this arrive at their own wedding exhausted, and it shows in every photograph.',
        ],
      },
    ],
    relatedProductIds: [],
    relatedVendorIds: ['ven-two-traditions', 'ven-manav-nritya'],
  },
  {
    id: 'art-3',
    slug: 'commissioning-bridal-jewellery',
    title: 'Commissioning bridal jewellery without getting it wrong',
    standfirst: 'What to ask before you pay a deposit, and what should be in writing.',
    categoryId: 'jewellery',
    faiths: ['HINDU', 'JAIN', 'SIKH', 'MUSLIM', 'PARSI', 'INTERFAITH'],
    author: 'Nandini Sheth',
    authorRole: 'Jeweller, Jaipur',
    publishedAt: '2025-01-30',
    readingMinutes: 7,
    heroMediaKey: 'jewellery-bench',
    sections: [
      {
        body: [
          'Commissioning a bridal set is a significant purchase made on a short timeline, often with family involved. A few things agreed in writing at the start will prevent most of the arguments.',
        ],
      },
      {
        heading: 'Gold is priced on the day',
        body: [
          'Ask which day’s rate applies and get it in writing. Some houses price on order, some on delivery, and between a nine-month order and delivery the difference can be substantial.',
          'Ask about making charges separately from the metal and the stones. A single combined figure makes it impossible to compare quotes.',
        ],
      },
      {
        heading: 'Ask about exchange and buy-back',
        body: [
          'A serious house will explain both clearly and put the terms on the invoice. If the answer is vague, treat that as information about how a future conversation will go.',
          'If you are working from a photograph of an inherited piece, expect the settings to be reinterpreted rather than copied exactly, and say so up front if that is not acceptable.',
        ],
      },
    ],
    relatedProductIds: ['prod-sj-3301', 'prod-sj-3345', 'prod-sj-3338'],
    relatedVendorIds: [],
  },
  {
    id: 'art-4',
    slug: 'what-happens-at-a-nikah',
    title: 'What happens at a nikah',
    standfirst: 'A plain-language explainer for guests who have not attended one before.',
    categoryId: 'cultural-guides',
    faiths: ['MUSLIM', 'INTERFAITH'],
    author: 'Ayesha Karim',
    authorRole: 'Writer',
    publishedAt: '2025-02-12',
    readingMinutes: 5,
    heroMediaKey: 'context-islamic-pattern',
    sections: [
      {
        body: [
          'The nikah is the marriage contract. It is agreed between the couple in the presence of witnesses, and the officiant confirms consent rather than conducting a ceremony around the couple.',
          'Everything else — the mehndi, the dholki, the walima — comes from family and regional tradition rather than from the contract itself, which is why no two families do it the same way.',
        ],
      },
      {
        heading: 'The contract',
        body: [
          'The mahr is a sum agreed as part of the contract and payable to the bride. Guests do not need to know the figure; it is a private matter between the families.',
          'A written contract is signed. Depending on the family, this happens at the nikah itself or at a separate gathering earlier.',
        ],
      },
      {
        heading: 'What is expected of you',
        body: [
          'Dress modestly, remove shoes where indicated, and follow the family’s arrangements for seating. If celebrations are segregated, this will be made clear to you in advance or on arrival.',
          'Photography practice varies. If you are not sure, ask the family rather than the photographer.',
        ],
      },
    ],
    relatedProductIds: ['prod-zm-6601'],
    relatedVendorIds: ['ven-qasr'],
  },
  {
    id: 'art-5',
    slug: 'planning-an-interfaith-wedding',
    title: 'Planning an interfaith wedding',
    standfirst:
      'Two ceremonies, two officiants, one running order. The practical decisions, in the order you will face them.',
    categoryId: 'ceremonies',
    faiths: ['INTERFAITH', 'HINDU', 'CHRISTIAN', 'MUSLIM', 'SIKH', 'JEWISH'],
    author: 'Priya Raghunathan',
    authorRole: 'Wedding planner, London',
    publishedAt: '2025-02-22',
    readingMinutes: 9,
    heroMediaKey: 'couple-showing-style',
    sections: [
      {
        body: [
          'Most interfaith weddings do not go wrong over religion. They go wrong over sequence, budget, and the assumption that both families already understand what is happening.',
        ],
      },
      {
        heading: 'Decide the sequence early',
        body: [
          'Same day, or different days? Same venue, or two? Both are workable, and they cost very different amounts. Two ceremonies on one day means two sets of vendor hours and a very long day for the couple.',
          'Separate days are usually kinder. It also gives each family a day that is unambiguously theirs.',
        ],
      },
      {
        heading: 'Find officiants who will co-operate',
        body: [
          'Not every officiant will take part in a joint ceremony. Start that conversation twelve months out, not three, because it determines the shape of everything else.',
          'Ask directly: will you co-officiate, and will you participate in a ceremony that includes a second tradition?',
        ],
      },
      {
        heading: 'Tell guests what to expect',
        body: [
          'A short explainer on the invitation or a printed sheet at the venue removes almost all of the awkwardness. Explain what guests will see, what they should wear, and whether they should participate or simply observe.',
        ],
      },
    ],
    relatedProductIds: ['prod-mv-1042', 'prod-nr-4401'],
    relatedVendorIds: ['ven-two-traditions'],
  },
  {
    id: 'art-6',
    slug: 'florals-that-survive-an-indian-summer',
    title: 'Florals that survive an Indian summer',
    standfirst: 'What is actually in season in May, and what to do instead of importing it.',
    categoryId: 'wedding-decor',
    faiths: ['HINDU', 'JAIN', 'SIKH', 'MUSLIM', 'PARSI', 'INTERFAITH'],
    author: 'Imran Firdaus',
    authorRole: 'Florist, New Delhi',
    publishedAt: '2025-01-24',
    readingMinutes: 6,
    heroMediaKey: 'marigolds',
    sections: [
      {
        body: [
          'The photograph you saved was probably taken in December. If your wedding is in May, that photograph is not achievable, and a florist who says otherwise is either guessing or planning to import at a cost you have not been quoted.',
        ],
      },
      {
        heading: 'What works in the heat',
        body: [
          'Marigold, jasmine, tuberose and most tropical foliage hold up well in heat and last a full day. They are also local, which means cost goes into volume and construction rather than airfreight.',
          'Roses, hydrangea and most imported blooms will not survive an afternoon outdoors. If you want them, use them for the ceremony only and accept they will not be there at the reception.',
        ],
      },
      {
        heading: 'Design for the climate',
        body: [
          'Low, tightly constructed arrangements survive heat better than tall, airy ones. If your venue is outdoors, ask for arrangements sized for the space rather than for a photograph.',
        ],
      },
    ],
    relatedProductIds: ['prod-as-8833'],
    relatedVendorIds: ['ven-marigold-room', 'ven-firdaus-florals'],
  },
  {
    id: 'art-7',
    slug: 'what-happens-at-an-anand-karaj',
    title: 'What happens at an Anand Karaj',
    standfirst: 'An explainer for guests attending a Sikh wedding for the first time.',
    categoryId: 'cultural-guides',
    faiths: ['SIKH', 'INTERFAITH'],
    author: 'Harpreet Singh Bhullar',
    authorRole: 'Writer',
    publishedAt: '2025-02-15',
    readingMinutes: 5,
    heroMediaKey: 'ritual-temple',
    sections: [
      {
        body: [
          'The Anand Karaj takes place in the presence of the Guru Granth Sahib, usually in a gurdwara. It is a short ceremony centred on four hymns, the lavan, sung as the couple walk around the scripture.',
        ],
      },
      {
        heading: 'What is expected of you',
        body: [
          'Cover your head and remove your shoes. Both men and women cover their heads — a scarf is fine, and gurdwaras keep spares at the entrance.',
          'Everyone sits on the floor, usually segregated by gender. If you cannot sit on the floor, there is normally seating at the side; ask a volunteer.',
          'Do not turn your back on the Guru Granth Sahib. Move sideways if you need to come and go.',
        ],
      },
      {
        heading: 'Photography',
        body: [
          'Practice varies between gurdwaras. Many allow photography from a respectful distance; some do not allow it inside the prayer hall at all. Ask before the day.',
        ],
      },
    ],
    relatedProductIds: ['prod-rc-2201'],
    relatedVendorIds: [],
  },
  {
    id: 'art-8',
    slug: 'a-real-wedding-across-two-traditions',
    title: 'A wedding across two traditions, in two cities',
    standfirst:
      'A Hindu and Christian wedding planned over fourteen months, with the running order they actually used.',
    categoryId: 'real-weddings',
    faiths: ['INTERFAITH', 'HINDU', 'CHRISTIAN'],
    author: 'Ananya Deshpande',
    authorRole: 'Editor',
    publishedAt: '2025-02-26',
    readingMinutes: 8,
    heroMediaKey: 'moment-married-hands',
    sections: [
      {
        body: [
          'Ananya and Thomas married over one long weekend in two cities. They kept the church ceremony in Manchester on the Friday and the vivah in Pune the following Sunday, with a day in between that they deliberately left empty.',
          'The empty Saturday, they both said afterwards, was the single best decision they made.',
        ],
      },
      {
        heading: 'What they spent the money on',
        body: [
          'They spent on two things: keeping the same photography team for both ceremonies so the two days look like one wedding, and on a written sequence document that they shared with both families before anything was booked.',
          'They saved on flowers, having decided early that a May wedding in Pune would not support the arrangements they had seen online.',
        ],
      },
      {
        heading: 'What they would change',
        body: [
          'They would have written the guest explainer earlier, and printed it, rather than sending it by message the week before.',
        ],
      },
    ],
    relatedProductIds: ['prod-mv-1042', 'prod-nr-4401'],
    relatedVendorIds: ['ven-two-traditions', 'ven-studio-anand'],
  },
  {
    id: 'art-9',
    slug: 'bridal-beauty-timeline',
    title: 'The bridal beauty timeline',
    standfirst: 'What to do at twelve, six and two months out, and what to leave alone.',
    categoryId: 'beauty',
    faiths: ['HINDU', 'MUSLIM', 'CHRISTIAN', 'JEWISH', 'SIKH', 'JAIN', 'PARSI', 'BUDDHIST', 'INTERFAITH', 'CUSTOM'],
    author: 'Amrita Sorabji',
    authorRole: 'Makeup artist, Mumbai',
    publishedAt: '2025-01-27',
    readingMinutes: 6,
    heroMediaKey: 'beauty-flatlay',
    sections: [
      {
        body: [
          'The most common bridal beauty mistake is starting too late and then doing too much at once. Skin does not respond well to six new products in the final month.',
        ],
      },
      {
        heading: 'Twelve months out',
        body: [
          'Establish a routine you will actually keep. If you want treatments, start now, when there is time for a bad reaction to be a footnote rather than a crisis.',
        ],
      },
      {
        heading: 'The final month',
        body: [
          'Change nothing. No new products, no new facials, no experiments. Book your last treatment at least two weeks before the ceremony so anything that surfaces has time to settle.',
        ],
      },
    ],
    relatedProductIds: ['prod-ab-9927', 'prod-ab-9901'],
    relatedVendorIds: ['ven-amrita-sorabji', 'ven-kiran-hair'],
  },
  {
    id: 'art-10',
    slug: 'how-to-build-a-wedding-budget',
    title: 'How to build a wedding budget that survives contact with your family',
    standfirst: 'Allocations, the contingency line, and how to have the conversation early.',
    categoryId: 'planning',
    faiths: ['HINDU', 'MUSLIM', 'CHRISTIAN', 'SIKH', 'JEWISH', 'PARSI', 'JAIN', 'BUDDHIST', 'INTERFAITH', 'CUSTOM'],
    author: 'Ananya Deshpande',
    authorRole: 'Editor',
    publishedAt: '2025-02-05',
    readingMinutes: 7,
    heroMediaKey: 'decor-table-detailed',
    sections: [
      {
        body: [
          'Most wedding budgets are not blown by overspending on individual items. They are blown by the guest count, which drives catering, seating, stationery and transport at the same time.',
        ],
      },
      {
        heading: 'Fix the guest count first',
        body: [
          'Everything else scales from it. Getting from a 200-guest assumption to 350 changes almost every other line, usually after deposits have been paid.',
          'Build the budget on the highest plausible guest count, then enjoy the surplus if it comes in lower.',
        ],
      },
      {
        heading: 'Keep a real contingency',
        body: [
          'Ten per cent, held back, and not allocated to anything on the day you build the budget. It will be spent; the only question is whether it was planned.',
        ],
      },
      {
        heading: 'Have the money conversation in writing',
        body: [
          'If families are contributing, agree in writing who is paying for what and by when. Deposits usually fall due months before the wedding, and a verbal understanding reached at an engagement is not a plan.',
        ],
      },
    ],
    relatedProductIds: [],
    relatedVendorIds: [],
  },
];

export const COLLECTIONS: Collection[] = [
  {
    id: 'col-bridal-edit',
    slug: 'the-bridal-edit',
    name: 'The Bridal Edit',
    description: 'Pieces our editors return to across every tradition — the ones that work on the day.',
    categoryIds: ['bridal-lehenga', 'bridal-gown', 'bridal-saree', 'bridal-anarkali'],
    faiths: ['HINDU', 'MUSLIM', 'CHRISTIAN', 'SIKH', 'JAIN', 'PARSI', 'BUDDHIST', 'JEWISH', 'INTERFAITH'],
    mediaKey: 'editorial-pillars',
    featured: true,
  },
  {
    id: 'col-modest',
    slug: 'modest-bridalwear',
    name: 'Modest Bridalwear',
    description: 'Full coverage, longer sleeves and considered drape, without giving up detail.',
    categoryIds: ['modest-bridalwear', 'bridal-suit', 'veils'],
    faiths: ['MUSLIM', 'SIKH', 'JEWISH', 'INTERFAITH'],
    mediaKey: 'bridal-rear-view',
    featured: true,
  },
  {
    id: 'col-south-asian',
    slug: 'south-asian-bridal',
    name: 'South Asian Bridal',
    description: 'Kanjeevaram, zardozi and gota work from ateliers and weaving families.',
    categoryIds: ['bridal-saree', 'bridal-lehenga', 'bridal-anarkali'],
    faiths: ['HINDU', 'JAIN', 'SIKH', 'BUDDHIST', 'PARSI', 'MUSLIM', 'INTERFAITH'],
    mediaKey: 'editorial-arches',
    featured: false,
  },
  {
    id: 'col-church',
    slug: 'church-ceremony',
    name: 'Church Ceremony',
    description: 'Gowns, veils and tailoring for a service, and for the reception after it.',
    categoryIds: ['bridal-gown', 'veils', 'groom-suit', 'tuxedo', 'headpieces'],
    faiths: ['CHRISTIAN', 'JEWISH', 'INTERFAITH'],
    mediaKey: 'church-altar',
    featured: true,
  },
  {
    id: 'col-groom',
    slug: 'the-groom-edit',
    name: 'The Groom Edit',
    description: 'Sherwanis, tailoring and the accessories that finish them.',
    categoryIds: ['sherwani', 'groom-suit', 'tuxedo', 'groom-traditional', 'groom-accessories'],
    faiths: ['HINDU', 'MUSLIM', 'CHRISTIAN', 'SIKH', 'JEWISH', 'PARSI', 'INTERFAITH', 'CUSTOM'],
    mediaKey: 'couple-showing-style',
    featured: false,
  },
  {
    id: 'col-ceremony',
    slug: 'ceremony-and-ritual',
    name: 'Ceremony & Ritual',
    description: 'The items a ceremony needs, assembled by tradition rather than sold as a fixed set.',
    categoryIds: ['ritual-items', 'ceremony-essentials'],
    faiths: ['HINDU', 'JAIN', 'SIKH', 'BUDDHIST', 'MUSLIM', 'CHRISTIAN', 'JEWISH', 'PARSI', 'INTERFAITH'],
    mediaKey: 'ritual-aarti',
    featured: false,
  },
];

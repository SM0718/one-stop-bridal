import { z } from 'zod';
import { FAITH_IDS } from '@/types';

/* ==========================================================================
   Shared field builders
   ========================================================================== */

const requiredString = (label: string, max = 120) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(max, `${label} must be ${max} characters or fewer`);

const optionalString = (max = 200) => z.string().trim().max(max).optional().default('');

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .default('')
  .refine((v) => v === '' || /^https?:\/\/.+\..+/.test(v), 'Enter a full URL including https://');

const optionalInstagram = z
  .string()
  .trim()
  .optional()
  .default('')
  .refine((v) => v === '' || /^@?[A-Za-z0-9._]{2,30}$/.test(v), 'Enter a valid handle, for example @studio');

const phone = z
  .string()
  .trim()
  .min(7, 'Enter a contact number')
  .max(24, 'That number looks too long')
  .regex(/^[+()\-\s\d]+$/, 'Numbers can only contain digits, spaces, brackets and +');

const email = z.string().trim().min(1, 'Email is required').email('Enter a valid email address');

const faithEnum = z.enum(FAITH_IDS);

/* ==========================================================================
   Retailer application
   ========================================================================== */

export const retailerApplicationSchema = z.object({
  firstName: requiredString('First name', 60),
  lastName: requiredString('Last name', 60),
  businessName: requiredString('Business name'),
  businessType: z.enum(['designer', 'boutique', 'retailer', 'atelier', 'tailor', 'jeweller', 'service'], {
    errorMap: () => ({ message: 'Select a business type' }),
  }),
  email,
  phone,
  country: requiredString('Country', 60),
  city: requiredString('City', 60),
  website: optionalUrl,
  instagram: optionalInstagram,
  address: requiredString('Business address', 240),
  yearsInBusiness: z.coerce
    .number({ invalid_type_error: 'Enter a number of years' })
    .int('Enter a whole number')
    .min(0, 'Cannot be negative')
    .max(200, 'That looks too high'),
  categoryIds: z.array(z.string()).min(1, 'Select at least one product category'),
  faiths: z.array(faithEnum).min(1, 'Select at least one faith or cultural context you serve'),
  priceRange: z.enum(['budget', 'mid', 'premium', 'luxury'], {
    errorMap: () => ({ message: 'Select a price range' }),
  }),
  productCount: z.coerce
    .number({ invalid_type_error: 'Enter a number' })
    .int('Enter a whole number')
    .min(1, 'Enter at least one product'),
  about: z
    .string()
    .trim()
    .min(80, 'Tell us a little more — at least 80 characters')
    .max(1600, 'Please keep this under 1600 characters'),
  logoFileName: z.string().nullable().default(null),
  documentFileName: z.string().nullable().default(null),
  agreeTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must confirm the retailer terms to apply' }),
  }),
  agreeContact: z.literal(true, {
    errorMap: () => ({ message: 'Please confirm we may contact you about this application' }),
  }),
});

export type RetailerApplicationInput = z.input<typeof retailerApplicationSchema>;
export type RetailerApplicationValues = z.output<typeof retailerApplicationSchema>;

/* ==========================================================================
   Account
   ========================================================================== */

export const signInSchema = z.object({
  email,
  password: z.string().min(8, 'Passwords are at least 8 characters'),
});

export const signUpSchema = z
  .object({
    firstName: requiredString('First name', 60),
    lastName: requiredString('Last name', 60),
    email,
    password: z
      .string()
      .min(8, 'Use at least 8 characters')
      .regex(/[a-z]/, 'Include a lowercase letter')
      .regex(/[A-Z]/, 'Include an uppercase letter')
      .regex(/\d/, 'Include a number'),
    confirmPassword: z.string(),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: 'Please accept the terms to continue' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const profileSchema = z.object({
  firstName: requiredString('First name', 60),
  lastName: requiredString('Last name', 60),
  email,
  phone: phone.or(z.literal('')),
  city: optionalString(60),
  country: optionalString(60),
  marketingOptIn: z.boolean().default(false),
});

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Enter your current password'),
    newPassword: z
      .string()
      .min(8, 'Use at least 8 characters')
      .regex(/[a-z]/, 'Include a lowercase letter')
      .regex(/[A-Z]/, 'Include an uppercase letter')
      .regex(/\d/, 'Include a number'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

/* ==========================================================================
   Wedding profile & planning
   ========================================================================== */

export const weddingProfileSchema = z
  .object({
    faith: faithEnum.nullable(),
    secondaryFaiths: z.array(faithEnum).default([]),
    customFaithLabel: optionalString(80),
    weddingDate: z.string().nullable(),
    city: optionalString(60),
    country: optionalString(60),
    guestCount: z.coerce.number().int().min(0).max(10000).nullable(),
    budgetTotal: z.coerce.number().min(0).max(100_000_000).nullable(),
    currency: z.enum(['INR', 'GBP', 'USD', 'AED']),
    stylePreferences: z.array(z.string()).default([]),
  })
  .refine((d) => d.faith !== 'CUSTOM' || d.customFaithLabel.trim().length > 0, {
    message: 'Tell us what to call your wedding',
    path: ['customFaithLabel'],
  });

export const eventSchema = z.object({
  name: requiredString('Event name', 80),
  date: z.string().nullable(),
  time: z
    .string()
    .trim()
    .optional()
    .default('')
    .refine((v) => v === '' || /^([01]\d|2[0-3]):[0-5]\d$/.test(v), 'Use a 24-hour time such as 18:30'),
  venue: optionalString(160),
  guestCount: z.coerce.number().int().min(0).max(10000).nullable(),
  budget: z.coerce.number().min(0).max(100_000_000).nullable(),
  notes: optionalString(1000),
});

export const taskSchema = z.object({
  title: requiredString('Task', 140),
  phase: z.enum([
    'twelve-months',
    'nine-months',
    'six-months',
    'three-months',
    'one-month',
    'wedding-week',
    'wedding-day',
  ]),
  dueDate: z.string().nullable(),
  assignee: optionalString(80),
  notes: optionalString(600),
});

export const guestSchema = z.object({
  name: requiredString('Guest name', 100),
  side: z.enum(['bride', 'groom', 'shared']),
  email: email.or(z.literal('')),
  phone: phone.or(z.literal('')),
  city: optionalString(60),
  rsvp: z.enum(['pending', 'attending', 'declined']),
  plusOnes: z.coerce.number().int().min(0).max(10),
  dietary: optionalString(200),
  notes: optionalString(400),
});

export const budgetLineSchema = z.object({
  categoryId: z.enum([
    'venue',
    'attire',
    'jewellery',
    'photography',
    'decor',
    'catering',
    'beauty',
    'invitations',
    'entertainment',
    'transportation',
    'miscellaneous',
  ]),
  label: requiredString('Line item', 100),
  allocated: z.coerce.number().min(0, 'Cannot be negative').max(100_000_000),
  spent: z.coerce.number().min(0, 'Cannot be negative').max(100_000_000),
});

/* ==========================================================================
   Enquiries & contact
   ========================================================================== */

export const enquirySchema = z.object({
  name: requiredString('Your name', 100),
  email,
  phone: phone.or(z.literal('')),
  city: optionalString(60),
  eventDate: z.string().optional().default(''),
  message: z
    .string()
    .trim()
    .min(20, 'Please add a little more detail — at least 20 characters')
    .max(1200, 'Please keep this under 1200 characters'),
  channel: z.enum(['form', 'whatsapp', 'appointment']).default('form'),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'Please confirm we may share these details with the retailer' }),
  }),
});

export const contactSchema = z.object({
  name: requiredString('Your name', 100),
  email,
  subject: z.enum(['general', 'retailer', 'press', 'support', 'privacy'], {
    errorMap: () => ({ message: 'Choose a subject' }),
  }),
  message: z.string().trim().min(20, 'Please write at least 20 characters').max(2000, 'Please keep this under 2000 characters'),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'Please confirm you are happy for us to reply' }),
  }),
});

/* ==========================================================================
   Checkout
   ========================================================================== */

export const checkoutSchema = z.object({
  firstName: requiredString('First name', 60),
  lastName: requiredString('Last name', 60),
  email,
  phone,
  addressLine1: requiredString('Address', 160),
  addressLine2: optionalString(160),
  city: requiredString('City', 60),
  postcode: requiredString('Postcode', 20),
  country: requiredString('Country', 60),
  shippingMethod: z.enum(['standard', 'express', 'collection']),
  deliveryNotes: optionalString(400),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'Please accept the terms before continuing' }),
  }),
});

/* ==========================================================================
   Search params
   ========================================================================== */

const commaList = z
  .string()
  .optional()
  .transform((v) => (v ? v.split(',').filter(Boolean) : undefined));

export const productSearchSchema = z.object({
  faith: faithEnum.optional().catch(undefined),
  category: commaList,
  event: commaList,
  silhouette: commaList,
  fabric: commaList,
  colour: commaList,
  designer: commaList,
  size: commaList,
  availability: commaList,
  min: z.coerce.number().nonnegative().optional().catch(undefined),
  max: z.coerce.number().nonnegative().optional().catch(undefined),
  sort: z.enum(['featured', 'price-asc', 'price-desc', 'newest', 'name-asc']).optional().catch(undefined),
  page: z.coerce.number().int().positive().optional().catch(undefined),
  q: z.string().optional().catch(undefined),
});

export type ProductSearchParams = z.infer<typeof productSearchSchema>;

export const vendorSearchSchema = z.object({
  faith: faithEnum.optional().catch(undefined),
  category: commaList,
  event: commaList,
  city: commaList,
  price: commaList,
  verified: z.coerce.boolean().optional().catch(undefined),
  sort: z.enum(['featured', 'name-asc', 'price-asc', 'price-desc', 'experience']).optional().catch(undefined),
  page: z.coerce.number().int().positive().optional().catch(undefined),
  q: z.string().optional().catch(undefined),
});

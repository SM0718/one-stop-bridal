import type {
  ApplicationEvent,
  Product,
  RetailerApplication,
  RetailerApplicationStatus,
  RetailerEnquiry,
  RetailerOrder,
} from '@/types';
import { readLocal, writeLocal, delay, assertFound } from './client';
import { createRetailerProduct, deleteRetailerProduct, getRetailerProducts } from './products';
import { PRODUCTS } from '@/data/products';

const APPLICATION_KEY = 'retailer-application';

const STATUS_SEQUENCE: RetailerApplicationStatus[] = ['pending', 'under-review', 'needs-information', 'approved', 'rejected'];

/**
 * Demo reviewer timeline. Because this build has no back office, these events
 * are generated from the submission date so the status UI is realistic without
 * implying that a real review has taken place.
 */
function buildTimeline(submittedAt: string, status: RetailerApplicationStatus): ApplicationEvent[] {
  const submitted = new Date(submittedAt);
  const events: ApplicationEvent[] = [
    {
      id: 'ev-submitted',
      status: 'pending',
      at: submitted.toISOString(),
      note: 'Application received. You will get an email confirmation shortly.',
    },
  ];

  if (status === 'pending') return events;

  const reviewAt = new Date(submitted.getTime() + 2 * 24 * 60 * 60 * 1000);
  events.push({
    id: 'ev-review',
    status: 'under-review',
    at: reviewAt.toISOString(),
    note: 'Our retail team is reviewing your business details and category selection.',
  });

  if (status === 'under-review') return events;

  if (status === 'needs-information') {
    events.push({
      id: 'ev-info',
      status: 'needs-information',
      at: new Date(reviewAt.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      note: 'We need a copy of your business registration and two additional product images before we can continue. Reply to the email we sent and your application will keep its place in the queue.',
    });
    return events;
  }

  if (status === 'approved') {
    events.push({
      id: 'ev-approved',
      status: 'approved',
      at: new Date(reviewAt.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      note: 'Approved. Your retailer account is active and you can begin adding products.',
    });
    return events;
  }

  events.push({
    id: 'ev-rejected',
    status: 'rejected',
    at: new Date(reviewAt.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    note: 'We are not able to accept this application at the moment. You are welcome to apply again in six months.',
  });
  return events;
}

export async function getApplication(): Promise<RetailerApplication | null> {
  return delay(readLocal<RetailerApplication | null>(APPLICATION_KEY, null));
}

export async function submitApplication(
  input: Omit<RetailerApplication, 'id' | 'status' | 'submittedAt' | 'timeline'>,
): Promise<RetailerApplication> {
  const submittedAt = new Date().toISOString();
  const application: RetailerApplication = {
    ...input,
    id: `app-${Date.now()}`,
    status: 'pending',
    submittedAt,
    timeline: buildTimeline(submittedAt, 'pending'),
  };
  writeLocal(APPLICATION_KEY, application);
  return delay(application);
}

/** Used by the demo status switcher so all states can be inspected. */
export async function setApplicationStatus(status: RetailerApplicationStatus): Promise<RetailerApplication> {
  const current = readLocal<RetailerApplication | null>(APPLICATION_KEY, null);
  const application = assertFound(current, 'Application');
  const next: RetailerApplication = { ...application, status, timeline: buildTimeline(application.submittedAt, status) };
  writeLocal(APPLICATION_KEY, next);
  return delay(next);
}

export async function withdrawApplication(): Promise<void> {
  writeLocal(APPLICATION_KEY, null);
  return delay(undefined);
}

export { STATUS_SEQUENCE };

/* ==========================================================================
   Retailer workspace demo data
   ========================================================================== */

const DEMO_RETAILER_ID = 'ret-meera-vasant';

export function demoRetailerId(): string {
  return DEMO_RETAILER_ID;
}

export async function getEnquiries(): Promise<RetailerEnquiry[]> {
  return delay([
    {
      id: 'enq-1',
      productId: 'prod-mv-1042',
      productName: 'Ivory Zardozi Bridal Lehenga',
      customerName: 'Ritika Malhotra',
      city: 'Gurugram',
      channel: 'form',
      message: 'Wedding is in November. Could I book a fitting in the next three weeks?',
      status: 'new',
      receivedAt: '2025-03-08T09:12:00Z',
    },
    {
      id: 'enq-2',
      productId: 'prod-mv-1090',
      productName: 'Blush Tissue Saree with Zardozi Border',
      customerName: 'Sneha Iyer',
      city: 'Chennai',
      channel: 'whatsapp',
      message: 'Is the blush shade available with a gold border instead of silver?',
      status: 'new',
      receivedAt: '2025-03-07T16:40:00Z',
    },
    {
      id: 'enq-3',
      productId: 'prod-mv-1102',
      productName: 'Heirloom Rework Commission',
      customerName: 'Farida Merchant',
      city: 'Mumbai',
      channel: 'appointment',
      message: 'I would like to bring my mother’s lehenga in for assessment.',
      status: 'responded',
      receivedAt: '2025-03-05T11:05:00Z',
    },
    {
      id: 'enq-4',
      productId: 'prod-mv-1114',
      productName: 'Crystal Bridal Heels',
      customerName: 'Aisha Rahman',
      city: 'Hyderabad',
      channel: 'form',
      message: 'Do you make these in a 42?',
      status: 'closed',
      receivedAt: '2025-02-28T08:22:00Z',
    },
  ]);
}

export async function getOrders(): Promise<RetailerOrder[]> {
  return delay([
    {
      id: 'ord-1',
      reference: 'OSB-24118',
      customerName: 'Ritika Malhotra',
      city: 'Gurugram',
      items: [{ productName: 'Ivory Zardozi Bridal Lehenga', quantity: 1, price: 385000 }],
      total: 385000,
      status: 'in-production',
      placedAt: '2025-03-01T10:00:00Z',
    },
    {
      id: 'ord-2',
      reference: 'OSB-24102',
      customerName: 'Farida Merchant',
      city: 'Mumbai',
      items: [{ productName: 'Crystal Bridal Heels', quantity: 1, price: 24000 }],
      total: 24000,
      status: 'shipped',
      placedAt: '2025-02-24T14:30:00Z',
    },
    {
      id: 'ord-3',
      reference: 'OSB-24088',
      customerName: 'Sneha Iyer',
      city: 'Chennai',
      items: [{ productName: 'Blush Tissue Saree with Zardozi Border', quantity: 2, price: 215000 }],
      total: 430000,
      status: 'confirmed',
      placedAt: '2025-02-19T09:15:00Z',
    },
    {
      id: 'ord-4',
      reference: 'OSB-24061',
      customerName: 'Nadia Fernandes',
      city: 'Pune',
      items: [{ productName: 'Heirloom Rework Commission', quantity: 1, price: null }],
      total: null,
      status: 'enquiry',
      placedAt: '2025-02-11T17:45:00Z',
    },
  ]);
}

/** Aggregated numbers for the retailer dashboard. */
export async function getRetailerStats(retailerId: string) {
  const products = await getRetailerProducts(retailerId);
  const enquiries = await getEnquiries();
  const orders = await getOrders();
  return delay({
    products: products.length,
    published: products.length,
    enquiries: enquiries.length,
    newEnquiries: enquiries.filter((e) => e.status === 'new').length,
    orders: orders.length,
    /* Demo view counts, labelled as demo in the UI. */
    views: { last30Days: 1840, previous30Days: 1622 },
  });
}

/* ==========================================================================
   Seed products for a newly approved retailer
   ========================================================================== */

const SAMPLE_SEED = PRODUCTS.slice(0, 2);

export async function seedDemoProducts(retailerId: string): Promise<Product[]> {
  const created: Product[] = [];
  for (const [index, p] of SAMPLE_SEED.entries()) {
    const seeded: Product = {
      ...p,
      id: `prod-seed-${retailerId}-${index}`,
      slug: `${p.slug}-seed-${retailerId}`,
      retailerId,
      featured: false,
    };
    created.push(await createRetailerProduct(seeded));
  }
  return created;
}

export { createRetailerProduct, deleteRetailerProduct, getRetailerProducts };

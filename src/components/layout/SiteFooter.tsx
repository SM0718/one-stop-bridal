import { Link } from '@tanstack/react-router';
import { Facebook, Instagram, Whatsapp, Youtube } from 'iconsax-react';
import { FOOTER_NAV } from '@/config/navigation';
import { routes } from '@/config/routes';

const SOCIAL = [
  { label: 'Instagram', href: 'https://instagram.com', Icon: Instagram },
  { label: 'Facebook', href: 'https://facebook.com', Icon: Facebook },
  { label: 'YouTube', href: 'https://youtube.com', Icon: Youtube },
  { label: 'WhatsApp', href: 'https://wa.me/910000000000', Icon: Whatsapp },
];

export function SiteFooter() {
  return (
    <footer className="mt-section border-t border-border bg-blush/35">
      <div className="container py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_1fr]">
          <div>
            <p className="font-display text-2xl tracking-wide text-ink">One Stop Bridal</p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-soft">
              A wedding marketplace and planning platform for weddings across faiths and cultures. Collections,
              vendors and planning tools that adapt to the wedding you are actually having.
            </p>

            <dl className="mt-6 space-y-2 text-sm">
              <div className="flex gap-2">
                <dt className="text-ink-muted">Email</dt>
                <dd>
                  <a href="mailto:hello@onestopbridal.example" className="link-quiet text-ink">
                    hello@onestopbridal.example
                  </a>
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-ink-muted">Phone</dt>
                <dd>
                  <a href="tel:+912200000000" className="link-quiet text-ink">
                    +91 22 0000 0000
                  </a>
                </dd>
              </div>
            </dl>

            <ul className="mt-6 flex items-center gap-2">
              {SOCIAL.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center border border-border text-ink-muted transition-colors hover:border-marigold hover:text-marigold-deep"
                  >
                    <Icon size={18} variant="Linear" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {FOOTER_NAV.map((column) => (
              <div key={column.title}>
                <h2 className="eyebrow mb-4">{column.title}</h2>
                <ul className="space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.to + link.label}>
                      <Link to={link.to} className="link-quiet text-[0.8125rem] text-ink-soft hover:text-ink">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-14 border-t border-border pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-ink-muted">© {new Date().getFullYear()} One Stop Bridal</p>
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-muted">
              <li>
                <Link to={routes.privacy} className="link-quiet">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to={routes.terms} className="link-quiet">
                  Terms
                </Link>
              </li>
              <li>
                <Link to={routes.shipping} className="link-quiet">
                  Shipping
                </Link>
              </li>
              <li>
                <Link to={routes.returns} className="link-quiet">
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          <p className="mt-5 max-w-3xl text-xs leading-relaxed text-ink-muted">
            This is a demonstration build. Photography is licensed placeholder imagery, and products, vendors and
            retailers are illustrative records rather than real businesses. No reviews, ratings, awards or customer
            statistics have been invented anywhere on this site.
          </p>
        </div>
      </div>
    </footer>
  );
}

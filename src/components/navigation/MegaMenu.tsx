import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'iconsax-react';
import type { NavItem } from '@/config/navigation';
import { MediaImage } from '@/components/ui/media';
import { cn } from '@/lib/utils';

interface MegaMenuProps {
  item: NavItem;
  onNavigate: () => void;
  className?: string;
}

/**
 * The mega menu is a quiet panel: link columns on a warm ground with one
 * editorial image. It opens on hover for pointers and on focus for keyboards,
 * and closes on Escape.
 */
export function MegaMenu({ item, onNavigate, className }: MegaMenuProps) {
  if (!item.columns) return null;

  return (
    <div
      className={cn(
        'absolute inset-x-0 top-full border-y border-border bg-background shadow-lift',
        className,
      )}
    >
      <div className="container">
        <div className="grid gap-10 py-9 lg:grid-cols-[1fr_1fr_1fr_18rem]">
          {item.columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="eyebrow mb-4 border-b border-border pb-2.5">{column.title}</h3>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.to + link.label}>
                    <Link
                      to={link.to}
                      search={link.search}
                      onClick={onNavigate}
                      className="link-quiet text-[0.8125rem] text-ink-soft transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {item.feature ? (
            <div className="lg:border-l lg:border-border lg:pl-8">
              <MediaImage
                mediaKey={item.feature.mediaKey}
                aspect="portrait"
                sizes="(min-width: 1024px) 288px, 100vw"
                width={576}
                height={720}
              />
              <p className="eyebrow mt-4">{item.feature.eyebrow}</p>
              <p className="mt-2 font-display text-xl leading-snug text-ink">{item.feature.title}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">{item.feature.description}</p>
              <Link
                to={item.feature.to}
                search={item.feature.search}
                onClick={onNavigate}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-ink"
              >
                Explore
                <ArrowRight size={14} variant="Linear" />
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

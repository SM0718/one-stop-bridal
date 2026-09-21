import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'iconsax-react';
import { PRIMARY_NAV } from '@/config/navigation';
import { routes } from '@/config/routes';
import { useUIStore } from '@/stores/ui';
import { FaithSelectorButton } from '@/components/faith/FaithPickerDialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Sheet, SheetBody, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';

/**
 * Mobile menu. Sections open in place rather than pushing a second screen, so
 * reaching a sub-category is one tap and one scroll. The wedding context stays
 * pinned at the top because it changes everything below it.
 */
export function MobileNav() {
  const open = useUIStore((s) => s.mobileNavOpen);
  const setOpen = useUIStore((s) => s.setMobileNavOpen);

  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="p-0">
        <SheetHeader className="pr-14">
          <SheetTitle>Menu</SheetTitle>
          <FaithSelectorButton className="mt-3 flex w-full items-center gap-2 border border-border bg-muted/50 px-3 py-2.5 text-left text-xs text-ink transition-colors hover:border-ink/40" />
        </SheetHeader>

        <SheetBody className="px-0">
          <Accordion type="multiple" className="border-t border-border">
            {PRIMARY_NAV.map((item) =>
              item.columns ? (
                <AccordionItem key={item.id} value={item.id} className="px-5">
                  <AccordionTrigger>{item.label}</AccordionTrigger>
                  <AccordionContent className="pr-0">
                    <div className="space-y-5">
                      {item.columns.map((column) => (
                        <div key={column.title}>
                          <p className="eyebrow mb-2.5">{column.title}</p>
                          <ul className="space-y-2.5">
                            {column.links.map((link) => (
                              <li key={link.to + link.label}>
                                <Link
                                  to={link.to}
                                  search={link.search}
                                  onClick={close}
                                  className="block py-0.5 text-sm text-ink-soft"
                                >
                                  {link.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      <Link
                        to={item.to}
                        search={item.search}
                        onClick={close}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink"
                      >
                        All {item.label.toLowerCase()}
                        <ArrowRight size={14} variant="Linear" />
                      </Link>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ) : (
                <div key={item.id} className="border-b border-border px-5">
                  <Link to={item.to} onClick={close} className="block py-4 text-[0.9375rem] font-medium text-ink">
                    {item.label}
                  </Link>
                </div>
              ),
            )}
          </Accordion>
        </SheetBody>

        <SheetFooter className="space-y-3">
          <Link
            to={routes.retailers}
            onClick={close}
            className="flex items-center justify-between border border-border px-4 py-3 text-sm text-ink transition-colors hover:border-ink"
          >
            Become a retailer
            <ArrowRight size={16} variant="Linear" />
          </Link>
          <div className="flex items-center justify-between text-xs text-ink-muted">
            <Link to={routes.account} onClick={close} className="link-quiet">
              Account
            </Link>
            <Link to={routes.faq} onClick={close} className="link-quiet">
              Help
            </Link>
            <Link to={routes.contact} onClick={close} className="link-quiet">
              Contact
            </Link>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

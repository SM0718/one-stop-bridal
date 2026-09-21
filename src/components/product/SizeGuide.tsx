import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const ROWS: { size: string; bust: string; waist: string; hip: string }[] = [
  { size: 'UK 6', bust: '31"', waist: '24"', hip: '34"' },
  { size: 'UK 8', bust: '32"', waist: '25"', hip: '35"' },
  { size: 'UK 10', bust: '34"', waist: '27"', hip: '37"' },
  { size: 'UK 12', bust: '36"', waist: '29"', hip: '39"' },
  { size: 'UK 14', bust: '38"', waist: '31"', hip: '41"' },
  { size: 'UK 16', bust: '40"', waist: '33"', hip: '43"' },
];

const LENGTH_ROWS: { size: string; bust: string; waist: string; hip: string }[] = [
  { size: 'XS', bust: '32"', waist: '26"', hip: '36"' },
  { size: 'S', bust: '34"', waist: '28"', hip: '38"' },
  { size: 'M', bust: '36"', waist: '30"', hip: '40"' },
  { size: 'L', bust: '38"', waist: '32"', hip: '42"' },
  { size: 'XL', bust: '40"', waist: '35"', hip: '45"' },
];

/**
 * A real measurement table rather than a decorative help link, since sizing is
 * the most common reason a bridal purchase goes wrong.
 */
export function SizeGuide() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="text-xs font-normal text-ink-muted underline decoration-gold/50 underline-offset-2 transition-colors hover:text-ink"
        >
          Size guide
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[22rem] p-0">
        <div className="border-b border-border px-4 py-3">
          <p className="font-display text-lg text-ink">Measurements</p>
          <p className="mt-0.5 text-xs text-ink-muted">
            Body measurements, not garment measurements. Measured over light clothing.
          </p>
        </div>

        <div className="max-h-72 overflow-y-auto px-4 py-3">
          <table className="w-full text-left text-xs">
            <caption className="sr-only">Womenswear measurements in inches</caption>
            <thead>
              <tr className="text-ink-muted">
                <th scope="col" className="pb-2 font-medium">
                  Size
                </th>
                <th scope="col" className="pb-2 font-medium">
                  Bust
                </th>
                <th scope="col" className="pb-2 font-medium">
                  Waist
                </th>
                <th scope="col" className="pb-2 font-medium">
                  Hip
                </th>
              </tr>
            </thead>
            <tbody className="text-ink-soft">
              {ROWS.map((row) => (
                <tr key={row.size} className="border-t border-border/70">
                  <th scope="row" className="py-1.5 pr-2 text-left font-normal text-ink">
                    {row.size}
                  </th>
                  <td className="py-1.5">{row.bust}</td>
                  <td className="py-1.5">{row.waist}</td>
                  <td className="py-1.5">{row.hip}</td>
                </tr>
              ))}
              {LENGTH_ROWS.map((row) => (
                <tr key={row.size} className="border-t border-border/70">
                  <th scope="row" className="py-1.5 pr-2 text-left font-normal text-ink">
                    {row.size}
                  </th>
                  <td className="py-1.5">{row.bust}</td>
                  <td className="py-1.5">{row.waist}</td>
                  <td className="py-1.5">{row.hip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="border-t border-border px-4 py-3 text-xs leading-relaxed text-ink-muted">
          Made-to-measure pieces are cut to your own measurements across fittings, so the table above does not apply —
          the atelier will measure you.
        </p>
      </PopoverContent>
    </Popover>
  );
}

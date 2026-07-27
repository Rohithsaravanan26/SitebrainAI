import * as React from 'react';
import { Star, Phone, Mail } from 'lucide-react';
import type { Supplier } from '@sitebrain/types';

const SUPPLIERS: Supplier[] = [
  {
    id: 's1',
    code: 'BLSCPE',
    name: 'BlueScope Steel',
    contactPerson: 'Andrew Clarke',
    email: 'aclarke@bluescope.com.au',
    phone: '02 9021 4400',
    rating: 4.8,
  },
  {
    id: 's2',
    code: 'BORAL',
    name: 'Boral Timber & Products',
    contactPerson: 'Sarah Whitmore',
    email: 'swhitmore@boral.com.au',
    phone: '02 8823 5200',
    rating: 4.5,
  },
  {
    id: 's3',
    code: 'HOLCIM',
    name: 'Holcim Australia',
    contactPerson: 'James Nguyen',
    email: 'jnguyen@holcim.com.au',
    phone: '02 9412 6600',
    rating: 4.6,
  },
  {
    id: 's4',
    code: 'SFTHQ',
    name: 'Safety HQ',
    contactPerson: 'Lisa Brennan',
    email: 'lbrennan@safetyhq.com.au',
    phone: '02 9321 7800',
    rating: 4.3,
  },
  {
    id: 's5',
    code: 'RAMSET',
    name: 'Ramset Australia',
    contactPerson: 'Peter Wang',
    email: 'pwang@ramset.com.au',
    phone: '02 8765 3100',
    rating: 4.7,
  },
  {
    id: 's6',
    code: 'PARCHEM',
    name: 'Parchem Construction',
    contactPerson: 'Fiona Kelly',
    email: 'fkelly@parchem.com.au',
    phone: '02 9114 7310',
    rating: 4.4,
  },
  {
    id: 's7',
    code: 'CLIPSAL',
    name: 'Clipsal Electrical',
    contactPerson: 'Marco Rossi',
    email: 'mrossi@clipsal.com.au',
    phone: '02 9811 2400',
    rating: 4.2,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`h-3 w-3 ${s <= Math.round(rating) ? 'text-amber-500 fill-amber-500' : 'text-slate-300 dark:text-slate-700'}`}
        />
      ))}
      <span className="text-[11px] font-mono text-slate-500 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

export const SuppliersTable: React.FC = () => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-sm overflow-hidden">
    <table className="w-full text-xs">
      <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
        <tr>
          <th className="text-left px-4 py-2.5 font-bold uppercase tracking-wider text-slate-500 text-[10px]">
            Supplier
          </th>
          <th className="text-left px-3 py-2.5 font-bold uppercase tracking-wider text-slate-500 text-[10px] hidden sm:table-cell">
            Contact
          </th>
          <th className="text-left px-3 py-2.5 font-bold uppercase tracking-wider text-slate-500 text-[10px] hidden md:table-cell">
            Email
          </th>
          <th className="text-left px-3 py-2.5 font-bold uppercase tracking-wider text-slate-500 text-[10px] hidden lg:table-cell">
            Phone
          </th>
          <th className="text-left px-4 py-2.5 font-bold uppercase tracking-wider text-slate-500 text-[10px]">
            Rating
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
        {SUPPLIERS.map((s) => (
          <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
            <td className="px-4 py-2.5">
              <p className="font-semibold text-slate-900 dark:text-slate-100">{s.name}</p>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-px rounded-sm">
                {s.code}
              </span>
            </td>
            <td className="px-3 py-2.5 text-slate-600 dark:text-slate-400 hidden sm:table-cell">
              {s.contactPerson}
            </td>
            <td className="px-3 py-2.5 hidden md:table-cell">
              <a
                href={`mailto:${s.email}`}
                className="flex items-center gap-1 text-orange-600 hover:text-orange-700 font-mono text-[11px]"
              >
                <Mail className="h-3 w-3" />
                {s.email}
              </a>
            </td>
            <td className="px-3 py-2.5 hidden lg:table-cell">
              <a
                href={`tel:${s.phone}`}
                className="flex items-center gap-1 text-slate-600 dark:text-slate-400 font-mono text-[11px]"
              >
                <Phone className="h-3 w-3" />
                {s.phone}
              </a>
            </td>
            <td className="px-4 py-2.5">
              <StarRating rating={s.rating} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

'use client';
import { useI18n } from '@rc/ui';

/* Development board for the UI kit (K-01): every wrapper gets a section here as it lands. */
export function KitBoard() {
  const { t } = useI18n();
  const planned = [
    'Dialog',
    'AlertDialog',
    'Menu',
    'Select',
    'Tabs',
    'Toast',
    'Popover',
    'Tooltip',
    'Checkbox',
    'RadioGroup',
    'Switch',
    'LoadingState',
    'ErrorState',
    'ForbiddenState',
    'OfflineBanner',
    'RefreshMarker'
  ];
  return (
    <main className="mx-auto max-w-[1200px] p-6 flex flex-col gap-6">
      <h1 className="text-[24px] font-extrabold">{t('kit.title')}</h1>
      <p className="m-0 text-[15px] font-semibold text-[var(--text-secondary)]">{t('kit.note')}</p>
      <ul className="glass-panel rounded-[1.5rem] p-4 grid grid-cols-2 md:grid-cols-4 gap-2 tabular">
        {planned.map((name) => (
          <li key={name} className="text-[14px] font-bold">
            {name}
          </li>
        ))}
      </ul>
    </main>
  );
}

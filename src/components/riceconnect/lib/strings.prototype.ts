/* STRINGS added for the prototype screens. [EN, TL, HIL].
   EN is complete. TL and HIL are DRAFTS. Draft: needs native review before any farmer, driver or judge reads them
   as final. Title Case for labels (CSS uppercases), sentence case for sentences. */
export const PROTOTYPE_STRINGS: Record<string, [string, string, string]> = {
    // chrome
    'theme.dark': ['Dark', 'Madilim', 'Madulom'],
    'theme.light': ['Light', 'Maliwanag', 'Masanag'],
    'role.coordinator': ['Coordinator · Cluster 1', 'Coordinator · Cluster 1', 'Coordinator · Cluster 1'],
    'role.buyer': ['Buyer (simulated)', 'Mamimili (simulated)', 'Bumalakal (simulated)'],
    'role.driver': ['Driver (simulated)', 'Driver (simulated)', 'Driver (simulated)'],
    'unit.sacks': ['sacks', 'sako', 'sako'],
    // components
    'market.filled': ['Filled', 'Napunan', 'Napuno'],
    'market.filledof': ['{filled} of {tonnes} t filled · {pct}%', '{filled} sa {tonnes} t napunan · {pct}%', '{filled} sa {tonnes} t napuno · {pct}%'],
    'cal.total': ['Total', 'Kabuuan', 'Kabilugan'],
    'cal.farms': ['{n} farms', '{n} bukid', '{n} ka uma'],
    'driver.away': ['{km} km away', '{km} km ang layo', '{km} km ang kalayuon'],
};

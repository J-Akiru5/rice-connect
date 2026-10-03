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
    // farm list + profile
    'farm.list': ['Cluster 1 Farms', 'Mga Bukid ng Cluster 1', 'Mga Uma sang Cluster 1'],
    'farm.search': ['Search Farms', 'Maghanap ng Bukid', 'Mangita sang Uma'],
    'farm.summary': ['{n} farms · {ha} ha', '{n} bukid · {ha} ha', '{n} ka uma · {ha} ha'],
    'farm.open': ['Open {id}', 'Buksan ang {id}', 'Buksan ang {id}'],
    'farm.back': ['All Farms', 'Lahat ng Bukid', 'Tanan nga Uma'],
    'farm.harvest': ['Harvest', 'Ani', 'Alani'],
    'farm.harvestLine': ['{week} · {date}', '{week} · {date}', '{week} · {date}'],
    'farm.forecast': ['Forecast, Dried', 'Tantiya, Tuyo', 'Banta, Uga'],
    'farm.lot': ['Lot', 'Lot', 'Lot'],
    'farm.viewPlan': ['View in Plan', 'Tingnan sa Plano', 'Tan-awa sa Plano'],
};

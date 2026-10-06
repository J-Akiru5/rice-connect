/* STRINGS added for the prototype screens. [EN, TL, HIL].
   EN is complete. TL and HIL are DRAFTS. Draft: needs native review before any farmer, driver or judge reads them
   as final. Title Case for labels (CSS uppercases), sentence case for sentences. */
export const PROTOTYPE_STRINGS: Record<string, [string, string, string]> = {
    // chrome
    'theme.dark': ['Dark', 'Madilim', 'Madulom'],
    'theme.light': ['Light', 'Maliwanag', 'Masanag'],
    'role.coordinator': ['Coordinator Â· Cluster 1', 'Coordinator Â· Cluster 1', 'Coordinator Â· Cluster 1'],
    'role.buyer': ['Buyer (simulated)', 'Mamimili (simulated)', 'Bumalakal (simulated)'],
    'role.driver': ['Driver (simulated)', 'Driver (simulated)', 'Driver (simulated)'],
    'unit.sacks': ['sacks', 'sako', 'sako'],
    'unit.t': ['t', 't', 't'],
    'unit.kg': ['kg', 'kg', 'kg'],
    'unit.ha': ['ha', 'ha', 'ha'],
    'unit.km': ['km', 'km', 'km'],
    'unit.perKg': ['/kg', '/kg', '/kg'],
    'unit.pesoPerKg': ['â‚±/kg', 'â‚±/kg', 'â‚±/kg'],
    'unit.lot': ['Lot', 'Lot', 'Lot'],
    'env.demo': ['Demo', 'Demo', 'Demo'],
    'env.staging': ['Staging', 'Staging', 'Staging'],
    'env.local': ['Local', 'Local', 'Local'],
    'kit.title': ['Component Kit', 'Component Kit', 'Component Kit'],
    'kit.note': [
        'Development board for the UI kit. Every wrapper ships with keyboard and focus tests.',
        'Development board for the UI kit. Every wrapper ships with keyboard and focus tests.',
        'Development board for the UI kit. Every wrapper ships with keyboard and focus tests.'
    ],
    'kit.typedPrompt': [
        'Type {word} to confirm',
        'I-type ang {word} para kumpirmahin',
        'I-type ang {word} para makumpirma'
    ],
    'action.cancel': ['Cancel', 'Kanselahin', 'Kanselahon'],
    'action.confirm': ['Confirm', 'Kumpirmahin', 'Kumpirmahon'],
    'action.close': ['Close', 'Isara', 'Isara'],
    'state.loading': ['Loading', 'Naglo-load', 'Ginakarga'],
    'state.refresh': ['Updating', 'Nag-a-update', 'Gina-update'],
    'state.offline': [
        'You are offline. Changes are not sent yet.',
        'Offline ka. Hindi pa naipapadala ang mga pagbabago.',
        'Offline ka. Wala pa napadala ang mga pagbag-o.'
    ],
    'state.error.title': ['Something went wrong', 'May nangyaring mali', 'May natabo nga sayop'],
    'state.error.body': [
        'Try again. If it keeps failing, share the reference code with support.',
        'Subukang muli. Kung paulit-ulit, ibahagi ang reference code sa support.',
        'Sulayi liwat. Kon mapadayon, ihatag ang reference code sa support.'
    ],
    'state.error.reference': ['Reference {code}', 'Sanggunian {code}', 'Reperensya {code}'],
    'state.notFound.title': ['This record no longer exists', 'Wala na ang record na ito', 'Wala na ang rekord nga ini'],
    'state.notFound.body': [
        'It may have been removed. Go back to the list.',
        'Maaaring natanggal na ito. Bumalik sa listahan.',
        'Mahimo nga gintangtang na. Balik sa listahan.'
    ],
    'state.forbidden.title': [
        'This page is for {role}',
        'Ang pahinang ito ay para sa {role}',
        'Ini nga pahina para sa {role}'
    ],
    'state.forbidden.body': [
        'Sign in with the right account to continue.',
        'Mag-sign in gamit ang tamang account para magpatuloy.',
        'Mag-sign in gamit ang husto nga account para magpadayon.'
    ],
    'state.forbidden.signIn': ['Sign In', 'Mag-sign In', 'Mag-sign In'],
    'state.home': ['Go to Home', 'Pumunta sa Home', 'Kadto sa Home'],
    'zod.invalidType': ['Enter a valid value', 'Maglagay ng tamang halaga', 'Magbutang sang husto nga bili'],
    'zod.tooSmall': ['Value is too small', 'Masyadong maliit', 'Gamay ra gid'],
    'zod.tooBig': ['Value is too large', 'Masyadong malaki', 'Dako ra gid'],
    'zod.invalidFormat': ['Check the format', 'Suriin ang format', 'Tsek ang pormat'],
    'zod.invalidValue': [
        'Choose one of the allowed options',
        'Pumili sa mga pinapayagang opsyon',
        'Pili sa mga ginatugot nga opsyon'
    ],
    'zod.notMultipleOf': ['Use a whole number', 'Gumamit ng buong numero', 'Gamita ang bilog nga numero'],
    'zod.unrecognizedKeys': [
        'An extra field is not allowed',
        'May dagdag na field na hindi pinapayagan',
        'May sobra nga field nga indi ginatugot'
    ],
    'zod.invalidUnion': ['Enter a valid value', 'Maglagay ng tamang halaga', 'Magbutang sang husto nga bili'],
    'zod.invalidKey': [
        'A field name is not allowed',
        'May hindi pinapayagang pangalan ng field',
        'May indi ginatugot nga ngalan sang field'
    ],
    'zod.invalidElement': ['One item is invalid', 'May maling item', 'May sayop nga item'],
    'zod.custom': ['Enter a valid value', 'Maglagay ng tamang halaga', 'Magbutang sang husto nga bili'],
    'zod.invalid': ['Enter a valid value', 'Maglagay ng tamang halaga', 'Magbutang sang husto nga bili'],
    'phone.net': ['4G', '4G', '4G'],
    'sms.chars': ['chars', 'mga karakter', 'mga karakter'],
    'slip.item': ['Item', 'Aytem', 'Butang'],
    // components
    'market.filled': ['Filled', 'Napunan', 'Napuno'],
    'market.filledof': [
        '{filled} of {tonnes} t filled Â· {pct}%',
        '{filled} sa {tonnes} t napunan Â· {pct}%',
        '{filled} sa {tonnes} t napuno Â· {pct}%'
    ],
    'cal.total': ['Total', 'Kabuuan', 'Kabilugan'],
    'cal.farms': ['{n} farms', '{n} bukid', '{n} ka uma'],
    'driver.away': ['{km} km away', '{km} km ang layo', '{km} km ang kalayuon'],
    // farm list + profile
    'farm.list': ['Cluster 1 Farms', 'Mga Bukid ng Cluster 1', 'Mga Uma sang Cluster 1'],
    'farm.search': ['Search Farms', 'Maghanap ng Bukid', 'Mangita sang Uma'],
    'farm.summary': ['{n} farms Â· {ha} ha', '{n} bukid Â· {ha} ha', '{n} ka uma Â· {ha} ha'],
    'farm.open': ['Open {id}', 'Buksan ang {id}', 'Buksan ang {id}'],
    'farm.back': ['All Farms', 'Lahat ng Bukid', 'Tanan nga Uma'],
    'farm.harvest': ['Harvest', 'Ani', 'Alani'],
    'farm.harvestLine': ['{week} Â· {date}', '{week} Â· {date}', '{week} Â· {date}'],
    'farm.forecast': ['Forecast, Dried', 'Tantiya, Tuyo', 'Banta, Uga'],
    'farm.lot': ['Lot', 'Lot', 'Lot'],
    'farm.viewPlan': ['View in Plan', 'Tingnan sa Plano', 'Tan-awa sa Plano'],
    // plan
    'plan.eyebrow': [
        'Cluster 1 Â· {barangays} Â· W1-W4 from {start}',
        'Cluster 1 Â· {barangays} Â· W1-W4 mula {start}',
        'Cluster 1 Â· {barangays} Â· W1-W4 halin {start}'
    ],
    'plan.note.farms': [
        '{b} barangays Â· {split} farms',
        '{b} barangay Â· {split} bukid',
        '{b} ka barangay Â· {split} ka uma'
    ],
    'plan.note.area': ['Average {avg} ha per farm', 'Karaniwang {avg} ha bawat bukid', 'Average {avg} ha kada uma'],
    'plan.note.tonnes': [
        'Dried. Wet {wet} t at {yield} kg/ha, {loss}% loss, x{factor}',
        'Tuyo. Basa {wet} t sa {yield} kg/ha, {loss}% lugi, x{factor}',
        'Uga. Basa {wet} t sa {yield} kg/ha, {loss}% kapierdi, x{factor}'
    ],
    'plan.note.peak': [
        '{t} t dried Â· book dryer slots early',
        '{t} t tuyo Â· mag-book ng patuyuan nang maaga',
        '{t} t uga Â· mag-book sang pamalahan sing temprano'
    ],
    'plan.caption': [
        'Dried palay tonnes by barangay and harvest week (forecast)',
        'Toneladang tuyong palay ayon sa barangay at linggo ng ani (tantiya)',
        'Tonelada sang uga nga palay suno sa barangay kag semana sang alani (banta)'
    ],
    'plan.legend': [
        'Bars: dried tonnes per week. Gold outline: Farm {farm}, Lot {lot}.',
        'Bar: toneladang tuyo bawat linggo. Gintong guhit: Bukid {farm}, Lot {lot}.',
        'Bar: tonelada nga uga kada semana. Bulawan nga linya: Uma {farm}, Lot {lot}.'
    ],
    // market
    'market.eyebrow': [
        'Buyers post standing orders Â· the cluster fills them',
        'Nagpo-post ng order ang mamimili Â· pinupunan ng cluster',
        'Nagapost sang order ang bumalakal Â· ginapun-an sang cluster'
    ],
    'market.filters': ['Filter Commitments', 'I-filter ang Pangako', 'I-filter ang Saad'],
    'market.group.grade': ['Grade', 'Grado', 'Grado'],
    'market.group.volume': ['Volume', 'Dami', 'Kadamuon'],
    'market.group.window': ['Window', 'Panahon', 'Tion'],
    'market.assumed': [
        '{id}: grade, MC and price assumed (not in the brief)',
        '{id}: grado, MC at presyo ay tantiya lamang',
        '{id}: grado, MC kag presyo banta lang'
    ],
    'market.lotline': [
        'Dried Â· {grade} Â· {mc} Â· {week}',
        'Tuyo Â· {grade} Â· {mc} Â· {week}',
        'Uga Â· {grade} Â· {mc} Â· {week}'
    ],
    'market.fills': [
        'Matched to {id}: {filled} t of {tonnes} t across {n} lots, including {lot}.',
        'Itinugma sa {id}: {filled} t sa {tonnes} t mula sa {n} lot, kasama ang {lot}.',
        'Gin-tupong sa {id}: {filled} t sa {tonnes} t halin sa {n} ka lot, upod ang {lot}.'
    ],
    'market.committed': ['Committed to {id}', 'Naipangako sa {id}', 'Nasaad sa {id}'],
    'market.forecast.title': ['Auto-Match to Forecast', 'Auto-Match sa Tantiya', 'Auto-Match sa Banta'],
    'market.col.commitment': ['Commitment', 'Pangako', 'Saad'],
    'market.col.requested': ['Requested', 'Hiniling', 'Ginpangayo'],
    'market.col.forecast': ['Forecast in Window', 'Tantiya sa Panahon', 'Banta sa Tion'],
    'market.col.matched': ['Matched', 'Tugma', 'Nagtupong'],
    'market.col.lots': ['Lots', 'Lot', 'Lot'],
    // dry
    'dry.eyebrow': ['{dryer} Â· {place}', '{dryer} Â· {place}', '{dryer} Â· {place}'],
    'dry.note.capacity': ['{t} t per day (assumed)', '{t} t bawat araw (tantiya)', '{t} t kada adlaw (banta)'],
    'dry.note.booked': [
        '{pct}% of {cap} this week',
        '{pct}% ng {cap} ngayong linggo',
        '{pct}% sang {cap} subong nga semana'
    ],
    'dry.hero.label': ['Lot {lot} Slot', 'Slot ng Lot {lot}', 'Slot sang Lot {lot}'],
    'dry.hero.note': [
        '{day} Â· {kg} kg Â· {sacks} sacks',
        '{day} Â· {kg} kg Â· {sacks} sako',
        '{day} Â· {kg} kg Â· {sacks} ka sako'
    ],
    'dry.weeks': ['Harvest Week', 'Linggo ng Ani', 'Semana sang Alani'],
    'dry.free': [
        'Free this week: {free} of {cap} sacks',
        'Bakante ngayong linggo: {free} sa {cap} sako',
        'Bakante sini nga semana: {free} sa {cap} sako'
    ],
    'pay.markPaid': ['Mark Paid', 'Markahan na Bayad', 'Markahan nga Bayad'],
    'pay.paidOn': ['Paid on {date}', 'Bayad noong {date}', 'Bayad sang {date}'],
    'pay.confirm.title': ['Confirm settlement', 'Kumpirmahin ang settlement', 'Kumpirmahin ang settlement'],
    'pay.confirm.body': [
        'Mark {amount} as paid to farmer {farm} for lot {lot}? This cannot be undone in the app.',
        'Markahan ang {amount} bilang bayad kay {farm} para sa lot {lot}? Hindi na ito maibabalik sa app.',
        'Markahan ang {amount} bilang bayad kay {farm} para sa lot {lot}? Indi na ini mabalik sa app.'
    ],
    'pay.paidToast': ['Lot {lot} marked paid', 'Namarkahang bayad ang lot {lot}', 'Namarkahan nga bayad ang lot {lot}'],
    'dry.rule': [
        'Each lot dries on its harvest day, or the next day with room. No day goes over {t} t.',
        'Pinapatuyo ang bawat lot sa araw ng ani, o sa susunod na araw na may puwang. Walang araw na lalampas sa {t} t.',
        'Ginapamala ang kada lot sa adlaw sang alani, ukon sa masunod nga adlaw nga may lugar. Wala sang adlaw nga molapaw sa {t} t.'
    ],
    // haul
    'haul.new': ['New Haul Request', 'Bagong Hiling na Hakot', 'Bag-o nga Pangayo nga Hakot'],
    'haul.route': ['Route', 'Ruta', 'Ruta'],
    'haul.sacks.help': [
        'Dried lot {lot}: {kg} kg = {n} sacks of {per} kg',
        'Tuyong lot {lot}: {kg} kg = {n} sako na {per} kg',
        'Uga nga lot {lot}: {kg} kg = {n} ka sako nga {per} kg'
    ],
    'haul.waiting': [
        'Waiting for {driver} to accept',
        'Hinihintay na tanggapin ni {driver}',
        'Ginahulat nga batunon ni {driver}'
    ],
    'haul.vehicles': ['Vehicle for {n} sacks', 'Sasakyan para sa {n} sako', 'Salakyan para sa {n} ka sako'],
    'haul.drivers': ['Pick Any Driver', 'Pumili ng Kahit Anong Driver', 'Magpili sang Bisan Sin-o nga Driver'],
    'haul.assign': ['Assign', 'Italaga', 'I-assign'],
    'haul.busy': ['Busy', 'Abala', 'Okupado'],
    'haul.free': ['Available', 'Bakante', 'Bakante'],
    'haul.trips': ['{n} trip(s) Â· {price}', '{n} biyahe Â· {price}', '{n} ka biyahe Â· {price}'],
    'haul.overridden': ['Coordinator override', 'Pinalitan ng coordinator', 'Ginbaylo sang coordinator'],
    'haul.overrideNote': [
        'Override history: {from} â†’ {to}',
        'Kasaysayan ng pagpalit: {from} â†’ {to}',
        'Kasaysayan sang pagkambyo: {from} â†’ {to}'
    ],
    'haul.reassigned': [
        'Haul {id} reassigned to {driver}',
        'Inilipat ang hakot {id} kay {driver}',
        'Ginbalhin ang hakot {id} kay {driver}'
    ],
    'haul.close': ['Close List', 'Isara ang Listahan', 'Isira ang Listahan'],
    'haul.delivered': ['Mark Delivered', 'Markahang Naihatid', 'Markahan nga Naihatod'],
    'haul.notSent': ['Not sent yet', 'Hindi pa naipapadala', 'Wala pa napadala'],
    'haul.saved': ['Status saved', 'Nai-save ang status', 'Na-save ang status'],
    'haul.declined': [
        'Job declined. The coordinator assigns the next nearest driver.',
        'Tinanggihan ang trabaho. Itatalaga ng coordinator ang susunod na pinakamalapit na driver.',
        'Wala ginbaton ang obra. I-assign sang coordinator ang masunod nga pinakamalapit nga driver.'
    ],
    'haul.undo': ['Undo', 'Ibalik', 'Ibalik'],
    'haul.about': ['{n} (about {t} t dried)', '{n} (mga {t} t tuyo)', '{n} (mga {t} t uga)'],
    'haul.done': ['Delivered. Thank you!', 'Naihatid na. Salamat!', 'Naihatod na. Salamat!'],
    'haul.cost': ['Haul Cost', 'Gastos sa Hakot', 'Gasto sa Hakot'],
    // pay
    'pay.eyebrow': ['Orders Â· Pay', 'Mga Order Â· Bayad', 'Mga Order Â· Bayad'],
    'pay.eyebrow.lot': [
        'Orders Â· Pay Â· Lot {lot}',
        'Mga Order Â· Bayad Â· Lot {lot}',
        'Mga Order Â· Bayad Â· Lot {lot}'
    ],
    'pay.list.title': [
        'Lots Matched to Commitments',
        'Mga Lot na Itinugma sa Pangako',
        'Mga Lot nga Gin-tupong sa Saad'
    ],
    'pay.list.note': [
        'Only weighed lots settle. Forecast lots show an estimate from the same rates.',
        'Ang natimbang na lot lang ang binabayaran. Tantiya ang ipinapakita sa iba, sa parehong rate.',
        'Ang natimbang nga lot lang ang ginabayaran. Banta ang ginapakita sa iban, sa pareho nga rate.'
    ],
    'pay.col.lot': ['Lot', 'Lot', 'Lot'],
    'pay.col.farm': ['Farm', 'Bukid', 'Uma'],
    'pay.col.commitment': ['Commitment', 'Pangako', 'Saad'],
    'pay.col.harvest': ['Harvest', 'Ani', 'Alani'],
    'pay.col.kg': ['Dried kg', 'Kg na Tuyo', 'Kg nga Uga'],
    'pay.col.net': ['Net to Farmer', 'Netong Matatanggap', 'Neto nga Mabaton'],
    'pay.col.status': ['Status', 'Katayuan', 'Kahimtangan'],
    'pay.weighed': ['Weighed', 'Natimbang', 'Natimbang'],
    'pay.estimate': ['Estimate', 'Tantiya', 'Banta'],
    'pay.open': ['Open Lot {lot}', 'Buksan ang Lot {lot}', 'Buksan ang Lot {lot}'],
    'pay.record': ['Lot Record', 'Talaan ng Lot', 'Rekord sang Lot'],
    'pay.rec.farm': ['Farm Â· Barangay', 'Bukid Â· Barangay', 'Uma Â· Barangay'],
    'pay.rec.harvest': ['Harvest', 'Ani', 'Alani'],
    'pay.rec.weight': ['Dried Weight', 'Timbang na Tuyo', 'Timbang nga Uga'],
    'pay.rec.quality': ['Grade Â· Moisture', 'Grado Â· Halumigmig', 'Grado Â· Kahalumigmigon'],
    'pay.rec.buyer': ['Commitment Â· Buyer', 'Pangako Â· Mamimili', 'Saad Â· Bumalakal'],
    'pay.rec.haul': ['Haul Â· Driver', 'Hakot Â· Driver', 'Hakot Â· Driver'],
    'pay.rec.slot': ['Dryer Slot', 'Slot sa Patuyuan', 'Slot sa Pamalahan'],
    'pay.rec.slip': ['Slip', 'Resibo', 'Resibo'],
    'pay.viewSms': ['View SMS', 'Tingnan ang SMS', 'Tan-awa ang SMS'],
    'pay.back': ['All Lots', 'Lahat ng Lot', 'Tanan nga Lot'],
    // sms
    'sms.all.title': ['SMS to Farmer Â· Lot {lot}', 'SMS sa Magsasaka Â· Lot {lot}', 'SMS sa Mangunguma Â· Lot {lot}'],
    'sms.ascii': [
        'Plain ASCII on purpose: every message stays GSM-7, so each one is a single 160-character SMS.',
        'Sadyang plain ASCII: GSM-7 ang bawat mensahe, kaya isang 160-character na SMS lang ang bawat isa.',
        'Tuyo nga plain ASCII: GSM-7 ang kada mensahe, gani isa lang ka 160-character nga SMS ang kada isa.'
    ],
    'sms.all.link': ['All Three Languages', 'Lahat ng Tatlong Wika', 'Tanan nga Tatlo ka Lingguahe'],
    // demo
    'demo.beat.farm': ['Farm Profile', 'Profile ng Bukid', 'Profile sang Uma'],
    'demo.beat.plan': ['Harvest Plan', 'Plano ng Ani', 'Plano sang Alani'],
    'demo.beat.market': ['Market Match', 'Tugma sa Merkado', 'Tupong sa Merkado'],
    'demo.beat.dry': ['Dryer Slot', 'Slot sa Patuyuan', 'Slot sa Pamalahan'],
    'demo.beat.haul': ['Haul', 'Hakot', 'Hakot'],
    'demo.beat.pay': ['Settlement', 'Bayaran', 'Bayaran'],
    'demo.beat.sms': ['SMS to Farmer', 'SMS sa Magsasaka', 'SMS sa Mangunguma'],
    'demo.beat.end': ['End Card', 'Pangwakas', 'Pangtapos'],
    'demo.prev': ['Back', 'Bumalik', 'Balik'],
    'demo.next': ['Next', 'Susunod', 'Masunod'],
    'demo.play': ['Play', 'I-play', 'I-play'],
    'demo.pause': ['Pause', 'I-pause', 'I-pause'],
    'demo.restart': ['Restart', 'Ulitin', 'Liwaton'],
    'demo.keys': [
        'Arrows step Â· Space pauses Â· R restarts',
        'Arrow: hakbang Â· Space: hinto Â· R: ulit',
        'Arrow: lakat Â· Space: untat Â· R: liwat'
    ],
    'demo.controls': ['Demo Controls', 'Kontrol ng Demo', 'Kontrol sang Demo'],
    'end.title': [
        'One cluster. One hundred farms. 80% paid within 24 hours.',
        'Isang cluster. Sandaang bukid. 80% bayad sa loob ng 24 oras.',
        'Isa ka cluster. Isa ka gatos nga uma. 80% bayad sa sulod sang 24 oras.'
    ],
    // responsive shell + pagination (TL/HIL drafts: needs native review)
    'nav.more': ['More', 'Iba Pa', 'Iban Pa'],
    'sms.inbox': [
        "Farmer {farm}'s Phone Â· Messages",
        'Telepono ng Magsasaka {farm} Â· Mga Mensahe',
        'Telepono sang Mangunguma {farm} Â· Mga Mensahe'
    ],
    'list.showing': [
        'Showing {from}-{to} of {total}',
        'Ipinapakita ang {from}-{to} sa {total}',
        'Ginapakita ang {from}-{to} sa {total}'
    ],
    'list.prev': ['Previous', 'Nakaraan', 'Nauna'],
    'list.next': ['Next', 'Susunod', 'Masunod'],
    'list.pageOf': ['Page {n} of {total}', 'Pahina {n} sa {total}', 'Pahina {n} sa {total}'],
    'list.page': ['Page {n}', 'Pahina {n}', 'Pahina {n}'],
    'list.rowsPerPage': ['Rows per page', 'Hilera bawat pahina', 'Linya kada pahina'],
    'list.pagination': ['Pagination', 'Paglipat ng Pahina', 'Paglipat sang Pahina'],
    'list.filters': ['Filters', 'Mga Filter', 'Mga Filter'],
    'filter.allStatuses': ['All statuses', 'Lahat ng katayuan', 'Tanan nga kahimtangan'],
    'filter.allBarangays': ['All barangays', 'Lahat ng barangay', 'Tanan nga barangay'],
    'farm.noMatch': ['No farms match', 'Walang bukid na tugma', 'Wala sang uma nga nagtupong'],
    'farm.clearFilters': ['Clear Filters', 'Burahin ang mga Filter', 'Panason ang mga Filter'],
    'farm.add': ['Add Farm', 'Magdagdag ng Bukid', 'Magdugang sang Uma'],
    'farm.add.title': ['Add Farm to Cluster', 'Magdagdag ng Bukid sa Cluster', 'Magdugang sang Uma sa Cluster'],
    'farm.add.name': ['Farmer Name', 'Pangalan ng Magsasaka', 'Ngalan sang Mangunguma'],
    'farm.add.hint': [
        'Simulated data only: use a made-up name. No real mobile number is collected.',
        'Simulated data lamang: gumamit ng gawa-gawang pangalan. Walang totoong numero ang kinukuha.',
        'Simulated data lamang: gamita ang hinimo-himo nga ngalan. Wala sang matuod nga numero nga ginkuha.'
    ],
    'farm.add.saved': [
        'Farm {id} added to the cluster',
        'Naidagdag ang bukid {id} sa cluster',
        'Nadugang ang uma {id} sa cluster'
    ],
    'farm.add.submit': ['Add Farm', 'Idagdag ang Bukid', 'Idugang ang Uma'],
    'farm.created.note': [
        'Added with the Add Farm form. No lot or settlement yet.',
        'Naidagdag gamit ang Add Farm. Wala pang lot o settlement.',
        'Nadugang gamit ang Add Farm. Wala pa sang lot ukon settlement.'
    ],
    'farm.fullPage': [
        'Open {id} as a Full Page',
        'Buksan ang {id} sa Buong Pahina',
        'Buksan ang {id} sa Bilog nga Pahina'
    ],
    'plan.farms': ['Farms by Harvest Date', 'Mga Bukid ayon sa Petsa ng Ani', 'Mga Uma suno sa Petsa sang Alani'],
    'dry.slots': ['Dryer Slots in {week}', 'Mga Slot sa Patuyuan sa {week}', 'Mga Slot sa Pamalahan sa {week}'],
    'dry.col.slot': ['Slot', 'Slot', 'Slot'],
    'dry.col.day': ['Dries On', 'Patutuyuin sa', 'Pamalahon sa'],
    'sms.conversations': ['Conversations', 'Mga Usapan', 'Mga Istoryahanay'],
    'sms.readonly': [
        'Preview of sent SMS. Farmers reply by SMS.',
        'Preview ng naipadalang SMS. Sumasagot ang magsasaka sa SMS.',
        'Preview sang napadala nga SMS. Nagasabat ang mangunguma paagi sa SMS.'
    ],
    // buyer portal + view-as (TL/HIL drafts: needs native review)
    'role.name.coordinator': ['Coordinator', 'Coordinator', 'Coordinator'],
    'role.name.buyer': ['Buyer', 'Mamimili', 'Bumalakal'],
    'role.name.driver': ['Driver', 'Driver', 'Driver'],
    'nav.supply': ['Supply', 'Suplay', 'Suplay'],
    'nav.myorders': ['My Orders', 'Aking mga Order', 'Akon nga mga Order'],
    'buyer.type': ['I buy as', 'Bumibili bilang', 'Nagabakal bilang'],
    'buyer.type.miller': ['Miller', 'Miller', 'Miller'],
    'buyer.type.retailer': ['Retailer', 'Retailer', 'Retailer'],
    'buyer.type.market': ['Market Seller', 'Tindera sa Palengke', 'Tindera sa Merkado'],
    'buyer.type.restaurant': ['Restaurant', 'Restawran', 'Restawran'],
    'buyer.buys.palay': [
        'Buys dried palay (unmilled) by the tonne',
        'Bumibili ng tuyong palay kada tonelada',
        'Nagabakal sang uga nga palay kada tonelada'
    ],
    'buyer.buys.rice': [
        'Buys milled rice by the 25 kg sack',
        'Bumibili ng bigas kada 25 kg na sako',
        'Nagabakal sang bugas kada 25 kg nga sako'
    ],
    'supply.mapNote': [
        '{place}. One marker per barangay, never per farm, to protect farmers and keep orders going through the cluster. Supply figures are simulated.',
        '{place}. Isang marker kada barangay, hindi kada bukid, para protektahan ang magsasaka. Simulated ang suplay.',
        '{place}. Isa ka marker kada barangay, indi kada uma, para protektahan ang mangunguma. Simulated ang suplay.'
    ],
    'supply.mapOffline': [
        'Map tiles could not load (no signal?). The table shows the same numbers.',
        'Hindi ma-load ang mapa (walang signal?). Pareho ang numero sa talaan.',
        'Indi ma-load ang mapa (wala signal?). Pareho ang numero sa listahan.'
    ],
    'supply.title': ['Cluster Supply', 'Suplay ng Cluster', 'Suplay sang Cluster'],
    'supply.eyebrow': [
        'Cluster 1 Â· simulated forecast',
        'Cluster 1 Â· simulated na tantiya',
        'Cluster 1 Â· simulated nga banta'
    ],
    'supply.map': ['Supply Map Â· {week}', 'Mapa ng Suplay Â· {week}', 'Mapa sang Suplay Â· {week}'],
    'supply.table': [
        'Supply by Barangay and Week',
        'Suplay ayon sa Barangay at Linggo',
        'Suplay suno sa Barangay kag Semana'
    ],
    'supply.stat.palay': ['Palay Forecast, Dried', 'Tantiyang Palay, Tuyo', 'Banta nga Palay, Uga'],
    'supply.stat.open': ['Not Yet Committed', 'Hindi Pa Naipangako', 'Wala Pa Nasaad'],
    'supply.stat.rice': ['Milled Rice Available', 'Bigas na Makukuha', 'Bugas nga Mabakal'],
    'supply.stat.price': ['Rice Price (assumed)', 'Presyo ng Bigas (tantiya)', 'Presyo sang Bugas (banta)'],
    'supply.note.palay': [
        '{n} lots across {w} harvest weeks',
        '{n} lot sa {w} linggo ng ani',
        '{n} ka lot sa {w} ka semana sang alani'
    ],
    'supply.note.rice': [
        'From {miller}, at {pct}% milling recovery (assumed)',
        'Mula sa {miller}, sa {pct}% milling recovery (tantiya)',
        'Halin sa {miller}, sa {pct}% milling recovery (banta)'
    ],
    'supply.note.price': ['Per kg Â· {sack} kg sacks', 'Kada kg Â· {sack} kg na sako', 'Kada kg Â· {sack} kg nga sako'],
    'supply.cta.palay': ['Post a Commitment', 'Mag-post ng Pangako', 'Mag-post sang Saad'],
    'supply.cta.rice': ['Order Rice', 'Umorder ng Bigas', 'Mag-order sang Bugas'],
    'supply.col.week': ['{week}', '{week}', '{week}'],
    'orders.title': ['My Orders', 'Aking mga Order', 'Akon nga mga Order'],
    'orders.eyebrow': ['Buyer Â· simulated', 'Mamimili Â· simulated', 'Bumalakal Â· simulated'],
    'orders.new.rice': ['Order Milled Rice', 'Umorder ng Bigas', 'Mag-order sang Bugas'],
    'orders.new.palay': ['Post a Commitment', 'Mag-post ng Pangako', 'Mag-post sang Saad'],
    'orders.sacks': ['Sacks ({kg} kg each)', 'Sako ({kg} kg bawat isa)', 'Sako ({kg} kg kada isa)'],
    'orders.week': ['Delivery Week', 'Linggo ng Hatid', 'Semana sang Hatod'],
    'orders.total': [
        '{kg} kg Â· {total} at {price}/kg (assumed)',
        '{kg} kg Â· {total} sa {price}/kg (tantiya)',
        '{kg} kg Â· {total} sa {price}/kg (banta)'
    ],
    'orders.available': ['Available: {kg} kg', 'Makukuha: {kg} kg', 'Mabakal: {kg} kg'],
    'orders.place': ['Place Order', 'Ilagay ang Order', 'Ibutang ang Order'],
    'orders.placing': ['Placing Order', 'Inilalagay ang Order', 'Ginabutang ang Order'],
    'orders.review': ['Review Order', 'Suriin ang Order', 'Usisaon ang Order'],
    'orders.summary': ['Order Summary', 'Buod ng Order', 'Kabilugan sang Order'],
    'orders.back': ['Back', 'Bumalik', 'Balik'],
    'orders.less': ['One sack less', 'Isang sako na bawas', 'Isa ka sako nga kubos'],
    'orders.more': ['One sack more', 'Isang sako pa', 'Isa pa ka sako'],
    'orders.placed': ['Order {id} placed', 'Naipasok ang order {id}', 'Napasulod ang order {id}'],
    'orders.cancelled': ['Order cancelled', 'Kinansela ang order', 'Ginkansel ang order'],
    'action.undo': ['Undo', 'I-undo', 'I-undo'],
    'orders.err.sacks': [
        'Enter at least one whole sack.',
        'Maglagay ng kahit isang buong sako.',
        'Magbutang sang bisan isa ka bilog nga sako.'
    ],
    'orders.err.available': [
        'That is more than the {kg} kg available.',
        'Lampas iyan sa {kg} kg na makukuha.',
        'Sobra ina sa {kg} kg nga mabakal.'
    ],
    'orders.mine': ['My Orders', 'Aking mga Order', 'Akon nga mga Order'],
    'orders.none': ['No Orders Yet', 'Wala Pang Order', 'Wala Pa sang Order'],
    'orders.none.body': [
        'Place your first order above. Orders stay in this browser only (prototype).',
        'Ilagay ang unang order sa itaas. Sa browser na ito lang naka-save (prototype).',
        'Ibutang ang una nga order sa ibabaw. Sa sini lang nga browser naka-save (prototype).'
    ],
    'orders.line': [
        '{sacks} sacks Â· {kg} kg Â· {week} Â· {total}',
        '{sacks} sako Â· {kg} kg Â· {week} Â· {total}',
        '{sacks} ka sako Â· {kg} kg Â· {week} Â· {total}'
    ],
    'orders.clear': ['Clear My Orders', 'Burahin ang Aking Order', 'Panason ang Akon nga Order'],
    'orders.tonnes': ['Tonnes of Dried Palay', 'Tonelada ng Tuyong Palay', 'Tonelada sang Uga nga Palay'],
    'orders.price': ['Your Price per kg (PHP)', 'Iyong Presyo kada kg (PHP)', 'Imo nga Presyo kada kg (PHP)'],
    'orders.from': ['Window From', 'Mula Linggo', 'Halin Semana'],
    'orders.to': ['Window To', 'Hanggang Linggo', 'Tubtob Semana'],
    'orders.gradeFixed': [
        'Grade 1 Â· 14% MC (the cluster forecast grade, assumed)',
        'Grade 1 Â· 14% MC (tantiyang grado ng cluster)',
        'Grade 1 Â· 14% MC (banta nga grado sang cluster)'
    ],
    'orders.post': ['Post and Auto-Match', 'I-post at Itugma', 'I-post kag Itupong'],
    'orders.err.tonnes': [
        'Enter tonnes greater than 0.',
        'Maglagay ng toneladang higit sa 0.',
        'Magbutang sang tonelada nga labaw sa 0.'
    ],
    'orders.err.price': [
        'Enter a price greater than 0.',
        'Maglagay ng presyong higit sa 0.',
        'Magbutang sang presyo nga labaw sa 0.'
    ],
    'orders.err.window': [
        'Window From must not be after Window To.',
        'Hindi dapat lumampas ang Mula sa Hanggang.',
        'Indi dapat molapaw ang Halin sa Tubtob.'
    ],
    'orders.matched': [
        'Auto-matched {kg} t from {n} lots not yet committed',
        'Naitugma ang {kg} t mula sa {n} lot',
        'Natupong ang {kg} t halin sa {n} ka lot'
    ],
    'orders.c01': [
        'Commitment C-01 (you as Buyer A, simulated)',
        'Pangako C-01 (ikaw bilang Buyer A, simulated)',
        'Saad C-01 (ikaw bilang Buyer A, simulated)'
    ],
    'trace.title': ['Trace to the Farm', 'Sundan Hanggang sa Bukid', 'Sundan Tubtob sa Uma'],
    'trace.order': ['Your order {id}', 'Iyong order {id}', 'Imo nga order {id}'],
    'trace.commitment': ['Your commitment {id}', 'Iyong pangako {id}', 'Imo nga saad {id}'],
    'trace.milled': [
        'Milled rice lot {id} Â· {kg} kg at {miller}',
        'Lot ng bigas {id} Â· {kg} kg sa {miller}',
        'Lot sang bugas {id} Â· {kg} kg sa {miller}'
    ],
    'trace.palay': [
        'Palay lot {id} Â· {kg} kg Â· {grade} Â· {mc}',
        'Lot ng palay {id} Â· {kg} kg Â· {grade} Â· {mc}',
        'Lot sang palay {id} Â· {kg} kg Â· {grade} Â· {mc}'
    ],
    'trace.farm': [
        'Farm {id} Â· {barangay} Â· harvest {date}',
        'Bukid {id} Â· {barangay} Â· ani {date}',
        'Uma {id} Â· {barangay} Â· alani {date}'
    ],
    'trace.haul': [
        'Haul {id} Â· {plate} Â· {km} km',
        'Hakot {id} Â· {plate} Â· {km} km',
        'Hakot {id} Â· {plate} Â· {km} km'
    ],
    'trace.dryer': ['Dryer slot {id} Â· {day}', 'Slot sa patuyuan {id} Â· {day}', 'Slot sa pamalahan {id} Â· {day}'],
    'trace.paid': [
        'Farmer paid: advance {advance} within 24 h Â· slip {slip}',
        'Bayad sa magsasaka: paunang {advance} sa loob ng 24 oras Â· resibo {slip}',
        'Bayad sa mangunguma: abanse {advance} sa sulod sang 24 oras Â· resibo {slip}'
    ],
    'trace.note': [
        'Shown for lot {lot}, the one lot in the simulation that has been weighed and paid.',
        'Ipinapakita para sa lot {lot}, ang tanging natimbang at nabayarang lot.',
        'Ginapakita para sa lot {lot}, ang isa lang nga lot nga natimbang kag nabayaran.'
    ],
    'orders.you': ['You (simulated)', 'Ikaw (simulated)', 'Ikaw (simulated)'],
    // farmer SMS replies (TL/HIL drafts: needs native review)
    'sms.reply.label': ['Reply to RiceConnect', 'Sumagot sa RiceConnect', 'Sabat sa RiceConnect'],
    'sms.reply.quick': ['Quick replies', 'Mabilisang sagot', 'Madasig nga sabat'],
    'sms.reply.sending': ['Sending', 'Ipinapadala', 'Ginapadala'],
    'slip.sameSms': ['Same numbers as the SMS', 'Parehong numero sa SMS', 'Pareho nga numero sa SMS'],
    'sms.reply.quickOk': ['1 OK', '1 OK', '1 OK'],
    'sms.reply.quickMove': ['2 Move', '2 Ilipat', '2 Ibalhin'],
    'sms.reply.placeholder': [
        'Type a reply, e.g. 1 OK',
        'Mag-type ng sagot, hal. 1 OK',
        'Mag-type sang sabat, pareho sang 1 OK'
    ],
    'sms.reply.send': ['Send', 'Ipadala', 'Ipadala'],
    'sms.reply.ok': ['Slot {slot} confirmed', 'Kumpirmado ang slot {slot}', 'Kumpirmado ang slot {slot}'],
    'sms.reply.move': [
        'Move requested for slot {slot}',
        'Hiniling ilipat ang slot {slot}',
        'Ginpangayo nga ibalhin ang slot {slot}'
    ],
    'sms.reply.unknown': [
        'Not understood: reply 1 OK or 2 Move',
        'Hindi naintindihan: sumagot ng 1 OK o 2 Ilipat',
        'Wala naintiendihan: sabat 1 OK ukon 2 Ibalhin'
    ],
    // coordinator home (TL/HIL drafts: needs native review)
    'nav.home': ['Home', 'Home', 'Home'],
    'home.title': ['This Week', 'Ngayong Linggo', 'Subong nga Semana'],
    'home.eyebrow': [
        'Coordinator Â· Cluster 1 Â· {week} Â· today {date} (simulated)',
        'Coordinator Â· Cluster 1 Â· {week} Â· ngayon {date} (simulated)',
        'Coordinator Â· Cluster 1 Â· {week} Â· subong {date} (simulated)'
    ],
    'home.stat.harvests': ['Harvests This Week', 'Ani Ngayong Linggo', 'Alani Subong nga Semana'],
    'home.stat.hauls': [
        'Hauls Waiting for a Driver',
        'Hakot na Naghihintay ng Driver',
        'Hakot nga Nagahulat sang Driver'
    ],
    'home.stat.advances': ['Advances Due', 'Paunang Bayad na Dapat Ibigay', 'Abanse nga Dapat Ihatag'],
    'home.stat.orders': ['New Buyer Orders', 'Bagong Order ng Mamimili', 'Bag-o nga Order sang Bumalakal'],
    'home.note.harvests': ['{t} t dried, forecast', '{t} t tuyo, tantiya', '{t} t uga, banta'],
    'home.note.hauls': [
        'Not yet accepted by a driver',
        'Hindi pa tinatanggap ng driver',
        'Wala pa ginbaton sang driver'
    ],
    'home.note.advances': ['80% of net, by {date}', '80% ng neto, bago ang {date}', '80% sang neto, antes sang {date}'],
    'home.note.orders': ['From the buyer app, live', 'Mula sa buyer app, live', 'Halin sa buyer app, live'],
    'home.harvests': ['Harvests in {week}', 'Ani sa {week}', 'Alani sa {week}'],
    'home.more': ['and {n} more in the Plan', 'at {n} pa sa Plano', 'kag {n} pa sa Plano'],
    'home.hauls': ['Hauls Waiting for a Driver', 'Hakot na Naghihintay ng Driver', 'Hakot nga Nagahulat sang Driver'],
    'home.noHauls': [
        'No haul is waiting: {id} is with its driver.',
        'Walang naghihintay: nasa driver na ang {id}.',
        'Wala sang nagahulat: yara na sa driver ang {id}.'
    ],
    'home.noHaulRequests': [
        'No haul requests this week.',
        'Walang hiling na hakot ngayong linggo.',
        'Wala sang pangayo nga hakot subong nga semana.'
    ],
    'home.openHaul': ['Open Logistics', 'Buksan ang Logistics', 'Buksan ang Logistics'],
    'home.advances': ['Advances Due', 'Paunang Bayad na Dapat Ibigay', 'Abanse nga Dapat Ihatag'],
    'home.advanceLine': [
        'Lot {lot}: {amount} to the farmer by {date}',
        'Lot {lot}: {amount} sa magsasaka bago ang {date}',
        'Lot {lot}: {amount} sa mangunguma antes sang {date}'
    ],
    'home.orders': ['New Buyer Orders', 'Bagong Order ng Mamimili', 'Bag-o nga Order sang Bumalakal'],
    'home.noOrders': [
        'No orders yet. Open the buyer app in another tab and place one: it appears here.',
        'Wala pang order. Buksan ang buyer app sa ibang tab at umorder: lalabas dito.',
        'Wala pa sang order. Buksan ang buyer app sa iban nga tab kag mag-order: makita diri.'
    ],
    'home.openBuyer': ['Open the Buyer App', 'Buksan ang Buyer App', 'Buksan ang Buyer App'],
    'home.replies': ['Farmer Replies', 'Sagot ng Magsasaka', 'Sabat sang Mangunguma'],
    'home.lastReply': ['{farm} replied "{text}"', 'Sumagot si {farm} ng "{text}"', 'Nagsabat si {farm} sang "{text}"'],
    'home.noReplies': ['No replies yet.', 'Wala pang sagot.', 'Wala pa sang sabat.'],
    'home.openSms': ['Open the Farmer SMS', 'Buksan ang SMS ng Magsasaka', 'Buksan ang SMS sang Mangunguma'],
    'home.simNote': [
        'Prototype: all figures simulated',
        'Prototype: simulated ang lahat ng numero',
        'Prototype: simulated ang tanan nga numero'
    ],
    'slot.scheduled': ['Slot {id} scheduled', 'Naka-iskedyul ang slot {id}', 'Naka-iskedyul ang slot {id}'],
    'slot.confirmed': [
        'Slot {id} confirmed by farmer',
        'Kinumpirma ng magsasaka ang slot {id}',
        'Ginkumpirma sang mangunguma ang slot {id}'
    ],
    'slot.move-requested': [
        'Farmer asked to move slot {id}',
        'Hiniling ng magsasaka ilipat ang slot {id}',
        'Ginpangayo sang mangunguma nga ibalhin ang slot {id}'
    ],
    'slip.viewer': [
        'Farmer {farm} Â· Slip {slip} (simulated)',
        'Magsasaka {farm} Â· Resibo {slip} (simulated)',
        'Mangunguma {farm} Â· Resibo {slip} (simulated)'
    ],
    'slip.view': ['View the Slip', 'Tingnan ang Resibo', 'Tan-awa ang Resibo'],
    // marketing site (TL/HIL drafts: needs native review)
    'mk.nav': ['Sections', 'Mga Seksiyon', 'Mga Seksiyon'],
    'mk.nav.problem': ['Problem', 'Problema', 'Problema'],
    'mk.nav.how': ['How It Works', 'Paano Ito Gumagana', 'Paano Ini Nagaobra'],
    'mk.nav.who': ["Who It's For", 'Para Kanino', 'Para Kay Sin-o'],
    'mk.nav.status': ['Status', 'Katayuan', 'Kahimtangan'],
    'mk.nav.faq': ['FAQ', 'Mga Tanong', 'Mga Pamangkot'],
    'mk.open': ['Open Prototype', 'Buksan ang Prototype', 'Buksan ang Prototype'],
    'mk.how': ['How It Works', 'Paano Ito Gumagana', 'Paano Ini Nagaobra'],
    'mk.see': ['See It', 'Tingnan', 'Tan-awa'],
    'mk.try': ['Try It', 'Subukan', 'Tilawan'],
    'mk.back': ['Back to RiceConnect', 'Bumalik sa RiceConnect', 'Balik sa RiceConnect'],
    'mk.contact': ['Email the Team', 'I-email ang Team', 'I-email ang Team'],
    'mk.footer.line': [
        'Cluster selling for smallholder rice farmers. A prototype by Team Syntaxure Labs.',
        'Sama-samang pagbebenta para sa maliliit na magsasaka ng palay. Prototype ng Team Syntaxure Labs.',
        'Tingob nga pagbaligya para sa gagmay nga mangunguma sang humay. Prototype sang Team Syntaxure Labs.'
    ],
    'mk.tag.model': ['Model', 'Modelo', 'Modelo'],
    'mk.tag.simulated': ['Simulated', 'Simulated', 'Simulated'],
    'mk.tag.assumed': ['Assumed', 'Tantiya', 'Banta'],
    'mk.hero.title': [
        'Rice farmers sell together, on their own terms.',
        'Sama-samang nagbebenta ang mga magsasaka, sa sarili nilang kondisyon.',
        'Tingob nga nagabaligya ang mga mangunguma, sa ila kaugalingon nga kondisyon.'
    ],
    'mk.hero.sub': [
        'RiceConnect helps a coordinator run a cluster of smallholder farms: plan the harvest, line up buyers before it comes in, dry and haul it on time, and pay farmers fast. Farmers only need SMS.',
        'Tinutulungan ng RiceConnect ang coordinator na patakbuhin ang cluster ng maliliit na bukid: planuhin ang ani, humanap ng mamimili bago pa mag-ani, patuyuin at ihatid sa tamang oras, at bayaran agad ang magsasaka. SMS lang ang kailangan ng magsasaka.',
        'Ginabuligan sang RiceConnect ang coordinator sa pagdumala sang cluster sang gagmay nga uma: planuhon ang alani, mangita sang bumalakal antes mag-alani, pamalahon kag ihatod sa husto nga oras, kag bayaran dayon ang mangunguma. SMS lang ang kinahanglan sang mangunguma.'
    ],
    'mk.hero.card': ['The Prototype Cluster', 'Ang Prototype na Cluster', 'Ang Prototype nga Cluster'],
    'mk.hero.where': [
        'Where (real places, simulated farms)',
        'Saan (totoong lugar, simulated na bukid)',
        'Diin (matuod nga lugar, simulated nga uma)'
    ],
    'mk.hero.cardNote': [
        'Simulated: no real farms, farmers or prices.',
        'Simulated: walang totoong bukid, magsasaka o presyo.',
        'Simulated: wala sang matuod nga uma, mangunguma ukon presyo.'
    ],
    'mk.problem.eyebrow': ["The Farmer's Problem", 'Ang Problema ng Magsasaka', 'Ang Problema sang Mangunguma'],
    'mk.problem.title': [
        "Farmers can find buyers. They can't choose when, to whom, or on what terms.",
        'Nakakahanap ng mamimili ang magsasaka, pero hindi nila napipili kung kailan, kanino, o sa anong kondisyon.',
        'Nakapangita sang bumalakal ang mangunguma, pero indi nila mapili kon san-o, kay sin-o, ukon sa ano nga kondisyon.'
    ],
    'mk.problem.when.h': ['When', 'Kailan', 'San-o'],
    'mk.problem.when.p': [
        "The harvest comes in at once and has to be dried and sold quickly, so the timing is rarely the farmer's choice.",
        'Sabay-sabay ang ani at kailangang patuyuin at ibenta agad, kaya bihirang ang magsasaka ang pumipili ng oras.',
        'Dungan-dungan ang alani kag kinahanglan pamalahon kag ibaligya dayon, gani talagsa lang ang mangunguma ang makapili sang oras.'
    ],
    'mk.problem.whom.h': ['To Whom', 'Kanino', 'Kay Sin-o'],
    'mk.problem.whom.p': [
        'One small farm is too small for a miller, retailer or restaurant to plan around.',
        'Masyadong maliit ang isang bukid para pagplanuhan ng miller, retailer o restawran.',
        'Gamay masyado ang isa ka uma para planuhan sang miller, retailer ukon restawran.'
    ],
    'mk.problem.terms.h': ['On What Terms', 'Sa Anong Kondisyon', 'Sa Ano nga Kondisyon'],
    'mk.problem.terms.p': [
        'Price, weighing and payment date are usually set at the sale, not agreed before the harvest.',
        'Karaniwang itinatakda ang presyo, timbang at araw ng bayad sa bentahan, hindi napagkakasunduan bago mag-ani.',
        'Kasagaran ginatakda ang presyo, timbang kag adlaw sang bayad sa baligyaan, indi ginkasugtan antes mag-alani.'
    ],
    'mk.how.eyebrow': ['How a Cluster Works', 'Paano Gumagana ang Cluster', 'Paano Nagaobra ang Cluster'],
    'mk.how.title': [
        'Calendar, Commitment, Dry, Haul, Pay',
        'Kalendaryo, Pangako, Patuyo, Hakot, Bayad',
        'Kalendaryo, Saad, Pamala, Hakot, Bayad'
    ],
    'mk.how.note': [
        'How the cluster is designed to work. The prototype runs it on simulated data.',
        'Ganito idinisenyo ang cluster. Sa simulated na datos ito pinapatakbo ng prototype.',
        'Amo ini ang disenyo sang cluster. Sa simulated nga datos ini ginapadalagan sang prototype.'
    ],
    'mk.step.plan.h': ['Calendar', 'Kalendaryo', 'Kalendaryo'],
    'mk.step.plan.p': [
        "Every farm's harvest week, by barangay, so the cluster knows what is coming and when.",
        'Ang linggo ng ani ng bawat bukid, ayon sa barangay, para alam ng cluster kung ano ang darating at kailan.',
        'Ang semana sang alani sang kada uma, suno sa barangay, para mahibaluan sang cluster kon ano ang maabot kag san-o.'
    ],
    'mk.step.commit.h': ['Buyer Commitment', 'Pangako ng Mamimili', 'Saad sang Bumalakal'],
    'mk.step.commit.p': [
        'Buyers commit volume, grade, window and price before the harvest; lots are matched automatically.',
        'Nangangako ang mamimili ng dami, grado, panahon at presyo bago mag-ani; awtomatikong itinutugma ang mga lot.',
        'Nagasaad ang bumalakal sang kadamuon, grado, tion kag presyo antes mag-alani; awtomatiko nga ginatupong ang mga lot.'
    ],
    'mk.step.dry.h': ['Dry', 'Patuyo', 'Pamala'],
    'mk.step.dry.p': [
        "Each lot gets a dryer slot on its harvest day, never over the dryer's daily capacity.",
        'Bawat lot ay may slot sa patuyuan sa araw ng ani, hindi lalampas sa kapasidad kada araw.',
        'Ang kada lot may slot sa pamalahan sa adlaw sang alani, indi molapaw sa kapasidad kada adlaw.'
    ],
    'mk.step.haul.h': ['Haul', 'Hakot', 'Hakot'],
    'mk.step.haul.p': [
        'The nearest available driver whose vehicle carries the whole lot is assigned; the coordinator can change it.',
        'Itinatalaga ang pinakamalapit na driver na kasya ang buong lot; puwedeng palitan ng coordinator.',
        'Gina-assign ang pinakamalapit nga driver nga kasya ang bilog nga lot; mabaylo sang coordinator.'
    ],
    'mk.step.pay.h': ['Pay', 'Bayad', 'Bayad'],
    'mk.step.pay.p': [
        'Quoted price âˆ’ drying âˆ’ coordination margin = net to the farmer; 80% advance within 24 hours, balance when the buyer pays.',
        'Presyong inalok âˆ’ patuyo âˆ’ bayad sa koordinasyon = neto sa magsasaka; 80% paunang bayad sa loob ng 24 oras, natitira kapag nagbayad ang mamimili.',
        'Gintanyag nga presyo âˆ’ pamala âˆ’ bayad sa koordinasyon = neto sa mangunguma; 80% abanse sa sulod sang 24 oras, nabilin kon magbayad ang bumalakal.'
    ],
    'mk.domains.eyebrow': ['The Four Domains', 'Ang Apat na Bahagi', 'Ang Apat ka Bahin'],
    'mk.domains.title': ['One Cluster, Four Jobs', 'Isang Cluster, Apat na Trabaho', 'Isa ka Cluster, Apat ka Obra'],
    'mk.domain.supply.h': ['Supply', 'Suplay', 'Suplay'],
    'mk.domain.supply.p': [
        'Farm profiles and the harvest plan.',
        'Profile ng bukid at plano ng ani.',
        'Profile sang uma kag plano sang alani.'
    ],
    'mk.domain.demand.h': ['Demand', 'Demand', 'Demand'],
    'mk.domain.demand.p': [
        'Buyer commitments and orders, matched to the forecast.',
        'Pangako at order ng mamimili, itinutugma sa tantiya.',
        'Saad kag order sang bumalakal, ginatupong sa banta.'
    ],
    'mk.domain.logistics.h': ['Logistics', 'Logistics', 'Logistics'],
    'mk.domain.logistics.p': [
        'Dryer slots and hauls from farm to dryer to buyer.',
        'Slot sa patuyuan at hakot mula bukid, patuyuan, hanggang mamimili.',
        'Slot sa pamalahan kag hakot halin sa uma, pamalahan, tubtob bumalakal.'
    ],
    'mk.domain.payment.h': ['Payment', 'Bayad', 'Bayad'],
    'mk.domain.payment.p': [
        "Settlement, the farmer's advance and balance, and a printed slip.",
        'Bayaran, paunang bayad at natitira ng magsasaka, at nakalimbag na resibo.',
        'Bayaran, abanse kag nabilin sang mangunguma, kag naimprinta nga resibo.'
    ],
    'mk.who.eyebrow': ["Who It's For", 'Para Kanino', 'Para Kay Sin-o'],
    'mk.who.title': ['Four People, One Lot', 'Apat na Tao, Isang Lot', 'Apat ka Tawo, Isa ka Lot'],
    'mk.role.coordinator.h': ['Coordinator', 'Coordinator', 'Coordinator'],
    'mk.role.coordinator.p': [
        'Runs the cluster: farms, plan, buyers, dryer, hauls and payments.',
        'Namamahala sa cluster: bukid, plano, mamimili, patuyuan, hakot at bayad.',
        'Nagadumala sang cluster: uma, plano, bumalakal, pamalahan, hakot kag bayad.'
    ],
    'mk.role.buyer.h': ['Buyer', 'Mamimili', 'Bumalakal'],
    'mk.role.buyer.p': [
        'Millers, retailers, market sellers and restaurants: see supply by barangay, order, and trace a lot to its farm.',
        'Miller, retailer, tindera sa palengke at restawran: tingnan ang suplay kada barangay, umorder, at sundan ang lot hanggang sa bukid.',
        'Miller, retailer, tindera sa merkado kag restawran: tan-awa ang suplay kada barangay, mag-order, kag sundan ang lot tubtob sa uma.'
    ],
    'mk.role.driver.h': ['Driver', 'Driver', 'Driver'],
    'mk.role.driver.p': [
        'Accepts haul jobs on a phone and marks pickup and delivery.',
        'Tumatanggap ng hakot sa telepono at nagmamarka ng kuha at hatid.',
        'Nagabaton sang hakot sa telepono kag nagamarka sang kuha kag hatod.'
    ],
    'mk.role.farmer.h': ['Farmer', 'Magsasaka', 'Mangunguma'],
    'mk.role.farmer.p': [
        'SMS first: gets SMS in English, Tagalog or Hiligaynon, replies 1 OK or 2 to move, and gets a paper slip. Can also sign in with a mobile number to see the inbox and slip.',
        'SMS muna: tumatanggap ng SMS sa English, Tagalog o Hiligaynon, sumasagot ng 1 OK o 2 para ilipat, at may papel na resibo. Puwede ring mag-sign in gamit ang numero ng mobile para makita ang inbox at resibo.',
        'SMS anay: nagabaton sang SMS sa English, Tagalog ukon Hiligaynon, nagasabat sang 1 OK ukon 2 para ibalhin, kag may papel nga resibo. Puede man mag-sign in gamit ang numero sang mobile para makita ang inbox kag resibo.'
    ],
    'mk.status.eyebrow': ['Status', 'Katayuan', 'Kahimtangan'],
    'mk.status.title': [
        'Validation Stage: Prototype with Simulated Data',
        'Yugto ng Pagpapatunay: Prototype na may Simulated na Datos',
        'Tion sang Pagpamatuod: Prototype nga may Simulated nga Datos'
    ],
    'mk.status.stage': [
        'Built for Enactus Philippines 2026. Not in use by any farmer or buyer yet.',
        'Ginawa para sa Enactus Philippines 2026. Hindi pa ginagamit ng sinumang magsasaka o mamimili.',
        'Ginhimo para sa Enactus Philippines 2026. Wala pa ginagamit sang bisan sin-o nga mangunguma ukon bumalakal.'
    ],
    'mk.status.model': [
        'How the cluster works (the steps above). Being validated in interviews with coordinators, buyers and farmers.',
        'Kung paano gumagana ang cluster (mga hakbang sa itaas). Pinapatunayan pa sa mga panayam.',
        'Kon paano nagaobra ang cluster (mga lakat sa ibabaw). Ginapamatud-an pa sa mga interbyu.'
    ],
    'mk.status.simulated': [
        '{n} farms on {ha} ha and every name, price, date and lot inside the app.',
        '{n} bukid sa {ha} ha at bawat pangalan, presyo, petsa at lot sa loob ng app.',
        '{n} ka uma sa {ha} ha kag kada ngalan, presyo, petsa kag lot sa sulod sang app.'
    ],
    'mk.status.assumed': [
        'Placeholder numbers such as the milling recovery and the milled-rice price, each labeled on screen.',
        'Mga pansamantalang numero gaya ng milling recovery at presyo ng bigas, may label sa screen.',
        'Mga temporaryo nga numero pareho sang milling recovery kag presyo sang bugas, may label sa screen.'
    ],
    'mk.status.next': [
        'Next: test with real coordinators, buyers and farmers. Real data only with consent, under the Data Privacy Act of 2012 (RA 10173).',
        'Susunod: subukan kasama ang totoong coordinator, mamimili at magsasaka. Totoong datos lamang kung may pahintulot, ayon sa Data Privacy Act of 2012 (RA 10173).',
        'Masunod: tilawan upod ang matuod nga coordinator, bumalakal kag mangunguma. Matuod nga datos lang kon may pahanugot, suno sa Data Privacy Act of 2012 (RA 10173).'
    ],
    'mk.team.eyebrow': ['Team', 'Team', 'Team'],
    'mk.team.title': ['Who Is Building It', 'Sino ang Gumagawa', 'Sin-o ang Nagahimo'],
    'mk.team.team.h': ['Team Syntaxure Labs', 'Team Syntaxure Labs', 'Team Syntaxure Labs'],
    'mk.team.team.p': [
        'Builds RiceConnect for Enactus Philippines 2026.',
        'Gumagawa ng RiceConnect para sa Enactus Philippines 2026.',
        'Nagahimo sang RiceConnect para sa Enactus Philippines 2026.'
    ],
    'mk.team.school.h': ['ISUFST', 'ISUFST', 'ISUFST'],
    'mk.team.school.p': [
        'Iloilo State University of Fisheries Science and Technology, Dingle Campus.',
        'Iloilo State University of Fisheries Science and Technology, Dingle Campus.',
        'Iloilo State University of Fisheries Science and Technology, Dingle Campus.'
    ],
    'mk.team.tbi.h': ['KWADRA TBI', 'KWADRA TBI', 'KWADRA TBI'],
    'mk.team.tbi.p': [
        'Syntaxure Labs is incubated at KWADRA Technology Business Incubator, Iloilo.',
        'Ang Syntaxure Labs ay incubated sa KWADRA Technology Business Incubator, Iloilo.',
        'Ang Syntaxure Labs incubated sa KWADRA Technology Business Incubator, Iloilo.'
    ],
    'mk.faq.eyebrow': ['FAQ', 'Mga Tanong', 'Mga Pamangkot'],
    'mk.faq.title': ['Questions', 'Mga Tanong', 'Mga Pamangkot'],
    'mk.faq.live.q': ['Is RiceConnect live?', 'Live na ba ang RiceConnect?', 'Live na bala ang RiceConnect?'],
    'mk.faq.live.a': [
        'Not yet. It is a clickable prototype with simulated data, for testing and for the Enactus competition.',
        'Hindi pa. Isa itong prototype na may simulated na datos, para sa pagsubok at sa Enactus.',
        'Wala pa. Isa ini ka prototype nga may simulated nga datos, para sa pagtilaw kag sa Enactus.'
    ],
    'mk.faq.data.q': ['Is the data real?', 'Totoo ba ang datos?', 'Matuod bala ang datos?'],
    'mk.faq.data.a': [
        'No. Farms, farmers, prices, dates and lots are simulated. The barangays are real places in Dingle, Iloilo; nothing shown about them is.',
        'Hindi. Simulated ang bukid, magsasaka, presyo, petsa at lot. Totoong lugar sa Dingle, Iloilo ang mga barangay; pero hindi totoo ang ipinapakita tungkol sa kanila.',
        'Indi. Simulated ang uma, mangunguma, presyo, petsa kag lot. Matuod nga lugar sa Dingle, Iloilo ang mga barangay; pero indi matuod ang ginapakita parte sa ila.'
    ],
    'mk.faq.app.q': [
        'Do farmers need a smartphone?',
        'Kailangan ba ng smartphone ng magsasaka?',
        'Kinahanglan bala sang mangunguma ang smartphone?'
    ],
    'mk.faq.app.a': [
        'No. Farmers get SMS and a printed slip. Only coordinators, buyers and drivers use the web app.',
        'Hindi. SMS at nakalimbag na resibo lang ang sa magsasaka. Ang coordinator, mamimili at driver lang ang gumagamit ng web app.',
        'Indi. SMS kag naimprinta nga resibo lang ang sa mangunguma. Ang coordinator, bumalakal kag driver lang ang nagagamit sang web app.'
    ],
    'mk.faq.price.q': ['Who sets the price?', 'Sino ang nagtatakda ng presyo?', 'Sin-o ang nagatakda sang presyo?'],
    'mk.faq.price.a': [
        'In the model, buyers commit to a price per kilo before the harvest. The prices in the prototype are simulated or assumed.',
        'Sa modelo, nangangako ang mamimili ng presyo kada kilo bago mag-ani. Simulated o tantiya lang ang presyo sa prototype.',
        'Sa modelo, nagasaad ang bumalakal sang presyo kada kilo antes mag-alani. Simulated ukon banta lang ang presyo sa prototype.'
    ],
    'mk.faq.privacy.q': ['What about privacy?', 'Paano ang privacy?', 'Paano ang privacy?'],
    'mk.faq.privacy.a': [
        'The prototype stores nothing about real people, only demo actions in your own browser. A pilot would collect personal data only with consent, as the Data Privacy Act of 2012 requires.',
        'Walang iniimbak ang prototype tungkol sa totoong tao, demo lang sa sarili mong browser. Sa pilot, may pahintulot muna bago kumuha ng personal na datos, ayon sa Data Privacy Act of 2012.',
        'Wala ginatipon ang prototype parte sa matuod nga tawo, demo lang sa imo browser. Sa pilot, may pahanugot anay antes magkuha sang personal nga datos, suno sa Data Privacy Act of 2012.'
    ],
    'mk.faq.lang.q': ['Which languages?', 'Anong mga wika?', 'Ano nga mga lingguahe?'],
    'mk.faq.lang.a': [
        'English, Tagalog and Hiligaynon. Tagalog and Hiligaynon are drafts awaiting review by native speakers.',
        'English, Tagalog at Hiligaynon. Draft pa ang Tagalog at Hiligaynon at kailangang suriin ng katutubong nagsasalita.',
        'English, Tagalog kag Hiligaynon. Draft pa ang Tagalog kag Hiligaynon kag kinahanglan usisaon sang taga-diri.'
    ],
    'mk.launch.eyebrow': ['Prototype', 'Prototype', 'Prototype'],
    'mk.launch.title': ['Open the Apps', 'Buksan ang mga App', 'Buksan ang mga App'],
    'mk.launch.sub': [
        "The four apps share one demo state in this browser. Place an order as a buyer, then watch it arrive on the coordinator's Home in another tab.",
        'Iisa ang demo state ng apat na app sa browser na ito. Umorder bilang mamimili, at panoorin itong lumabas sa Home ng coordinator sa ibang tab.',
        'Isa lang ang demo state sang apat ka app sa sini nga browser. Mag-order bilang bumalakal, kag tan-awa ini nga mag-abot sa Home sang coordinator sa iban nga tab.'
    ],
    'mk.launch.coordinator': [
        'Home, farms, plan, market, dryer, hauls and payments.',
        'Home, bukid, plano, merkado, patuyuan, hakot at bayad.',
        'Home, uma, plano, merkado, pamalahan, hakot kag bayad.'
    ],
    'mk.launch.buyer': [
        'Supply by barangay, orders, and trace to the farm.',
        'Suplay kada barangay, order, at pagsunod hanggang bukid.',
        'Suplay kada barangay, order, kag pagsunod tubtob uma.'
    ],
    'mk.launch.driver': [
        'Accept a haul job and mark pickup and delivery.',
        'Tanggapin ang hakot at markahan ang kuha at hatid.',
        'Batuna ang hakot kag markahi ang kuha kag hatod.'
    ],
    'mk.launch.farmer': [
        "The farmer's SMS: reply 1 OK or 2 Move.",
        'SMS ng magsasaka: sumagot ng 1 OK o 2 Ilipat.',
        'SMS sang mangunguma: sabat 1 OK ukon 2 Ibalhin.'
    ],
    'mk.launch.demo.h': ['The 78-Second Demo', 'Ang 78-Segundong Demo', 'Ang 78-Segundo nga Demo'],
    'mk.launch.demo.p': [
        'The guided sequence used for the video (arrows step, space pauses, R restarts).',
        'Ang gabay na pagkakasunod para sa video (arrow: hakbang, space: hinto, R: ulit).',
        'Ang giya nga pagkasunod para sa video (arrow: lakat, space: untat, R: liwat).'
    ],
    'mk.launch.demo.cta': ['Play Demo', 'I-play ang Demo', 'I-play ang Demo'],
    'mk.reset.h': ['Reset Demo Data', 'I-reset ang Demo Data', 'I-reset ang Demo Data'],
    'mk.reset.p': [
        'Clears orders, replies and statuses in this browser (every open tab). The seeded data never changes.',
        'Binubura ang order, sagot at katayuan sa browser na ito (lahat ng bukas na tab). Hindi nagbabago ang seeded na datos.',
        'Ginapanas ang order, sabat kag kahimtangan sa sini nga browser (tanan nga bukas nga tab). Indi nagabag-o ang seeded nga datos.'
    ],
    'mk.reset.cta': ['Reset Demo Data', 'I-reset ang Demo Data', 'I-reset ang Demo Data'],
    'mk.reset.done': ['Demo data reset.', 'Na-reset ang demo data.', 'Na-reset ang demo data.'],

    // language menu (M17)
    'lang.draftTag': ['Draft', 'Draft', 'Draft'],
    'lang.draftNote': [
        'Tagalog and Hiligaynon are drafts: they need review by native speakers.',
        'Draft ang Tagalog at Hiligaynon: kailangang suriin ng katutubong nagsasalita.',
        'Draft ang Tagalog kag Hiligaynon: kinahanglan pa usisaon sang taga-diri.'
    ],
    // landing (M18)
    'mk.login': ['Log In', 'Mag-log In', 'Mag-log In'],
    'mk.menu': ['Menu', 'Menu', 'Menu'],
    'mk.menu.close': ['Close', 'Isara', 'Isira'],
    'mk.hero.pill': [
        'Cluster selling for smallholder rice farmers',
        'Sama-samang pagbebenta para sa maliliit na magsasaka ng palay',
        'Tingob nga pagbaligya para sa gagmay nga mangunguma sang humay'
    ],
    'mk.badge.sms': [
        'Farmers Need Only SMS',
        'SMS Lang ang Kailangan ng Magsasaka',
        'SMS Lang ang Kinahanglan sang Mangunguma'
    ],
    'mk.badge.lang': [
        'English Â· Tagalog Â· Hiligaynon',
        'English Â· Tagalog Â· Hiligaynon',
        'English Â· Tagalog Â· Hiligaynon'
    ],
    'mk.badge.place': ['Dingle, Iloilo', 'Dingle, Iloilo', 'Dingle, Iloilo'],
    'mk.tracker.title': ['Harvest Tracker', 'Tracker ng Ani', 'Tracker sang Alani'],
    'mk.tracker.week': ['Cluster 1 Â· {w}', 'Cluster 1 Â· {w}', 'Cluster 1 Â· {w}'],
    'mk.tracker.matched': ['Buyer Matched', 'May Mamimili Na', 'May Bumalakal Na'],
    'mk.tracker.open': ['Open for Buyers', 'Bukas sa Mamimili', 'Bukas sa Bumalakal'],
    'mk.tracker.lotLine': ['Farm {farm} Â· {brgy}', 'Bukid {farm} Â· {brgy}', 'Uma {farm} Â· {brgy}'],
    'mk.tracker.foot': [
        "Simulated lots from the prototype's seeded data",
        'Simulated na lot mula sa seeded na datos ng prototype',
        'Simulated nga lot halin sa seeded nga datos sang prototype'
    ],
    'mk.tracker.cta': ['Open the Plan', 'Buksan ang Plano', 'Buksan ang Plano'],
    'mk.scroll': ['Scroll to Learn More', 'Mag-scroll para Malaman Pa', 'Mag-scroll para Mahibaluan Pa'],
    'mk.foot.prototype': ['Prototype', 'Prototype', 'Prototype'],
    'mk.foot.project': ['Project', 'Proyekto', 'Proyekto'],
    'mk.foot.contact': ['Contact', 'Kontak', 'Kontak'],
    'mk.foot.mode.h': ['Prototype Mode', 'Prototype Mode', 'Prototype Mode'],
    'mk.foot.mode.p': [
        'Every farm, farmer, price and date here is simulated. Demo actions stay in your own browser.',
        'Simulated ang bawat bukid, magsasaka, presyo at petsa dito. Nasa sarili mong browser lang ang mga demo action.',
        'Simulated ang kada uma, mangunguma, presyo kag petsa diri. Yara lang sa imo browser ang mga demo action.'
    ],
    'mk.foot.rights': [
        'Â© 2026 Team Syntaxure Labs Â· ISUFST',
        'Â© 2026 Team Syntaxure Labs Â· ISUFST',
        'Â© 2026 Team Syntaxure Labs Â· ISUFST'
    ],
    // simulated sign-in: one page per app, one demo identity each (M22)
    'login.eyebrow': ['Simulated Sign-In', 'Simulated na Pag-sign In', 'Simulated nga Pag-sign In'],
    'signin.cta': ['Sign In', 'Mag-sign In', 'Mag-sign In'],
    'signin.continue': ['Continue', 'Magpatuloy', 'Magpadayon'],
    'signin.out': ['Sign Out', 'Mag-sign Out', 'Mag-sign Out'],
    'signin.as': ['Signed In: {who}', 'Naka-sign In: {who}', 'Naka-sign In: {who}'],
    // sign in / sign up per app (M23)
    'role.farmer': ['Farmer F-014 (simulated)', 'Farmer F-014 (simulated)', 'Farmer F-014 (simulated)'],
    'nav.slip': ['Slip', 'Resibo', 'Resibo'],
    'auth.signin.h': ['Welcome Back', 'Maligayang Pagbabalik', 'Maayong Pagbalik'],
    'auth.signin.sub': ['Sign in to the {app} app.', 'Mag-sign in sa {app} app.', 'Mag-sign in sa {app} nga app.'],
    'auth.signup.h': ['Create Your {app} Account', 'Gumawa ng {app} Account', 'Maghimo sang {app} nga Account'],
    'auth.mock': [
        "Prototype: any valid details work, and you'll be signed in as the demo account {id}. Nothing you type is saved.",
        'Prototype: gagana ang anumang wastong detalye, at maka-sign in ka bilang demo account na {id}. Walang nase-save sa tina-type mo.',
        'Prototype: magagamit ang bisan ano nga husto nga detalye, kag maka-sign in ka bilang demo account nga {id}. Wala sang nasave sa imo ginta-type.'
    ],
    'auth.f.email': ['Email', 'Email', 'Email'],
    'auth.f.mobile': ['Mobile Number', 'Numero ng Mobile', 'Numero sang Mobile'],
    'auth.f.password': ['Password', 'Password', 'Password'],
    'auth.f.name': ['Full Name', 'Buong Pangalan', 'Bilog nga Ngalan'],
    'auth.f.business': ['Business Name', 'Pangalan ng Negosyo', 'Ngalan sang Negosyo'],
    'auth.f.buyerType': ['Buyer Type', 'Uri ng Mamimili', 'Klase sang Bumalakal'],
    'auth.f.vehicle': ['Vehicle', 'Sasakyan', 'Salakyan'],
    'auth.f.barangay': ['Barangay', 'Barangay', 'Barangay'],
    'auth.select': ['Chooseâ€¦', 'Pumiliâ€¦', 'Magpiliâ€¦'],
    'auth.mobile.hint': [
        '11 digits, starting with 09.',
        '11 digit, nagsisimula sa 09.',
        '11 ka digit, nagasugod sa 09.'
    ],
    'auth.pw.hint': ['At least 8 characters.', 'Hindi bababa sa 8 character.', 'Indi magnubo sa 8 ka character.'],
    'auth.pw.show': ['Show', 'Ipakita', 'Ipakita'],
    'auth.pw.hide': ['Hide', 'Itago', 'Tagoa'],
    'auth.consent': [
        'I agree that RiceConnect may use these details to run my account, under the Data Privacy Act of 2012 (RA 10173).',
        'Pumapayag ako na gamitin ng RiceConnect ang mga detalyeng ito para sa aking account, ayon sa Data Privacy Act of 2012 (RA 10173).',
        'Nagauyon ako nga gamiton sang RiceConnect ini nga mga detalye para sa akon account, suno sa Data Privacy Act of 2012 (RA 10173).'
    ],
    'auth.cta.signup': ['Create Account', 'Gumawa ng Account', 'Maghimo sang Account'],
    'auth.busy.signin': ['Signing Inâ€¦', 'Nagsa-sign Inâ€¦', 'Ginasign Inâ€¦'],
    'auth.busy.signup': ['Creating Accountâ€¦', 'Ginagawa ang Accountâ€¦', 'Ginahimo ang Accountâ€¦'],
    'auth.new.q': ['New to RiceConnect?', 'Bago sa RiceConnect?', 'Bag-o sa RiceConnect?'],
    'auth.have.q': ['Already have an account?', 'May account ka na?', 'May account ka na?'],
    'auth.admin.invite': [
        'Admin accounts are created by RiceConnect.',
        'Ang RiceConnect ang gumagawa ng admin account.',
        'Ang RiceConnect ang nagahimo sang admin account.'
    ],
    'auth.panel.coordinator': [
        'Run Cluster 1 from one place.',
        'Patakbuhin ang Cluster 1 sa iisang lugar.',
        'Dalagan ang Cluster 1 sa isa lang ka lugar.'
    ],
    'auth.panel.buyer': [
        'Buy palay and rice straight from the cluster.',
        'Bumili ng palay at bigas direkta sa cluster.',
        'Magbakal sang palay kag bugas direkta sa cluster.'
    ],
    'auth.panel.driver': [
        'Your haul jobs, pickup to delivery.',
        'Ang iyong mga hakot, mula kuha hanggang hatid.',
        'Ang imo mga hakot, halin kuha tubtob hatod.'
    ],
    'auth.panel.farmer': [
        'Your SMS and settlement slip in one place.',
        'Ang iyong SMS at resibo sa iisang lugar.',
        'Ang imo SMS kag resibo sa isa lang ka lugar.'
    ],
    'auth.panel.admin': ['Every app at a glance.', 'Lahat ng app sa isang tingin.', 'Tanan nga app sa isa ka tan-aw.'],
    'auth.panel.lang': [
        'English, Tagalog and Hiligaynon',
        'English, Tagalog at Hiligaynon',
        'English, Tagalog kag Hiligaynon'
    ],
    'auth.panel.sim': [
        'Simulated data: no real farmers, prices or payments',
        'Simulated na data: walang totoong magsasaka, presyo o bayad',
        'Simulated nga data: wala sang matuod nga mangunguma, presyo ukon bayad'
    ],
    'auth.err.required': ['This field is required.', 'Kailangan ito.', 'Kinahanglan ini.'],
    'auth.err.email.required': ['Enter your email.', 'Ilagay ang iyong email.', 'Isulat ang imo email.'],
    'auth.err.email.invalid': [
        'Enter a valid email, like name@example.com.',
        'Maglagay ng tamang email, gaya ng name@example.com.',
        'Magbutang sang husto nga email, pareho sang name@example.com.'
    ],
    'auth.err.mobile.required': [
        'Enter your mobile number.',
        'Ilagay ang iyong numero ng mobile.',
        'Isulat ang imo numero sang mobile.'
    ],
    'auth.err.mobile.invalid': [
        'Enter an 11-digit mobile number that starts with 09.',
        'Maglagay ng 11-digit na numero na nagsisimula sa 09.',
        'Magbutang sang 11-digit nga numero nga nagasugod sa 09.'
    ],
    'auth.err.password.required': ['Enter your password.', 'Ilagay ang iyong password.', 'Isulat ang imo password.'],
    'auth.err.password.short': [
        'Use at least 8 characters.',
        'Gumamit ng hindi bababa sa 8 character.',
        'Gamita ang indi magnubo sa 8 ka character.'
    ],
    'auth.err.consent': [
        'Please agree to continue.',
        'Pumayag muna para magpatuloy.',
        'Mag-uyon anay para makapadayon.'
    ],
    'auth.err.invalid_credentials': [
        "Those details don't match an account. Check them and try again.",
        'Hindi tugma ang mga detalye sa isang account. Suriin at subukan muli.',
        'Indi match ang mga detalye sa isa ka account. Usisaa kag tilawi liwat.'
    ],
    'auth.err.account_exists': [
        'An account with these details already exists. Sign in instead.',
        'May account na sa mga detalyeng ito. Mag-sign in na lang.',
        'May account na sa sini nga mga detalye. Mag-sign in na lang.'
    ],
    'auth.err.network': [
        "Can't reach RiceConnect. Check your connection and try again.",
        'Hindi maabot ang RiceConnect. Suriin ang koneksyon at subukan muli.',
        'Indi maabot ang RiceConnect. Usisaa ang koneksyon kag tilawi liwat.'
    ],
    'auth.err.unknown': [
        'Something went wrong. Please try again.',
        'May nangyaring mali. Pakisubukan muli.',
        'May sala nga natabo. Palihog tilawi liwat.'
    ],
    'login.admin.h': ['Super Admin', 'Super Admin', 'Super Admin'],
    'login.admin.p': [
        'Overview of every app, users and roles, settings and assumptions, activity log.',
        'Buod ng lahat ng app, mga user at papel, settings at mga tantiya, talaan ng aktibidad.',
        'Sumaryo sang tanan nga app, mga user kag papel, settings kag mga banta, listahan sang aktibidad.'
    ],
    'login.note': [
        'Real accounts come after the pilot, with consent, under the Data Privacy Act of 2012 (RA 10173).',
        'Ang totoong account ay pagkatapos ng pilot, may pahintulot, ayon sa Data Privacy Act of 2012 (RA 10173).',
        'Ang matuod nga account pagkatapos sang pilot, may pahanugot, suno sa Data Privacy Act of 2012 (RA 10173).'
    ],
    // super admin (M20)
    'role.admin': ['Super Admin (simulated)', 'Super Admin (simulated)', 'Super Admin (simulated)'],
    'role.name.admin': ['Super Admin', 'Super Admin', 'Super Admin'],
    'nav.overview': ['Overview', 'Buod', 'Sumaryo'],
    'nav.users': ['Users', 'Mga User', 'Mga User'],
    'nav.config': ['Settings', 'Settings', 'Settings'],
    'nav.activity': ['Activity', 'Aktibidad', 'Aktibidad'],
    'admin.eyebrow': ['Super Admin Â· All Apps', 'Super Admin Â· Lahat ng App', 'Super Admin Â· Tanan nga App'],
    'admin.overview.title': ['Overview', 'Buod', 'Sumaryo'],
    'admin.stat.farms': ['Farms', 'Bukid', 'Uma'],
    'admin.stat.farms.sub': ['{n} in Cluster 1', '{n} sa Cluster 1', '{n} sa Cluster 1'],
    'admin.stat.buyers': ['Buyers', 'Mamimili', 'Bumalakal'],
    'admin.stat.buyers.sub': ['With commitments', 'May pangako', 'May saad'],
    'admin.stat.drivers': ['Drivers', 'Driver', 'Driver'],
    'admin.stat.drivers.sub': ['{n} vehicles', '{n} sasakyan', '{n} salakyan'],
    'admin.stat.lots': ['Lots', 'Lot', 'Lot'],
    'admin.stat.lots.sub': ['{n} matched to a buyer', '{n} may mamimili na', '{n} may bumalakal na'],
    'admin.apps.h': ['Apps', 'Mga App', 'Mga App'],
    'admin.apps.main': ['Public site and coordinator', 'Public site at coordinator', 'Public site kag coordinator'],
    'admin.apps.buyer': ['Supply, orders, trace', 'Suplay, order, pagsunod', 'Suplay, order, pagsunod'],
    'admin.apps.driver': ['Haul jobs', 'Mga hakot', 'Mga hakot'],
    'admin.apps.farmer': ['SMS and slip', 'SMS at resibo', 'SMS kag resibo'],
    'admin.apps.open': ['Open', 'Buksan', 'Buksan'],
    'admin.live.h': [
        'Live Demo Activity (This Browser)',
        'Live na Aktibidad sa Demo (Browser na Ito)',
        'Live nga Aktibidad sa Demo (Sini nga Browser)'
    ],
    'admin.live.orders': ['Buyer orders', 'Order ng mamimili', 'Order sang bumalakal'],
    'admin.live.commitments': ['New commitments', 'Bagong pangako', 'Bag-o nga saad'],
    'admin.live.replies': ['Farmer replies', 'Sagot ng magsasaka', 'Sabat sang mangunguma'],
    'admin.live.added': ['Farms added to cluster', 'Bukid na naidagdag', 'Uma nga nadugang'],
    'admin.users.title': ['Users and Roles', 'Mga User at Papel', 'Mga User kag Papel'],
    'admin.users.search': [
        'Search by code or barangay',
        'Hanapin ayon sa code o barangay',
        'Pangitaa suno sa code ukon barangay'
    ],
    'admin.users.role': ['Role', 'Papel', 'Papel'],
    'admin.users.all': ['All Roles', 'Lahat ng Papel', 'Tanan nga Papel'],
    'admin.users.code': ['Code', 'Code', 'Code'],
    'admin.users.contact': ['Contact', 'Kontak', 'Kontak'],
    'admin.users.where': ['Where', 'Saan', 'Diin'],
    'admin.users.detail': ['Detail', 'Detalye', 'Detalye'],
    'admin.users.caption': [
        'Users and roles (simulated)',
        'Mga user at papel (simulated)',
        'Mga user kag papel (simulated)'
    ],
    'admin.users.none': ['No user matches.', 'Walang tumugmang user.', 'Wala sang nagtupong nga user.'],
    'admin.users.note': [
        'Simulated directory built from the seed: codes only, mobiles masked. No logins exist; role changes are simulated and kept in this browser.',
        'Simulated na directory mula sa seed: code lang, nakatago ang mobile. Walang login; simulated ang pagpapalit ng papel at sa browser na ito lang nakatala.',
        'Simulated nga directory halin sa seed: code lang, natago ang mobile. Wala sang login; simulated ang pag-ilis sang papel kag sa sini nga browser lang natago.'
    ],
    'admin.users.actions': ['Actions', 'Mga Aksyon', 'Mga Aksyon'],
    'admin.change.role': ['Change Role', 'Palitan ang Papel', 'Ilisan ang Papel'],
    'admin.change.roleTitle': ['Change role for {code}', 'Palitan ang papel ni {code}', 'Ilisan ang papel ni {code}'],
    'admin.change.roleBody': [
        'The directory is simulated and has no logins: the change is kept in this browser and shows up in the Activity Log.',
        'Simulated ang directory at walang login: sa browser na ito lang nakatala ang pagbabago at makikita ito sa Talaan ng Aktibidad.',
        'Simulated ang directory kag wala sang login: sa sini nga browser lang natago ang pagbag-o kag makita ini sa Listahan sang Aktibidad.'
    ],
    'admin.change.newRole': ['New role', 'Bagong papel', 'Bag-o nga papel'],
    'admin.change.roleToast': [
        '{code} is now {role} (simulated).',
        'Si {code} ay {role} na (simulated).',
        'Si {code} {role} na (simulated).'
    ],
    'admin.changed': ['Changed in this browser', 'Binago sa browser na ito', 'Ginbag-o sa sini nga browser'],
    'admin.was': ['was {value}', 'dating {value}', 'dati {value}'],
    'admin.change.settingTitle': ['Change {setting}', 'Palitan ang {setting}', 'Ilisan ang {setting}'],
    'admin.change.settingBody': [
        'Current value: {value}. The change is simulated and kept in this browser only; screens keep using the built-in value until the backend (Phase 3).',
        'Kasalukuyang halaga: {value}. Simulated ang pagbabago at sa browser na ito lang nakatala; ginagamit pa rin ng mga screen ang built-in na halaga hanggang sa backend (Phase 3).',
        'Karon nga kantidad: {value}. Simulated ang pagbag-o kag sa sini nga browser lang natago; ginagamit gihapon sang mga screen ang built-in nga kantidad asta sa backend (Phase 3).'
    ],
    'admin.change.newValue': ['New value', 'Bagong halaga', 'Bag-o nga kantidad'],
    'admin.change.invalid': [
        'Enter a value greater than zero.',
        'Maglagay ng halagang higit sa zero.',
        'Magbutang sang kantidad nga labaw sa sero.'
    ],
    'admin.change.word': ['CHANGE', 'CHANGE', 'CHANGE'],
    'admin.change.action': ['Change', 'Palitan', 'Ilisan'],
    'admin.change.save': ['Save Change', 'I-save ang Pagbabago', 'I-save ang Pagbag-o'],
    'admin.change.settingToast': [
        '{setting} is now {value} (simulated).',
        'Ang {setting} ay {value} na (simulated).',
        'Ang {setting} {value} na (simulated).'
    ],
    'admin.change.failed': [
        'The change was not saved. Try again.',
        'Hindi na-save ang pagbabago. Subukan muli.',
        'Wala na-save ang pagbag-o. Tilawan liwat.'
    ],
    'admin.role.coordinator': ['Coordinator', 'Coordinator', 'Coordinator'],
    'admin.role.farmer': ['Farmer', 'Magsasaka', 'Mangunguma'],
    'admin.role.buyer': ['Buyer', 'Mamimili', 'Bumalakal'],
    'admin.role.driver': ['Driver', 'Driver', 'Driver'],
    'admin.settings.title': ['Settings and Assumptions', 'Settings at mga Tantiya', 'Settings kag mga Banta'],
    'admin.settings.note': [
        'Values come from packages/domain/src/overrides.json; those marked Assumed are listed in docs/NUMBERS.md. A change here is simulated and kept in this browser only.',
        'Galing ang mga halaga sa overrides.json; nakalista sa docs/NUMBERS.md ang may markang Tantiya. Simulated ang pagbabago dito at sa browser na ito lang nakatala.',
        'Halin ang mga kantidad sa overrides.json; nakalista sa docs/NUMBERS.md ang may marka nga Banta. Simulated ang pagbag-o diri kag sa sini nga browser lang natago.'
    ],
    'admin.settings.setting': ['Setting', 'Setting', 'Setting'],
    'admin.settings.value': ['Value', 'Halaga', 'Kantidad'],
    'admin.settings.source': ['Source', 'Pinagmulan', 'Ginhalinan'],
    'admin.settings.caption': [
        'Cluster settings and assumptions',
        'Settings ng cluster at mga tantiya',
        'Settings sang cluster kag mga banta'
    ],
    'admin.set.kgPerSack': ['Kilograms per sack', 'Kilo kada sako', 'Kilo kada sako'],
    'admin.set.dryer': [
        'Dryer capacity per day',
        'Kapasidad ng patuyuan kada araw',
        'Kapasidad sang pamalahan kada adlaw'
    ],
    'admin.set.grade': ['Forecast grade', 'Grado sa tantiya', 'Grado sa banta'],
    'admin.set.mc': ['Forecast moisture', 'Moisture sa tantiya', 'Moisture sa banta'],
    'admin.set.smsLead': ['SMS sent before harvest', 'SMS bago mag-ani', 'SMS antes mag-alani'],
    'admin.set.buyerPays': [
        'Buyer pays after',
        'Nagbabayad ang mamimili pagkalipas ng',
        'Nagabayad ang bumalakal pagligad sang'
    ],
    'admin.set.milling': ['Milling recovery', 'Milling recovery', 'Milling recovery'],
    'admin.set.ricePrice': ['Milled-rice price', 'Presyo ng bigas', 'Presyo sang bugas'],
    'admin.set.today': ['Demo "today"', '"Ngayon" sa demo', '"Subong" sa demo'],
    'admin.set.advance': ['Advance to farmer', 'Paunang bayad sa magsasaka', 'Abanse sa mangunguma'],
    'admin.driver.available': ['Available', 'Available', 'Available'],
    'admin.driver.unavailable': ['Unavailable', 'Hindi Available', 'Indi Available'],
    'admin.src.brief': ['From the Brief', 'Mula sa Brief', 'Halin sa Brief'],
    'admin.days': ['{n} days', '{n} araw', '{n} ka adlaw'],
    'admin.activity.title': ['Activity Log', 'Talaan ng Aktibidad', 'Listahan sang Aktibidad'],
    'admin.activity.none': [
        'No demo activity yet in this browser.',
        'Wala pang aktibidad sa demo sa browser na ito.',
        'Wala pa sang aktibidad sa demo sa sini nga browser.'
    ],
    'admin.activity.noneBody': [
        'Place a buyer order, reply to the farmer SMS or move a haul, and it shows up here.',
        'Umorder bilang mamimili, sumagot sa SMS ng magsasaka o galawin ang hakot, at lalabas ito dito.',
        'Mag-order bilang bumalakal, sabat sa SMS sang mangunguma ukon hulagon ang hakot, kag makita ini diri.'
    ],
    'admin.activity.order': [
        'Buyer order {id}: {sacks} sacks, {total}',
        'Order {id}: {sacks} sako, {total}',
        'Order {id}: {sacks} ka sako, {total}'
    ],
    'admin.activity.commitment': ['Commitment {id}: {t} t', 'Pangako {id}: {t} t', 'Saad {id}: {t} t'],
    'admin.activity.reply': [
        'Farmer {farm} replied "{text}"',
        'Sumagot si {farm} ng "{text}"',
        'Nagsabat si {farm} sang "{text}"'
    ],
    'admin.activity.haul': ['Haul {id} is now {status}', 'Ang hakot {id} ay {status} na', 'Ang hakot {id} {status} na'],
    'admin.activity.slot': ['Dryer slot {id}: {status}', 'Slot {id}: {status}', 'Slot {id}: {status}'],
    'admin.activity.added': [
        'Farm {id} added to Cluster 1',
        'Naidagdag ang bukid {id} sa Cluster 1',
        'Nadugang ang uma {id} sa Cluster 1'
    ],
    'admin.activity.role': [
        'Role of {code} changed to {role} (simulated)',
        'Ang papel ni {code} ay pinalitan ng {role} (simulated)',
        'Ang papel ni {code} gin-ilis sa {role} (simulated)'
    ],
    'admin.activity.setting': [
        'Assumption {setting} changed to {value} (simulated)',
        'Ang tantiya na {setting} ay pinalitan ng {value} (simulated)',
        'Ang banta nga {setting} gin-ilis sa {value} (simulated)'
    ],
    'admin.reset.title': ['Reset demo data?', 'I-reset ang demo data?', 'I-reset ang demo data?'],
    'admin.reset.body': [
        'Clears every change made in this browser: orders, replies, hauls, slots, added farms, and role or assumption changes. The seed never changes. This cannot be undone.',
        'Binubura ang lahat ng pagbabago sa browser na ito: mga order, sagot, hakot, slot, naidagdag na bukid, at mga pagbabago sa papel o tantiya. Hindi nagbabago ang seed. Hindi na ito maibabalik.',
        'Ginapanas ang tanan nga pagbag-o sa sini nga browser: mga order, sabat, hakot, slot, nadugang nga uma, kag mga pagbag-o sa papel ukon banta. Indi nagabag-o ang seed. Indi na ini maibalik.'
    ],
    'admin.reset.count': [
        '{n} changes in this browser will be cleared.',
        '{n} pagbabago sa browser na ito ang buburahin.',
        '{n} ka pagbag-o sa sini nga browser ang pagapanason.'
    ],
    'admin.reset.word': ['RESET', 'RESET', 'RESET'],
    'admin.activity.note': [
        'Derived from the current demo state in this browser, not an append-only audit trail: an Undo or a Reset removes the entry. The real per-entity audit log ships with the backend (Phase 3, B-06).',
        'Galing sa kasalukuyang demo state sa browser na ito, hindi ito isang append-only na audit trail: tinatanggal ng Undo o Reset ang entry. Darating ang tunay na audit log kasama ng backend (Phase 3, B-06).',
        'Halin sa karon nga demo state sa sini nga browser, indi ini isa ka append-only nga audit trail: ginakuha sang Undo ukon Reset ang entry. Magaabot ang matuod nga audit log upod sa backend (Phase 3, B-06).'
    ],
    // ANNI, the Farm Assistant (out of plan; docs/DECISIONS.md M42; TL/HIL drafts: needs native review)
    'anni.launch': [
        'Ask ANNI, the Farm Assistant',
        'Tanungin si ANNI, ang Farm Assistant',
        'Pamangkuta si ANNI, ang Farm Assistant'
    ],
    'anni.title': ['ANNI', 'ANNI', 'ANNI'],
    'anni.sub': ['Farm Assistant', 'Katulong sa Bukid', 'Katabang sa Uma'],
    'anni.greeting': [
        'Hi! I am ANNI. Ask me about harvests, drying, hauling or selling. I can explain a screen, but please check important details.',
        'Kumusta! Ako si ANNI. Magtanong tungkol sa ani, pagpapatuyo, paghakot o pagbebenta. Maaari kong ipaliwanag ang isang screen, ngunit suriin ang mahahalagang detalye.',
        'Kamusta! Ako si ANNI. Pamangkot parte sa ani, pagpamala, paghakot ukon pagbaligya. Mahimo ko ipaliwanag ang isa ka screen, pero usisaon ang importante nga detalye.'
    ],
    'anni.inputLabel': ['Message ANNI', 'Mensahe kay ANNI', 'Mensahe kay ANNI'],
    'anni.placeholder': ['Ask about your farmâ€¦', 'Magtanong tungkol sa bukidâ€¦', 'Pamangkot parte sa umaâ€¦'],
    'anni.send': ['Send', 'Ipadala', 'Ipadala'],
    'anni.thinking': ['ANNI is thinkingâ€¦', 'Nag-iisip si ANNIâ€¦', 'Nagapamalandong si ANNIâ€¦'],
    'anni.error': [
        'ANNI could not answer. Check your connection and try again.',
        'Hindi makasagot si ANNI. Suriin ang koneksyon at subukan muli.',
        'Indi makasabat si ANNI. Usisaon ang koneksyon kag tilawan liwat.'
    ],
    'anni.notConfigured': ['ANNI is not switched on yet.', 'Hindi pa naka-on si ANNI.', 'Wala pa naka-on si ANNI.'],
    'anni.disclaimer': [
        'ANNI can make mistakes. Check important details.',
        'Maaaring magkamali si ANNI. Suriin ang mahahalagang detalye.',
        'Mahimo magsayop si ANNI. Usisaon ang importante nga detalye.'
    ],
    // Live sign-in note (B-04; the mock note above only shows in demo mode)
    'auth.live': [
        'Sign in with your RiceConnect account. Accounts are issued by the RiceConnect team.',
        'Mag-sign in gamit ang iyong RiceConnect account. Ang mga account ay ibinibigay ng RiceConnect team.',
        'Mag-sign in gamit ang imo RiceConnect account. Ang mga account ginahatag sang RiceConnect team.'
    ],
    'anni.order.title': ['Place this order?', 'Ilagay ang order na ito?', 'Ibutang ini nga order?'],
    'anni.order.body': [
        '{sacks} sacks of {type} for {week}. Total {total}.',
        '{sacks} sako ng {type} para sa {week}. Kabuuan {total}.',
        '{sacks} ka sako sang {type} para sa {week}. Kabuuan {total}.'
    ],
    'anni.order.confirm': ['Place Order', 'Ilagay ang Order', 'Ibutang ang Order'],
    'anni.order.done': [
        'Order {id} placed ({total}).',
        'Naipasok ang order {id} ({total}).',
        'Nasulod ang order {id} ({total}).'
    ],
    'anni.paid.title': [
        'Mark this settlement paid?',
        'Markahan na bayad ang settlement?',
        'Markahan nga bayad ang settlement?'
    ],
    'anni.paid.body': [
        'Lot {lot}: the balance is released to the farmer. This cannot be undone.',
        'Lot {lot}: ilalabas na ang natitirang bayad sa magsasaka. Hindi na ito maibabalik.',
        'Lot {lot}: igwa na ang nabilin nga bayad sa mangunguma. Indi na ini maibalik.'
    ],
    'anni.paid.confirm': ['Mark Paid', 'Markahan na Bayad', 'Markahan nga Bayad'],
    'anni.paid.done': [
        'Settlement {lot} marked paid.',
        'Na-markahan na bayad ang settlement {lot}.',
        'Na-markahan nga bayad ang settlement {lot}.'
    ],
    'anni.action.failed': [
        'The action did not complete. Try again from the screen.',
        'Hindi natapos ang aksyon. Subukan muli mula sa screen.',
        'Wala natapos ang aksyon. Tilawan liwat halin sa screen.'
    ]
};

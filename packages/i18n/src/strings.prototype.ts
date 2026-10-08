/* STRINGS added for the prototype screens. [EN, TL, HIL].
   EN is complete. TL and HIL are DRAFTS. Draft: needs native review before any farmer, driver or judge reads them
   as final. Title Case for labels (CSS uppercases), sentence case for sentences.

   [[...]] marks the accent phrase in a display heading. marketing.tsx renders the marked words in the
   display voice (see .rc-accent in app.css) and strips the brackets, so the reader never sees them. Keep
   the mark to one to four words, keep punctuation outside it, and mark a phrase only when it carries the
   argument. All three locales carry the mark: TL and HIL mirror the English accent phrase so every reader
   gets the same emphasis, and a native reviewer should confirm that each mark lands on the words that
   carry the argument when the drafts are reviewed. */
export const PROTOTYPE_STRINGS: Record<string, [string, string, string]> = {
    // chrome
    'theme.dark': ['Dark', 'Madilim', 'Madulom'],
    'theme.light': ['Light', 'Maliwanag', 'Masanag'],
    'role.coordinator': ['Coordinator · Cluster 1', 'Coordinator · Cluster 1', 'Coordinator · Cluster 1'],
    'role.buyer': ['Buyer (simulated)', 'Mamimili (simulated)', 'Bumalakal (simulated)'],
    'role.driver': ['Driver (simulated)', 'Driver (simulated)', 'Driver (simulated)'],
    'unit.sacks': ['sacks', 'sako', 'sako'],
    'unit.t': ['t', 't', 't'],
    'unit.kg': ['kg', 'kg', 'kg'],
    'unit.ha': ['ha', 'ha', 'ha'],
    'unit.farms': ['farms', 'bukid', 'uma'],
    'unit.km': ['km', 'km', 'km'],
    'unit.perKg': ['/kg', '/kg', '/kg'],
    'unit.pesoPerKg': ['₱/kg', '₱/kg', '₱/kg'],
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
        '{filled} of {tonnes} t filled · {pct}%',
        '{filled} sa {tonnes} t napunan · {pct}%',
        '{filled} sa {tonnes} t napuno · {pct}%'
    ],
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
    // plan
    'plan.eyebrow': [
        'Cluster 1 · {barangays} · W1-W4 from {start}',
        'Cluster 1 · {barangays} · W1-W4 mula {start}',
        'Cluster 1 · {barangays} · W1-W4 halin {start}'
    ],
    'plan.note.farms': [
        '{b} barangays · {split} farms',
        '{b} barangay · {split} bukid',
        '{b} ka barangay · {split} ka uma'
    ],
    'plan.note.area': ['Average {avg} ha per farm', 'Karaniwang {avg} ha bawat bukid', 'Average {avg} ha kada uma'],
    'plan.note.tonnes': [
        'Dried. Wet {wet} t at {yield} kg/ha, {loss}% loss, x{factor}',
        'Tuyo. Basa {wet} t sa {yield} kg/ha, {loss}% lugi, x{factor}',
        'Uga. Basa {wet} t sa {yield} kg/ha, {loss}% kapierdi, x{factor}'
    ],
    'plan.note.peak': [
        '{t} t dried · book dryer slots early',
        '{t} t tuyo · mag-book ng patuyuan nang maaga',
        '{t} t uga · mag-book sang pamalahan sing temprano'
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
    // farmer plan (S-15): my harvest, the same cluster calendar, and repeat delivery
    'plan.eyebrow.farmer': [
        '{farm} · {barangay} · {week} · {date}',
        '{farm} · {barangay} · {week} · {date}',
        '{farm} · {barangay} · {week} · {date}'
    ],
    'plan.mine': ['My Harvest', 'Aking Ani', 'Akon nga Alani'],
    'plan.delivery': ['Delivery', 'Paghatod', 'Paghatod'],
    'plan.delivery.help': [
        'The pickup is confirmed by SMS. Book another trip when the cluster needs a second run.',
        'Kinukumpirma ang kuha sa SMS. Mag-book ng isa pang biyahe kapag kailangan ng pangalawang takbo.',
        'Ginkumpirma ang kuha sa SMS. Mag-book sang isa pa nga biyahe kon kinahanglan sang ikadha nga dagan.'
    ],
    'plan.book': ['Book Repeat Delivery', 'Mag-book ng Paulit na Paghatod', 'Mag-book sang Ining Paghatod'],
    'plan.book.title': ['Book a repeat delivery?', 'I-book ang paulit na paghatod?', 'I-book ang ining paghatod?'],
    'plan.book.desc': [
        'A second pickup of {sacks} sacks from {farm} to {via} on the same route.',
        'Pangalawang kuha ng {sacks} sako mula {farm} tungo sa {via} sa parehong ruta.',
        'Ikaduha nga kuha sang {sacks} sako halin {farm} paagi sa {via} sa amo nga ruta.'
    ],
    'plan.booked': ['Repeat Delivery Booked', 'Nai-book ang Paulit na Paghatod', 'Na-book ang Ining Paghatod'],
    'plan.booked.note': [
        'Second trip · {sacks} sacks · {via}',
        'Ikalawang biyahe · {sacks} sako · {via}',
        'Ikaduha nga biyahe · {sacks} sako · {via}'
    ],
    'plan.book.cancel': ['Cancel Booking', 'Kanselahin ang Booking', 'Kanselahon ang Booking'],
    'plan.book.cancelled': ['Booking cancelled', 'Nakansela ang booking', 'Nakansela ang booking'],
    // central milling (S-16): the farmer's dryer slot and what the assumed milling gives back
    'nav.milling': ['Milling', 'Paggiling', 'Pagkagiling'],
    'milling.title': ['Central Milling', 'Central na Paggiling', 'Sentral nga Pagkagiling'],
    'milling.eyebrow': ['Lot {lot} · {dryer}', 'Lot {lot} · {dryer}', 'Lot {lot} · {dryer}'],
    'milling.drying': ['Drying', 'Pagpapatuyo', 'Pagpamala'],
    'milling.time': ['Time', 'Oras', 'Oras'],
    'milling.dryer': ['Dryer', 'Patuyuan', 'Pamalahan'],
    'milling.section': ['From Dried Palay', 'Mula sa Tuyong Palay', 'Halin sa Uga nga Palay'],
    'milling.milled': ['Milled Rice', 'Gilingang Bigas', 'Giling nga Bugas'],
    'milling.recovery.note': ['{pct}% recovery (assumed)', '{pct}% recovery (tantiya)', '{pct}% recovery (banta)'],
    'milling.rice.sacks': ['Rice Sacks', 'Mga Sako ng Bigas', 'Mga Sako nga Bugas'],
    'milling.sack.note': ['{kg} kg per sack (assumed)', '{kg} kg bawat sako (tantiya)', '{kg} kg kada sako (banta)'],
    'milling.assumed': [
        'Recovery {pct}%, {kg} kg sacks and the partner miller are assumed (docs/NUMBERS.md).',
        'Ang recovery na {pct}%, {kg} kg na sako at ang partner miller ay tantiya (docs/NUMBERS.md).',
        'Ang recovery nga {pct}%, {kg} nga sako kag ang partner miller ay banta (docs/NUMBERS.md).'
    ],
    'milling.partner': [
        'Milled by {miller} after drying.',
        'Gigilingan ng {miller} pagkatapos matuyo.',
        'Giligingan sang {miller} pagkatapos ugaon.'
    ],
    'milling.confirm': ['Confirm Slot', 'Kumpirmahin ang Slot', 'Kumpirmaha ang Slot'],
    'milling.move': ['Request Another Time', 'Humingi ng Ibang Oras', 'Pangayo sang Ibang Oras'],
    'milling.empty.title': ['No Dryer Slot Yet', 'Wala Pang Slot sa Patuyuan', 'Wala Pa sang Slot sa Pamalahan'],
    'milling.empty.body': [
        'The coordinator assigns a slot when the harvest date is set.',
        'Nagbibigay ng slot ang coordinator kapag nakatakda na ang petsa ng ani.',
        'Nagahatag sang slot ang coordinator kon natig-ad na ang petsa sang alani.'
    ],
    // contract price and variety (S-17)
    'nav.price': ['Price', 'Presyo', 'Presyo'],
    'price.title': ['Contract Price & Variety', 'Presyo ng Kontrata at Variety', 'Presyo sang Kontrata kag Variety'],
    'price.eyebrow': ['Lot {lot} · {id}', 'Lot {lot} · {id}', 'Lot {lot} · {id}'],
    'price.contract': ['Your Contract', 'Ang Iyong Kontrata', 'Ang Imo nga Kontrata'],
    'price.variety': ['Rice Variety', 'Variety ng Bigas', 'Variety nga Bugas'],
    'price.variety.label': ['Variety', 'Variety', 'Variety'],
    'price.mc': ['Moisture Content', 'Konten ng Moisture', 'Kontenido sang Moisture'],
    'price.week': ['Delivery Week', 'Linggo ng Hatid', 'Semana sang Hatid'],
    'price.rate': ['Price per Kilo', 'Presyo bawat Kilo', 'Presyo kada Kilo'],
    'price.empty.title': ['No Contract Yet', 'Wala Pang Kontrata', 'Wala Pa sang Kontrata'],
    'price.empty.body': [
        'Your lot is matched to a buyer when the coordinator posts the contract.',
        'Natutugma ang iyong lot sa mamimili kapag inilathala ng coordinator ang kontrata.',
        'Natig-ad ang imo lot sa mamalitay kon igapost sang coordinator ang kontrata.'
    ],
    // driver jobs (S-18)
    'nav.jobs': ['Jobs', 'Mga Trabaho', 'Mga Buhat'],
    'haul.driver.jobs': ['Your Jobs', 'Ang Iyong mga Trabaho', 'Ang Imo nga mga Obra'],
    'haul.open': ['Open Job', 'Buksan ang Trabaho', 'Buksan ang Buhat'],
    // market
    'market.eyebrow': [
        'Buyers post standing orders · the cluster fills them',
        'Nagpo-post ng order ang mamimili · pinupunan ng cluster',
        'Nagapost sang order ang bumalakal · ginapun-an sang cluster'
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
        'Dried · {grade} · {mc} · {week}',
        'Tuyo · {grade} · {mc} · {week}',
        'Uga · {grade} · {mc} · {week}'
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
    'dry.eyebrow': ['{dryer} · {place}', '{dryer} · {place}', '{dryer} · {place}'],
    'dry.note.capacity': ['{t} t per day (assumed)', '{t} t bawat araw (tantiya)', '{t} t kada adlaw (banta)'],
    'dry.note.booked': [
        '{pct}% of {cap} this week',
        '{pct}% ng {cap} ngayong linggo',
        '{pct}% sang {cap} subong nga semana'
    ],
    'dry.hero.label': ['Lot {lot} Slot', 'Slot ng Lot {lot}', 'Slot sang Lot {lot}'],
    'dry.hero.note': [
        '{day} · {kg} kg · {sacks} sacks',
        '{day} · {kg} kg · {sacks} sako',
        '{day} · {kg} kg · {sacks} ka sako'
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
    'haul.drivers.hint': [
        'Nearest first. The driver assigned to this haul is highlighted.',
        'Pinakamalapit muna. Naka-highlight ang driver na nakatalaga sa haul na ito.',
        'Pinakamalapit una. Naka-highlight ang driver nga natakda sa haul nga ini.'
    ],
    'haul.assign': ['Assign', 'Italaga', 'I-assign'],
    'haul.busy': ['Busy', 'Abala', 'Okupado'],
    'haul.best': ['Best price', 'Pinakamura', 'Pinakabarato'],
    'haul.free': ['Available', 'Bakante', 'Bakante'],
    'haul.trips': ['{n} trip(s) · {price}', '{n} biyahe · {price}', '{n} ka biyahe · {price}'],
    'haul.overridden': ['Coordinator override', 'Pinalitan ng coordinator', 'Ginbaylo sang coordinator'],
    'haul.overrideNote': [
        'Override history: {from} → {to}',
        'Kasaysayan ng pagpalit: {from} → {to}',
        'Kasaysayan sang pagkambyo: {from} → {to}'
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
    'pay.eyebrow': ['Orders · Pay', 'Mga Order · Bayad', 'Mga Order · Bayad'],
    'pay.eyebrow.lot': ['Orders · Pay · Lot {lot}', 'Mga Order · Bayad · Lot {lot}', 'Mga Order · Bayad · Lot {lot}'],
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
    'pay.rec.farm': ['Farm · Barangay', 'Bukid · Barangay', 'Uma · Barangay'],
    'pay.rec.harvest': ['Harvest', 'Ani', 'Alani'],
    'pay.rec.weight': ['Dried Weight', 'Timbang na Tuyo', 'Timbang nga Uga'],
    'pay.rec.quality': ['Grade · Moisture', 'Grado · Halumigmig', 'Grado · Kahalumigmigon'],
    'pay.rec.buyer': ['Commitment · Buyer', 'Pangako · Mamimili', 'Saad · Bumalakal'],
    'pay.rec.haul': ['Haul · Driver', 'Hakot · Driver', 'Hakot · Driver'],
    'pay.rec.slot': ['Dryer Slot', 'Slot sa Patuyuan', 'Slot sa Pamalahan'],
    'pay.rec.slip': ['Slip', 'Resibo', 'Resibo'],
    'pay.viewSms': ['View SMS', 'Tingnan ang SMS', 'Tan-awa ang SMS'],
    'pay.back': ['All Lots', 'Lahat ng Lot', 'Tanan nga Lot'],
    // sms
    'sms.all.title': ['SMS to Farmer · Lot {lot}', 'SMS sa Magsasaka · Lot {lot}', 'SMS sa Mangunguma · Lot {lot}'],
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
        'Arrows step · Space pauses · R restarts',
        'Arrow: hakbang · Space: hinto · R: ulit',
        'Arrow: lakat · Space: untat · R: liwat'
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
        "Farmer {farm}'s Phone · Messages",
        'Telepono ng Magsasaka {farm} · Mga Mensahe',
        'Telepono sang Mangunguma {farm} · Mga Mensahe'
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
        'Cluster 1 · simulated forecast',
        'Cluster 1 · simulated na tantiya',
        'Cluster 1 · simulated nga banta'
    ],
    'supply.map': ['Supply Map · {week}', 'Mapa ng Suplay · {week}', 'Mapa sang Suplay · {week}'],
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
    'supply.note.price': ['Per kg · {sack} kg sacks', 'Kada kg · {sack} kg na sako', 'Kada kg · {sack} kg nga sako'],
    'supply.cta.palay': ['Post a Commitment', 'Mag-post ng Pangako', 'Mag-post sang Saad'],
    'supply.cta.rice': ['Order Rice', 'Umorder ng Bigas', 'Mag-order sang Bugas'],
    'supply.col.week': ['{week}', '{week}', '{week}'],
    'orders.title': ['My Orders', 'Aking mga Order', 'Akon nga mga Order'],
    'orders.eyebrow': ['Buyer · simulated', 'Mamimili · simulated', 'Bumalakal · simulated'],
    'orders.new.rice': ['Order Milled Rice', 'Umorder ng Bigas', 'Mag-order sang Bugas'],
    'orders.new.palay': ['Post a Commitment', 'Mag-post ng Pangako', 'Mag-post sang Saad'],
    'orders.sacks': ['Sacks ({kg} kg each)', 'Sako ({kg} kg bawat isa)', 'Sako ({kg} kg kada isa)'],
    'orders.week': ['Delivery Week', 'Linggo ng Hatid', 'Semana sang Hatod'],
    'orders.total': [
        '{kg} kg · {total} at {price}/kg (assumed)',
        '{kg} kg · {total} sa {price}/kg (tantiya)',
        '{kg} kg · {total} sa {price}/kg (banta)'
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
        '{sacks} sacks · {kg} kg · {week} · {total}',
        '{sacks} sako · {kg} kg · {week} · {total}',
        '{sacks} ka sako · {kg} kg · {week} · {total}'
    ],
    'orders.clear': ['Clear My Orders', 'Burahin ang Aking Order', 'Panason ang Akon nga Order'],
    'orders.tonnes': ['Tonnes of Dried Palay', 'Tonelada ng Tuyong Palay', 'Tonelada sang Uga nga Palay'],
    'orders.price': ['Your Price per kg (PHP)', 'Iyong Presyo kada kg (PHP)', 'Imo nga Presyo kada kg (PHP)'],
    'orders.from': ['Window From', 'Mula Linggo', 'Halin Semana'],
    'orders.to': ['Window To', 'Hanggang Linggo', 'Tubtob Semana'],
    'orders.gradeFixed': [
        'Grade 1 · 14% MC (the cluster forecast grade, assumed)',
        'Grade 1 · 14% MC (tantiyang grado ng cluster)',
        'Grade 1 · 14% MC (banta nga grado sang cluster)'
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
    'orders.err.post': [
        'Could not post the commitment. Try again.',
        'Hindi na-post ang pangako. Subukan muli.',
        'Wala na-post ang saad. Tilawan liwat.'
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
        'Milled rice lot {id} · {kg} kg at {miller}',
        'Lot ng bigas {id} · {kg} kg sa {miller}',
        'Lot sang bugas {id} · {kg} kg sa {miller}'
    ],
    'trace.palay': [
        'Palay lot {id} · {kg} kg · {grade} · {mc}',
        'Lot ng palay {id} · {kg} kg · {grade} · {mc}',
        'Lot sang palay {id} · {kg} kg · {grade} · {mc}'
    ],
    'trace.farm': [
        'Farm {id} · {barangay} · harvest {date}',
        'Bukid {id} · {barangay} · ani {date}',
        'Uma {id} · {barangay} · alani {date}'
    ],
    'trace.haul': ['Haul {id} · {plate} · {km} km', 'Hakot {id} · {plate} · {km} km', 'Hakot {id} · {plate} · {km} km'],
    'trace.dryer': ['Dryer slot {id} · {day}', 'Slot sa patuyuan {id} · {day}', 'Slot sa pamalahan {id} · {day}'],
    'trace.paid': [
        'Farmer paid: advance {advance} within 24 h · slip {slip}',
        'Bayad sa magsasaka: paunang {advance} sa loob ng 24 oras · resibo {slip}',
        'Bayad sa mangunguma: abanse {advance} sa sulod sang 24 oras · resibo {slip}'
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
    /* Chat chrome for the SMS thread (farmer app). TL/HIL drafts: needs native review. */
    'chat.today': ['Today', 'Ngayong araw', 'Subong nga adlaw'],
    'chat.sent': ['Sent', 'Naipadala', 'Napadala'],
    'chat.delivered': ['Delivered', 'Naihatid', 'Nadala'],
    'chat.read': ['Read', 'Nabasa', 'Nabasahan'],
    'chat.parts': ['{n} SMS', '{n} SMS', '{n} SMS'],
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
    'sms.reply.accepted': ['Accepted', 'Tinanggap', 'Ginbaton'],
    'sms.reply.moved': ['Move requested', 'Hiniling ilipat', 'Ginpangayo ibalhin'],
    'sms.reply.unclear': ['Not understood', 'Hindi naintindihan', 'Wala naintiendihan'],
    // coordinator home (TL/HIL drafts: needs native review)
    'nav.home': ['Home', 'Home', 'Home'],
    'home.title': ['This Week', 'Ngayong Linggo', 'Subong nga Semana'],
    'home.eyebrow': [
        'Coordinator · Cluster 1 · {week} · today {date} (simulated)',
        'Coordinator · Cluster 1 · {week} · ngayon {date} (simulated)',
        'Coordinator · Cluster 1 · {week} · subong {date} (simulated)'
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
    'home.charts': ['Cluster Dashboard', 'Dashboard ng Cluster', 'Dashboard sang Cluster'],
    'home.chart.harvest': ['Harvest by Week', 'Ani Kada Linggo', 'Alani Kada Semana'],
    'home.chart.commitments': ['Commitment Fill', 'Puno ng Pangako', 'Puno sang Saad'],
    'home.chart.hauls': ['Haul Status', 'Katayuan ng Hakot', 'Kahimtangan sang Hakot'],
    'chart.label': ['Item', 'Item', 'Item'],
    'chart.value': ['Value', 'Halaga', 'Bili'],
    'chart.noData': ['No data yet', 'Wala pang datos', 'Wala pa sang datos'],
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
        'Farmer {farm} · Slip {slip} (simulated)',
        'Magsasaka {farm} · Resibo {slip} (simulated)',
        'Mangunguma {farm} · Resibo {slip} (simulated)'
    ],
    'slip.view': ['View the Slip', 'Tingnan ang Resibo', 'Tan-awa ang Resibo'],
    // marketing site (TL/HIL drafts: needs native review)
    'mk.nav': ['Sections', 'Mga Seksiyon', 'Mga Seksiyon'],
    'mk.nav.problem': ['Problem', 'Problema', 'Problema'],
    'mk.nav.value': ['Who Benefits', 'Sino ang Nakikinabang', 'Sin-o ang Makabenepisyo'],
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
        "We don't consolidate land. We consolidate opportunity. A prototype by Team Syntaxure Labs.",
        'Hindi namin pinagsasama ang lupa. Pinagsasama namin ang oportunidad. Prototype ng Team Syntaxure Labs.',
        'Indi namon ginatingob ang duta. Ginatingob namon ang oportunidad. Prototype sang Team Syntaxure Labs.'
    ],
    'mk.tag.model': ['Model', 'Modelo', 'Modelo'],
    'mk.tag.simulated': ['Simulated', 'Simulated', 'Simulated'],
    'mk.tag.assumed': ['Assumed', 'Tantiya', 'Banta'],
    'mk.hero.title': [
        '[[Farm consolidation]] without [[land consolidation]].',
        '[[Pagsasanib ng ani]] nang hindi [[pagsasanib ng lupa]].',
        '[[Pagtingob sang alani]] nga indi [[pagtingob sang duta]].'
    ],
    'mk.hero.sub': [
        'RiceConnect is operational coordination infrastructure for smallholder rice farming. It organizes a cluster of independent farms into one supply unit — planned harvests, pre-committed buyers, shared drying and hauling — so farmers sell at industrial scale without giving up a single hectare. Cluster Leads run the dashboard. Farmers only need SMS.',
        'Ang RiceConnect ay operational coordination infrastructure para sa maliliit na magsasaka ng palay. Pinagsasama nito ang isang cluster ng mga independiyenteng bukid tungo sa isang yunit ng suplay — planadong ani, nakatakdang mamimili, sabay na pagpapatuyo at paghakot — para makapagbenta ang magsasaka sa sukat-industriya nang hindi isinusuko ang kahit isang ektarya. Ang Cluster Lead ang nagpapatakbo ng dashboard. SMS lang ang kailangan ng magsasaka.',
        'Ang RiceConnect amo ang operational coordination infrastructure para sa gagmay nga mangunguma sang humay. Ginaorganisar sini ang isa ka cluster sang independiente nga mga uma sa isa ka yunit sang suplay — planado nga alani, nakatakda nga bumalakal, tingob nga pagpamala kag paghakot — agod makabaligya ang mangunguma sa sukat-industriya nga wala ginahatag ang bisan isa ka ektarya. Ang Cluster Lead ang nagapadalagan sang dashboard. SMS lang ang kinahanglan sang mangunguma.'
    ],
    'mk.hero.card': ['The Prototype Cluster', 'Ang Prototype na Cluster', 'Ang Prototype nga Cluster'],
    'mk.hero.impact': [
        'Target Impact, Not Yet Measured',
        'Target na Epekto, Hindi Pa Nasusukat',
        'Target nga Epekto, Wala Pa Nasukat'
    ],
    'mk.hero.income': ['Target: Net Income', 'Target: Netong Kita', 'Target: Neto nga Kita'],
    'mk.hero.income.val': ['+{gainMin}–{gainMax}%', '+{gainMin}–{gainMax}%', '+{gainMin}–{gainMax}%'],
    'mk.hero.loss': [
        'Target: Post-Harvest Loss',
        'Target: Kabawasan Pagkatapos ng Ani',
        'Target: Kabawasan Pagkatapos sang Alani'
    ],
    'mk.hero.loss.val': ['<{targetLoss}%', '<{targetLoss}%', '<{targetLoss}%'],
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
        "Farmers can find buyers. They [[can't choose]] when, to whom, or on what terms.",
        'Nakakahanap ng mamimili ang magsasaka, pero [[hindi nila napipili]] kung kailan, kanino, o sa anong kondisyon.',
        'Nakapangita sang bumalakal ang mangunguma, pero [[indi nila mapili]] kon san-o, kay sin-o, ukon sa ano nga kondisyon.'
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
    // who benefits (two audiences, one chain)
    'mk.value.eyebrow': [
        'Two Sides, One Supply Chain',
        'Dalawang Panig, Isang Supply Chain',
        'Duha ka Kilid, Isa ka Supply Chain'
    ],
    'mk.value.title': [
        'For [[Buyers]] who need predictability. For [[Farmers]] who need autonomy.',
        'Para sa [[mga Mamimili]] na kailangan ng kasiguraduhan. Para sa [[mga Magsasaka]] na kailangan ng kalayaan.',
        'Para sa [[mga Bumalakal]] nga kinahanglan ang kasiguruhan. Para sa [[mga Mangunguma]] nga kinahanglan ang kahilwayan.'
    ],
    'mk.value.buyer.h': [
        'Institutional Buyers & Millers',
        'Institusyonal na Mamimili at Miller',
        'Institusyonal nga Bumalakal kag Miller'
    ],
    'mk.value.buyer.p': [
        'Aggregated volume from dozens of farms. Standardized moisture grading at {mc}% MC. Committed supply windows you can plan inventory around. One invoice, not fifty.',
        'Pinagsama-samang dami mula sa dose-dosenang bukid. Standard na moisture grading sa {mc}% MC. Takdang panahon ng suplay na mapaplano mo. Isang invoice, hindi limampu.',
        'Tingob nga kadamuon halin sa dinosena nga uma. Standard nga moisture grading sa {mc}% MC. Takda nga tion sang suplay nga maplano mo. Isa ka invoice, indi singkwenta.'
    ],
    'mk.value.buyer.cta': ['Partner for Sourcing', 'Maging Katuwang sa Sourcing', 'Mangin Kaupod sa Sourcing'],
    'mk.value.buyer.subject': [
        'RiceConnect sourcing partnership',
        'Pakikipagtulungan sa sourcing ng RiceConnect',
        'Pag-upod sa sourcing sang RiceConnect'
    ],
    'mk.value.farmer.h': ['Farmer Clusters', 'Mga Cluster ng Magsasaka', 'Mga Cluster sang Mangunguma'],
    'mk.value.farmer.p': [
        'Keep your land. Cut input costs {savingsMin}–{savingsMax}% through bulk buying. Bypass predatory trader debt (pautang). Dry on schedule instead of losing {lossMin}–{lossMax}% to weather. Get {adv}% of your pay within 24 hours.',
        'Panatilihin ang lupa mo. Bawasan ang gastos sa input ng {savingsMin}–{savingsMax}% sa sabayang pagbili. Iwasan ang mapanamantalang utang ng trader (pautang). Matuyo ayon sa iskedyul kaysa mawalan ng {lossMin}–{lossMax}% sa panahon. Kunin ang {adv}% ng bayad sa loob ng 24 oras.',
        'Tipiga ang imo duta. Pakamayadi ang gastos sa input sang {savingsMin}–{savingsMax}% paagi sa tingob nga pagbakal. Likawi ang malaut nga utang sang trader (pautang). Mapamala suno sa iskedyul sa baylo sang pagkadula sang {lossMin}–{lossMax}% sa panahon. Batona ang {adv}% sang bayad sa sulod sang 24 oras.'
    ],
    'mk.value.farmer.cta': ['Register a Cluster', 'Irehistro ang isang Cluster', 'Iparehistro ang isa ka Cluster'],
    'mk.value.farmer.subject': [
        'RiceConnect cluster registration',
        'Pagpaparehistro ng cluster sa RiceConnect',
        'Pagparehistro sang cluster sa RiceConnect'
    ],
    'mk.value.note': ['Interested? Email the team.', 'Interesado? I-email ang team.', 'Interesado? I-email ang team.'],
    'mk.how.eyebrow': ['How a Cluster Works', 'Paano Gumagana ang Cluster', 'Paano Nagaobra ang Cluster'],
    'mk.how.title': [
        'Demand, Plan, Inputs, Harvest, Haul, [[Settlement]]',
        'Demand, Plano, Input, Ani, Hakot, [[Bayaran]]',
        'Demand, Plano, Input, Alani, Hakot, [[Bayaran]]'
    ],
    'mk.how.note': [
        'How the cluster is designed to work. The prototype runs it on simulated data.',
        'Ganito idinisenyo ang cluster. Sa simulated na datos ito pinapatakbo ng prototype.',
        'Amo ini ang disenyo sang cluster. Sa simulated nga datos ini ginapadalagan sang prototype.'
    ],
    'mk.step.demand.h': ['Buyer Demand', 'Pangangailangan ng Mamimili', 'Kinahanglan sang Bumalakal'],
    'mk.step.demand.p': [
        'Millers, retailers and restaurants commit volume, grade, moisture spec and price before a single stalk is cut. Demand drives the entire chain.',
        'Nangangako ang miller, retailer at restawran ng dami, grado, moisture at presyo bago pa putulin ang isang tangkay. Ang demand ang nagpapatakbo sa buong chain.',
        'Nagasaad ang miller, retailer kag restawran sang kadamuon, grado, moisture kag presyo antes pa gintigbas ang isa ka tangkay. Ang kinahanglan amo ang nagapadalagan sang bug-os nga chain.'
    ],
    'mk.step.plan.h': [
        'Cluster Production Plan',
        'Plano ng Produksiyon ng Cluster',
        'Plano sang Produksiyon sang Cluster'
    ],
    'mk.step.plan.p': [
        "The Cluster Lead maps every farm's harvest week by barangay and matches production windows to buyer commitments. Farmers are notified by SMS.",
        'Inilalagay ng Cluster Lead sa mapa ang linggo ng ani ng bawat bukid ayon sa barangay at itinatugma ang panahon ng produksiyon sa pangako ng mamimili. Aabisuhan ang magsasaka sa SMS.',
        'Ginabutang sang Cluster Lead sa mapa ang semana sang alani sang kada uma suno sa barangay kag ginatupong ang tion sang produksiyon sa saad sang bumalakal. Ginapahibalo ang mangunguma paagi sa SMS.'
    ],
    'mk.step.inputs.h': ['Bulk Inputs', 'Sabayang Pagbili ng Input', 'Tingob nga Pagbakal sang Input'],
    'mk.step.inputs.p': [
        'The cluster pools purchasing power: seeds, fertilizer and crop protection bought together at {savingsMin}–{savingsMax}% below individual retail. No one takes a loan from a trader.',
        'Pinagsasama ng cluster ang kakayahan sa pagbili: binhi, abono at pang-proteksiyon ng pananim na binili nang sabay sa {savingsMin}–{savingsMax}% na mas mababa sa tingi. Walang kumukuha ng pautang sa trader.',
        'Ginatingob sang cluster ang ikasarang sa pagbakal: binhi, abono kag panalipod sang pananum nga tingob nga ginbakal sa {savingsMin}–{savingsMax}% nga mas barato sa tingi. Wala sing nagakuha sang pautang sa trader.'
    ],
    'mk.step.harvest.h': [
        'Synchronized Harvest & Drying',
        'Sabay na Ani at Pagpapatuyo',
        'Tingob nga Alani kag Pagpamala'
    ],
    'mk.step.harvest.p': [
        'Each lot gets a dryer slot on its harvest day. Palay is dried to {mc}% moisture within hours, not days — cutting post-harvest losses below {targetLoss}%.',
        'Bawat lot ay may slot sa patuyuan sa araw ng ani. Pinapatuyo ang palay hanggang {mc}% moisture sa loob ng oras, hindi araw — kaya bumababa ang kabawasan pagkatapos ng ani sa ibaba ng {targetLoss}%.',
        'Ang kada lot may slot sa pamalahan sa adlaw sang alani. Ginapamala ang humay tubtob {mc}% moisture sa sulod sang oras, indi adlaw — gani nagakubos ang kabawasan pagkatapos sang alani sa idalom sang {targetLoss}%.'
    ],
    'mk.step.haul.h': ['Haul', 'Hakot', 'Hakot'],
    'mk.step.haul.p': [
        'The nearest available driver whose vehicle carries the whole lot is assigned; the Cluster Lead can change it.',
        'Itinatalaga ang pinakamalapit na driver na kasya ang buong lot; puwedeng palitan ng Cluster Lead.',
        'Gina-assign ang pinakamalapit nga driver nga kasya ang bilog nga lot; mabaylo sang Cluster Lead.'
    ],
    'mk.step.settle.h': ['Fast Settlement', 'Mabilis na Bayaran', 'Madasig nga Bayaran'],
    'mk.step.settle.p': [
        'Quoted price − drying − coordination margin = net to the farmer; {adv}% advance within 24 hours, balance when the buyer pays. A printed slip in the hands, not a promise.',
        'Presyong inalok − patuyo − bayad sa koordinasyon = neto sa magsasaka; {adv}% paunang bayad sa loob ng 24 oras, natitira kapag nagbayad ang mamimili. Nakalimbag na resibo, hindi pangako.',
        'Gintanyag nga presyo − pamala − bayad sa koordinasyon = neto sa mangunguma; {adv}% abanse sa sulod sang 24 oras, nabilin kon magbayad ang bumalakal. Naimprinta nga resibo, indi saad.'
    ],
    'mk.domains.eyebrow': ['The Four Domains', 'Ang Apat na Bahagi', 'Ang Apat ka Bahin'],
    'mk.domains.title': [
        'One Cluster, [[Four Jobs]]',
        'Isang Cluster, [[Apat na Trabaho]]',
        'Isa ka Cluster, [[Apat ka Obra]]'
    ],
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
    'mk.who.title': [
        'A Cluster Lead, Three Partners, [[One Lot]]',
        'Isang Cluster Lead, Tatlong Katuwang, [[Isang Lot]]',
        'Isa ka Cluster Lead, Tatlo ka Kaupod, [[Isa ka Lot]]'
    ],
    'mk.role.coordinator.h': ['Cluster Lead', 'Cluster Lead', 'Cluster Lead'],
    'mk.role.coordinator.p': [
        'A youth agri-intern, coop officer or lead farmer who operates the dashboard. They register farms, match lots to buyers, dispatch hauls and settle payments — the human bridge between the system and the SMS-only farmers.',
        'Isang youth agri-intern, opisyal ng kooperatiba o lead farmer na nagpapatakbo ng dashboard. Sila ang nagrerehistro ng bukid, nagtutugma ng lot sa mamimili, nagpapadala ng hakot at nagbabayad — ang tulay ng tao sa pagitan ng sistema at ng magsasakang SMS lang ang gamit.',
        'Isa ka youth agri-intern, opisyal sang kooperatiba ukon lead farmer nga nagapadalagan sang dashboard. Sila ang nagapalista sang uma, nagatupong sang lot sa bumalakal, nagapadala sang hakot kag nagabayad — ang tulay sang tawo sa ulot sang sistema kag sang mangunguma nga SMS lang ang gamit.'
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
        'Validation Stage: Prototype with [[Simulated Data]]',
        'Yugto ng Pagpapatunay: Prototype na may [[Simulated na Datos]]',
        'Tion sang Pagpamatuod: Prototype nga may [[Simulated nga Datos]]'
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
    'mk.tracker.title': ['Harvest Tracker', 'Tracker ng Ani', 'Tracker sang Alani'],
    'mk.tracker.week': ['Cluster 1 · {w}', 'Cluster 1 · {w}', 'Cluster 1 · {w}'],
    'mk.tracker.matched': ['Buyer Matched', 'May Mamimili Na', 'May Bumalakal Na'],
    'mk.tracker.open': ['Open for Buyers', 'Bukas sa Mamimili', 'Bukas sa Bumalakal'],
    'mk.tracker.lotLine': ['Farm {farm} · {brgy}', 'Bukid {farm} · {brgy}', 'Uma {farm} · {brgy}'],
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
        '© 2026 Team Syntaxure Labs · ISUFST',
        '© 2026 Team Syntaxure Labs · ISUFST',
        '© 2026 Team Syntaxure Labs · ISUFST'
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
    'auth.select': ['Choose…', 'Pumili…', 'Magpili…'],
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
    'auth.busy.signin': ['Signing In…', 'Nagsa-sign In…', 'Ginasign In…'],
    'auth.busy.signup': ['Creating Account…', 'Ginagawa ang Account…', 'Ginahimo ang Account…'],
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
    'admin.eyebrow': ['Super Admin · All Apps', 'Super Admin · Lahat ng App', 'Super Admin · Tanan nga App'],
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
    'anni.placeholder': ['Ask about your farm…', 'Magtanong tungkol sa bukid…', 'Pamangkot parte sa uma…'],
    'anni.send': ['Send', 'Ipadala', 'Ipadala'],
    'anni.thinking': ['ANNI is thinking…', 'Nag-iisip si ANNI…', 'Nagapamalandong si ANNI…'],
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
    ],
    // Buyer portal: page lead, the week-at-a-glance figures and the three analytics charts
    'supply.lead': [
        'What the cluster can deliver from {place}, week by week. Every figure is simulated.',
        'Ang kayang ihatid ng cluster mula sa {place}, linggo-linggo. Simuladong datos ang lahat ng numero.',
        'Ang maipadala sang cluster halin sa {place}, semana-semana. Simulated nga datos ang tanan nga numero.'
    ],
    'supply.look.title': [
        'This Week at a Glance',
        'Sa Isang Tingin Ngayong Linggo',
        'Sa Isa ka Tan-aw Subong nga Semana'
    ],
    'supply.trend.palay': [
        'Dried Palay Forecast, by Week',
        'Forecast ng Tuyong Palay, Bawat Linggo',
        'Forecast sang Uga nga Humay, Kada Semana'
    ],
    'supply.trend.rice': [
        'Milled Rice Available, by Week',
        'Giniling na Bigas, Bawat Linggo',
        'Ginaling nga Bugas, Kada Semana'
    ],
    'supply.rank.title': [
        'Supply by Barangay · {week}',
        'Suplay ayon sa Barangay · {week}',
        'Suplay suno sa Barangay · {week}'
    ],
    'supply.share.title': [
        'How {week} Is Shared Between Barangays',
        'Hati ng mga Barangay sa {week}',
        'Pagbahin sang mga Barangay sa {week}'
    ],
    'supply.trend.summary': [
        'Each column is one week, split by barangay; the week’s total and its share of the season sit above it. {week} is the highest at {value} {unit} ({pct}%).',
        'Bawat bar ay isang linggo, hinati ayon sa barangay; nasa itaas ang kabuuan at bahagdan ng season. Pinakamataas ang {week} sa {value} {unit} ({pct}%).',
        'Kada bar isa ka semana, ginbahin suno sa barangay; sa ibabaw ang kabilugan kag porsiento sang season. Pinakamataas ang {week} sa {value} {unit} ({pct}%).'
    ],
    'supply.rank.summary': [
        '{week} supply per barangay, largest first: {list}.',
        'Suplay sa {week} bawat barangay, pinakamalaki muna: {list}.',
        'Suplay sa {week} kada barangay, pinakadako anay: {list}.'
    ],
    'supply.share.summary': [
        'The {value} {unit} of {week} split across {n} barangays; each share is printed with its percentage.',
        'Ang {value} {unit} ng {week} na hinati sa {n} barangay; may porsyento ang bawat hati.',
        'Ang {value} {unit} sang {week} nga ginbahin sa {n} barangay; may porsyento ang kada bahin.'
    ],
    'supply.week.help': [
        'The week controls every figure, the map and the table on this page.',
        'Kinokontrol ng linggo ang lahat ng numero, ang mapa at ang talahanayan sa pahinang ito.',
        'Ginakontrol sang semana ang tanan nga numero, ang mapa kag ang table sa sini nga pahina.'
    ],
    // Coordinator console: the week's landing trend and the per-barangay ranking on Home
    'home.trend.title': [
        'Harvest Landing, Day by Day',
        'Paghakot ng Ani, Araw-araw',
        'Pag-abot sang Alani, Adlaw-adlaw'
    ],
    'home.rank.title': [
        'Planned Harvest by Barangay · {week}',
        'Planong Ani ayon sa Barangay · {week}',
        'Plano nga Alani suno sa Barangay · {week}'
    ],
    'home.trend.summary': [
        'Each column is one day, split by barangay; the day’s planned weight and its share of the week sit above it. The heaviest day is {day} at {value} {unit} ({pct}%).',
        'Bawat bar ay isang araw, hinati ayon sa barangay; nasa itaas ang timbang at bahagdan ng linggo. Pinakamabigat ang {day} sa {value} {unit} ({pct}%).',
        'Kada bar isa ka adlaw, ginbahin suno sa barangay; sa ibabaw ang timbang kag porsiento sang semana. Pinakamabug-at ang {day} sa {value} {unit} ({pct}%).'
    ],
    'home.rank.summary': [
        'Planned harvest this week per barangay, largest first: {list}.',
        'Planong ani ngayong linggo bawat barangay, pinakamalaki muna: {list}.',
        'Plano nga alani subong nga semana kada barangay, pinakadako anay: {list}.'
    ],
    'home.look.title': [
        'This Week at a Glance',
        'Sa Isang Tingin Ngayong Linggo',
        'Sa Isa ka Tan-aw Subong nga Semana'
    ],
    'home.analytics.note': [
        'Counted from the farm profiles in Cluster 1 for {week}. Figures are planned dried weight, not delivered weight.',
        'Mula sa mga profile ng bukid sa Cluster 1 para sa {week}. Planong tuyong timbang ito, hindi aktwal na naihatid.',
        'Halin sa mga profile sang uma sa Cluster 1 para sa {week}. Plano nga uga nga timbang ini, indi aktwal nga naihatod.'
    ],
    'home.day': ['Day {d}', 'Araw {d}', 'Adlaw {d}'],
    // Buyer portal: the order-book band on /buyer/orders
    'orders.lead': [
        'Order milled rice by the sack, or commit to dried palay for a window of weeks. Simulated data, kept in this browser.',
        'Umorder ng giniling na bigas kada sako, o mag-commit ng tuyong palay sa isang agwat ng linggo. Simuladong datos, nasa browser na ito.',
        'Mag-order sang ginaling nga bugas kada sako, ukon mag-commit sang uga nga humay sa isa ka agwat sang semana. Simulated nga datos, yara sa sini nga browser.'
    ],
    'orders.look.title': [
        'Order Book at a Glance',
        'Ang Order Book sa Isang Tingin',
        'Ang Order Book sa Isa ka Tan-aw'
    ],
    'orders.stat.value': ['Value of Your Orders', 'Halaga ng Iyong mga Order', 'Bili sang Imo mga Order'],
    'orders.stat.free.rice': ['Rice Still Available', 'Natitirang Bigas', 'Nabilin nga Bugas'],
    'orders.stat.free.palay': ['Palay Still Open', 'Bukas Pa na Palay', 'Bukas Pa nga Humay'],
    'orders.note.mine': [
        'Requests you placed from this browser. They show on the coordinator console too.',
        'Mga hiling na inilagay mo mula sa browser na ito. Lumalabas din ang mga ito sa console ng coordinator.',
        'Mga pangayo nga ginbutang mo halin sa sini nga browser. Makita man ini sa console sang coordinator.'
    ],
    'orders.note.value': [
        '{sacks} sacks at {price}/kg, priced at the assumed milling rate.',
        '{sacks} sako sa {price}/kg, ayon sa inaasahang rate ng paggiling.',
        '{sacks} ka sako sa {price}/kg, suno sa ginapaabot nga rate sang paggaling.'
    ],
    'orders.note.free': [
        'Counted from every order in this browser, against what the partner miller can offer.',
        'Mula sa lahat ng order sa browser na ito, kumpara sa kayang ialok ng partner miller.',
        'Halin sa tanan nga order sa sini nga browser, batok sa maalok sang partner miller.'
    ],
    'orders.share.title': ['How the Milled Lot Is Going', 'Daloy ng Giniling na Lot', 'Daloy sang Ginaling nga Lot'],
    'orders.share.ordered': ['Ordered', 'Naorder', 'Naorder'],
    'orders.share.free': ['Still Available', 'Natitira Pa', 'Nabilin Pa'],
    'orders.share.summary': [
        '{ordered} t of the {total} t milled lot is ordered; {free} t is still open.',
        '{ordered} t sa {total} t na giniling na lot ang naorder; {free} t pa ang bukas.',
        '{ordered} t sang {total} t nga ginaling nga lot ang naorder; {free} t pa ang bukas.'
    ],
    'orders.palay.share.title': [
        'Palay Pool: Committed and Open',
        'Palay Pool: Nakatalaga at Bukas Pa',
        'Palay Pool: Natakda kag Bukas Pa'
    ],
    'orders.palay.share.committed': [
        'Held by Commitment C-01',
        'Hawak ng Commitment C-01',
        'Gin-aggaw sang Commitment C-01'
    ],
    'orders.palay.share.free': [
        'Open to a New Commitment',
        'Bukas sa Bagong Commitment',
        'Bukas sa Bag-o nga Commitment'
    ],
    'orders.palay.share.summary': [
        'Commitment C-01 holds {committed} t; {free} t of palay is still open to a new commitment.',
        'Hawak ng commitment C-01 ang {committed} t; {free} t ng palay ang bukas pa sa bagong commitment.',
        'Gin-aggaw sang commitment C-01 ang {committed} t; {free} t nga humay ang bukas pa sa bag-o nga commitment.'
    ],
    // Coordinator console: the dryer's week and how a settlement splits
    'dry.share.title': [
        'Dryer Capacity: Booked and Free',
        'Kapasidad ng Patuyuan: Naka-book at Bakante',
        'Kapasidad sang Pamalahan: Naka-book kag Bakante'
    ],
    'dry.share.free': ['Still Free', 'Bakante Pa', 'Bakante Pa'],
    'dry.share.summary': [
        '{booked} of {cap} sacks are booked this week; {free} sacks are still free at this dryer.',
        '{booked} sa {cap} sako ang naka-book ngayong linggo; {free} sako pa ang bakante sa patuyuang ito.',
        '{booked} sa {cap} ka sako ang naka-book subong nga semana; {free} ka sako pa ang bakante sa sini nga pamalahan.'
    ],
    'pay.share.title': ['How the Net Settles', 'Paano Nahahati ang Neto', 'Paano Ginbahin ang Neto'],
    'pay.share.summary': [
        'Of {net} net, {advance} is released as the advance and {balance} waits for the buyer receipt.',
        'Sa {net} na neto, {advance} ang inilalabas bilang paunang bayad at {balance} ang hinihintay sa resibo ng mamimili.',
        'Sa {net} nga neto, {advance} ang ginabuhas bilang abanse kag {balance} ang ginahulat sa resibo sang bumalakal.'
    ],
    // Coordinator: the 100-farm harvest calendar page
    'plan.lead': [
        'The harvest plan for {place}: {farms} farms across {weeks} weeks. Every figure is simulated.',
        'Ang plano ng ani para sa {place}: {farms} bukid sa {weeks} linggo. Simuladong datos ang lahat ng numero.',
        'Ang plano sang ani para sa {place}: {farms} ka uma sa {weeks} ka semana. Simulated nga datos ang tanan nga numero.'
    ],
    'plan.look.title': ['Harvest at a Glance', 'Ang Ani sa Isang Tingin', 'Ang Ani sa Isa ka Tan-aw'],
    'plan.look.hint': [
        'When the cluster harvest comes in, which barangay carries it, and how the total divides.',
        'Kung kailan dumarating ang ani ng cluster, kung aling barangay ang may dala, at paano nahahati ang kabuuan.',
        'Kon san-o nag-abot ang ani sang cluster, kon diin nga barangay ang may dala, kag paano ginbahin ang kabilugan.'
    ],
    'plan.trend.title': ['Dried Forecast, by Week', 'Forecast ng Tuyo, Bawat Linggo', 'Forecast sang Uga, Kada Semana'],
    'plan.trend.summary': [
        'Each column is one week, split by barangay; the week’s total and its share of the season sit above it. {week} is the peak at {value} {unit} ({pct}%).',
        'Bawat bar ay isang linggo, hinati ayon sa barangay; nasa itaas ang kabuuan at bahagdan ng ani. Pinakamataas ang {week} sa {value} {unit} ({pct}%).',
        'Kada bar isa ka semana, ginbahin suno sa barangay; sa ibabaw ang kabilugan kag porsiento sang ani. Pinakamataas ang {week} sa {value} {unit} ({pct}%).'
    ],
    'plan.rank.title': [
        'Dried Forecast by Barangay',
        'Tuyong Forecast ayon sa Barangay',
        'Uga nga Forecast suno sa Barangay'
    ],
    'plan.rank.summary': [
        '{n} barangays, largest first: {list}.',
        '{n} barangay, pinakamalaki muna: {list}.',
        '{n} ka barangay, pinakadako una: {list}.'
    ],
    'plan.share.title': [
        'How the Forecast Splits Across Barangays',
        'Hati ng Forecast sa mga Barangay',
        'Pagbahin sang Forecast sa mga Barangay'
    ],
    'plan.share.summary': [
        'The three biggest barangays hold {pct}% of the {total} {unit} forecast; all {n} are ranked above.',
        'Ang tatlong pinakamalaking barangay ay may {pct}% ng {total} {unit} na forecast; niranggo sa itaas ang lahat ng {n}.',
        'Ang tatlo ka pinakadako nga barangay may {pct}% sang {total} {unit} nga forecast; niranggo sa ibabaw ang tanan nga {n}.'
    ],
    // Coordinator: the buyer-commitment board
    'market.lead': [
        'What buyers have asked for, and how much of it the cluster can fill from {place}. Every figure is simulated.',
        'Ang hinihiling ng mga mamimili, at kung gaano karami ang kayang punan ng cluster mula sa {place}. Simuladong datos ang lahat.',
        'Ang ginapangayo sang mga bumalakal, kag kon pila ang maabot sang cluster halin sa {place}. Simulated nga datos ang tanan.'
    ],
    'market.look.title': [
        'Commitments at a Glance',
        'Mga Commitment sa Isang Tingin',
        'Mga Commitment sa Isa ka Tan-aw'
    ],
    'market.stat.open': ['Open Commitments', 'Bukas na Commitment', 'Bukas nga Commitment'],
    'market.stat.open.note': [
        '{n} buyer accounts across the board.',
        '{n} account ng mamimili sa buong board.',
        '{n} ka account sang bumalakal sa bilog nga board.'
    ],
    'market.stat.value': ['Committed Volume', 'Nakomit na Dami', 'Nakomit nga Kadamuon'],
    'market.stat.value.note': [
        'Total volume buyers have asked for, across {n} commitments.',
        'Kabuuang dami na hiniling ng mga mamimili, sa {n} commitment.',
        'Kabilugan nga kadamuon nga ginpangayo sang mga bumalakal, sa {n} ka commitment.'
    ],
    'market.trend.title': [
        'Requested Volume by Buyer',
        'Hiniling na Dami ayon sa Mamimili',
        'Ginpangayo nga Kadamuon suno sa Bumalakal'
    ],
    'market.trend.summary': [
        '{n} buyers, largest request first: {list}.',
        '{n} mamimili, pinakamalaki muna: {list}.',
        '{n} ka bumalakal, pinakadako una: {list}.'
    ],
    'market.share.title': [
        'Requested Volume: Matched and Still Open',
        'Hiniling na Dami: Na-match at Bukas Pa',
        'Ginpangayo nga Kadamuon: Na-match kag Bukas Pa'
    ],
    'market.share.matched': ['Matched to Forecast', 'Na-match sa Forecast', 'Na-match sa Forecast'],
    'market.share.open': ['Not Yet Matched', 'Hindi Pa Na-match', 'Wala Pa Na-match'],
    'market.share.summary': [
        '{matched} of {total} {unit} requested is matched to a forecast lot; {open} {unit} is still open.',
        '{matched} sa {total} {unit} ang na-match sa forecast na lote; {open} {unit} pa ang bukas.',
        '{matched} sa {total} {unit} ang na-match sa forecast nga lote; {open} {unit} pa ang bukas.'
    ],
    // Coordinator: the farm register
    'farm.lead': [
        'Every registered farm in {place}, with its forecast, variety and harvest week.',
        'Lahat ng rehistradong bukid sa {place}, kasama ang forecast, variety at linggo ng ani.',
        'Tanan nga rehistrado nga uma sa {place}, upod ang forecast, variety kag semana sang ani.'
    ],
    'farm.look.title': ['Register at a Glance', 'Ang Rehistro sa Isang Tingin', 'Ang Rehistro sa Isa ka Tan-aw'],
    'farm.look.hint': [
        'Each column is one barangay, split by the same three statuses as the chart beside it: one colour, one meaning.',
        'Bawat haligi ay isang barangay, hinati sa parehong tatlong status ng katabing chart: isang kulay, isang kahulugan.',
        'Ang kada haligi isa ka barangay, ginbahin sa pareho nga tatlo ka status sang tupad nga chart: isa ka kolor, isa ka kahulugan.'
    ],
    'farm.stat.farms': ['Registered Farms', 'Rehistradong Bukid', 'Rehistrado nga Uma'],
    'farm.stat.ha': ['Cluster Area', 'Lawak ng Cluster', 'Kalaparon sang Cluster'],
    'farm.stat.forecast': ['Cluster Forecast', 'Forecast ng Cluster', 'Forecast sang Cluster'],
    'farm.stat.forecast.note': [
        'Dried tonnes across {b} barangays: {list}.',
        'Tuyong tonelada sa {b} barangay: {list}.',
        'Uga nga tonelada sa {b} ka barangay: {list}.'
    ],
    'farm.rank.title': ['Farms by Barangay', 'Bukid ayon sa Barangay', 'Uma suno sa Barangay'],
    'farm.rank.summary': [
        '{n} farms counted, largest barangay first: {list}.',
        '{n} bukid ang binilang, pinakamalaking barangay muna: {list}.',
        '{n} ka uma ang ginbilang, pinakadako nga barangay una: {list}.'
    ],
    'farm.share.title': ['Farms by Status', 'Bukid ayon sa Status', 'Uma suno sa Status'],
    'farm.share.summary': [
        'Of {n} farms, {cluster} are still to be clustered, {verified} are verified and {registered} are registered.',
        'Sa {n} bukid, {cluster} ang titipunin pa, {verified} ang beripikado at {registered} ang rehistrado.',
        'Sa {n} ka uma, {cluster} ang tipunon pa, {verified} ang beripikado kag {registered} ang rehistrado.'
    ],
    // Super admin: clearer page leads and section headings
    'admin.lead': [
        'Every app in the cluster, the counts that are live in this demo, and a door into each one.',
        'Lahat ng app sa cluster, ang mga bilang na live sa demo na ito, at pinto sa bawat isa.',
        'Tanan nga app sa cluster, ang mga bilang nga live sa demo nga ini, kag pwertahan sa kada isa.'
    ],
    'admin.users.lead': [
        'Every account in the cluster: coordinators, farmers, buyers and drivers. Search, filter, or change a role.',
        'Lahat ng account sa cluster: coordinator, magsasaka, mamimili at driver. Maghanap, mag-filter, o magpalit ng role.',
        'Tanan nga account sa cluster: coordinator, mangunguma, bumalakal kag driver. Pangitaa, i-filter, ukon ilisdi ang role.'
    ],
    'admin.settings.lead': [
        'The simulated assumptions behind every figure in the demo, and this demo’s data reset.',
        'Ang simuladong palagay sa likod ng bawat numero sa demo, at ang pag-reset ng datos nito.',
        'Ang simulated nga pangagpas sa likod sang kada numero sa demo, kag ang reset sang datos sini.'
    ],
    'admin.activity.lead': [
        'Every simulated write in this session, newest first, and the switch that clears the demo.',
        'Lahat ng simuladong pagbabago sa session na ito, pinakabago muna, at ang switch na naglilinis sa demo.',
        'Tanan nga simulated nga pagbag-o sa session nga ini, pinakabag-o una, kag ang switch nga nagtinlo sang demo.'
    ],
    // Coordinator: haul / logistics
    'haul.lead': [
        'One move at a time: the request, the assigned driver, and what each vehicle would cost.',
        'Isa-isa lang: ang kahilingan, ang nakatalagang driver, at ang magiging gastos ng bawat sasakyan.',
        'Isa-isa lang: ang pangayo, ang natakda nga driver, kag ang magastos sang kada salakyan.'
    ],
    'haul.work.title': ['Request and Assignment', 'Kahilingan at Pagtatalaga', 'Pangayo kag Pagtakda'],
    'haul.work.hint': [
        'Request the move, see who takes it, then compare what each vehicle costs for this load.',
        'Ipadala ang hiling, tingnan kung sino ang kukuha, at ihambing ang gastos ng bawat sasakyan para sa kargang ito.',
        'Ipadala ang pangayo, tan-awa kon sin-o ang magakuha, kag itanding ang gasto sang kada salakyan para sa karga nga ini.'
    ],
    'haul.look.title': ['This Move at a Glance', 'Ang Move sa Isang Tingin', 'Ang Move sa Isa ka Tan-aw'],
    'haul.stat.sacks': ['Sacks to Move', 'Sakong Ililipat', 'Sako nga Ibalhin'],
    'haul.stat.km': ['Route Distance', 'Distansya ng Ruta', 'Distansya sang Ruta'],
    'haul.stat.cost': ['Selected Haul Cost', 'Gastos ng Napiling Haul', 'Gastos sang Napili nga Haul'],
    'haul.rank.title': ['Trip Cost by Vehicle', 'Gastos ng Biyahe kada Sasakyan', 'Gastos sang Biyahe kada Salakyan'],
    'haul.rank.summary': [
        'What each vehicle would charge for {sacks} sacks over {km} km, largest first: {list}. Selected: {veh}.',
        'Ang sisingilin ng bawat sasakyan para sa {sacks} sako sa {km} km, pinakamalaki muna: {list}. Napili: {veh}.',
        'Ang singil sang kada salakyan para sa {sacks} ka sako sa {km} km, pinakadako una: {list}. Napili: {veh}.'
    ]
};

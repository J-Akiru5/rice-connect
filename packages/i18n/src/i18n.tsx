'use client';
import { PROTOTYPE_STRINGS } from './strings.prototype';
import { installZodErrorMap } from './zod-error-map';
import {
    createContext,
    PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode
} from 'react';

export type Lang = 'en' | 'tl' | 'hil';
export const LANGS: { id: Lang; short: string; name: string; draft: boolean }[] = [
    { id: 'en', short: 'EN', name: 'English', draft: false },
    { id: 'tl', short: 'TL', name: 'Tagalog', draft: true },
    { id: 'hil', short: 'HIL', name: 'Hiligaynon', draft: true }
];

/* Strings are Title Case / sentence case; CSS uppercases labels.
   TL and HIL are DRAFT translations. Draft: needs native review (every TL and HIL entry in this file,
   including the prototype additions at the end). The LanguageSwitcher shows this note on screen. */
type Dict = Record<string, [string, string, string]>;
export const STRINGS: Dict = {
    // nav
    'nav.console': ['Console', 'Console', 'Console'],
    'nav.farms': ['Farm Profile', 'Profile ng Bukid', 'Profile sang Uma'],
    'nav.plan': ['Plan', 'Plano', 'Plano'],
    'nav.market': ['Market', 'Merkado', 'Merkado'],
    'nav.haul': ['Haul', 'Hakot', 'Hakot'],
    'nav.dry': ['Dry', 'Patuyo', 'Pamala'],
    'nav.pay': ['Pay', 'Bayad', 'Bayad'],
    'nav.sms': ['SMS', 'SMS', 'SMS'],
    'nav.inventory': ['Inventory', 'Imbentaryo', 'Imbentaryo'],
    'nav.logistics': ['Logistics', 'Logistics', 'Logistics'],
    'nav.orders': ['Orders', 'Mga Order', 'Mga Order'],
    'nav.settings': ['Settings', 'Settings', 'Settings'],
    // chrome
    'demo.chip': ['Prototype · Simulated Data', 'Prototype · Simulated na Datos', 'Prototype · Simulated nga Datos'],
    'lang.label': ['Language', 'Wika', 'Lingguahe'],
    'lang.draft': [
        'Draft: needs native review',
        'Draft: kailangang suriin ng katutubong nagsasalita',
        'Draft: kinahanglan pa usisaon sang taga-diri'
    ],
    // farm profile
    'farm.title': ['Farm Profile', 'Profile ng Bukid', 'Profile sang Uma'],
    'farm.id': ['Farm ID', 'Farm ID', 'Farm ID'],
    'farm.name': ['Farmer', 'Magsasaka', 'Mangunguma'],
    'farm.mobile': ['Mobile', 'Mobile', 'Mobile'],
    'farm.barangay': ['Barangay', 'Barangay', 'Barangay'],
    'farm.area': ['Area', 'Lawak', 'Kalapad'],
    'farm.variety': ['Variety', 'Barayti', 'Klase sang Humay'],
    'farm.planting': ['Planting Week', 'Linggo ng Pagtanim', 'Semana sang Pagtanum'],
    'farm.status': ['Status', 'Katayuan', 'Kahimtangan'],
    'farm.add': ['Add to Cluster', 'Idagdag sa Cluster', 'Idugang sa Cluster'],
    'farm.added': ['Added to Cluster 1', 'Naidagdag sa Cluster 1', 'Nadugang sa Cluster 1'],
    'status.registered': ['Registered', 'Nakarehistro', 'Nakarehistro'],
    'status.verified': ['Verified', 'Napatunayan', 'Napamatud-an'],
    'status.cluster': ['In Cluster', 'Nasa Cluster', 'Yara sa Cluster'],
    // generic status
    'status.requested': ['Requested', 'Hiniling', 'Ginpangayo'],
    'status.assigned': ['Assigned', 'Naitalaga', 'Gin-assign'],
    'status.accepted': ['Accepted', 'Tinanggap', 'Ginbaton'],
    'status.pickedup': ['Picked Up', 'Nakuha Na', 'Nakuha Na'],
    'status.delivered': ['Delivered', 'Naihatid', 'Naihatod'],
    'status.pending': ['Pending', 'Naghihintay', 'Ginahulat'],
    'status.paid': ['Paid', 'Bayad Na', 'Bayad Na'],
    'status.failed': ['Failed', 'Hindi Natuloy', 'Wala Natuloy'],
    'status.matched': ['Matched', 'Tugma', 'Nagtupong'],
    'status.open': ['Open', 'Bukas', 'Bukas'],
    'status.full': ['Full', 'Puno', 'Puno'],
    // haul
    'haul.title': ['Haul Request', 'Hiling na Hakot', 'Pangayo nga Hakot'],
    'haul.from': ['Farm', 'Bukid', 'Uma'],
    'haul.via': ['Dryer', 'Patuyuan', 'Pamalahan'],
    'haul.to': ['Buyer', 'Mamimili', 'Bumalakal'],
    'haul.sacks': ['Sacks', 'Sako', 'Sako'],
    'haul.vehicle': ['Vehicle', 'Sasakyan', 'Salakyan'],
    'haul.autoassign': [
        'Nearest Driver Assigned',
        'Naitalaga ang Pinakamalapit na Driver',
        'Gin-assign ang Pinakamalapit nga Driver'
    ],
    'haul.override': ['Change Driver', 'Palitan ang Driver', 'Ilisan ang Driver'],
    'haul.request': ['Send Request', 'Ipadala ang Hiling', 'Ipadala ang Pangayo'],
    'haul.accept': ['Accept Job', 'Tanggapin', 'Batunon'],
    'haul.decline': ['Decline', 'Tanggihan', 'Indi Pagbatunon'],
    'haul.pickedup': ['Mark Picked Up', 'Markahang Nakuha', 'Markahan nga Nakuha'],
    'haul.pertrip': ['per trip', 'bawat biyahe', 'kada biyahe'],
    'haul.capacity': ['up to', 'hanggang', 'tubtob'],
    'haul.eta': ['Pickup', 'Kuha', 'Kuha'],
    'veh.motor': ['Motor', 'Motor', 'Motor'],
    'veh.tricycle': ['Tricycle', 'Traysikel', 'Traysikol'],
    'veh.multicab': ['Multicab', 'Multicab', 'Multicab'],
    'veh.truck': ['Truck', 'Trak', 'Trak'],
    // dry, plan, market
    'dry.title': ['Dryer Slots', 'Iskedyul ng Patuyuan', 'Iskedyul sang Pamalahan'],
    'dry.capacity': ['Capacity per Day', 'Kapasidad Bawat Araw', 'Kapasidad Kada Adlaw'],
    'plan.title': ['Harvest Plan', 'Plano ng Ani', 'Plano sang Alani'],
    'market.title': ['Commitment Board', 'Lupon ng Pangako', 'Tabla sang Saad'],
    'market.search': ['Search Commitments', 'Maghanap ng Pangako', 'Mangita sang Saad'],
    'market.automatch': ['Auto-Match Lots', 'Awtomatikong Itugma', 'Awtomatiko nga Itupong'],
    'market.commit': ['Commit Lot', 'Ipangako ang Lot', 'Isaad ang Lot'],
    // pay / slip
    'pay.title': ['Settlement', 'Bayaran', 'Bayaran'],
    'slip.title': ['Settlement Slip', 'Resibo ng Bayad', 'Resibo sang Bayad'],
    'slip.quoted': ['Quoted Price', 'Presyong Inalok', 'Presyo nga Gintanyag'],
    'slip.drying': ['Drying', 'Pagpapatuyo', 'Pagpamala'],
    'slip.margin': ['Coordination Margin', 'Bayad sa Koordinasyon', 'Bayad sa Koordinasyon'],
    'slip.net': ['Net to Farmer', 'Netong Matatanggap', 'Neto nga Mabaton'],
    'slip.weight': ['Dried Weight', 'Timbang Matapos Patuyuin', 'Timbang Pagkatapos Ibilad'],
    'slip.advance': [
        'Advance (80%) within 24 h',
        'Paunang Bayad (80%) sa loob ng 24 oras',
        'Abanse (80%) sa sulod sang 24 oras'
    ],
    'slip.balance': [
        'Balance on Buyer Receipt',
        'Natitira Pagkatanggap ng Mamimili',
        'Nabilin Pagbaton sang Bumalakal'
    ],
    'slip.fee': [
        'Buyer sourcing fee {rate}/kg (3% of quoted), paid by buyer',
        'Bayad sa paghahanap {rate}/kg (3% ng inalok), sagot ng mamimili',
        'Bayad sa pagpangita {rate}/kg (3% sang gintanyag), bayaran sang bumalakal'
    ],
    'slip.print': ['Print Slip', 'I-print ang Resibo', 'I-print ang Resibo'],
    'slip.sign': ['Received by', 'Tinanggap ni', 'Ginbaton ni'],
    // empty/error/success
    'empty.title': ['Nothing Here Yet', 'Wala Pang Laman', 'Wala Pa sang Sulod'],
    'empty.results': ['No results', 'Walang resulta', 'Wala sang resulta'],
    'error.retry': ['Try Again', 'Subukan Muli', 'Tilawan Liwat'],
    'sms.title': ['Messages to Farmer', 'Mga Mensahe sa Magsasaka', 'Mga Mensahe sa Mangunguma'],
    'state.farm.empty.title': ['No Farms Yet', 'Wala Pang Bukid', 'Wala Pa sang Uma'],
    'state.farm.empty.body': [
        'Register the first farm in this cluster. One farm, one farmer.',
        'Irehistro ang unang bukid sa cluster na ito. Isang bukid, isang magsasaka.',
        'Irehistro ang una nga uma sa sini nga cluster. Isa ka uma, isa ka mangunguma.'
    ],
    'state.farm.empty.action': ['Add Farm', 'Magdagdag ng Bukid', 'Magdugang sang Uma'],
    'state.farm.error.title': ['Could Not Save Farm', 'Hindi Na-save ang Bukid', 'Wala Na-save ang Uma'],
    'state.farm.error.body': [
        'No signal. Nothing was lost: it saves when you are back online.',
        'Walang signal. Walang nawala: mase-save pagbalik ng signal.',
        'Wala signal. Wala sang nadula: ma-save pagbalik sang signal.'
    ],
    'state.farm.success.title': ['Added to Cluster 1', 'Naidagdag sa Cluster 1', 'Nadugang sa Cluster 1'],
    'state.farm.success.body': [
        'Farmer {farm} gets an SMS confirmation.',
        'Makakatanggap ang Magsasaka {farm} ng SMS na kumpirmasyon.',
        'Makabaton ang Mangunguma {farm} sang SMS nga kumpirmasyon.'
    ],
    'state.farm.success.action': ['Next Farm', 'Susunod na Bukid', 'Masunod nga Uma'],
    'state.haul.empty.title': ['No Haul Requests', 'Walang Hiling na Hakot', 'Wala sang Pangayo nga Hakot'],
    'state.haul.empty.body': [
        'Requests appear here when a lot is ready for pickup.',
        'Lalabas dito ang mga hiling kapag handa nang kunin ang lot.',
        'Makita diri ang mga pangayo kon handa na kuhaon ang lot.'
    ],
    'state.haul.empty.action': ['New Request', 'Bagong Hiling', 'Bag-o nga Pangayo'],
    'state.haul.error.title': ['No Driver Available', 'Walang Bakanteng Driver', 'Wala sang Bakante nga Driver'],
    'state.haul.error.body': [
        'All trucks are busy. Pick a later time or split the lot.',
        'Abala ang lahat ng trak. Pumili ng ibang oras o hatiin ang lot.',
        'Okupado ang tanan nga trak. Magpili sang iban nga oras ukon partihon ang lot.'
    ],
    'state.haul.error.action': ['Change Time', 'Palitan ang Oras', 'Ilisan ang Oras'],
    'state.haul.success.title': ['Haul {haul} Delivered', 'Naihatid ang Hakot {haul}', 'Naihatod ang Hakot {haul}'],
    'state.haul.success.body': [
        '{sacks} sacks received at {dryer}. Dryer slot {slot}, {day}.',
        'Natanggap ang {sacks} sako sa {dryer}. Slot sa patuyuan {slot}, {day}.',
        'Nabaton ang {sacks} ka sako sa {dryer}. Slot sa pamalahan {slot}, {day}.'
    ],
    'state.haul.success.action': ['View Dryer Slot', 'Tingnan ang Slot', 'Tan-awa ang Slot'],
    'state.pay.empty.title': ['No Lots to Settle', 'Walang Lot na Babayaran', 'Wala sang Lot nga Bayaran'],
    'state.pay.empty.body': [
        'Lots appear here after drying and buyer receipt.',
        'Lalabas dito ang mga lot matapos patuyuin at matanggap ng mamimili.',
        'Makita diri ang mga lot pagkatapos ibilad kag mabaton sang bumalakal.'
    ],
    'state.pay.empty.action': ['Go to Dry', 'Pumunta sa Patuyo', 'Kadto sa Pamala'],
    'state.pay.error.title': ['Advance Not Sent', 'Hindi Naipadala ang Paunang Bayad', 'Wala Napadala ang Abanse'],
    'state.pay.error.body': [
        'The payout partner did not answer. No money left the account. Try again, or pay in cash and record it.',
        'Hindi sumagot ang payout partner. Walang perang lumabas. Subukan muli, o magbayad ng cash at itala ito.',
        'Wala nagsabat ang payout partner. Wala sang kuwarta nga naggwa. Tilawan liwat, ukon magbayad sang cash kag ilista ini.'
    ],
    'state.pay.success.title': [
        'Advance Sent: {advance}',
        'Naipadala ang Paunang Bayad: {advance}',
        'Napadala ang Abanse: {advance}'
    ],
    'state.pay.success.body': [
        'Farmer {farm} got an SMS. The {balance} balance follows buyer receipt.',
        'Nakatanggap ng SMS ang Magsasaka {farm}. Ang natitirang {balance} ay kasunod ng pagtanggap ng mamimili.',
        'Nakabaton sang SMS ang Mangunguma {farm}. Ang nabilin nga {balance} masunod pagbaton sang bumalakal.'
    ],
    'plan.section': [
        'Harvest by Barangay and Week',
        'Ani ayon sa Barangay at Linggo',
        'Alani suno sa Barangay kag Semana'
    ],
    'plan.stat.farms': ['Farms in Cluster', 'Bukid sa Cluster', 'Uma sa Cluster'],
    'plan.stat.area': ['Area', 'Lawak', 'Kalapad'],
    'plan.stat.tonnes': ['Planned Harvest', 'Planong Ani', 'Plano nga Alani'],
    'plan.stat.peak': ['Peak Week', 'Pinakamataas na Linggo', 'Pinakataas nga Semana'],
    'market.section.matches': [
        'Auto-Match for Lot {lot}',
        'Auto-Match para sa Lot {lot}',
        'Auto-Match para sa Lot {lot}'
    ],
    'market.match.reason': [
        'Same grade, same week, best price',
        'Parehong grado, parehong linggo, pinakamagandang presyo',
        'Pareho nga grado, pareho nga semana, pinakamaayo nga presyo'
    ],
    'dry.section': [
        'This Week at Cluster Dryer 1',
        'Ngayong Linggo sa Cluster Dryer 1',
        'Subong nga Semana sa Cluster Dryer 1'
    ],
    'dry.stat.capacity': ['Capacity per Day', 'Kapasidad Bawat Araw', 'Kapasidad Kada Adlaw'],
    'dry.stat.booked': ['Booked This Week', 'Naka-book Ngayong Linggo', 'Naka-book Subong nga Semana'],
    'pay.section.slip': ['Print Preview (A6)', 'Print Preview (A6)', 'Print Preview (A6)'],
    'pay.section.lot': ['Lot {lot} · Farm {farm}', 'Lot {lot} · Bukid {farm}', 'Lot {lot} · Uma {farm}'],
    'pay.stat.net': ['Net to Farmer', 'Netong Matatanggap', 'Neto nga Mabaton'],
    'pay.stat.advance': ['Advance 80%', 'Paunang Bayad 80%', 'Abanse 80%'],
    'pay.stat.balance': ['Balance 20%', 'Natitira 20%', 'Nabilin 20%'],
    'haul.driver.job': ['New Job', 'Bagong Trabaho', 'Bag-o nga Obra'],
    'haul.driver.pay': ['You earn', 'Kikitain mo', 'Kitaon mo'],
    'sms.note': [
        'Farmers get SMS only, no app. Each message fits one SMS.',
        'SMS lang ang natatanggap ng magsasaka, walang app. Kasya ang bawat mensahe sa isang SMS.',
        'SMS lang ang mabaton sang mangunguma, wala app. Kasya ang kada mensahe sa isa ka SMS.'
    ],
    'veh.toosmall': [
        'Too small for {n} sacks',
        'Masyadong maliit para sa {n} sako',
        'Gamay masyado para sa {n} ka sako'
    ],
    'veh.trips': ['{n} trips', '{n} biyahe', '{n} ka biyahe'],
    'step.now': ['now', 'ngayon', 'subong'],
    'route.note': [
        'stylized, not to scale',
        'pinasimple, hindi eksakto ang sukat',
        'ginpasimple, indi eksakto ang sukat'
    ],
    'pay.explain': [
        'Quoted {quoted}/kg − drying {drying} − coordination margin {margin} = net {net}/kg to the farmer. The buyer sourcing fee ({rate}/kg, {fee}) is paid by the buyer and never deducted from the farmer.',
        'Inalok na {quoted}/kg − pagpapatuyo {drying} − bayad sa koordinasyon {margin} = netong {net}/kg sa magsasaka. Ang bayad sa paghahanap ({rate}/kg, {fee}) ay sagot ng mamimili at hindi ibinabawas sa magsasaka.',
        'Gintanyag nga {quoted}/kg − pagpamala {drying} − bayad sa koordinasyon {margin} = neto nga {net}/kg sa mangunguma. Ang bayad sa pagpangita ({rate}/kg, {fee}) bayaran sang bumalakal kag indi ginabuhin sa mangunguma.'
    ],
    'pay.note.advance': ['Sent within 24 h', 'Naipadala sa loob ng 24 oras', 'Napadala sa sulod sang 24 oras'],
    'pay.note.balance': ['On buyer receipt', 'Pagkatanggap ng mamimili', 'Pagbaton sang bumalakal'],
    'pay.note.net': ['{kg} kg dried x {net}', '{kg} kg tuyo x {net}', '{kg} kg nga uga x {net}'],
    'pay.resend': ['Resend SMS', 'Ipadala Muli ang SMS', 'Ipadala Liwat ang SMS'],
    'pay.badge.delivered': ['{haul} Delivered', 'Naihatid ang {haul}', 'Naihatod ang {haul}'],
    'pay.badge.paid': ['Advance Paid', 'Bayad Na ang Paunang Bayad', 'Bayad Na ang Abanse'],
    'pay.badge.pending': ['Balance Pending', 'Naghihintay ang Natitira', 'Ginahulat ang Nabilin'],
    'slip.notdeducted': [
        'Not deducted from the farmer.',
        'Hindi ibinabawas sa magsasaka.',
        'Indi ginabuhin sa mangunguma.'
    ],
    'slip.farmlot': ['Farm · Lot', 'Bukid · Lot', 'Uma · Lot'],
    'slip.haulslot': ['Haul · Dryer Slot', 'Hakot · Slot sa Patuyuan', 'Hakot · Slot sa Pamalahan'],
    'slip.coordinator': ['Coordinator', 'Coordinator', 'Coordinator'],
    'slip.amount': ['Amount', 'Halaga', 'Kantidad'],
    'filter.all': ['All', 'Lahat', 'Tanan'],
    // footer + privacy notice (Phase 4; TL/HIL drafts: needs native review). The notice body follows
    // docs/plan/08-pilot-readiness.md; the DPO name and contact are provisional until O7 is answered.
    'footer.privacy': ['Privacy Notice', 'Paunawa sa Pagkapribado', 'Pahibalo sa Pagkapribado'],
    'privacy.eyebrow': [
        'RiceConnect · Data Privacy Act of 2012 (RA 10173)',
        'RiceConnect · Data Privacy Act of 2012 (RA 10173)',
        'RiceConnect · Data Privacy Act of 2012 (RA 10173)'
    ],
    'privacy.title': ['Privacy Notice', 'Paunawa sa Pagkapribado', 'Pahibalo sa Pagkapribado'],
    'privacy.version': ['Version {version}', 'Bersyon {version}', 'Bersyon {version}'],
    'privacy.intro': [
        'RiceConnect is run by Team Syntaxure Labs (ISUFST) for the rice cluster in Dingle, Iloilo. This notice explains what personal data we collect in the app and by SMS, why we collect it, who can see it, and the choices you have. It follows the Data Privacy Act of 2012 (RA 10173).',
        'Ang RiceConnect ay pinapatakbo ng Team Syntaxure Labs (ISUFST) para sa cluster ng palay sa Dingle, Iloilo. Ipinaliwanag ng paunawang ito kung anong personal na datos ang kinokolekta namin sa app at sa SMS, bakit, sino ang makakakita, at ang iyong mga pagpipilian. Sumusunod ito sa Data Privacy Act of 2012 (RA 10173).',
        'Ang RiceConnect ginadumala sang Team Syntaxure Labs (ISUFST) para sa cluster sang humay sa Dingle, Iloilo. Ginapaliwanag sang pahibalo nga ini kon ano nga personal nga datos ang ginatipon namon sa app kag sa SMS, ngaa, sin-o ang makakita, kag ang imo mga pagpili. Nagasunod ini sa Data Privacy Act of 2012 (RA 10173).'
    ],
    'privacy.collect.title': ['What We Collect', 'Ang Kinokolekta Namin', 'Ang Ginatipon Namon'],
    'privacy.collect.body': [
        'Your name; your mobile number (or email for buyers and coordinators); your barangay; your farm area, variety and harvest week; lot weights and grades; dryer slots; haul and delivery status; orders and settlement amounts; and the SMS messages we exchange with you.',
        'Ang iyong pangalan; numero ng mobile (o email para sa mga buyer at coordinator); barangay; lawak, klase at linggo ng ani ng iyong bukid; timbang at grado ng lot; slot sa patuyuan; katayuan ng hakot at paghatid; mga order at halaga ng settlement; at ang mga SMS na ipinagpapalitan natin.',
        'Ang imo ngalan; numero sang mobile (ukon email para sa mga buyer kag coordinator); barangay; kalapad, klase kag semana sang alani sang imo uma; timbang kag grado sang lot; slot sa pamalahan; kahimtangan sang hakot kag paghatod; mga order kag kantidad sang settlement; kag ang mga SMS nga ginapalitan naton.'
    ],
    'privacy.why.title': ['Why We Collect It', 'Bakit Namin Ito Kinokolekta', 'Ngaa Ginatipon Namon Ini'],
    'privacy.why.body': [
        'To plan harvests, book the dryer, assign hauls, keep buyers updated, compute and pay settlements, and send you SMS updates. We do not use the data for anything else, and we never sell it.',
        'Para magplano ng ani, mag-book ng patuyuan, magtalaga ng hakot, magbigay-alam sa mamimili, kalkulahin at bayaran ang settlement, at magpadala ng SMS. Hindi namin ginagamit ang datos sa ibang bagay, at hindi namin ito ibinebenta.',
        'Para makaplano sang alani, makabook sang pamalahan, makatalaga sang hakot, makapahibalo sa bumalakal, makalkulo kag makabayad sang settlement, kag makapadala sang SMS. Indi namon ginagamit ang datos sa iban, kag indi namon ini ginabaligya.'
    ],
    'privacy.who.title': ['Who Can See It', 'Sino ang Makakakita', 'Sin-o ang Makakita'],
    'privacy.who.body': [
        'You see your own records. The cluster coordinator sees the cluster\u2019s farms, lots, slots, hauls and settlements. A buyer sees the lots, weights and settlement totals tied to their own orders, and never your home or mobile number. A driver sees only the haul assigned to them. RiceConnect team members see records only to fix a problem, and every administrative action is logged.',
        'Nakikita mo ang iyong sariling talaan. Nakikita ng coordinator ng cluster ang mga bukid, lot, slot, hakot at settlement ng cluster. Nakikita ng mamimili ang mga lot, timbang at kabuuang settlement na konektado sa kanilang order, at hindi ang iyong tahanan o numero. Nakikita ng driver ang hakot na itinalaga sa kanya. Ang mga miyembro ng RiceConnect ay nakakakita ng talaan para ayusin ang problema lamang, at naka-log ang bawat aksyong administratibo.',
        'Makita mo ang imo kaugalingon nga rekord. Makita sang coordinator sang cluster ang mga uma, lot, slot, hakot kag settlement sang cluster. Makita sang bumalakal ang mga lot, timbang kag kabilugan nga settlement nga nakaangot sa ila order, kag indi ang imo balay ukon numero. Makita sang driver ang hakot nga gin-assign sa iya. Ang mga miyembro sang RiceConnect makakita sang rekord para ayuhon ang problema lamang, kag naka-log ang kada aksyon nga administratibo.'
    ],
    'privacy.retention.title': ['How Long We Keep It', 'Gaano Katagal Itinatago', 'Pila Kadugay Ginatago'],
    'privacy.retention.body': [
        'We keep records only while the pilot and its audit need them, then delete or anonymise them. The retention periods are listed in the project\u2019s data inventory and are being confirmed with the cluster before the pilot starts.',
        'Itinatago namin ang talaan hangga\u2019t kailangan ito ng pilot at ng audit nito, pagkatapos ay binubura o ginagawang anonymous. Ang mga tagal ng pagtatago ay nakalista sa data inventory ng proyekto at kinukumpirma pa sa cluster bago magsimula ang pilot.',
        'Ginatago namon ang rekord samtang kinahanglan ini sang pilot kag sang audit, dayon ginapanas ukon ginahimo nga anonymous. Ang mga tagal sang pagtago nakalista sa data inventory sang proyekto kag gina-confirm pa sa cluster antes magsugod ang pilot.'
    ],
    'privacy.rights.title': ['Your Rights', 'Ang Iyong Mga Karapatan', 'Ang Imo Mga Kinamatarong'],
    'privacy.rights.body': [
        'You can ask to see, correct or delete your data, or withdraw your consent at any time, by contacting the Data Protection Officer. We answer within the time the Data Privacy Act allows. Withdrawing consent means we can no longer run your account.',
        'Maaari mong hilingin na tingnan, itama o burahin ang iyong datos, o bawiin ang pahintulot anumang oras, sa pamamagitan ng pakikipag-ugnayan sa Data Protection Officer. Sasagot kami sa loob ng panahong pinapayagan ng Data Privacy Act. Ang pagbawi ng pahintulot ay nangangahulugang hindi na namin mapapatakbo ang iyong account.',
        'Mahimo mo pangayuon nga tan-awon, tadlungon ukon panason ang imo datos, ukon bawi-on ang pagtugot bisan ano nga oras, paagi sa pagkontak sa Data Protection Officer. Sabton namon sa sulod sang tion nga ginatugot sang Data Privacy Act. Ang pagbawi sang pagtugot nagakahulugan nga indi na namon mapadalagan ang imo account.'
    ],
    'privacy.contact.title': ['Contact', 'Makipag-ugnayan', 'Kontaka Kami'],
    'privacy.contact.body': [
        'Data Protection Officer: to be named before the pilot. For now, contact the team at team@example.com (placeholder); the final name and contact will be published here before the pilot starts.',
        'Data Protection Officer: pangalanan bago ang pilot. Sa ngayon, makipag-ugnayan sa team sa team@example.com (placeholder); ang huling pangalan at kontak ay ipalalathala dito bago magsimula ang pilot.',
        'Data Protection Officer: paganganlan antes ang pilot. Sa subong, kontaka ang team sa team@example.com (placeholder); ang katapusan nga ngalan kag kontak i-publish diri antes magsugod ang pilot.'
    ],
    'privacy.changes.title': [
        'Changes to This Notice',
        'Mga Pagbabago sa Paunawang Ito',
        'Mga Pagbag-o sa Pahibalo nga Ini'
    ],
    'privacy.changes.body': [
        'If this notice changes, the version on this page changes too. The version you accepted is stored with your consent record.',
        'Kung magbabago ang paunawang ito, magbabago rin ang bersyon sa pahinang ito. Ang bersyong tinanggap mo ay nakaimbak kasama ng iyong consent record.',
        'Kon magbag-o ini nga pahibalo, magbag-o man ang bersyon sa sini nga pahina. Ang bersyon nga ginbaton mo naka-store upod sang imo consent record.'
    ],
    'privacy.back': ['Back to RiceConnect', 'Bumalik sa RiceConnect', 'Balik sa RiceConnect'],
    'auth.consent.link': [
        'Read the Privacy Notice',
        'Basahin ang Paunawa sa Pagkapribado',
        'Basaha ang Pahibalo sa Pagkapribado'
    ],
    'plan.noFarm.title': ['No Farm Linked Yet', 'Wala Pang Bukid na Naka-link', 'Wala Pa sang Uma nga Naka-link'],
    'plan.noFarm.body': [
        'Your account has no farm in this cluster yet. The coordinator links one when you register: one farm, one farmer.',
        'Wala pang bukid ang iyong account sa cluster na ito. Ililink ito ng coordinator kapag nagrehistro: isang bukid, isang magsasaka.',
        'Wala pa sang uma ang imo account sa sini nga cluster. I-link ini sang coordinator kon magrehistro: isa ka uma, isa ka mangunguma.'
    ]
};

/* Prototype additions live in strings.prototype.ts (EN complete; TL and HIL drafts: needs native review). */
Object.assign(STRINGS, PROTOTYPE_STRINGS);

const idx: Record<Lang, number> = { en: 0, tl: 1, hil: 2 };
export const translate = (lang: Lang, key: string) => STRINGS[key]?.[idx[lang]] ?? key;
/** Fill {name} placeholders. Values are already formatted (money, kg, dates). */
export const fill = (text: string, vars?: Record<string, string | number>) =>
    vars ? text.replace(/\{(\w+)\}/g, (m, k) => (vars[k] !== undefined ? String(vars[k]) : m)) : text;

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: string, vars?: Record<string, string | number>) => string };
const Ctx = createContext<Ctx>({ lang: 'en', setLang: () => {}, t: (k, v) => fill(translate('en', k), v) });

const STORE = 'rc-lang';
const isLang = (v: unknown): v is Lang => v === 'en' || v === 'tl' || v === 'hil';

/** Holds the current language; every LanguageSwitcher, SmsBubble and SettlementSlip inside follows it.
    Prototype port: no BroadcastChannel (the app is one page tree); the choice is kept in localStorage
    (try/catch) and mirrored to <html lang>. */
export function I18nProvider({ lang: initial = 'en', children }: PropsWithChildren<{ lang?: Lang }>) {
    const [lang, setLangState] = useState<Lang>(initial);
    useEffect(() => {
        installZodErrorMap();
        try {
            const v = window.localStorage.getItem(STORE);
            if (isLang(v)) setLangState(v);
        } catch {
            /* storage blocked */
        }
    }, []);
    useEffect(() => {
        document.documentElement.lang = lang === 'hil' ? 'hil' : lang;
    }, [lang]);
    const setLang = useCallback((l: Lang) => {
        setLangState(l);
        try {
            window.localStorage.setItem(STORE, l);
        } catch {
            /* storage blocked */
        }
    }, []);
    const value = useMemo<Ctx>(() => ({ lang, setLang, t: (k, v) => fill(translate(lang, k), v) }), [lang, setLang]);
    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useI18n = () => useContext(Ctx);

/** Translate when the value is a STRINGS key, else return it as written. */
export function tx(t: (k: string) => string, v: string): string;
export function tx(t: (k: string) => string, v: string | undefined): string | undefined;
export function tx(t: (k: string) => string, v: ReactNode): ReactNode;
export function tx(t: (k: string) => string, v: ReactNode): ReactNode {
    return typeof v === 'string' && STRINGS[v] ? t(v) : v;
}
/** Inline translated text: <T k="plan.section" />. */
export function T({ k, vars }: { k: string; vars?: Record<string, string | number> }) {
    const { t } = useI18n();
    return <>{t(k, vars)}</>;
}

'use client';
import { PROTOTYPE_STRINGS } from './strings.prototype';
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
    'filter.all': ['All', 'Lahat', 'Tanan']
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

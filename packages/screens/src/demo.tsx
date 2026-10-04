'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ASSETS, EndCard, Icon, useI18n } from '@rc/ui';
import { FrameProvider } from './shell';
import { FarmProfileScreen } from './farm';
import { PlanScreen } from './plan';
import { MarketScreen } from './market';
import { DryScreen } from './dry';
import { HaulCoordinatorScreen, HaulDriverScreen } from './haul';
import { PayLotScreen } from './pay';
import { SmsScreen } from './sms';
import { HERO_FARM } from '@rc/domain/seed';

import { BEATS, TOTAL, beatIndexAt, flipLang, haulAt } from './timeline';
export { BEATS, TOTAL };

/** One frame of the sequence at time t (seconds). */
export function Stage({ t }: { t: number }) {
    const { t: tr } = useI18n();
    const beat = BEATS[beatIndexAt(t)].key;
    switch (beat) {
        case 'farm':
            return (
                <FrameProvider framed>
                    <FarmProfileScreen id={HERO_FARM.id} added={t >= 3} />
                </FrameProvider>
            );
        case 'plan':
            return <PlanScreen />;
        case 'market':
            return <MarketScreen committed={t >= 22} />;
        case 'dry':
            return <DryScreen />;
        case 'haul': {
            const h = haulAt(t);
            return (
                <FrameProvider framed>
                    {h.who === 'coordinator' ? (
                        <HaulCoordinatorScreen status={h.status} />
                    ) : (
                        <HaulDriverScreen status={h.status} />
                    )}
                </FrameProvider>
            );
        }
        case 'pay':
            return <PayLotScreen />;
        case 'sms':
            return (
                <FrameProvider framed>
                    <SmsScreen />
                </FrameProvider>
            );
        default:
            return <EndCard logoSrc={ASSETS.logoReversed} title={tr('end.title')} className="min-h-screen w-full" />;
    }
}

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

/** /demo — arrows step, space pauses, R restarts. ?rec=1 hides the demo controls; ?flip=1 flips the language in the SMS beat;
    ?beat=N (1-8) starts at beat N. */
export function DemoPlayer({ rec, flip, startBeat }: { rec: boolean; flip: boolean; startBeat: number }) {
    const { t, setLang } = useI18n();
    const [time, setTime] = useState<number>(BEATS[startBeat]?.start ?? 0);
    const [playing, setPlaying] = useState(true);
    const last = useRef<number | null>(null);

    useEffect(() => {
        if (!playing) {
            last.current = null;
            return;
        }
        let raf = 0;
        const tick = (now: number) => {
            if (last.current !== null) setTime((x) => Math.min(TOTAL, x + (now - last.current!) / 1000));
            last.current = now;
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [playing]);
    useEffect(() => {
        if (time >= TOTAL) setPlaying(false);
    }, [time]);
    const wanted = flip ? flipLang(time) : null;
    useEffect(() => {
        if (wanted) setLang(wanted);
    }, [wanted, setLang]);

    const go = useCallback((delta: number) => {
        setTime((x) => {
            const i = beatIndexAt(x);
            const target = delta < 0 && x - BEATS[i].start > 1 ? i : Math.min(BEATS.length - 1, Math.max(0, i + delta));
            return BEATS[target].start;
        });
        last.current = null;
    }, []);
    const restart = useCallback(() => {
        setTime(0);
        last.current = null;
        setPlaying(true);
    }, []);
    const toggle = useCallback(
        () =>
            setPlaying((p) => {
                if (!p) last.current = null;
                return !p;
            }),
        []
    );

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const el = e.target as HTMLElement | null;
            if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return;
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                go(1);
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                go(-1);
            } else if (e.key === ' ' || e.code === 'Space') {
                e.preventDefault();
                if (time >= TOTAL) restart();
                else toggle();
            } else if (e.key === 'r' || e.key === 'R') {
                e.preventDefault();
                restart();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [go, restart, toggle, time]);

    const i = beatIndexAt(time);
    return (
        <div className="relative min-h-screen" data-demo-time={time.toFixed(1)} data-demo-beat={BEATS[i].key}>
            <Stage t={time} />
            {!rec && (
                <div
                    role="region"
                    aria-label={t('demo.controls')}
                    className="print:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[min(760px,calc(100%-2rem))] glass-panel rounded-[1.5rem] p-3 flex flex-col gap-2"
                >
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="eyebrow min-w-0 flex-1" aria-live="polite">
                            {i + 1}/{BEATS.length} · {t('demo.beat.' + BEATS[i].key)}
                        </span>
                        <span className="text-[14px] font-extrabold tabular">
                            {mmss(time)} / {mmss(TOTAL)}
                        </span>
                    </div>
                    <div className="h-2 rounded-full bg-[rgba(2,44,34,.12)] overflow-hidden" aria-hidden>
                        <div className="h-full bg-[var(--fill-strong)]" style={{ width: `${(time / TOTAL) * 100}%` }} />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => go(-1)}
                            className="inline-flex items-center gap-1.5 min-h-[40px] px-3 rounded-full border-2 border-[color:var(--text-muted)] text-[13px] font-extrabold uppercase tracking-[0.06em]"
                        >
                            <Icon name="ChevronLeft" size={20} />
                            {t('demo.prev')}
                        </button>
                        <button
                            type="button"
                            onClick={toggle}
                            aria-pressed={!playing}
                            className="inline-flex items-center gap-1.5 min-h-[40px] px-3 rounded-full bg-[var(--fill-strong)] text-[var(--on-fill-strong)] text-[13px] font-extrabold uppercase tracking-[0.06em]"
                        >
                            <Icon name={playing ? 'Pause' : 'Play'} size={20} />
                            {t(playing ? 'demo.pause' : 'demo.play')}
                        </button>
                        <button
                            type="button"
                            onClick={() => go(1)}
                            className="inline-flex items-center gap-1.5 min-h-[40px] px-3 rounded-full border-2 border-[color:var(--text-muted)] text-[13px] font-extrabold uppercase tracking-[0.06em]"
                        >
                            {t('demo.next')}
                            <Icon name="ChevronRight" size={20} />
                        </button>
                        <button
                            type="button"
                            onClick={restart}
                            className="inline-flex items-center gap-1.5 min-h-[40px] px-3 rounded-full border-2 border-[color:var(--text-muted)] text-[13px] font-extrabold uppercase tracking-[0.06em]"
                        >
                            <Icon name="Retry" size={20} />
                            {t('demo.restart')}
                        </button>
                        <span className="ml-auto text-[14px] font-bold text-[var(--text-secondary)]">
                            {t('demo.keys')}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

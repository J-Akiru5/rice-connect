'use client';
import { useState } from 'react';
import { ACCOUNTS, ApplicationLogo, DemoChip, Icon, LanguageSwitcher, PrimaryButton, SecondaryButton, TeamFooter, ThemeToggle, ZLink, tx, useI18n, useZoneNav } from '@rc/ui';
import { signIn, signOut, type SessionRole } from '@rc/store';
import { useDemoState, updateDemoState } from '@rc/store/react';

/* Simulated sign-in, one page per app (prototype addition, docs/DECISIONS.md M22): /login (coordinator),
   /buyer/login, /driver/login, /admin/login. Each page signs in that app's one demo identity from the seed.
   No accounts, no passwords, no choosing who you are; the "session" is a field in this browser's demo state. */
export function SignInScreen({ role }: { role: SessionRole }) {
    const { t } = useI18n();
    const nav = useZoneNav();
    const a = ACCOUNTS[role];
    const current = useDemoState().session[role];
    const [busy, setBusy] = useState(false);
    const go = () => { setBusy(true); updateDemoState(signIn(role, a.id)); nav(a.home); };
    return (
        <div className="rc-ground-auth min-h-screen flex flex-col">
            <header className="px-4 md:px-8 py-3 flex items-center gap-3 flex-wrap">
                <ZLink href="/" className="rounded-xl shrink-0"><ApplicationLogo height={40} /></ZLink>
                <div className="flex-1" />
                <LanguageSwitcher />
                <ThemeToggle iconSize={20} />
            </header>
            <main className="flex-1 flex items-center justify-center px-4 py-8">
                <section aria-labelledby="signin-h" className="glass-panel rounded-[2rem] p-6 md:p-8 w-full max-w-[480px] flex flex-col gap-5">
                    <div className="flex flex-wrap items-center gap-2"><span className="eyebrow">{t('login.eyebrow')}</span><DemoChip /></div>
                    <div className="flex items-start gap-3">
                        <span className="icon-box shrink-0"><Icon name={a.icon} size={24} /></span>
                        <div className="min-w-0 flex flex-col gap-1">
                            <h1 id="signin-h" className="text-[28px] md:text-[32px] leading-tight font-extrabold tracking-[-0.03em]">{t('signin.title', { app: t(a.name) })}</h1>
                            <p className="m-0 text-[16px] leading-6 font-medium text-[var(--text-secondary)]">{t(a.about)}</p>
                        </div>
                    </div>
                    <dl className="m-0 rounded-[1.25rem] border-2 border-[color:var(--glass-border)] p-4 flex flex-col gap-3">
                        <div className="flex flex-col gap-0.5">
                            <dt className="eyebrow">{t('signin.account')}</dt>
                            <dd className="m-0 text-[17px] font-extrabold break-words">{tx(t, a.id)}</dd>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <dt className="eyebrow">{t('signin.password')}</dt>
                            <dd className="m-0 text-[15px] font-semibold text-[var(--text-secondary)]">{t('signin.password.none')}</dd>
                        </div>
                    </dl>
                    {current ? (
                        <div className="flex flex-col gap-3">
                            <p role="status" className="m-0 inline-flex items-center gap-2 text-[15px] font-semibold"><Icon name="Check" size={20} className="shrink-0 text-[var(--text-accent)]" />{t('signin.as', { who: tx(t, current) })}</p>
                            <div className="flex flex-wrap gap-3">
                                <PrimaryButton icon="ArrowRight" onClick={() => nav(a.home)}>{t('signin.continue')}</PrimaryButton>
                                <SecondaryButton icon="LogOut" onClick={() => updateDemoState(signOut(role))}>{t('signin.out')}</SecondaryButton>
                            </div>
                        </div>
                    ) : (
                        <PrimaryButton icon="LogIn" onClick={go} disabled={busy} className="w-full justify-center">{t('signin.cta')}</PrimaryButton>
                    )}
                    <p className="m-0 flex items-start gap-2 text-[14px] leading-5 font-semibold text-[var(--text-secondary)]"><Icon name="Shield" size={20} className="shrink-0" />{t('signin.note')} {t('login.note')}</p>
                    <ZLink href="/" className="self-start inline-flex items-center gap-2 min-h-[44px] text-[14px] font-extrabold uppercase tracking-[0.06em] text-[var(--text-accent)]"><Icon name="ChevronLeft" size={20} />{t('mk.back')}</ZLink>
                </section>
            </main>
            <TeamFooter className="text-center" />
        </div>
    );
}

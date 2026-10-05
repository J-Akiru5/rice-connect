'use client';
import { DemoChip, ErrorState, Icon, LoadingState, TeamFooter, ZLink, useI18n } from '@rc/ui';

/* App-level states for every route (F-11): branded 404, error page with a reference code, and a loading
   skeleton. Apps render these from their not-found / error / loading files. */

function PageShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="rc-ground min-h-screen flex flex-col">
            <main className="flex-1 flex items-center justify-center px-4 py-10">{children}</main>
            <TeamFooter className="text-center" />
        </div>
    );
}

function HomeLink({ href, label }: { href: string; label: string }) {
    return (
        <ZLink
            href={href}
            className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full border-2 border-[color:var(--text-muted)] text-[13px] font-extrabold uppercase tracking-[0.06em]"
        >
            <Icon name="Home" size={20} />
            <span>{label}</span>
        </ZLink>
    );
}

export function NotFoundScreen({ homeHref }: { homeHref: string }) {
    const { t } = useI18n();
    return (
        <PageShell>
            <div className="w-full max-w-[560px] flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="eyebrow">RiceConnect</span>
                    <DemoChip />
                </div>
                <ErrorState variant="notFound" />
                <HomeLink href={homeHref} label={t('state.home')} />
            </div>
        </PageShell>
    );
}

export function ErrorScreen({
    homeHref,
    reference,
    onRetry
}: {
    homeHref: string;
    reference?: string;
    onRetry: () => void;
}) {
    const { t } = useI18n();
    return (
        <PageShell>
            <div className="w-full max-w-[560px] flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="eyebrow">RiceConnect</span>
                    <DemoChip />
                </div>
                <ErrorState reference={reference} onRetry={onRetry} />
                <HomeLink href={homeHref} label={t('state.home')} />
            </div>
        </PageShell>
    );
}

export function LoadingScreen() {
    const { t } = useI18n();
    return (
        <div className="rc-ground min-h-screen p-6">
            <span className="sr-only">{t('state.loading')}</span>
            <LoadingState rows={4} />
        </div>
    );
}

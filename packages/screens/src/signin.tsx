'use client';
import { useEffect, useId, useState, type ReactNode } from 'react';
import {
    ACCOUNTS,
    ApplicationLogo,
    Checkbox,
    Controller,
    DemoChip,
    Field,
    Form,
    Icon,
    InputError,
    LanguageSwitcher,
    PrimaryButton,
    SecondaryButton,
    SubmitButton,
    TeamFooter,
    TextInput,
    ThemeToggle,
    ZLink,
    auth,
    tx,
    useForm,
    useI18n,
    useZoneNav,
    type Resolver
} from '@rc/ui';
import type { SessionRole } from '@rc/store';
import { useDemoState } from '@rc/store/react';
import { checkConsent, checkIdentifier, checkPassword, checkRequired, toE164 } from '@rc/domain/auth-form';
import { BUYER_TYPES } from '@rc/domain/buyers';
import { BARANGAYS } from '@rc/domain/params';
import { VEHICLES } from '@rc/domain/seed';

/* Sign In / Sign Up, one pair per app (prototype addition, docs/DECISIONS.md M23): /login + /signup (coordinator),
   /buyer/login + /buyer/signup, /driver/login + /driver/signup, /farmer/login + /farmer/signup, /admin/login.
   Split layout: brand panel left (desktop), form right. Built on the form kit (D-03): labelled fields, inline
   errors from the domain checks (i18n keys), focus on the first invalid field, locked submit while pending.
   The form talks only to the AuthAdapter (`auth` from @rc/ui), which is the mock today: nothing typed is kept,
   and it signs in as the app's one demo identity. */
export type AuthMode = 'signin' | 'signup';
type Field = {
    name: string;
    label: string;
    kind: 'text' | 'email' | 'tel' | 'password' | 'select';
    autoComplete?: string;
    options?: { value: string; label: string }[];
    hint?: string;
};

type AuthFormValues = {
    identifier: string;
    password: string;
    name?: string;
    buyerType?: string;
    vehicle?: string;
    barangay?: string;
    consent?: boolean;
};

/* The extra sign-up fields for each app (besides the identifier, password and consent). */
function profileFields(role: SessionRole, t: (k: string) => string): Field[] {
    const select = (values: readonly string[], label: (v: string) => string) =>
        values.map((v) => ({ value: v, label: label(v) }));
    switch (role) {
        case 'buyer':
            return [
                { name: 'name', label: 'auth.f.business', kind: 'text', autoComplete: 'organization' },
                {
                    name: 'buyerType',
                    label: 'auth.f.buyerType',
                    kind: 'select',
                    options: select(BUYER_TYPES, (v) => t(`buyer.type.${v}`))
                }
            ];
        case 'driver':
            return [
                { name: 'name', label: 'auth.f.name', kind: 'text', autoComplete: 'name' },
                {
                    name: 'vehicle',
                    label: 'auth.f.vehicle',
                    kind: 'select',
                    options: select(
                        VEHICLES.map((v) => v.id),
                        (v) => t(`veh.${v}`)
                    )
                }
            ];
        case 'farmer':
            return [
                { name: 'name', label: 'auth.f.name', kind: 'text', autoComplete: 'name' },
                { name: 'barangay', label: 'auth.f.barangay', kind: 'select', options: select(BARANGAYS, (v) => v) }
            ];
        default:
            return [{ name: 'name', label: 'auth.f.name', kind: 'text', autoComplete: 'name' }];
    }
}

/** The domain checks (tested in @rc/domain/auth-form) as an RHF resolver: messages are i18n keys. */
function makeResolver(
    fields: Field[],
    signup: boolean,
    account: (typeof ACCOUNTS)[SessionRole]
): Resolver<AuthFormValues> {
    return async (values) => {
        const errors: Record<string, { type: string; message: string }> = {};
        for (const f of fields) {
            const x = values[f.name as keyof AuthFormValues];
            const s = typeof x === 'string' ? x : '';
            const key =
                f.name === 'identifier'
                    ? checkIdentifier(account.identifier, s)
                    : f.name === 'password'
                      ? checkPassword(s, signup)
                      : checkRequired(s);
            if (key) errors[f.name] = { type: 'validation', message: key };
        }
        if (signup) {
            const key = checkConsent(values.consent === true);
            if (key) errors.consent = { type: 'validation', message: key };
        }
        return Object.keys(errors).length > 0 ? { values: {}, errors: errors as never } : { values, errors: {} };
    };
}

export function AuthScreen({ role, mode }: { role: SessionRole; mode: AuthMode }) {
    const { t } = useI18n();
    const nav = useZoneNav();
    const a = ACCOUNTS[role];
    const signup = mode === 'signup' && a.signUp !== null;
    const current = useDemoState().session[role];
    const uid = useId();
    const [showPw, setShowPw] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    /* S-12: the route guard sends signed-out users here with ?next=<the page>; return there after sign-in.
       Same-origin paths only, so the parameter can never be an open redirect. */
    const [next, setNext] = useState<string | null>(null);
    useEffect(() => {
        const raw = new URLSearchParams(window.location.search).get('next');
        if (raw && /^\/(?!\/)/.test(raw) && !raw.includes('\\')) setNext(raw);
    }, []);
    const goHome = () => nav(next ?? a.home);

    const idField: Field =
        a.identifier === 'email'
            ? { name: 'identifier', label: 'auth.f.email', kind: 'email', autoComplete: 'email' }
            : {
                  name: 'identifier',
                  label: 'auth.f.mobile',
                  kind: 'tel',
                  autoComplete: 'tel',
                  hint: 'auth.mobile.hint'
              };
    const pwField: Field = {
        name: 'password',
        label: 'auth.f.password',
        kind: 'password',
        autoComplete: signup ? 'new-password' : 'current-password',
        hint: signup ? 'auth.pw.hint' : undefined
    };
    const fields = signup ? [...profileFields(role, t), idField, pwField] : [idField, pwField];

    const form = useForm<AuthFormValues>({
        defaultValues: {
            identifier: '',
            password: '',
            name: '',
            buyerType: '',
            vehicle: '',
            barangay: '',
            consent: false
        },
        resolver: makeResolver(fields, signup, a),
        mode: 'onSubmit',
        reValidateMode: 'onChange'
    });

    const onValid = async (values: AuthFormValues) => {
        setFormError(null);
        const identifier = a.identifier === 'mobile' ? toE164(values.identifier) : values.identifier.trim();
        const { identifier: _i, password, consent: _c, name = '', ...profile } = values;
        const res = signup
            ? await auth.signUp(role, { identifier, password, name: name.trim(), profile })
            : await auth.signIn(role, { identifier, password });
        if (!res.ok) {
            setFormError(t(`auth.err.${res.code}`));
            return;
        }
        goHome();
    };

    const showPwButton = (
        <button
            type="button"
            onClick={() => setShowPw((s) => !s)}
            aria-controls="auth-password"
            aria-pressed={showPw}
            className="mb-1 inline-flex items-center gap-1.5 min-h-[40px] px-2 rounded-full text-[13px] font-extrabold uppercase tracking-[0.06em] text-[var(--text-accent)]"
        >
            <Icon name={showPw ? 'EyeOff' : 'Eye'} size={20} />
            {t(showPw ? 'auth.pw.hide' : 'auth.pw.show')}
        </button>
    );

    const title = signup ? t('auth.signup.h', { app: t(a.name) }) : t('auth.signin.h');
    const sub = signup ? t(a.about) : t('auth.signin.sub', { app: t(a.name) });
    return (
        <div className="rc-ground-auth min-h-screen lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <BrandPanel role={role} />
            <div className="min-h-screen flex flex-col min-w-0">
                <header className="px-4 md:px-8 py-3 flex items-center gap-3 flex-wrap">
                    <ZLink href="/" className="lg:hidden rounded-xl shrink-0">
                        <ApplicationLogo height={36} />
                    </ZLink>
                    <ZLink
                        href="/"
                        className="hidden lg:inline-flex items-center gap-2 min-h-[40px] text-[13px] font-extrabold uppercase tracking-[0.06em] text-[var(--text-accent)]"
                    >
                        <Icon name="ChevronLeft" size={20} />
                        {t('mk.back')}
                    </ZLink>
                    <div className="flex-1" />
                    <LanguageSwitcher />
                    <ThemeToggle iconSize={20} />
                </header>
                <main className="flex-1 flex items-center justify-center px-4 py-8 md:py-12">
                    <section aria-labelledby={`${uid}-h`} className="w-full max-w-[440px] flex flex-col gap-6">
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="lg:hidden icon-box !w-10 !h-10 shrink-0">
                                    <Icon name={a.icon} size={20} />
                                </span>
                                <span className="eyebrow">{t(a.name)}</span>
                                <DemoChip />
                            </div>
                            <h1
                                id={`${uid}-h`}
                                className="m-0 text-[30px] md:text-[36px] leading-tight font-extrabold tracking-[-0.03em]"
                            >
                                {title}
                            </h1>
                            <p className="m-0 text-[16px] leading-6 font-medium text-[var(--text-secondary)]">{sub}</p>
                        </div>
                        <p className="m-0 flex items-start gap-2 rounded-2xl border-2 border-[color:var(--glass-border-strong)] bg-[var(--glass-fill-strong)] px-4 py-3 text-[14px] leading-5 font-semibold">
                            <Icon name="Info" size={20} className="shrink-0 mt-px text-[var(--info)]" />
                            <span>{t('auth.mock', { id: tx(t, a.id) })}</span>
                        </p>
                        {current ? (
                            <div className="glass-panel rounded-[1.5rem] p-5 flex flex-col gap-4">
                                <p
                                    role="status"
                                    className="m-0 inline-flex items-center gap-2 text-[16px] font-semibold"
                                >
                                    <Icon name="Check" size={20} className="shrink-0 text-[var(--text-accent)]" />
                                    {t('signin.as', { who: tx(t, current) })}
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <PrimaryButton icon="ArrowRight" onClick={goHome}>
                                        {t('signin.continue')}
                                    </PrimaryButton>
                                    <SecondaryButton
                                        icon="LogOut"
                                        onClick={() => {
                                            void auth.signOut(role);
                                        }}
                                    >
                                        {t('signin.out')}
                                    </SecondaryButton>
                                </div>
                            </div>
                        ) : (
                            <Form
                                form={form}
                                onSubmit={onValid}
                                busy={form.formState.isSubmitting}
                                className="flex flex-col gap-5"
                            >
                                {formError && (
                                    <p
                                        role="alert"
                                        className="m-0 flex items-start gap-2 rounded-2xl bg-[var(--danger-soft)] text-[var(--danger-ink)] px-4 py-3 text-[14px] leading-5 font-semibold"
                                    >
                                        <Icon name="Alert" size={20} className="shrink-0" />
                                        {formError}
                                    </p>
                                )}
                                {fields.map((f) => (
                                    <Field
                                        key={f.name}
                                        name={f.name}
                                        label={t(f.label)}
                                        hint={f.hint ? t(f.hint) : undefined}
                                        labelAside={f.kind === 'password' ? showPwButton : undefined}
                                    >
                                        {({ value, onChange, onBlur, name, invalid, describedBy }) =>
                                            f.kind === 'select' ? (
                                                <select
                                                    id={`auth-${name}`}
                                                    name={name}
                                                    value={value}
                                                    onChange={(e) => onChange(e.target.value)}
                                                    onBlur={onBlur}
                                                    aria-invalid={invalid}
                                                    aria-describedby={describedBy}
                                                    required
                                                    className="input-2026 !text-base"
                                                >
                                                    <option value="">{t('auth.select')}</option>
                                                    {f.options?.map((o) => (
                                                        <option key={o.value} value={o.value}>
                                                            {o.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <TextInput
                                                    id={`auth-${name}`}
                                                    name={name}
                                                    value={value}
                                                    onChange={(e) => onChange(e.target.value)}
                                                    onBlur={onBlur}
                                                    aria-invalid={invalid}
                                                    aria-describedby={describedBy}
                                                    required
                                                    autoComplete={f.autoComplete}
                                                    type={
                                                        f.kind === 'password' ? (showPw ? 'text' : 'password') : f.kind
                                                    }
                                                    inputMode={
                                                        f.kind === 'tel'
                                                            ? 'tel'
                                                            : f.kind === 'email'
                                                              ? 'email'
                                                              : undefined
                                                    }
                                                    placeholder={
                                                        f.kind === 'email'
                                                            ? 'name@example.com'
                                                            : f.kind === 'tel'
                                                              ? '09XX XXX XXXX'
                                                              : undefined
                                                    }
                                                    className="!text-base"
                                                />
                                            )
                                        }
                                    </Field>
                                ))}
                                {signup && (
                                    <Controller
                                        name="consent"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <div className="flex flex-col">
                                                <Checkbox
                                                    name="consent"
                                                    checked={field.value === true}
                                                    onCheckedChange={(c) => field.onChange(c)}
                                                    label={t('auth.consent')}
                                                    invalid={Boolean(fieldState.error)}
                                                    describedBy={fieldState.error ? `${uid}-consent-err` : undefined}
                                                />
                                                <InputError
                                                    id={`${uid}-consent-err`}
                                                    message={
                                                        fieldState.error?.message
                                                            ? t(String(fieldState.error.message))
                                                            : undefined
                                                    }
                                                />
                                            </div>
                                        )}
                                    />
                                )}
                                <SubmitButton
                                    icon={signup ? 'Plus' : 'LogIn'}
                                    className="w-full justify-center"
                                    label={t(signup ? 'auth.cta.signup' : 'signin.cta')}
                                    pendingLabel={t(signup ? 'auth.busy.signup' : 'auth.busy.signin')}
                                />
                            </Form>
                        )}
                        <SwitchLine role={role} signup={signup} />
                        <p className="m-0 flex items-start gap-2 text-[14px] leading-5 font-medium text-[var(--text-secondary)]">
                            <Icon name="Shield" size={20} className="shrink-0" />
                            {t('login.note')}
                        </p>
                    </section>
                </main>
                <TeamFooter className="text-center" />
            </div>
        </div>
    );
}

/** "New to RiceConnect? Create an Account" / "Already have an account? Sign In" / admin: invite only. */
function SwitchLine({ role, signup }: { role: SessionRole; signup: boolean }) {
    const { t } = useI18n();
    const a = ACCOUNTS[role];
    const link = (href: string, children: ReactNode) => (
        <ZLink
            href={href}
            className="inline-flex items-center min-h-[44px] md:min-h-[40px] font-extrabold text-[var(--text-accent)] underline underline-offset-4"
        >
            {children}
        </ZLink>
    );
    if (!a.signUp)
        return <p className="m-0 text-[15px] font-semibold text-[var(--text-secondary)]">{t('auth.admin.invite')}</p>;
    return (
        <p className="m-0 flex flex-wrap items-center gap-x-2 text-[15px] font-semibold text-[var(--text-secondary)]">
            {signup ? (
                <>
                    {t('auth.have.q')} {link(a.signIn, t('signin.cta'))}
                </>
            ) : (
                <>
                    {t('auth.new.q')} {link(a.signUp, t('auth.cta.signup'))}
                </>
            )}
        </p>
    );
}

/* Desktop brand panel (≥1200px). Below that, the form column carries the logo and the app name instead. */
function BrandPanel({ role }: { role: SessionRole }) {
    const { t } = useI18n();
    const a = ACCOUNTS[role];
    return (
        <aside className="hidden lg:flex sticky top-0 h-screen flex-col justify-between gap-10 p-12 bg-[var(--fill-strong)] text-[var(--on-fill-strong)] overflow-hidden">
            <ZLink href="/" className="self-start rounded-xl">
                <ApplicationLogo tone="reversed" height={44} />
            </ZLink>
            <div className="flex flex-col gap-6 max-w-[520px]">
                <span className="inline-flex items-center gap-2 text-[13px] font-extrabold uppercase tracking-[0.12em] opacity-90">
                    <Icon name={a.icon} size={20} />
                    {t(a.name)}
                </span>
                <p className="m-0 text-[44px] leading-[1.1] font-extrabold tracking-[-0.03em]">
                    {t(`auth.panel.${role}`)}
                </p>
                <p className="m-0 text-[18px] leading-7 font-medium opacity-90">{t(a.about)}</p>
                <ul className="m-0 p-0 list-none flex flex-col gap-3">
                    {['auth.panel.lang', 'auth.panel.sim'].map((k) => (
                        <li key={k} className="flex items-start gap-3 text-[16px] leading-6 font-semibold">
                            <Icon name="Check" size={20} className="shrink-0 mt-0.5" />
                            {t(k)}
                        </li>
                    ))}
                </ul>
            </div>
            <DemoChip className="self-start" />
        </aside>
    );
}

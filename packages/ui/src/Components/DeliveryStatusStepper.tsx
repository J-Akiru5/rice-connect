'use client';
import React from 'react';
import Icon from './Icon';
import { useI18n } from '@rc/i18n';

/* Logistics status stepper, soft style like the rest of the app: a brand-green disc for every step
   already behind us (check icon), gold for the step we are on, a hairline disc for what is still to
   come. Type "cluster" is the 5-step haul journey; the legacy palay/rice lists are kept for the
   other screens that still use them. 12px labels, aria-current on the current step. */
type Status = string;
interface Props {
    status: Status;
    type: 'palay' | 'rice' | 'cluster';
}

const LEGACY: Record<'palay' | 'rice', { key: string; label: string }[]> = {
    palay: [
        { key: 'Pending', label: 'Awaiting Pickup' },
        { key: 'In Transit', label: 'Heading to Miller' },
        { key: 'Delivered', label: 'Arrived (At Miller)' },
        { key: 'Confirmed Received', label: 'Finalized / Received' }
    ],
    rice: [
        { key: 'Pending', label: 'Waiting for Driver' },
        { key: 'In Transit', label: 'Heading to Retailer' },
        { key: 'Delivered', label: 'Truck Arrived' },
        { key: 'Confirmed Received', label: 'Final Sign-off' }
    ]
};
const CLUSTER = ['requested', 'assigned', 'accepted', 'pickedup', 'delivered'];

const DeliveryStatusStepper: React.FC<Props> = ({ status, type }) => {
    const { t } = useI18n();
    let steps: { label: string }[];
    let current = 0;
    if (type === 'cluster') {
        steps = CLUSTER.map((k) => ({ label: t('status.' + k) }));
        const s = String(status)
            .toLowerCase()
            .replace(/[\s_-]/g, '');
        current = Math.max(0, CLUSTER.indexOf(s));
    } else {
        steps = LEGACY[type];
        if (status === 'In Transit') current = 1;
        else if (status === 'Delivered' || status === 'Received') current = 2;
        else if (status === 'Confirmed Received' || status === 'Completed') current = 3;
    }
    return (
        <ol className="w-full py-1 flex flex-col sm:flex-row sm:items-start gap-0" aria-label="Delivery status">
            {steps.map((step, i) => {
                const reached = i <= current;
                return (
                    <React.Fragment key={i}>
                        <li
                            className="relative flex sm:flex-col items-center gap-3 sm:gap-0 sm:flex-1 min-w-0"
                            aria-current={i === current ? 'step' : undefined}
                        >
                            <div
                                className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-full border-2 text-[15px] font-extrabold z-10 transition-colors ${
                                    i < current
                                        ? 'bg-[var(--fill-strong)] text-[var(--on-fill-strong)] border-transparent'
                                        : i === current
                                          ? 'bg-[var(--warning)] text-black border-transparent shadow-[var(--shadow-button)]'
                                          : 'bg-[var(--glass-fill-strong)] text-[var(--text-muted)] border-[color:var(--text-muted)]'
                                }`}
                            >
                                {i < current ? <Icon name="Check" size={20} strokeWidth={3} /> : i + 1}
                            </div>
                            <div
                                className={`sm:mt-3 text-[13px] sm:text-[12px] leading-4 font-extrabold uppercase tracking-[0.04em] sm:text-center sm:px-0.5 sm:whitespace-nowrap ${
                                    reached ? 'text-[var(--ink)]' : 'text-[var(--text-muted)]'
                                }`}
                            >
                                {step.label}
                                {i === current && (
                                    <span className="sm:hidden ml-2 normal-case tracking-normal font-bold">
                                        · {t('step.now')}
                                    </span>
                                )}
                            </div>
                        </li>
                        {i < steps.length - 1 && (
                            <li
                                aria-hidden="true"
                                className={`ml-[19px] w-[2px] h-4 rounded-full sm:ml-0 sm:w-auto sm:h-[2px] sm:flex-auto sm:mt-5 sm:-mx-3 ${
                                    i < current
                                        ? 'bg-[var(--fill-strong)]'
                                        : 'bg-[color:color-mix(in_srgb,var(--ink)_14%,transparent)]'
                                }`}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </ol>
    );
};
export default DeliveryStatusStepper;

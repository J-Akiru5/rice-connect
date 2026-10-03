'use client';
import React from 'react';
import Icon from './Icon';
import { useI18n } from '../lib/i18n';

/* Karl's hard logistics stepper, kept: 4px black borders, hard offset shadow, square corners.
   Added: type "cluster" (5 steps), a check icon on done steps, readable pending labels (gray-600 on white, 7.6:1),
   12px labels, and aria-current on the current step. */
type Status = string;
interface Props { status: Status; type: 'palay' | 'rice' | 'cluster'; }

const LEGACY: Record<'palay' | 'rice', { key: string; label: string }[]> = {
    palay: [{ key: 'Pending', label: 'Awaiting Pickup' }, { key: 'In Transit', label: 'Heading to Miller' }, { key: 'Delivered', label: 'Arrived (At Miller)' }, { key: 'Confirmed Received', label: 'Finalized / Received' }],
    rice: [{ key: 'Pending', label: 'Waiting for Driver' }, { key: 'In Transit', label: 'Heading to Retailer' }, { key: 'Delivered', label: 'Truck Arrived' }, { key: 'Confirmed Received', label: 'Final Sign-off' }],
};
const CLUSTER = ['requested', 'assigned', 'accepted', 'pickedup', 'delivered'];

const DeliveryStatusStepper: React.FC<Props> = ({ status, type }) => {
    const { t } = useI18n();
    let steps: { label: string }[]; let current = 0;
    if (type === 'cluster') {
        steps = CLUSTER.map((k) => ({ label: t('status.' + k) }));
        const s = String(status).toLowerCase().replace(/[\s_-]/g, '');
        current = Math.max(0, CLUSTER.indexOf(s));
    } else {
        steps = LEGACY[type];
        if (status === 'In Transit') current = 1;
        else if (status === 'Delivered' || status === 'Received') current = 2;
        else if (status === 'Confirmed Received' || status === 'Completed') current = 3;
    }
    return (
        <ol className="w-full py-2 flex flex-col sm:flex-row sm:items-start gap-0" aria-label="Delivery status">
            {steps.map((step, i) => {
                const done = i <= current;
                return (
                    <React.Fragment key={i}>
                        <li className="relative flex sm:flex-col items-center gap-3 sm:gap-0 sm:flex-1 min-w-0" aria-current={i === current ? 'step' : undefined}>
                            <div className={`w-10 h-10 shrink-0 flex items-center justify-center border-4 font-extrabold text-lg z-10 ${done ? 'bg-[var(--success)] text-black border-black shadow-[var(--shadow-hard)]' : 'bg-white text-[var(--gray-900)] border-[color:var(--gray-900)]'}`}>
                                {done && i < current ? <Icon name="Check" size={20} strokeWidth={3} /> : i + 1}
                            </div>
                            <div className={`sm:mt-3 text-[13px] sm:text-[12px] leading-4 font-extrabold uppercase tracking-[0.04em] sm:text-center sm:px-1 ${done ? 'text-black' : 'text-[var(--gray-900)]'}`}>
                                {step.label}{i === current && <span className="sm:hidden ml-2 normal-case tracking-normal font-bold">· {t('step.now')}</span>}
                            </div>
                        </li>
                        {i < steps.length - 1 && (
                            <li aria-hidden="true" className={`ml-[18px] w-1 h-4 sm:ml-0 sm:w-auto sm:h-1 sm:flex-auto sm:mt-5 sm:-mx-4 ${i < current ? 'bg-black' : 'bg-[var(--gray-400)]'}`} />
                        )}
                    </React.Fragment>
                );
            })}
        </ol>
    );
};
export default DeliveryStatusStepper;

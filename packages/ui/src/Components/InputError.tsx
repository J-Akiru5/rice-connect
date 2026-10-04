import { HTMLAttributes } from 'react';
import Icon from './Icon';
export default function InputError({ message, className = '', ...props }: HTMLAttributes<HTMLParagraphElement> & { message?: string }) {
    return message ? (
        <p {...props} role="alert" className={'mt-2 flex items-start gap-1.5 text-sm font-semibold text-[var(--danger-ink)] ' + className}>
            <Icon name="Alert" size={18} className="shrink-0 mt-px" /><span>{message}</span>
        </p>
    ) : null;
}

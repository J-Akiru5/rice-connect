import { InputHTMLAttributes } from 'react';
/* Restyled to glass: 24px box, brand-green check, focus-ring outline. Wrap in a <label> for a 44px target. */
export default function Checkbox({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input {...props} type="checkbox"
            className={'h-6 w-6 rounded-lg border-2 border-[color:var(--text-muted)] bg-[var(--glass-fill-strong)] text-[var(--fill-strong)] shadow-none focus:ring-0 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[color:var(--focus-ring)] ' + className} />
    );
}

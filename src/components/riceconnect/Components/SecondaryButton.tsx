import { ButtonHTMLAttributes } from 'react';
import Icon from './Icon';
export default function SecondaryButton({ type = 'button', className = '', disabled, icon, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { icon?: string }) {
    return (
        <button {...props} type={type} disabled={disabled}
            className={`inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-3 rounded-[2rem] font-extrabold uppercase text-[13px] leading-4 tracking-[0.08em] text-center
            bg-[var(--glass-fill-strong)] text-[var(--ink)] border-2 border-[color:var(--text-muted)] hover:-translate-y-0.5 transition-all duration-500
            ${disabled ? 'opacity-40 cursor-not-allowed transform-none' : ''} ` + className}>
            {icon && <Icon name={icon} size={20} />}<span>{children}</span>
        </button>
    );
}

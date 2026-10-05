import { ButtonHTMLAttributes } from 'react';
import Icon from './Icon';
/* Karl's btn-2026, legibility-fixed: 13px / 0.08em, 44px min height, sizes to its label. */
export default function PrimaryButton({
    className = '',
    disabled,
    icon,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { icon?: string }) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={
                `btn-2026 ${disabled ? 'opacity-40 cursor-not-allowed !shadow-none !transform-none' : ''} ` + className
            }
        >
            {icon && <Icon name={icon} size={20} />}
            <span>{children}</span>
        </button>
    );
}

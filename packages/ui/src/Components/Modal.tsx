'use client';
import { PropsWithChildren, useEffect, useRef } from 'react';

/* Karl's Modal look (emerald scrim, glass panel), rebuilt on the native <dialog> element:
   @headlessui/react is not an allowed dependency in the prototype. */
export default function Modal({
    children,
    show = false,
    maxWidth = '2xl',
    closeable = true,
    onClose = () => {},
    label
}: PropsWithChildren<{
    show: boolean;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    closeable?: boolean;
    onClose: CallableFunction;
    label?: string;
}>) {
    const ref = useRef<HTMLDialogElement>(null);
    useEffect(() => {
        const d = ref.current;
        if (!d) return;
        if (show && !d.open) d.showModal();
        if (!show && d.open) d.close();
    }, [show]);
    const maxWidthClass = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-xl', '2xl': 'max-w-2xl' }[
        maxWidth
    ];
    return (
        <dialog
            ref={ref}
            aria-label={label}
            onCancel={(e) => {
                e.preventDefault();
                if (closeable) onClose();
            }}
            onClick={(e) => {
                if (e.target === ref.current && closeable) onClose();
            }}
            className={`glass-panel rounded-[2rem] p-0 w-[calc(100%-2rem)] ${maxWidthClass} backdrop:bg-[rgba(2,44,34,.55)] backdrop:backdrop-blur-sm`}
        >
            {show && children}
        </dialog>
    );
}

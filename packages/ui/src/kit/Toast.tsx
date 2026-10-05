'use client';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { useI18n } from '@rc/i18n';
import Icon from '../Components/Icon';

export type ToastAction = { label: string; onClick: () => void };
type ToastItem = { id: number; message: string; action?: ToastAction };
type ToastApi = { show: (message: string, action?: ToastAction) => void };

const ToastCtx = createContext<ToastApi>({ show: () => {} });

/** Success toasts with an optional Undo (10 s). `role="status"`; the viewport never covers the primary action. */
export function ToastProvider({ children, duration = 10000 }: { children: ReactNode; duration?: number }) {
    const { t } = useI18n();
    const [items, setItems] = useState<ToastItem[]>([]);
    const show = useCallback((message: string, action?: ToastAction) => {
        setItems((list) => [...list, { id: Date.now() + Math.random(), message, action }]);
    }, []);
    const api = useMemo(() => ({ show }), [show]);
    const drop = (id: number) => setItems((list) => list.filter((i) => i.id !== id));
    return (
        <ToastCtx.Provider value={api}>
            <ToastPrimitive.Provider swipeDirection="right" duration={duration}>
                {children}
                {items.map((item) => (
                    <ToastPrimitive.Root
                        key={item.id}
                        role="status"
                        onOpenChange={(open) => {
                            if (!open) drop(item.id);
                        }}
                        className="glass-panel glass-fill-strong rounded-2xl p-4 flex items-start gap-3 shadow-[var(--shadow-popover)]"
                    >
                        <Icon name="Info" size={20} className="shrink-0 mt-0.5 text-[var(--text-accent)]" />
                        <div className="min-w-0 flex-1">
                            <ToastPrimitive.Title className="text-[15px] leading-5 font-bold text-[var(--ink)]">
                                {item.message}
                            </ToastPrimitive.Title>
                            {item.action && (
                                <ToastPrimitive.Action asChild altText={item.action.label}>
                                    <button
                                        type="button"
                                        onClick={item.action.onClick}
                                        className="mt-2 inline-flex items-center gap-2 min-h-[44px] px-3 rounded-full border-2 border-[color:var(--text-muted)] text-[13px] font-extrabold uppercase tracking-[0.06em]"
                                    >
                                        <Icon name="TaskUndo" size={18} />
                                        <span>{item.action.label}</span>
                                    </button>
                                </ToastPrimitive.Action>
                            )}
                        </div>
                        <ToastPrimitive.Close asChild>
                            <button
                                type="button"
                                className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-full border-2 border-[color:var(--text-muted)]"
                            >
                                <Icon name="X" size={18} />
                                <span className="sr-only">{t('action.close')}</span>
                            </button>
                        </ToastPrimitive.Close>
                    </ToastPrimitive.Root>
                ))}
                <ToastPrimitive.Viewport className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-[min(380px,calc(100vw-2rem))]" />
            </ToastPrimitive.Provider>
        </ToastCtx.Provider>
    );
}

export const useToast = () => useContext(ToastCtx);

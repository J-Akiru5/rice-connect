import type { FieldValues, Resolver } from 'react-hook-form';
import type { ZodType } from 'zod';

/** Minimal Zod resolver (no @hookform/resolvers dependency): Zod messages are i18n keys (D-02). */
export function zodResolver<T extends FieldValues>(schema: ZodType<T>): Resolver<T> {
    return async (values) => {
        const result = schema.safeParse(values);
        if (result.success) return { values: result.data, errors: {} };
        const errors: Record<string, { type: string; message: string }> = {};
        for (const issue of result.error.issues) {
            const key = issue.path.map(String).join('.');
            if (key && !errors[key]) errors[key] = { type: issue.code, message: issue.message };
        }
        return { values: {}, errors: errors as never };
    };
}

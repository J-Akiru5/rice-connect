import { z } from 'zod';

/* Zod messages are i18n keys only (owner guardrail, M28); screens translate them with t(). */
export const ZOD_ERROR_KEYS = {
    invalidType: 'zod.invalidType',
    tooSmall: 'zod.tooSmall',
    tooBig: 'zod.tooBig',
    invalidFormat: 'zod.invalidFormat',
    invalidValue: 'zod.invalidValue',
    notMultipleOf: 'zod.notMultipleOf',
    unrecognizedKeys: 'zod.unrecognizedKeys',
    invalidUnion: 'zod.invalidUnion',
    invalidKey: 'zod.invalidKey',
    invalidElement: 'zod.invalidElement',
    custom: 'zod.custom',
    fallback: 'zod.invalid'
} as const;

export const zodErrorMap: z.core.$ZodErrorMap = (issue) => {
    switch (issue.code) {
        case 'invalid_type':
            return { message: ZOD_ERROR_KEYS.invalidType };
        case 'too_small':
            return { message: ZOD_ERROR_KEYS.tooSmall };
        case 'too_big':
            return { message: ZOD_ERROR_KEYS.tooBig };
        case 'invalid_format':
            return { message: ZOD_ERROR_KEYS.invalidFormat };
        case 'invalid_value':
            return { message: ZOD_ERROR_KEYS.invalidValue };
        case 'not_multiple_of':
            return { message: ZOD_ERROR_KEYS.notMultipleOf };
        case 'unrecognized_keys':
            return { message: ZOD_ERROR_KEYS.unrecognizedKeys };
        case 'invalid_union':
            return { message: ZOD_ERROR_KEYS.invalidUnion };
        case 'invalid_key':
            return { message: ZOD_ERROR_KEYS.invalidKey };
        case 'invalid_element':
            return { message: ZOD_ERROR_KEYS.invalidElement };
        case 'custom':
            return { message: ZOD_ERROR_KEYS.custom };
        default:
            return { message: ZOD_ERROR_KEYS.fallback };
    }
};

let installed = false;
/** Installs the key-only error map once (called by I18nProvider). */
export function installZodErrorMap() {
    if (installed) return;
    z.config({ customError: zodErrorMap });
    installed = true;
}

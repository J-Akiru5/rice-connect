// B-09: one place for the security headers every app sends. CSP allows only self plus the Supabase origins
// the browser talks to; inline scripts/styles are required by the theme/mode boot scripts and React style
// attributes, so they stay allowed for now (tightening with nonces is a Phase 4 item, docs/BLOCKERS.md).
// Dev adds 'unsafe-eval' and http/ws origins because Next's dev overlay needs them.
export function securityHeaders({ dev = process.env.NODE_ENV !== 'production' } = {}) {
    const supabase = 'https://*.supabase.co wss://*.supabase.co';
    const csp = [
        "default-src 'self'",
        `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ''}`,
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob:",
        "font-src 'self'",
        `connect-src 'self' ${supabase}${dev ? ' http: https: ws: wss:' : ''}`,
        "worker-src 'self' blob:",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "object-src 'none'"
    ].join('; ');
    return [
        { key: 'Content-Security-Policy', value: csp },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
        { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        { key: 'X-DNS-Prefetch-Control', value: 'off' }
    ];
}

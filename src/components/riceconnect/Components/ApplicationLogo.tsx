/* Was: favicon photo + stacked RICE/CONNECT. Now: the vector logo set (light / reversed / mono / mark).
   Pass the asset URLs once via RiceConnect.setAssets({...}) or the src* props. */
import { HTMLAttributes } from 'react';
import { ASSETS } from '../lib/assets';
export default function ApplicationLogo({ variant = 'full', tone = 'auto', height, className = '', ...props }: HTMLAttributes<HTMLDivElement> & { variant?: 'full' | 'mark'; tone?: 'auto' | 'light' | 'reversed' | 'mono'; height?: number }) {
    const h = height ?? (variant === 'mark' ? 48 : 40);
    const src = (t: 'light' | 'reversed' | 'mono') => variant === 'mark' ? (t === 'reversed' ? ASSETS.markReversed : ASSETS.mark) : t === 'reversed' ? ASSETS.logoReversed : t === 'mono' ? ASSETS.logoMono : ASSETS.logo;
    const img = (t: 'light' | 'reversed' | 'mono', cls = '') => <img src={src(t)} alt="RiceConnect" style={{ height: Math.max(h, variant === 'mark' ? 48 : h) }} className={'w-auto block ' + cls} />;
    return (
        <div {...props} className={'inline-flex items-center ' + className}>
            {tone === 'auto' ? (<>{img('light', 'rc-light-only')}{img('reversed', 'rc-dark-only')}</>) : img(tone)}
        </div>
    );
}

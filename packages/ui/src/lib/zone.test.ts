import { describe, expect, it } from 'vitest';
import { resolveZone, gatewayPath, zoneHref } from './zone';

describe('zones', () => {
    it('maps original URLs to their app', () => {
        expect(resolveZone('/farm/F-014')).toEqual({ zone: 'coordinator', path: '/farm/F-014' });
        expect(resolveZone('/haul/driver')).toEqual({ zone: 'driver', path: '/' });
        expect(resolveZone('/haul?state=empty')).toEqual({ zone: 'coordinator', path: '/haul?state=empty' });
        expect(resolveZone('/sms?all=1')).toEqual({ zone: 'farmer', path: '/?all=1' });
        expect(resolveZone('/buyer/orders?type=miller')).toEqual({ zone: 'buyer', path: '/orders?type=miller' });
        expect(resolveZone('/')).toEqual({ zone: 'marketing', path: '/' });
        expect(resolveZone('/coordinator/home')).toEqual({ zone: 'coordinator', path: '/home' });
    });
    it('builds gateway paths', () => {
        expect(gatewayPath('/farm')).toBe('/coordinator/farm');
        expect(gatewayPath('/sms')).toBe('/farmer');
        expect(gatewayPath('/sms?all=1')).toBe('/farmer?all=1');
        expect(gatewayPath('/buyer')).toBe('/buyer');
        expect(gatewayPath('/haul/driver')).toBe('/driver');
        expect(gatewayPath('/launch')).toBe('/launch');
    });
    it('uses next/link inside a zone and <a> across zones', () => {
        expect(zoneHref('coordinator', '/pay/L-03')).toEqual({ href: '/pay/L-03', same: true });
        expect(zoneHref('coordinator', '/sms')).toEqual({ href: '/farmer', same: false });
        expect(zoneHref('buyer', '/buyer/orders')).toEqual({ href: '/orders', same: true });
        expect(zoneHref('web', '/sms')).toEqual({ href: '/sms', same: true });
        expect(zoneHref('farmer', '#sms-thread')).toEqual({ href: '#sms-thread', same: true });
    });
});

import { describe, expect, it, vi } from 'vitest';

import { scannerBlocker } from '../../server/middleware/blocker.js';

describe('Scanner Blocker Middleware', () => {
  it('should block wlwmanifest.xml requests', () => {
    const req = { path: '/blog/wp-includes/wlwmanifest.xml' };
    const res = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };
    const next = vi.fn();

    scannerBlocker(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith('Not Found');
    expect(next).not.toHaveBeenCalled();
  });

  it('should block xmlrpc.php requests', () => {
    const req = { path: '/xmlrpc.php' };
    const res = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };
    const next = vi.fn();

    scannerBlocker(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).not.toHaveBeenCalled();
  });

  it('should block aws credentials', () => {
    const req = { path: '/.aws/credentials' };
    const res = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };
    const next = vi.fn();

    scannerBlocker(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).not.toHaveBeenCalled();
  });

  it('should block wp-admin anywhere', () => {
    const req = { path: '/site/wp-admin/install.php' };
    const res = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };
    const next = vi.fn();

    scannerBlocker(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).not.toHaveBeenCalled();
  });

  it('should allow legitimate requests', () => {
    const req = { path: '/api/tools/uuid' };
    const res = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };
    const next = vi.fn();

    scannerBlocker(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should block any dotfile (.env)', () => {
    const req = { path: '/.env' };
    const res = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };
    const next = vi.fn();

    scannerBlocker(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).not.toHaveBeenCalled();
  });

  it('should allow .well-known paths (SSL)', () => {
    const req = { path: '/.well-known/acme-challenge/123' };
    const res = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };
    const next = vi.fn();

    scannerBlocker(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});

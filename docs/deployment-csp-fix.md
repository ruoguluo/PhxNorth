# Deployment Fix: Content Security Policy for Daily.co Video Calls

**Date:** 2026-06-14
**Issue:** Video calls fail with `Fetch API cannot load https://c.daily.co/...` CSP error
**Status:** Resolved

---

## Problem

When PhxNorth is served behind an outer nginx reverse proxy (e.g. a shared server running
multiple projects), that proxy's `Content-Security-Policy` header overrides the one set
by the inner PhxNorth nginx container.

In our case, `radio-russell-nginx` had a strict CSP intended for a different app:

```
connect-src 'self' https://d3d4yli4hf5bmh.cloudfront.net
```

This blocked the browser from loading Daily.co's video SDK
(`c.daily.co/call-machine/...`) and opening WebSocket connections to Daily.co's
signaling servers. The video call would appear to connect, then immediately fail with:

```
Refused to connect because it violates the document's Content Security Policy.
[Daily] join() failed: ...
```

The root cause: **the browser sees only the outermost HTTP response headers**. The inner
nginx's CSP was being silently discarded.

---

## Fix

In the outer nginx config (`radio-russell-nginx`), inside the HTTPS server block for
PhxNorth:

1. **Strip the upstream CSP** so the inner container's header doesn't leak through:
   ```nginx
   proxy_hide_header Content-Security-Policy;
   ```

2. **Add a PhxNorth-appropriate CSP** that whitelists Daily.co domains:
   ```nginx
   add_header Content-Security-Policy "
     default-src 'self';
     script-src  'self' 'unsafe-inline' 'unsafe-eval'
                 https://cdn.jsdelivr.net
                 https://*.daily.co https://c.daily.co;
     style-src   'self' 'unsafe-inline'
                 https://fonts.googleapis.com https://*.daily.co;
     font-src    'self' https://fonts.gstatic.com;
     img-src     'self' data: blob: https:;
     connect-src 'self'
                 https://*.daily.co wss://*.daily.co
                 https://c.daily.co wss://c.daily.co
                 https://*.pluot.blue wss://*.pluot.blue;
     media-src   'self' blob: mediastream:;
     frame-src   'self' https://*.daily.co;
     worker-src  'self' blob:;
   " always;
   ```

3. **Disable Daily.co's built-in prejoin UI** at the account level (it conflicts with
   PhxNorth's custom video UI):
   ```bash
   curl -X POST https://api.daily.co/v1/ \
     -H "Authorization: Bearer $DAILY_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"properties":{"enable_prejoin_ui":false}}'
   ```

---

## Why These Domains

| Domain | Purpose |
|--------|---------|
| `*.daily.co`, `c.daily.co` | Daily.co SDK scripts, REST API, signaling |
| `wss://*.daily.co` | WebSocket connections for real-time video |
| `*.pluot.blue` | Daily.co's internal infrastructure (SFU, TURN servers) |
| `blob:`, `mediastream:` | Camera/microphone local media streams |
| `worker-src blob:` | Daily.co uses Web Workers loaded from blob URLs |

---

## Files Changed

| File | Change |
|------|--------|
| `nginx.conf` (outer proxy) | Added `proxy_hide_header` + PhxNorth CSP block |
| `server/main.py` | Added `https://107.182.26.178` to FastAPI CORS origins |
| `docker-compose.yml` | Added `env_file: ./server/.env` to inject Daily/Stripe keys |
| `src/lib/daily.ts` | Added error logging to `callObject.join()` catch block |

---

## General Rule

If PhxNorth is ever placed behind a new reverse proxy or CDN, ensure the upstream CSP
is either stripped (`proxy_hide_header Content-Security-Policy`) or extended to include
all Daily.co domains listed above. Missing any one of them — especially `connect-src`
for WebSockets or `worker-src blob:` — will break video calls in the browser silently.

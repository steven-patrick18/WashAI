# WashAI — Production Deployment Guide

## Recommended server spec

WashAI is **API-bound, not CPU-bound** — the heavy thinking happens on Anthropic's
side. A modest VPS is plenty for a single factory:

| Item | Recommendation |
|---|---|
| **Size** | 2 vCPU · **4 GB RAM** · 40–80 GB SSD |
| **OS** | Ubuntu 24.04 LTS |
| **Region** | Closest to the factory — e.g. AWS Mumbai (ap-south-1), DigitalOcean Bangalore, Lightsail Mumbai |
| **Cost** | ~$12–24/month (₹1,000–2,000). Hetzner (EU) is cheaper (~€5) if latency to EU is acceptable |
| **Software** | Docker + Docker Compose (that's all) |

Why 4 GB: the Next.js build inside Docker peaks around 2 GB; at runtime the app
idles under 500 MB. Knowledge-base uploads (30 MB PDFs, base64-encoded per
question) spike memory briefly — 4 GB gives comfortable headroom.

Scale triggers: move to 4 vCPU / 8 GB (and Postgres, below) when you have
multiple plants, >20 concurrent operators, or the Live Production Monitoring
module (Module 6) starts polling machines.

## Database choice

**Ship v1 on SQLite** (the default in `docker-compose.prod.yml`). For a
single-factory internal tool the write load is tiny, and SQLite on a persistent
volume means one container, zero DB administration, and backup = copy one file.

**Upgrade to Postgres** when you go multi-plant or add heavy concurrent writes:
1. In `prisma/schema.prisma` set `provider = "postgresql"`
2. Point `DATABASE_URL` at a managed Postgres (Neon / Supabase / RDS) or add the
   `db` service from `docker-compose.yml` to the prod compose file
3. `npx prisma db push` — the schema is already string-based (no enum rewrite needed)

## Deploy steps

```bash
# On the server (Ubuntu 24.04)
curl -fsSL https://get.docker.com | sh

git clone https://github.com/steven-patrick18/WashAI.git
cd WashAI

# Secrets — NEVER commit this file
cat > .env <<EOF
ANTHROPIC_API_KEY=sk-ant-...
AUTH_SECRET=$(head -c32 /dev/urandom | xxd -p -c64)
EOF

docker compose -f docker-compose.prod.yml up -d --build
# App is now on http://SERVER_IP:3000
```

**First visit** redirects to `/setup` — create the OWNER account immediately
(whoever gets there first owns the instance). The owner then adds
manager/operator accounts at `/users`.

## HTTPS + domain (recommended)

Point a DNS A-record (e.g. `washai.yourfactory.com`) at the server, then run
Caddy for automatic TLS:

```bash
docker run -d --name caddy --restart unless-stopped --network host \
  -v caddy_data:/data caddy:2 \
  caddy reverse-proxy --from washai.yourfactory.com --to localhost:3000
```

## Backups (do this — the learning data IS the product)

The two named volumes hold everything: `washai-data` (SQLite db — recipes,
outcomes, master data) and `washai-uploads` (knowledge-base PDFs).

```bash
# Nightly cron on the server
docker run --rm -v washai-data:/data -v /backup:/backup alpine \
  cp /data/washai.db /backup/washai-$(date +%F).db
docker run --rm -v washai-uploads:/up -v /backup:/backup alpine \
  tar czf /backup/uploads-$(date +%F).tgz -C /up .
```

Sync `/backup` off-site (rclone → Google Drive/S3).

## Updating to a new version

```bash
cd WashAI && git pull
docker compose -f docker-compose.prod.yml up -d --build
```

Schema changes apply automatically on boot (`prisma db push` in the container CMD).

## Security checklist

- [ ] `ufw allow 22,80,443/tcp && ufw enable` (close port 3000 externally once Caddy fronts it)
- [ ] SSH key-only login, disable password auth
- [ ] `.env` file permissions `600`; secrets never committed
- [ ] ✅ Authentication is built in (email + password, OWNER/MANAGER/OPERATOR
      roles, all pages and APIs protected by middleware). Complete `/setup`
      immediately after first deploy. Rotating `AUTH_SECRET` signs everyone out.

## What's deliberately NOT here yet

- **User accounts/roles** (owner/manager/operator — Module 19 concern): add before
  exposing to the open internet.
- **Vercel/serverless**: not used because knowledge-base PDFs live on local disk;
  serverless would need S3 storage first. A VPS keeps v1 simple.

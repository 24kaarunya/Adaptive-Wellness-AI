# 🚀 Deployment Guide - Adaptive Wellness AI

## Production Deployment Checklist

This guide covers deploying to production on Vercel (recommended) and other platforms.

---

## 🎯 Pre-Deployment Checklist

- [ ] All tests passing (when implemented)
- [ ] Environment variables documented
- [ ] Database migrations ready
- [ ] Security audit completed
- [ ] Performance tested
- [ ] Documentation updated
- [ ] API rate limits configured
- [ ] Error tracking set up

---

## 🌐 Vercel Deployment (Recommended)

### Why Vercel?

- ✅ Built by Next.js creators
- ✅ Zero-config deployment
- ✅ Automatic HTTPS
- ✅ Edge network (CDN)
- ✅ Serverless functions
- ✅ Free tier available

### Step-by-Step Deployment

#### 1. Prepare Your Repository

```bash
# Initialize git if not already
git init

# Add all files
git add .

# Commit
git commit -m "feat: initial commit - adaptive wellness AI"

# Create GitHub repository
# Push to GitHub
git remote add origin https://github.com/username/adaptive-wellness-ai.git
git branch -M main
git push -u origin main
```

#### 2. Set Up Production Database

**Option A: Supabase (Recommended for PostgreSQL)**

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Wait for database provisioning (~2 minutes)
4. Go to Settings → Database
5. Copy "Connection pooling" connection string
6. Format: `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`

**Option B: Railway**

1. Go to [railway.app](https://railway.app)
2. Create new project → PostgreSQL
3. Copy connection string

**Option C: Neon**

1. Go to [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string

#### 3. Deploy to Vercel

1. **Visit Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New Project"
   - Import your GitHub repository
   - Select framework: Next.js (auto-detected)

3. **Configure Environment Variables**
   
   Add the following in Vercel dashboard:

   ```env
   # Database (use production database URL)
   DATABASE_URL=postgresql://user:password@host:5432/database
   
   # NextAuth
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=[generate new with: openssl rand -base64 32]
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   
   # OpenAI
   OPENAI_API_KEY=sk-your-production-api-key
   
   # Environment
   NODE_ENV=production
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Visit your live URL! 🎉

#### 4. Run Database Migrations

```bash
# Set DATABASE_URL temporarily
export DATABASE_URL="your-production-database-url"

# Run migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

#### 5. Update Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Navigate to "Credentials"
4. Edit your OAuth 2.0 Client ID
5. Add authorized redirect URI:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```

#### 6. Test Production Deployment

- [ ] Visit your production URL
- [ ] Test sign up
- [ ] Test sign in
- [ ] Test Google OAuth
- [ ] Complete onboarding
- [ ] Create a goal
- [ ] Log activity
- [ ] Check agent logs in database

---

## 🔄 Continuous Deployment

### Automatic Deployments

Vercel automatically deploys:
- **Production**: Every push to `main` branch
- **Preview**: Every pull request

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

---

## 🏗️ Alternative Deployment Options

### AWS Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init

# Create environment
eb create production

# Deploy
eb deploy
```

### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# Build
docker build -t adaptive-wellness-ai .

# Run
docker run -p 3000:3000 \
  -e DATABASE_URL="..." \
  -e NEXTAUTH_SECRET="..." \
  -e OPENAI_API_KEY="..." \
  adaptive-wellness-ai
```

### Railway

1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Add environment variables
4. Deploy

---

## 🔒 Security Hardening

### Production Environment Variables

```env
# ⚠️ CRITICAL: Generate new secrets for production
# Never reuse development secrets

# Generate secure NEXTAUTH_SECRET
openssl rand -base64 32

# Use separate OpenAI API key for production
# Set spending limits at platform.openai.com
```

### Security Headers

Add to `next.config.js`:

```javascript
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

### Rate Limiting

```typescript
// src/middleware.ts

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

export async function middleware(req: NextRequest) {
  const ip = req.ip ?? '127.0.0.1';
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return new Response('Too Many Requests', { status: 429 });
  }

  return NextResponse.next();
}
```

---

## 📊 Monitoring & Logging

### Error Tracking with Sentry

```bash
# Install
npm install @sentry/nextjs

# Initialize
npx @sentry/wizard@latest -i nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### Analytics

```typescript
// Vercel Analytics
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Logging

```typescript
// lib/logger.ts
export const logger = {
  info: (message: string, meta?: any) => {
    console.log(JSON.stringify({ level: 'info', message, ...meta }));
  },
  error: (message: string, error?: any) => {
    console.error(JSON.stringify({ level: 'error', message, error }));
  },
};
```

---

## 🎛️ Environment Management

### Multiple Environments

```
Development  → Local (localhost:3000)
Staging      → Vercel Preview (pr-123.vercel.app)
Production   → Vercel Production (yourapp.com)
```

### Environment Variables by Stage

| Variable | Development | Staging | Production |
|----------|-------------|---------|------------|
| DATABASE_URL | Local PG | Staging DB | Production DB |
| NEXTAUTH_SECRET | Dev secret | Staging secret | Prod secret |
| NEXTAUTH_URL | localhost:3000 | staging.app | yourapp.com |
| OPENAI_API_KEY | Dev key | Shared key | Prod key |

---

## 💾 Database Backup

### Automated Backups

**Supabase:**
- Automatic daily backups
- Point-in-time recovery
- Download backups manually

**Railway:**
- Enable backups in settings
- Scheduled snapshots

### Manual Backup

```bash
# Backup
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

---

## 📈 Performance Optimization

### Enable Caching

```typescript
// API route caching
export async function GET() {
  const data = await fetchData();
  
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
    }
  });
}
```

### Image Optimization

```typescript
// Use Next.js Image
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={50}
  priority
/>
```

### Database Connection Pooling

Already configured in Prisma. Use connection pooler URL from Supabase.

---

## 🔍 Health Checks

### API Health Endpoint

```typescript
// src/app/api/health/route.ts

export async function GET() {
  try {
    // Check database
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      error: error.message
    }, { status: 503 });
  }
}
```

---

## 🚨 Troubleshooting Production Issues

### Common Issues

**1. Build Fails**

```bash
# Check build logs in Vercel
# Common causes:
- TypeScript errors
- Missing environment variables
- Package dependency issues

# Fix:
- Run `npm run build` locally
- Check `npm run lint`
- Verify all deps in package.json
```

**2. Database Connection Fails**

```bash
# Check:
- DATABASE_URL is correct
- Database is accessible from Vercel (IP whitelist)
- Connection pooler is used (not direct connection)

# Test connection:
npx prisma db pull
```

**3. Authentication Issues**

```bash
# Check:
- NEXTAUTH_URL matches production domain
- NEXTAUTH_SECRET is set
- Google OAuth redirect URI includes production URL
```

**4. OpenAI API Errors**

```bash
# Check:
- API key is valid
- Account has credits
- Rate limits not exceeded
- Model name is correct (gpt-4-turbo-preview)
```

---

## 📊 Cost Estimation

### Monthly Costs (Estimated)

| Service | Free Tier | Paid (Small) | Paid (Medium) |
|---------|-----------|--------------|---------------|
| **Vercel** | Free (hobby) | $20/mo (Pro) | $20/mo |
| **Supabase** | Free (500MB) | $25/mo (8GB) | $25/mo |
| **OpenAI** | Pay-per-use | ~$50/mo | ~$200/mo |
| **Total** | **$0-50** | **$95** | **$245** |

**Note**: OpenAI costs vary significantly based on usage (number of agent calls).

---

## 🎯 Post-Deployment Tasks

- [ ] Set up error tracking (Sentry)
- [ ] Configure analytics (Vercel Analytics)
- [ ] Set up monitoring (Vercel Dashboard)
- [ ] Enable database backups
- [ ] Test all critical flows
- [ ] Monitor API costs (OpenAI)
- [ ] Set up uptime monitoring (e.g., UptimeRobot)
- [ ] Create runbook for incidents
- [ ] Document rollback procedure

---

## 🔄 Rollback Procedure

### Vercel

1. Go to Vercel Dashboard
2. Select your project
3. Click "Deployments"
4. Find previous working deployment
5. Click "..." → "Promote to Production"

### Database

```bash
# Restore from backup
psql $DATABASE_URL < backup-before-migration.sql

# Or rollback migration
npx prisma migrate resolve --rolled-back 20231201_migration
```

---

## 📚 Additional Resources

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Prisma Production**: https://www.prisma.io/docs/guides/deployment

---

## ✅ Deployment Complete!

Your Adaptive Wellness AI system is now live in production. 🎉

**Next Steps:**
1. Monitor error logs
2. Track performance metrics
3. Gather user feedback
4. Iterate and improve

---

**Production URL**: https://your-app.vercel.app

**Status**: ✅ Live and serving users

# BuildMyCycle Setup Guide

## Prerequisites

Install Node.js first: https://nodejs.org/en/download (LTS version)

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Set up the database
npm run db:push
npm run db:generate

# 3. Start the dev server
npm run dev
```

Open http://localhost:3000

---

## Environment Variables (.env)

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-here"       # run: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
XAI_API_KEY=""                           # optional — get from https://x.ai/api
```

> Without XAI_API_KEY the app works fine — RoidAI returns a mock evaluation.
> Add your key to get real Grok AI analysis.

---

## AWS Deployment (AWS Amplify — easiest)

1. Push code to a GitHub repo
2. Go to AWS Amplify Console → "Create App" → connect GitHub
3. Amplify auto-detects Next.js. Use these build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
           - npx prisma generate
           - npx prisma db push
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
   ```
4. Add environment variables in Amplify Console:
   - DATABASE_URL → use PostgreSQL (AWS RDS) for production — see below
   - NEXTAUTH_SECRET → generate a secret
   - NEXTAUTH_URL → your Amplify URL or custom domain
   - XAI_API_KEY → your xAI key

### Production Database (PostgreSQL on AWS RDS)

1. Create an RDS PostgreSQL instance in the same AWS region
2. Update prisma/schema.prisma: change `provider = "sqlite"` to `provider = "postgresql"`
3. Update DATABASE_URL to your RDS connection string

### Connecting buildmycycle.com (Namecheap → AWS Amplify)

1. In AWS Amplify Console → "Domain Management" → Add domain: buildmycycle.com
2. Amplify gives you CNAME records
3. In Namecheap:
   - Go to "Advanced DNS" for buildmycycle.com
   - Delete default A records
   - Add the CNAME records Amplify provides
   - TTL: 5 min
4. Wait 10–30 min for DNS propagation
5. Amplify automatically provisions SSL (HTTPS)

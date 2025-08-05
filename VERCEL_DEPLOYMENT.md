# Vercel Deployment Guide with Upstash Redis

## 🚀 Deploy to Vercel with Upstash Redis

Your hormone health assessment app is now configured for Vercel deployment with Upstash Redis as the database.

## 📋 Prerequisites

1. **Vercel Account** - [vercel.com](https://vercel.com)
2. **Upstash Redis Database** - [upstash.com](https://upstash.com)
3. **OpenAI API Key** - [platform.openai.com](https://platform.openai.com)
4. **Groq API Key** - [console.groq.com](https://console.groq.com)

## 🗄️ Set Up Upstash Redis

### 1. Create Upstash Redis Database
1. Go to [upstash.com](https://upstash.com)
2. Sign up/Login
3. Click "Create Database"
4. Choose a name (e.g., "hormone-health-app")
5. Select region closest to your users
6. Click "Create"

### 2. Get Redis Credentials
After creating the database, you'll get:
- **UPSTASH_REDIS_REST_URL** - Your Redis REST URL
- **UPSTASH_REDIS_REST_TOKEN** - Your Redis REST token

## 🔧 Deploy to Vercel

### 1. Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository: `https://github.com/nikitabansal01/SYrootcause.git`
4. Select the repository

### 2. Configure Environment Variables
In Vercel project settings, add these environment variables:

```bash
# Database
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_redis_token_here

# AI APIs
OPENAI_API_KEY=sk-your_openai_key_here
GROQ_API_KEY=gsk_your_groq_key_here

# Optional - Production URL (will be auto-set by Vercel)
NEXT_PUBLIC_BASE_URL=https://your-vercel-domain.vercel.app
```

### 3. Deploy Settings
- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

### 4. Deploy
Click "Deploy" and wait for the build to complete.

## 🔍 Verify Deployment

### 1. Test Database Connection
Visit: `https://your-domain.vercel.app/api/test-redis`

Expected response:
```json
{
  "success": true,
  "message": "Redis connection successful",
  "debug": {
    "urlSet": true,
    "tokenSet": true
  }
}
```

### 2. Test Survey Flow
1. Visit your deployed app
2. Take the hormone assessment
3. Check if data is saved (admin dashboard should show responses)

## 🛠️ Troubleshooting

### Common Issues:

1. **Redis Connection Failed**
   - Check environment variables in Vercel
   - Verify Upstash Redis credentials
   - Check Vercel function logs

2. **Build Errors**
   - Check package.json dependencies
   - Verify TypeScript compilation
   - Check Vercel build logs

3. **API Errors**
   - Check environment variables
   - Verify API keys are valid
   - Check Vercel function logs

### Debug Commands:
```bash
# Check Redis connection
curl https://your-domain.vercel.app/api/test-redis

# Check environment variables
curl https://your-domain.vercel.app/api/debug-env

# Get all responses
curl https://your-domain.vercel.app/api/get-responses
```

## 📊 Monitoring

### Vercel Analytics:
- **Function Logs:** Check API route performance
- **Error Tracking:** Monitor application errors
- **Performance:** Track page load times

### Upstash Redis:
- **Database Dashboard:** Monitor Redis usage
- **Metrics:** Track read/write operations
- **Logs:** Check database operations

## 🔄 Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL | ✅ |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST token | ✅ |
| `OPENAI_API_KEY` | OpenAI API key for recommendations | ✅ |
| `GROQ_API_KEY` | Groq API key for fallback recommendations | ✅ |
| `NEXT_PUBLIC_BASE_URL` | Production URL (auto-set by Vercel) | ❌ |

## 🎯 Next Steps

After successful deployment:

1. **Test the complete flow** - Survey → Results → Recommendations
2. **Monitor performance** - Check Vercel and Upstash dashboards
3. **Set up custom domain** - Configure your own domain in Vercel
4. **Enable analytics** - Set up Vercel Analytics for insights

Your app is now ready for production with Vercel and Upstash Redis! 🚀 
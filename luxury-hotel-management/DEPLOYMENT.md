# Deployment Guide

Guide to deploy the Luxury Hotel Management System to production.

## Deployment Options

1. **Heroku** (Easy, Free tier available)
2. **Vercel** (Frontend) + **Render** (Backend)
3. **DigitalOcean** (Full control)
4. **AWS** (Enterprise)

---

## Option 1: Heroku Deployment (Recommended for Beginners)

### Prerequisites
- Heroku account
- Heroku CLI installed
- Git installed

### Step 1: Prepare Backend

1. Add `Procfile` in backend directory:
```
web: node server.js
```

2. Update `backend/package.json`:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "engines": {
    "node": "18.x",
    "npm": "9.x"
  }
}
```

3. Ensure all environment variables are set

### Step 2: Deploy Backend to Heroku

```bash
cd backend

# Login to Heroku
heroku login

# Create app
heroku create luxury-hotel-backend

# Set environment variables
heroku config:set MONGODB_URI="your_mongodb_atlas_uri"
heroku config:set JWT_SECRET="your_secret_key"
heroku config:set NODE_ENV="production"

# Deploy
git init
git add .
git commit -m "Initial commit"
git push heroku main

# Seed database (one time)
heroku run node seedData.js
```

### Step 3: Deploy Frontend to Vercel

1. Update `frontend/src/utils/api.js`:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'https://luxury-hotel-backend.herokuapp.com/api';
```

2. Create `.env.production` in frontend:
```
REACT_APP_API_URL=https://luxury-hotel-backend.herokuapp.com/api
```

3. Deploy to Vercel:
```bash
cd frontend
npm install -g vercel
vercel login
vercel
```

Follow prompts and deploy!

---

## Option 2: Vercel (Frontend) + Render (Backend)

### Deploy Backend to Render

1. Push code to GitHub
2. Go to render.com
3. Create New Web Service
4. Connect GitHub repo
5. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment Variables**: Add all from .env

### Deploy Frontend to Vercel

Same as Option 1, Step 3

---

## Option 3: Full Stack on Single Server (VPS)

### Prerequisites
- Ubuntu server (DigitalOcean, AWS EC2, etc.)
- Domain name (optional)

### Step 1: Setup Server

```bash
# SSH into server
ssh root@your_server_ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install Nginx
sudo apt install -y nginx

# Install PM2 (Process Manager)
sudo npm install -g pm2
```

### Step 2: Clone and Setup

```bash
# Clone repository
cd /var/www
git clone your-repo-url luxury-hotel
cd luxury-hotel

# Backend setup
cd backend
npm install
cp .env.example .env
nano .env  # Edit with production values
node seedData.js  # Seed database

# Start backend with PM2
pm2 start server.js --name luxury-hotel-backend
pm2 save
pm2 startup

# Frontend setup
cd ../frontend
npm install
npm run build
```

### Step 3: Configure Nginx

Create `/etc/nginx/sites-available/luxury-hotel`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/luxury-hotel/frontend/build;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/luxury-hotel /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 4: SSL Certificate (Optional but Recommended)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## MongoDB Atlas Setup (Cloud Database)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster (M0)
3. Database Access → Add Database User
4. Network Access → Add IP Address (0.0.0.0/0 for all, or specific IPs)
5. Connect → Get connection string
6. Update `.env` with connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/luxury-hotel?retryWrites=true&w=majority
   ```

---

## Environment Variables for Production

### Backend (.env)
```bash
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/luxury-hotel
JWT_SECRET=super_secure_random_string_change_this_in_production_xyz123
NODE_ENV=production
```

**Important:** Generate a strong JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Frontend (.env.production)
```bash
REACT_APP_API_URL=https://your-backend-url.com/api
```

---

## Pre-Deployment Checklist

### Security
- [ ] Change JWT_SECRET to strong random string
- [ ] Use MongoDB Atlas or secure MongoDB instance
- [ ] Enable CORS only for your frontend domain
- [ ] Add rate limiting middleware
- [ ] Sanitize user inputs
- [ ] Use HTTPS in production
- [ ] Set secure cookie flags
- [ ] Add helmet.js for security headers

### Performance
- [ ] Enable compression middleware
- [ ] Optimize images (use CDN)
- [ ] Minify frontend build
- [ ] Enable gzip in Nginx
- [ ] Add database indexes
- [ ] Implement caching (Redis)

### Monitoring
- [ ] Setup error logging (Sentry)
- [ ] Setup uptime monitoring (UptimeRobot)
- [ ] Setup analytics (Google Analytics)
- [ ] Setup PM2 monitoring
- [ ] Setup database backups

### Testing
- [ ] Test all API endpoints
- [ ] Test authentication flow
- [ ] Test booking flow
- [ ] Test admin features
- [ ] Test on mobile devices
- [ ] Test payment validation
- [ ] Load testing (optional)

---

## Post-Deployment

### Update CORS in Backend

```javascript
// backend/server.js
const corsOptions = {
  origin: 'https://your-frontend-domain.com',
  credentials: true
};
app.use(cors(corsOptions));
```

### Monitor Application

```bash
# View logs
pm2 logs luxury-hotel-backend

# Monitor resources
pm2 monit

# Restart app
pm2 restart luxury-hotel-backend
```

### Database Backup

```bash
# Manual backup
mongodump --uri="mongodb+srv://..." --out=/backups/$(date +%Y%m%d)

# Automated backup (cron job)
crontab -e
# Add: 0 2 * * * mongodump --uri="..." --out=/backups/$(date +\%Y\%m\%d)
```

---

## Troubleshooting

### Frontend not loading
- Check build directory exists
- Check Nginx configuration
- Check browser console for errors
- Verify API URL in .env

### API not responding
- Check PM2 status: `pm2 status`
- Check logs: `pm2 logs`
- Check port 5000 is not in use
- Verify environment variables

### Database connection error
- Check MongoDB Atlas IP whitelist
- Verify connection string
- Check database user credentials
- Ensure MongoDB service is running

### CORS errors
- Update CORS origin in backend
- Check API URL in frontend
- Verify request headers

---

## Scaling (Future)

### Load Balancing
- Use Nginx load balancer
- Deploy multiple backend instances
- Use PM2 cluster mode

### Database
- MongoDB replica sets
- Read replicas
- Sharding for large datasets

### Caching
- Redis for session storage
- API response caching
- Image CDN (Cloudinary, AWS S3)

### Microservices
- Separate booking service
- Separate payment service
- Message queue (RabbitMQ)

---

## Cost Estimation

### Free Tier (Development)
- **Frontend**: Vercel (Free)
- **Backend**: Render (Free) or Heroku (Free with limits)
- **Database**: MongoDB Atlas (Free M0 cluster)
- **Total**: $0/month

### Production (Small Scale)
- **Frontend**: Vercel ($20/month)
- **Backend**: DigitalOcean Droplet ($10/month)
- **Database**: MongoDB Atlas M10 ($57/month)
- **Domain**: $12/year
- **SSL**: Free (Let's Encrypt)
- **Total**: ~$87/month

### Production (Medium Scale)
- **Frontend**: Vercel Pro ($20/month)
- **Backend**: 2x DigitalOcean Droplets ($20/month)
- **Database**: MongoDB Atlas M30 ($260/month)
- **CDN**: Cloudflare ($20/month)
- **Monitoring**: Sentry ($26/month)
- **Total**: ~$346/month

---

## Domain Configuration

### Namecheap/GoDaddy DNS
```
Type: A Record
Host: @
Value: your_server_ip

Type: CNAME
Host: www
Value: @
```

### Cloudflare (Recommended)
1. Add domain to Cloudflare
2. Update nameservers
3. Enable SSL (Full)
4. Enable caching
5. Configure firewall rules

---

## CI/CD Pipeline (Advanced)

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "luxury-hotel-backend"
          heroku_email: "your-email@example.com"
          appdir: "backend"

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID}}
          vercel-project-id: ${{ secrets.PROJECT_ID}}
          working-directory: ./frontend
```

---

## Support

For deployment issues:
1. Check application logs
2. Verify environment variables
3. Test API endpoints with Postman
4. Check database connection
5. Review Nginx error logs: `/var/log/nginx/error.log`

---

**Your luxury hotel website is now live! 🎉**

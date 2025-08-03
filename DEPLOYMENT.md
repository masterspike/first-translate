# FirstTranslate Deployment Guide

## Deploy naar www.leemreize.com

### Optie 1: Vercel (Aanbevolen)

#### Stap 1: GitHub Repository
1. Push je code naar GitHub
2. Ga naar [vercel.com](https://vercel.com)
3. Log in met GitHub account
4. Klik "New Project"
5. Importeer je repository

#### Stap 2: Custom Domain
1. Ga naar Project Settings → Domains
2. Voeg `www.leemreize.com` toe
3. Voeg ook `leemreize.com` toe (zonder www)
4. Vercel geeft je DNS instructies

#### Stap 3: DNS Configuratie
Voeg deze records toe aan je domein provider:

```
Type: A
Name: @
Value: 76.76.19.19

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Optie 2: Netlify

#### Stap 1: Deploy
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

#### Stap 2: Custom Domain
1. Ga naar Site Settings → Domain Management
2. Voeg custom domain toe
3. Configureer DNS records

### Optie 3: Railway

#### Stap 1: Deploy
```bash
npm install -g @railway/cli
railway login
railway up
```

#### Stap 2: Custom Domain
1. Ga naar Project Settings → Domains
2. Voeg custom domain toe

## Environment Variables

Voeg deze toe aan je deployment platform:

```
NEXT_PUBLIC_APP_URL=https://www.leemreize.com
NEXT_PUBLIC_APP_NAME=FirstTranslate
```

## PWA Configuratie

De app is geconfigureerd als PWA met:
- Service Worker voor offline functionaliteit
- Manifest voor app installatie
- HTTPS vereist voor PWA features

## SSL Certificaat

Alle platforms bieden automatische SSL certificaten aan.

## Monitoring

- **Vercel**: Built-in analytics en monitoring
- **Netlify**: Built-in analytics
- **Railway**: Logs en monitoring

## Backup Plan

Als je problemen hebt met de deployment:
1. Check de logs in je deployment platform
2. Test lokaal met `npm run build`
3. Controleer environment variables
4. Verifieer DNS configuratie

## Support

Voor vragen over deployment:
- Vercel: [vercel.com/support](https://vercel.com/support)
- Netlify: [netlify.com/support](https://netlify.com/support)
- Railway: [railway.app/support](https://railway.app/support) 
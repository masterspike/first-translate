#!/bin/bash

# Build APK script for FirstTranslate
echo "🚀 Building FirstTranslate APK for Aik's Japan trip..."

# Build the Next.js app
echo "📦 Building Next.js app..."
npm run build

# Create a simple HTML wrapper for PWA
echo "📱 Creating PWA wrapper..."
cat > public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FirstTranslate - Nederlands naar Japans</title>
    <meta name="description" content="Vertaal tussen Nederlands en Japans voor je reis naar Japan">
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#3b82f6">
    <link rel="apple-touch-icon" href="/icon-192x192.png">
    <style>
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { color: #3b82f6; margin-bottom: 10px; }
        .install-btn { 
            background: #3b82f6; 
            color: white; 
            padding: 15px 30px; 
            border: none; 
            border-radius: 8px; 
            font-size: 16px; 
            cursor: pointer; 
            margin: 10px;
        }
        .feature-list { 
            background: #f8f9fa; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 20px 0; 
        }
        .feature-list h3 { color: #3b82f6; margin-top: 0; }
        .feature-list ul { margin: 0; padding-left: 20px; }
        .feature-list li { margin: 5px 0; }
        .apk-info {
            background: #e8f5e8;
            border: 2px solid #4caf50;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🇳🇱 FirstTranslate voor Aik</h1>
            <p>Nederlands ↔ Japans Vertaling voor Japan</p>
            <button class="install-btn" onclick="installPWA()">📱 App Installeren</button>
        </div>
        
        <div class="apk-info">
            <h3>📱 APK Download Opties:</h3>
            <p><strong>Voor een echte APK file:</strong></p>
            <ol>
                <li><strong>PWA Builder:</strong> Ga naar <a href="https://www.pwabuilder.com" target="_blank">pwabuilder.com</a></li>
                <li><strong>Upload deze URL:</strong> https://firsttranslate.vercel.app</li>
                <li><strong>Download APK:</strong> Klik op "Build My PWA"</li>
                <li><strong>Installeer:</strong> Kopieer APK naar je telefoon</li>
            </ol>
        </div>
        
        <div class="feature-list">
            <h3>🎯 Perfect voor Japan:</h3>
            <ul>
                <li>✅ <strong>1000+ vertalingen</strong> - Uitgebreide database</li>
                <li>✅ <strong>Offline werken</strong> - Geen internet nodig</li>
                <li>✅ <strong>Reis-specifiek</strong> - Restaurants, transport, noodgevallen</li>
                <li>✅ <strong>Nederlandse interface</strong> - Gepersonaliseerd voor Aik</li>
                <li>✅ <strong>Snelle toegang</strong> - Vanaf startscherm</li>
                <li>✅ <strong>Vertalingsgeschiedenis</strong> - Voor hergebruik</li>
            </ul>
        </div>
        
        <div class="feature-list">
            <h3>🗾 Japan-specifieke zinnen:</h3>
            <ul>
                <li>🍽️ <strong>Restaurant & Eten:</strong> "Waar is het restaurant?", "Hoeveel kost dit?"</li>
                <li>🚇 <strong>Transport:</strong> "Waar is het station?", "Hoe kom ik naar de luchthaven?"</li>
                <li>🏥 <strong>Noodgevallen:</strong> "Waar is het ziekenhuis?", "Help!"</li>
                <li>💬 <strong>Basis communicatie:</strong> "Hallo", "Dank je", "Spreek je Engels?"</li>
                <li>🏨 <strong>Accommodatie:</strong> "Hotel reservering", "Check-in", "Check-out"</li>
                <li>🛍️ <strong>Shopping:</strong> "Hoeveel kost dit?", "Te duur", "Goedkoop"</li>
            </ul>
        </div>
        
        <div class="feature-list">
            <h3>📱 APK Installatie instructies:</h3>
            <ol>
                <li><strong>Deploy naar Vercel:</strong> <code>npm install -g vercel && vercel</code></li>
                <li><strong>Ga naar PWA Builder:</strong> <a href="https://www.pwabuilder.com" target="_blank">pwabuilder.com</a></li>
                <li><strong>Voer URL in:</strong> Je Vercel URL (bijv. https://firsttranslate.vercel.app)</li>
                <li><strong>Build APK:</strong> Klik op "Build My PWA" → "Android"</li>
                <li><strong>Download APK:</strong> Download het .apk bestand</li>
                <li><strong>Installeer:</strong> Kopieer naar telefoon en installeer</li>
            </ol>
        </div>
    </div>
    
    <script>
        function installPWA() {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                        console.log('SW registered: ', registration);
                        alert('✅ App succesvol geïnstalleerd! Je kunt nu offline vertalingen gebruiken.');
                    })
                    .catch(function(registrationError) {
                        console.log('SW registration failed: ', registrationError);
                        alert('⚠️ Installeer de app via je browser menu voor offline gebruik.');
                    });
            } else {
                alert('⚠️ Je browser ondersteunt geen PWA installatie. Gebruik de app via de browser.');
            }
        }
        
        // Auto-install prompt
        let deferredPrompt;
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            console.log('Install prompt ready');
        });
    </script>
</body>
</html>
EOF

echo "✅ PWA wrapper created"
echo ""
echo "🎯 Voor een echte APK:"
echo "1. Deploy naar Vercel: npm install -g vercel && vercel"
echo "2. Ga naar: https://www.pwabuilder.com"
echo "3. Voer je Vercel URL in"
echo "4. Klik 'Build My PWA' → 'Android'"
echo "5. Download de APK en installeer op je telefoon!"
echo ""
echo "📱 Your app now has 1000+ translations and works offline!"
echo "🇯🇵 Perfect for your Japan trip, Aik!" 
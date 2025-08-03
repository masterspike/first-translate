#!/bin/bash

echo "🚀 Creating FirstTranslate APK for Aik..."

# Check if we have the necessary tools
if ! command -v bubblewrap &> /dev/null; then
    echo "❌ Bubblewrap not found. Installing..."
    npm install -g @bubblewrap/cli
fi

# Create a simple web server for the app
echo "📦 Starting local server..."
cd .next
python3 -m http.server 8080 --bind 0.0.0.0 &
SERVER_PID=$!

# Wait for server to start
sleep 5

# Create APK with Bubblewrap
echo "📱 Building APK..."
cd ..
bubblewrap init --manifest http://localhost:8080/manifest.json --directory firsttranslate-apk

if [ $? -eq 0 ]; then
    echo "✅ APK project created successfully!"
    echo "🎯 Next steps:"
    echo "1. cd firsttranslate-apk"
    echo "2. bubblewrap build"
    echo "3. The APK will be in firsttranslate-apk/app-release.apk"
else
    echo "❌ Failed to create APK project"
fi

# Stop the server
kill $SERVER_PID

echo "🎉 APK creation process completed!" 
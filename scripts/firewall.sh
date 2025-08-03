#!/bin/bash

# Firewall management script for FirstTranslate development

case "$1" in
  "on")
    echo "🔒 Enabling macOS Firewall..."
    sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate on
    echo "✅ Firewall enabled"
    ;;
  "off")
    echo "🔓 Disabling macOS Firewall..."
    sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate off
    echo "✅ Firewall disabled"
    ;;
  "status")
    echo "📊 Firewall Status:"
    sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate
    ;;
  "dev")
    echo "🚀 Starting development with firewall disabled..."
    sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate off
    echo "✅ Firewall disabled for development"
    echo "🌐 Your app is now accessible at: http://192.168.50.210:3000"
    echo "📱 Install on your phone by visiting the URL above"
    echo ""
    echo "To re-enable firewall later, run: ./scripts/firewall.sh on"
    ;;
  *)
    echo "Usage: ./scripts/firewall.sh [on|off|status|dev]"
    echo ""
    echo "Commands:"
    echo "  on     - Enable macOS Firewall"
    echo "  off    - Disable macOS Firewall"
    echo "  status - Show firewall status"
    echo "  dev    - Disable firewall and show app URL"
    echo ""
    echo "For development, use: ./scripts/firewall.sh dev"
    ;;
esac 
#!/bin/bash
cd "$(dirname "$0")"
echo ""
echo "  FlexB Server gestartet!"
echo "  Öffne im Browser: http://localhost:8080/ui_kits/website/"
echo "  Zum Stoppen: Ctrl+C"
echo ""
python3 -m http.server 8080

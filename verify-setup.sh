#!/bin/bash

# Portfolio Setup Verification Script
# This script checks if all required files and folders are in place

echo "============================================"
echo "Portfolio Setup Verification"
echo "============================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track if there are any errors
ERRORS=0

# Function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} Found: $1"
    else
        echo -e "${RED}✗${NC} Missing: $1"
        ERRORS=$((ERRORS + 1))
    fi
}

# Function to check if directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} Found: $1/"
    else
        echo -e "${YELLOW}!${NC} Missing: $1/ (will be created when you add media)"
    fi
}

echo "Checking Core Files:"
echo "-------------------"
check_file "index.html"
check_file "styles.css"
check_file "script.js"
check_file "contact.php"
echo ""

echo "Checking Documentation:"
echo "----------------------"
check_file "README.md"
check_file "MEDIA_GUIDE.md"
check_file "JSON_GUIDE.md"
echo ""

echo "Checking Data Files:"
echo "-------------------"
check_file "data/projects.json"
check_file "data/gallery.json"
echo ""

echo "Checking Directories:"
echo "--------------------"
check_dir "images"
check_dir "images/projects"
check_dir "images/certifications"
check_dir "videos"
check_dir "data"
echo ""

# Check if JSON files are valid
echo "Validating JSON Files:"
echo "---------------------"

if command -v python3 &> /dev/null; then
    if python3 -c "import json; json.load(open('data/projects.json'))" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} projects.json is valid JSON"
    else
        echo -e "${RED}✗${NC} projects.json has syntax errors"
        ERRORS=$((ERRORS + 1))
    fi
    
    if python3 -c "import json; json.load(open('data/gallery.json'))" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} gallery.json is valid JSON"
    else
        echo -e "${RED}✗${NC} gallery.json has syntax errors"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${YELLOW}!${NC} Python3 not found - skipping JSON validation"
fi
echo ""

# Summary
echo "============================================"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ All core files are present!${NC}"
    echo ""
    echo "Next Steps:"
    echo "1. Edit data/projects.json to add your projects"
    echo "2. Edit data/gallery.json to add your media"
    echo "3. Add images to images/ folder"
    echo "4. Start a PHP server: php -S localhost:8000"
    echo "5. Open http://localhost:8000 in your browser"
else
    echo -e "${RED}✗ Found $ERRORS missing files${NC}"
    echo "Please ensure all required files are present."
fi
echo "============================================"

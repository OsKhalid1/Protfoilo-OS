#!/bin/bash

# Portfolio Diagnostic Script
# Checks for common issues that prevent projects/gallery from displaying

echo "============================================"
echo "Portfolio Diagnostic Tool"
echo "============================================"
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

WARNINGS=0
ERRORS=0

echo -e "${BLUE}Checking File Permissions:${NC}"
echo "----------------------------"

# Check if files are readable
for file in index.html styles.css script.js data/projects.json data/gallery.json; do
    if [ -r "$file" ]; then
        echo -e "${GREEN}✓${NC} $file is readable"
    else
        echo -e "${RED}✗${NC} $file is not readable or missing"
        ERRORS=$((ERRORS + 1))
    fi
done
echo ""

echo -e "${BLUE}Checking JSON Syntax:${NC}"
echo "----------------------"

if command -v python3 &> /dev/null; then
    # Check projects.json
    if python3 -c "import json; json.load(open('data/projects.json'))" 2>/dev/null; then
        PROJECT_COUNT=$(python3 -c "import json; data=json.load(open('data/projects.json')); print(len(data['projects']))")
        FEATURED_COUNT=$(python3 -c "import json; data=json.load(open('data/projects.json')); print(len([p for p in data['projects'] if p.get('featured', False)]))")
        echo -e "${GREEN}✓${NC} projects.json is valid"
        echo -e "  Total projects: $PROJECT_COUNT"
        echo -e "  Featured projects: $FEATURED_COUNT"
        if [ "$FEATURED_COUNT" -eq 0 ]; then
            echo -e "${YELLOW}!${NC} WARNING: No projects marked as featured!"
            WARNINGS=$((WARNINGS + 1))
        fi
    else
        echo -e "${RED}✗${NC} projects.json has syntax errors"
        python3 -c "import json; json.load(open('data/projects.json'))" 2>&1
        ERRORS=$((ERRORS + 1))
    fi
    
    # Check gallery.json
    if python3 -c "import json; json.load(open('data/gallery.json'))" 2>/dev/null; then
        GALLERY_COUNT=$(python3 -c "import json; data=json.load(open('data/gallery.json')); print(len(data['gallery']))")
        echo -e "${GREEN}✓${NC} gallery.json is valid"
        echo -e "  Gallery items: $GALLERY_COUNT"
    else
        echo -e "${RED}✗${NC} gallery.json has syntax errors"
        python3 -c "import json; json.load(open('data/gallery.json'))" 2>&1
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${YELLOW}!${NC} Python3 not found - skipping JSON validation"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

echo -e "${BLUE}Checking Directory Structure:${NC}"
echo "------------------------------"

REQUIRED_DIRS=("data" "images" "images/projects" "images/certifications" "videos")
for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✓${NC} $dir/ exists"
    else
        echo -e "${YELLOW}!${NC} $dir/ missing (will create)"
        mkdir -p "$dir"
    fi
done
echo ""

echo -e "${BLUE}Testing Web Server:${NC}"
echo "-------------------"

# Check if we're running in a web server context
if [ -f "index.html" ]; then
    echo "To test your portfolio, run one of these commands:"
    echo ""
    echo "  ${GREEN}Option 1:${NC} PHP Built-in Server (Recommended)"
    echo "  $ php -S localhost:8000"
    echo ""
    echo "  ${GREEN}Option 2:${NC} Python Simple HTTP Server"
    echo "  $ python3 -m http.server 8000"
    echo ""
    echo "Then open: ${BLUE}http://localhost:8000${NC}"
    echo ""
    echo -e "${YELLOW}IMPORTANT:${NC} Don't open index.html directly (file:///) - it won't load JSON!"
fi
echo ""

echo -e "${BLUE}Browser Console Check:${NC}"
echo "----------------------"
echo "When you open the portfolio in a browser:"
echo "1. Press F12 to open Developer Tools"
echo "2. Click the 'Console' tab"
echo "3. Look for messages like:"
echo "   ${GREEN}✓ Loading projects from data/projects.json...${NC}"
echo "   ${GREEN}✓ Projects loaded successfully${NC}"
echo ""
echo "If you see errors in RED, they will tell you exactly what's wrong."
echo ""

echo -e "${BLUE}Quick Test:${NC}"
echo "-----------"
echo "Open test.html to verify your CSS and layout work:"
echo "1. Start server: ${GREEN}php -S localhost:8000${NC}"
echo "2. Open: ${BLUE}http://localhost:8000/test.html${NC}"
echo "3. You should see 3 test projects and 3 test gallery items"
echo ""
echo "If test.html works but index.html doesn't, the issue is with JSON loading."
echo ""

echo "============================================"
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ No issues found!${NC}"
    echo ""
    echo "If your portfolio still isn't working:"
    echo "1. Make sure you're running a web server"
    echo "2. Check browser console (F12) for errors"
    echo "3. Try opening test.html first"
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}! Found $WARNINGS warnings${NC}"
    echo "Your portfolio should work, but check the warnings above."
else
    echo -e "${RED}✗ Found $ERRORS errors${NC}"
    echo "Fix the errors above before running your portfolio."
fi
echo "============================================"

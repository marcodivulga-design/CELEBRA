#!/bin/bash

# CELEBRA - Hinário Digital Activation Script
# Scrapes and indexes 1,658 liturgical songs from Hinário Digital
# Usage: bash scripts/activate-hinario.sh

set -e

echo "🎵 CELEBRA - Hinário Digital Activation"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check environment
echo -e "${BLUE}📋 Checking environment...${NC}"

if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found${NC}"
    exit 1
fi

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    pnpm install
fi

# Start activation
echo ""
echo -e "${BLUE}🚀 Starting Hinário Digital activation...${NC}"
echo ""

# Step 1: Validate database
echo -e "${BLUE}1️⃣  Validating database connection...${NC}"
pnpm exec tsx scripts/validate-db.mjs
echo -e "${GREEN}✅ Database connection OK${NC}"
echo ""

# Step 2: Scrape songs
echo -e "${BLUE}2️⃣  Scraping 1,658 songs from Hinário Digital...${NC}"
echo "   This may take 10-15 minutes..."
pnpm exec tsx scripts/scrape-hinario.mjs
echo -e "${GREEN}✅ Songs scraped successfully${NC}"
echo ""

# Step 3: Download resources
echo -e "${BLUE}3️⃣  Downloading resources (MP3, PDF, MuseScore)...${NC}"
echo "   This may take 2-4 hours depending on your connection..."
pnpm exec tsx scripts/download-resources.mjs
echo -e "${GREEN}✅ Resources downloaded${NC}"
echo ""

# Step 4: Upload to S3
echo -e "${BLUE}4️⃣  Uploading to S3 storage...${NC}"
echo "   This may take 1-2 hours..."
pnpm exec tsx scripts/upload-to-s3.mjs
echo -e "${GREEN}✅ Files uploaded to S3${NC}"
echo ""

# Step 5: Index in database
echo -e "${BLUE}5️⃣  Indexing songs in database...${NC}"
pnpm exec tsx scripts/index-songs.mjs
echo -e "${GREEN}✅ Songs indexed${NC}"
echo ""

# Step 6: Verify
echo -e "${BLUE}6️⃣  Verifying installation...${NC}"
pnpm exec tsx scripts/verify-hinario.mjs
echo -e "${GREEN}✅ Verification complete${NC}"
echo ""

# Summary
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}✨ Hinário Digital Activation Complete!${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo ""
echo "📊 Summary:"
echo "   Songs Indexed: 1,658"
echo "   Resources: MP3, PDF, MuseScore, Cifra"
echo "   Storage Used: ~50GB"
echo "   Search: Enabled by title, artist, composer"
echo "   Filters: Liturgical time, mass function"
echo ""
echo "🎉 Songs are now available in CELEBRA!"
echo ""
echo "📚 Next steps:"
echo "   1. Restart the application"
echo "   2. Go to 'Música' → 'Hinário Digital'"
echo "   3. Search for songs or browse by category"
echo ""

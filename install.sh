#!/usr/bin/env bash

set -e

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}"
cat << "BANNER"
   ██████╗ ██████╗  █████╗ ███╗   ██╗██████╗  ██████╗ ███╗  
   ██╔══██╗██╔══██╗██╔══██╗████╗  ██║██╔══██╗██╔═══██╗████╗ 
   ██████╔╝██████╔╝███████║██╔██╗ ██║██║  ██║██║   ██║██╔██╗
   ██╔══██╗██╔══██╗██╔══██║██║╚██╗██║██║  ██║██║   ██║██║╚█║
   ██████╔╝██║  ██║██║  ██║██║ ╚████║██████╔╝╚██████╔╝██║ ╚█║
   ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝  ╚═════╝ ╚═╝ ╚╝
                                                             
   Portfolio Simulation Manager
   Experience Sovereign Systems Locally
BANNER
echo -e "${NC}"

echo -e "${YELLOW}>> Checking prerequisites...${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js not found. Please install Node.js 18+ first.${NC}"
    echo "  Visit: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}✗ Node.js 18+ required. Current: $(node -v)${NC}"
    exit 1
fi
echo -e "${GREEN}✓${NC} Node.js $(node -v)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓${NC} npm $(npm -v)"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗ Docker not found${NC}"
    echo "  Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! docker info &> /dev/null; then
    echo -e "${YELLOW}⚠ Docker is installed but not running.${NC}"
    echo "  Please start Docker before using vsp-porto."
fi
echo -e "${GREEN}✓${NC} Docker"

echo -e "\n${YELLOW}>> Installing @vspatabuga/porto...${NC}"

# Create temporary directory
INSTALL_DIR=$(mktemp -d)
cd "$INSTALL_DIR"

# Download package tarball from GitHub Packages
echo "Downloading package..."
TARBALL="@vspatabuga/porto-$(date +%s).tgz"
npm pack @vspatabuga/porto --registry https://npm.pkg.github.com -o "$TARBALL" 2>/dev/null || {
    echo -e "${RED}✗ Failed to download package${NC}"
    exit 1
}

# Extract package
tar -xzf "$TARBALL"
rm "$TARBALL"

# Install dependencies from npmjs.org (not GitHub Packages)
echo "Installing dependencies..."
cd package
npm install --registry https://registry.npmjs.org 2>/dev/null || npm install

# Link to global node_modules
npm link

cd /tmp
rm -rf "$INSTALL_DIR"

if command -v vsp-porto &> /dev/null; then
    echo -e "\n${GREEN}✓ Installation successful!${NC}"
    echo ""
    echo -e "Next steps:"
    echo -e "  ${BLUE}vsp-porto list${NC}           # See available simulations"
    echo -e "  ${BLUE}vsp-porto install kalpataru${NC}  # Install a simulation"
    echo -e "  ${BLUE}vsp-porto start kalpataru${NC}    # Start it!"
    echo ""
    echo -e "Documentation: ${BLUE}https://porto.vspatabuga.io${NC}"
else
    echo -e "${RED}✗ Installation failed${NC}"
    exit 1
fi

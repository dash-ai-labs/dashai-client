#!/bin/bash

# DashAI Client Development Script
# This script handles both initial setup and successive runs

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$SCRIPT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[DashAI]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[DashAI]${NC} $1"
}

print_error() {
    echo -e "${RED}[DashAI]${NC} $1"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check for required tools
check_requirements() {
    local missing_tools=()
    
    if ! command_exists node; then
        missing_tools+=("Node.js")
    fi
    
    if ! command_exists yarn; then
        missing_tools+=("yarn")
    fi
    
    if [ ${#missing_tools[@]} -gt 0 ]; then
        print_error "Missing required tools:"
        for tool in "${missing_tools[@]}"; do
            echo "  - $tool"
        done
        echo ""
        print_error "Please install the missing tools and try again:"
        echo "  - Node.js: https://nodejs.org/"
        echo "  - yarn: https://yarnpkg.com/"
        exit 1
    fi
}

# Function to detect package manager
detect_package_manager() {
    echo "yarn"
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing dependencies using yarn..."
    
    cd "$PROJECT_DIR" || exit 1
    
    yarn install
    
    if [ $? -ne 0 ]; then
        print_error "Failed to install dependencies"
        print_error "Try running manually:"
        echo "  yarn install"
        exit 1
    fi
}

# Function to check if .env file exists and prompt for creation
check_env_file() {
    if [ ! -f "$PROJECT_DIR/.env" ]; then
        print_error ".env file not found"
        echo ""
        
        if [ -f "$PROJECT_DIR/.env.example" ]; then
            print_error "Please create a .env file by copying the example and filling in your values:"
            echo "  cp .env.example .env"
            echo "  # Then edit .env with your actual values"
        else
            print_error "Please create a .env file with the following variables:"
            echo "  PUBLIC_API_URL=<your_api_url>"
            echo "  PUBLIC_GOOGLE_CLIENT_ID=<your_google_client_id>"
        fi
        
        echo ""
        print_error "Environment setup is required before running the development server."
        exit 1
    fi
}

# Function to start development server
start_dev_server() {
    print_status "Starting DashAI Client development server..."
    
    cd "$PROJECT_DIR" || exit 1
    
    yarn dev
}

# Main execution
main() {
    print_status "DashAI Client Development Setup"
    echo ""
    
    # Check if we're in the right directory
    if [ ! -f "$PROJECT_DIR/package.json" ]; then
        print_error "package.json not found in $PROJECT_DIR"
        print_error "Make sure you're running this script from the dashai-client directory"
        exit 1
    fi
    
    # Check requirements
    check_requirements
    
    # Check if node_modules exists
    if [ ! -d "$PROJECT_DIR/node_modules" ]; then
        print_status "First time setup detected"
        install_dependencies
    else
        print_status "Dependencies already installed"
    fi
    
    # Check environment file
    check_env_file
    
    # Start development server
    start_dev_server
}

# Run main function
main "$@"
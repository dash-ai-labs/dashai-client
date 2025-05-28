#!/bin/bash

# Version of this script
CURRENT_VERSION="1.0.1"

# Get the directory where the dashai-client project is installed
DASHAI_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Function to detect if old installation exists
detect_old_installation() {
    if grep -q "### BEGIN DASHAI CLI COMMANDS ###" ~/.zshrc || grep -q "alias dashai-client=" ~/.zshrc; then
        return 0  # Found
    else
        return 1  # Not found
    fi
}

# Function to uninstall old version
uninstall_old_version() {
    echo "    Uninstalling old version..."

    # Create a temporary file
    TEMP_FILE=$(mktemp)

    # Remove any standalone aliases for dashai-client first
    sed -e '/alias dashai-client=/d' ~/.zshrc > "$TEMP_FILE"
    cp "$TEMP_FILE" ~/.zshrc

    # Find the exact start and end lines using the marker comments
    START_LINE=$(grep -n "### BEGIN DASHAI CLI COMMANDS ###" ~/.zshrc | cut -d: -f1)
    END_LINE=$(grep -n "### END DASHAI CLI COMMANDS ###" ~/.zshrc | cut -d: -f1)
    
    if [ ! -z "$START_LINE" ] && [ ! -z "$END_LINE" ]; then
        # Remove the block between and including the markers
        sed -e "${START_LINE},${END_LINE}d" ~/.zshrc > "$TEMP_FILE"

        # Remove any trailing empty lines
        perl -i -0pe 's/\n+\Z/\n/' "$TEMP_FILE"

        # Copy the cleaned content back
        cp "$TEMP_FILE" ~/.zshrc

        echo "    Old version uninstalled successfully"
    else
        echo "    Incomplete or no previous installation found in block format"
    fi

    # Clean up
    rm "$TEMP_FILE"
}

# Create the content to be added to .zshrc
read -r -d '' DASHAI_FUNCTIONS << 'EOF'
### BEGIN DASHAI CLI COMMANDS ###
export DASHAI_APP_DIR="%DASHAI_DIR%"
export DASHAI_CLI_VERSION="%VERSION%"

# Function to check if dashai-client CLI needs an update
_dashai_check_update() {
    if [ -f "$DASHAI_APP_DIR/install_dashai_cli.sh" ]; then
        AVAILABLE_VERSION=$(grep "^CURRENT_VERSION=" "$DASHAI_APP_DIR/install_dashai_cli.sh" | cut -d'"' -f2)
        if [ "$AVAILABLE_VERSION" != "$DASHAI_CLI_VERSION" ]; then
            echo "⚠️  DashAI CLI update available! ($DASHAI_CLI_VERSION → $AVAILABLE_VERSION)"
            echo "   To update, run: dashai-client update"
            echo ""
        fi
    fi
}

# Main dashai-client function
dashai-client() {
    # Check for updates before running any command
    _dashai_check_update

    case "$1" in
        "dev")
            bash "$DASHAI_APP_DIR/dashai-client-dev.sh"
            ;;
        "version")
            echo "DashAI CLI version: $DASHAI_CLI_VERSION"
            ;;
        "update")
            echo "Updating DashAI CLI..."
            bash "$DASHAI_APP_DIR/install_dashai_cli.sh"
            ;;
        *)
            echo "DashAI Client CLI"
            echo ""
            echo "Available commands:"
            echo "  dev       - Start the DashAI Client development server"
            echo "  version   - Show current CLI version"
            echo "  update    - Update the CLI to the latest version"
            echo ""
            echo "Usage: dashai-client <command>"
            ;;
    esac
}
### END DASHAI CLI COMMANDS ###
EOF

# Replace the placeholders with actual values
DASHAI_FUNCTIONS="${DASHAI_FUNCTIONS//%DASHAI_DIR%/$DASHAI_DIR}"
DASHAI_FUNCTIONS="${DASHAI_FUNCTIONS//%VERSION%/$CURRENT_VERSION}"

echo "Starting DashAI CLI installation process..."

# Check if .zshrc exists, create if it doesn't
if [ ! -f ~/.zshrc ]; then
    echo "Creating ~/.zshrc file..."
    touch ~/.zshrc
fi

# Create a backup of .zshrc
cp ~/.zshrc ~/.zshrc.backup.$(date +%Y%m%d%H%M%S)

# Always run the uninstall to clean up any previous installations
if detect_old_installation; then
    uninstall_old_version
fi

# Add the new functions
echo "" >> ~/.zshrc
echo "$DASHAI_FUNCTIONS" >> ~/.zshrc

echo "Installation complete!"
echo "DashAI CLI has been installed/updated to version $CURRENT_VERSION"
echo ""
echo "Usage:"
echo "  dashai-client dev     - Start development server"
echo "  dashai-client version - Show CLI version"
echo "  dashai-client update  - Update CLI"
echo ""
echo "Please restart your terminal or run 'source ~/.zshrc' to use the CLI"

# Make the script executable
chmod +x "$0"
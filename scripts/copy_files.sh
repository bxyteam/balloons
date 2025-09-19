#!/bin/bash

COPY_BALLOONS_PROCESSOR=${1:-false}

WEB_DIR="/var/balloon/data/web"
GITHUB_DIR="/var/balloon/data/github"

# Function to validate boolean input
validate_boolean() {
    local input="$1"
    case "$input" in
        true|TRUE|1|yes|YES|y|Y)
            echo "true"
            ;;
        false|FALSE|0|no|NO|n|N)
            echo "false"
            ;;
        *)
            echo "Invalid boolean value: $input" >&2
            echo "Usage: $0 [true|false]" >&2
            echo "  true/TRUE/1/yes/y  - Copy balloons_processor directory" >&2
            echo "  false/FALSE/0/no/n - Skip balloons_processor directory" >&2
            exit 1
            ;;
    esac
}

# Validate the boolean parameter
COPY_BALLOONS_PROCESSOR=$(validate_boolean "$COPY_BALLOONS_PROCESSOR")

# Copy templates if source directory exists and has files
if [ -d "${GITHUB_DIR}/frontend/templates" ] && [ "$(find "${GITHUB_DIR}/frontend/templates" -type f | head -n 1)" ]; then
    echo "Copying templates..."
    cp -r "${GITHUB_DIR}/frontend/templates/"* "${WEB_DIR}/templates"
    echo "Templates copied successfully"
else
    echo "Templates directory is missing or empty: ${GITHUB_DIR}/frontend/templates"
fi

# Copy builder files and folders if source directory exists and has files
if [ -d "${GITHUB_DIR}/frontend/builder" ] && [ "$(find "${GITHUB_DIR}/frontend/builder" -type f | head -n 1)" ]; then
    echo "Copying builder files..."
    cp -r "${GITHUB_DIR}/frontend/builder/." "${WEB_DIR}"
    echo "Builder files copied successfully"
else
    echo "Builder directory is missing or empty: ${GITHUB_DIR}/frontend/builder"
fi

# Copy balloons_processor files and folders ONLY if boolean parameter is true
if [ "$COPY_BALLOONS_PROCESSOR" = "true" ]; then
    echo "COPY_BALLOONS_PROCESSOR is true, checking balloons_processor directory..."

    if [ -d "${GITHUB_DIR}/balloons_processor" ] && [ "$(find "${GITHUB_DIR}/balloons_processor" -type f | head -n 1)" ]; then
        echo "Copying balloons_processor files..."
        cp -r "${GITHUB_DIR}/balloons_processor/." "${WEB_DIR}"
        echo "Balloons_processor files copied successfully"
    else
        echo "Balloons_processor directory is missing or empty: ${GITHUB_DIR}/balloons_processor"
    fi
else
    echo "COPY_BALLOONS_PROCESSOR is false, skipping balloons_processor directory"
fi

echo "Script completed successfully"

#!/bin/bash

WEB_DIR="/var/balloon/data/web"
GITHUB_DIR="/var/balloon/data/github"

# Copy templates if source directory exists and has files
if [ -d "${GITHUB_DIR}/frontend/templates" ] && [ "$(find "${GITHUB_DIR}/frontend/templates" -type f | head -n 1)" ]; then
    cp -r "${GITHUB_DIR}/frontend/templates/"* "${WEB_DIR}/templates"
else
    echo "Templates directory is missing or empty: ${GITHUB_DIR}/frontend/templates"
fi

# Copy builder files and folders if source directory exists and has files
if [ -d "${GITHUB_DIR}/frontend/builder" ] && [ "$(find "${GITHUB_DIR}/frontend/builder" -type f | head -n 1)" ]; then
    cp -r "${GITHUB_DIR}/frontend/builder/." "${WEB_DIR}"
else
    echo "Builder directory is missing or empty: ${GITHUB_DIR}/frontend/builder"
fi

# Copy java files and folders if source directory exists and has files
if [ -d "${GITHUB_DIR}/frontend/balloons_processor" ] && [ "$(find "${GITHUB_DIR}/frontend/balloons_processor" -type f | head -n 1)" ]; then
    cp -r "${GITHUB_DIR}/frontend/balloons_processor/." "${WEB_DIR}"
else
    echo "Balloons Processor directory is missing or empty: ${GITHUB_DIR}/frontend/balloons_processor"
fi

# #!/bin/bash

# WEB_DIR="/var/balloon/data/web"
# GITHUB_DIR="/var/balloon/data/github"
# CHECKOUT_DIR="${GITHUB_DIR}/frontend/balloons_processor"
# COMMIT_FILE="/var/balloon/data/last_commit.txt"  # File to store the last known commit hash

# # Navigate to the balloons_processor directory
# cd "$CHECKOUT_DIR" || { echo "Failed to change directory to $CHECKOUT_DIR"; exit 1; }

# # Fetch the latest changes from the remote repository
# git fetch origin

# # Get the latest commit hash from the remote 'main' branch (or any other branch you're working with)
# REMOTE_COMMIT=$(git rev-parse origin/main)  # Replace 'main' with your desired branch if needed

# # Check if the commit file exists
# if [ -f "$COMMIT_FILE" ]; then
#     # Read the last known commit hash from the file
#     LAST_COMMIT=$(cat "$COMMIT_FILE")

#     if [ "$REMOTE_COMMIT" != "$LAST_COMMIT" ]; then
#         # If the remote commit has changed, copy the files and update the commit hash
#         echo "Balloons Processor directory has changed. Copying files..."
#         cp -r "${CHECKOUT_DIR}/." "${WEB_DIR}"
#         # Update the commit hash in the file
#         echo "$REMOTE_COMMIT" > "$COMMIT_FILE"
#     else
#         echo "No changes in the Balloons Processor directory. Skipping copy."
#     fi
# else
#     # If no commit file exists (first run), copy the files and create the commit file
#     echo "No previous commit found. Copying files for the first time..."
#     cp -r "${CHECKOUT_DIR}/." "${WEB_DIR}"
#     echo "$REMOTE_COMMIT" > "$COMMIT_FILE"  # Create the commit hash file
# fi

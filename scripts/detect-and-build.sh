#!/usr/bin/env bash
# scripts/detect-and-build.sh
# Universal build script for any Node.js project

set -e

echo "🔍 Detecting project type and configuration..."

# -----------------------------------------------------------
# Detect package manager
# -----------------------------------------------------------
if [ -f "yarn.lock" ]; then
    PKG_MANAGER="yarn"
    INSTALL_CMD="yarn install --frozen-lockfile"
elif [ -f "pnpm-lock.yaml" ]; then
    PKG_MANAGER="pnpm"
    INSTALL_CMD="pnpm install --frozen-lockfile"
elif [ -f "package-lock.json" ]; then
    PKG_MANAGER="npm"
    INSTALL_CMD="npm ci --include=dev"
else
    PKG_MANAGER="npm"
    INSTALL_CMD="npm install --include=dev"
fi

echo "📦 Using package manager: $PKG_MANAGER"

# -----------------------------------------------------------
# Detect framework
# -----------------------------------------------------------
FRAMEWORK="generic"

if [ -f "next.config.js" ] || [ -f "next.config.ts" ]; then
    FRAMEWORK="next"
    echo "✅ Detected Next.js project"
elif [ -f "vite.config.js" ] || [ -f "vite.config.ts" ]; then
    FRAMEWORK="vite"
    echo "✅ Detected Vite project"
elif [ -f "webpack.config.js" ]; then
    FRAMEWORK="webpack"
    echo "✅ Detected Webpack project"
else
    echo "⚠️  No specific framework detected, using package.json scripts"
fi

# -----------------------------------------------------------
# Install dependencies
# -----------------------------------------------------------
echo "📥 Installing dependencies..."
eval $INSTALL_CMD


# In detect-and-build.sh, after installing dependencies:

# -----------------------------------------------------------
# Run Prisma generate if prisma schema exists
# -----------------------------------------------------------
if [ -f "prisma/schema.prisma" ]; then
    echo "🗄️  Generating Prisma client..."
    npx prisma generate --schema=prisma/schema.prisma 2>/dev/null || true
fi

# -----------------------------------------------------------
# Build the application
# -----------------------------------------------------------
case $FRAMEWORK in
    vite)
        echo "🏗️  Building Next. app..."
        npm run build
        ;;
    nexte)
        echo "🏗️  Building next.js app..."
        npm run build
        ;;
    *)
        echo "🏗️  Using package.json build script..."
        if npm run 2>/dev/null | grep -q "build"; then
            npm run build
        else
            echo "⚠️  No build script found, skipping build"
        fi
        ;;
esac

# -----------------------------------------------------------
# Determine start command
# -----------------------------------------------------------
echo "🚀 Determining start command..."

case $FRAMEWORK in
    next)
        START_CMD="npm start"
        ;;
    vite)
        if npm run 2>/dev/null | grep -q "preview"; then
            START_CMD="npm run preview"
        else
            START_CMD="npm start"
        fi
        ;;
    *)
        if npm run 2>/dev/null | grep -q "start"; then
            START_CMD="npm start"
        elif [ -f "server.js" ] || [ -f "index.js" ]; then
            START_CMD="node server.js"
        else
            echo "❌ No start command found"
            exit 1
        fi
        ;;
esac

echo "✅ Build complete! Start command: $START_CMD"

# Don't exec here - let the Docker CMD handle starting the app so we can run migrations first in the entrypoint
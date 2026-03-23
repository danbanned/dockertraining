# build.sh
#!/usr/bin/env bash
REPO_URL=$1
BRANCH=$2

git clone --depth 1 --branch $BRANCH $REPO_URL /tmp/repo
cd /tmp/repo

# Detect language
if [ -f "package.json" ]; then
    echo "Node.js app detected"
    docker build -f Dockerfile.node -t myapp .
elif [ -f "requirements.txt" ]; then
    echo "Python app detected"
    docker build -f Dockerfile.python -t myapp .
elif [ -f "go.mod" ]; then
    echo "Go app detected"
    docker build -f Dockerfile.go -t myapp .
fi
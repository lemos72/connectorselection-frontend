#!/bin/bash
set -e

echo "=== Deploy started: $(date) ==="

cd /home/ssm-user/connector-frontend

echo "Building site..."
echo "Clearing build cache..."
rm -rf .next out
npm run build

echo "Syncing to S3..."
aws s3 sync out/ s3://connectorselection.com/ --delete --exclude "downloads/*" --exclude "categories/signal-integrity/*" --exclude "6e360b5a5a2d4bd5bda7e06c0b6646ae.txt"

echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id ERI4NFYVTW518 --paths "/*"

echo "=== Deploy finished: $(date) ==="

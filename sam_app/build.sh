#!/bin/bash

# Build React app
cd react-app
npm run build
cd ..

# Copy React build to S3 deployment package
mkdir -p .aws-sam/build/ReactAppBucket
cp -R react-app/dist/* .aws-sam/build/ReactAppBucket/

# Build SAM application
sam build
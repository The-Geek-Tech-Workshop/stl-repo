#!/bin/bash

# Build React app
cd react-app
npm run build
cd ..

# Build SAM application
sam build
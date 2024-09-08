#!/bin/bash

# Deploy Sam infrastructure
sam deploy

# Upload React app to bucket
aws s3 sync --delete --region=eu-west-2 react-app/dist/ s3://stlrepo-react-app/
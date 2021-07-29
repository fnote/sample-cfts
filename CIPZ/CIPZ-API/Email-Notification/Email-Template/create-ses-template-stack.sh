#!/usr/bin/env bash
if test "$#" -eq 2; then
  echo "creating the stack: $1 with params $2"
  aws cloudformation create-stack                                   \
      --stack-name $1                     \
      --template-body file://CP-CIPZ-API-SES-TEMPLATE-CONFIGS.yml          \
      --parameters    file://$2
else
  echo "Execute the following command to create the stack."
  echo "   ./create-ses-template-stack.sh <stack-name> <parameter-file-name>"
fi
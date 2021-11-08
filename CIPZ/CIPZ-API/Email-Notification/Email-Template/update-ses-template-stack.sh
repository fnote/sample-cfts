#!/usr/bin/env bash
if test "$#" -eq 2; then
  echo "updating the stack: $1 with params $2"
  aws cloudformation update-stack                                   \
      --stack-name $1                     \
      --template-body file://CP-CIPZ-API-SES-TEMPLATE-CONFIGS.yml          \
      --parameters    file://$2
else
  echo "Execute the following command to update the stack."
  echo "   ./update-ses-template-stack.sh <stack-name> <parameter-file-name>"
fi
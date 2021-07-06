#!/usr/bin/env bash

aws cloudformation create-stack                                   \
    --stack-name CP-CIPZ-API-SES-Template-Rejected-DEV                     \
    --template-body file://CP-CIPZ-API-SES-TEMPLATE-CONFIGS.yml          \
    --parameters    file://parameters.json

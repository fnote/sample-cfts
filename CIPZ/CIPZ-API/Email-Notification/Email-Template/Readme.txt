1) Execute the following command to create the stack.

./create-ses-template-stack.sh <stack-name> <parameter-file-name>

*NOTE: You need to manually set the respective SNS topic to the corresponding configurationSet after the CFT creation.

For DEV
=======
./create-ses-template-stack.sh CP-CIPZ-API-SES-Template-Rejected-DEV parameters-dev.json

For EXE
=======
./create-ses-template-stack.sh CP-CIPZ-API-SES-Template-Rejected-EXE parameters-exe.json

For STG
=======
./create-ses-template-stack.sh CP-CIPZ-API-SES-Template-Rejected-STG parameters-stg.json

For PROD
=======
./create-ses-template-stack.sh CP-CIPZ-API-SES-Template-Rejected-PROD parameters-prod.json

2) Execute the following command to update the stack.

./update-ses-template-stack.sh <stack-name> <parameter-file-name>

For DEV
=======
./update-ses-template-stack.sh CP-CIPZ-API-SES-Template-Rejected-DEV parameters-dev.json

For EXE
=======
./update-ses-template-stack.sh CP-CIPZ-API-SES-Template-Rejected-EXE parameters-exe.json

For STG
=======
./update-ses-template-stack.sh CP-CIPZ-API-SES-Template-Rejected-STG parameters-stg.json

For PROD
=======
./update-ses-template-stack.sh CP-CIPZ-API-SES-Template-Rejected-PROD parameters-prod.json

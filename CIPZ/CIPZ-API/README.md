# Sequence of Events - CIPZ API
## For the first ever deployment of CIPZ-API
1. Create a stack from Cloud-Pricing-CIPZ-API-IAM-Roles.yaml
2. Create the ECR repository - cp-cipz-api
3. Add the project to AWS CodeBuild
4. Build the project
5. Get the Image URL from ECR and update it in Cloud-Pricing-CIPZ-API.yaml parameter - ecrImageUri
6. Create a stack from Cloud-Pricing-CIPZ-API.yaml

## For the updates
1. Update Cloud-Pricing-CIPZ-API.yaml with relevant changes
2. Update the stack with Cloud-Pricing-CIPZ-API.yaml

#### Note : Behavior is same for CIPZ Seed Mock API

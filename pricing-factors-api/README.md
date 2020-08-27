# Sequence of Events
## For the First ever deployment 
1. Create a stack with pfa-iam.yaml
2. Create the ECR repository - cp-pricing-factors-api
3. Add the project to AWS CodeBuild
4. Build the project
5. Get the Image URL from ECR and update it in pfa-service.yaml parameter - ecrImageUri
6. Create a stack with pfa-service.yaml

## If ECR and Image is already available 
1. Create a stack with pfa-iam.yaml
2. Create a stack with pfa-service.yaml


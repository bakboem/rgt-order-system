#!/bin/bash

S3_BUCKET="terraform-bucket-rgt"  
S3_KEY="terraform.tfstate"
LOCAL_STATE_FILE="terraform.tfstate"
LOCK_TABLE="custom-lock-table-rgt"
REGION="ap-northeast-2"

if ! aws s3 ls "s3://$S3_BUCKET" --region "$REGION" >/dev/null 2>&1; then
  echo "S3 bucket does not exist. Creating bucket: $S3_BUCKET"
  aws s3 mb "s3://$S3_BUCKET" --region "$REGION"
  if [ $? -ne 0 ]; then
    echo "Error: Failed to create S3 bucket."
    exit 1
  fi
  echo "S3 bucket created successfully."
fi

if aws logs delete-log-group --log-group-name vpc-log; then
    echo "Log group 'vpc-log' deleted successfully."
else
    echo "Failed to delete log group 'vpc-log'. Exiting..."
fi


terraform init \
  -backend-config="bucket=$S3_BUCKET" \
  -backend-config="key=$S3_KEY" \
  -backend-config="region=$REGION" \
  -backend-config="dynamodb_table=$LOCK_TABLE"

if [ $? -ne 0 ]; then
  echo "Error: Terraform init failed."
  exit 1
fi

echo "Terraform init completed successfully."

terraform plan
if [ $? -ne 0 ]; then
  echo "Error: Terraform plan failed."
  exit 1
fi

echo "Terraform plan completed successfully."

read -p "Do you want to proceed with Terraform apply? (yes/no): " user_input
if [ "$user_input" != "yes" ]; then
  echo "Operation cancelled by user. Exiting."
  exit 0
fi

terraform apply
if [ $? -ne 0 ]; then
  echo "Error: Terraform apply failed."
  exit 1
fi

echo "Terraform apply completed successfully."

aws s3 cp "$LOCAL_STATE_FILE" "s3://$S3_BUCKET/$S3_KEY" --region "$REGION"
if [ $? -ne 0 ]; then
  echo "Error: Failed to upload state file to S3."
  exit 1
fi

echo "State file successfully uploaded to S3."

exit 0

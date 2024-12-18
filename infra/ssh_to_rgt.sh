#!/bin/bash

# 引入 fetch_ssm_key.sh 脚本
source ./fetch_ssm_key.sh

RGT_IP=$(jq -r '.outputs.rgt_public_ip.value' terraform.tfstate)
SSM_KEY_NAME="keys_rgt_main_private"

echo "Fetching RGT private key from SSM..."
rgt_private_key=$(fetch_ssm_key "$SSM_KEY_NAME")
if [ $? -ne 0 ] || [ -z "$rgt_private_key" ]; then
  echo "Error: Unable to fetch private key."
  exit 1
fi
echo "Fetched private key successfully."

temp_key_file=$(mktemp)
echo "$rgt_private_key" > "$temp_key_file"
chmod 400 "$temp_key_file"

echo "Connecting to RGT host at $RGT_IP..."
ssh -o StrictHostKeyChecking=no -i "$temp_key_file" -t "ec2-user@$RGT_IP"

if [ $? -ne 0 ]; then
  echo "Error: Failed to connect to RGT host."
  rm -f "$temp_key_file" 
  exit 1
fi

rm -f "$temp_key_file"
echo "Temporary key file removed."

echo "Successfully connected to Bastion host."

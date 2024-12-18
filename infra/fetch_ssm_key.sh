# 定义函数：从 SSM 获取私钥
fetch_ssm_key() {
  local ssm_key_name=$1
  if [ -z "$ssm_key_name" ]; then
    echo "Error: Missing SSM key name."
    return 1
  fi

  echo "Fetching private key from SSM: $ssm_key_name..."

  # 获取私钥
local private_key
  private_key=$(aws ssm get-parameter --name "$ssm_key_name" --with-decryption --query "Parameter.Value" --output text 2>/dev/null)
  # 检查是否成功
  if [ $? -ne 0 ] || [ -z "$private_key" ]; then
    echo "Error: Failed to retrieve private key from SSM: $ssm_key_name"
    return 1
  fi

  echo "$private_key"
  return 0
}




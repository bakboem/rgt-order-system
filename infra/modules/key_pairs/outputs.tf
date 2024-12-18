# 动态输出所有密钥对的名称
output "key_names" {
  value = { for key, pair in aws_key_pair.key_pair : key => pair.key_name }
}

output "key_pairs" {
  value = {
    for k, v in aws_key_pair.key_pair : k => v.key_name
  }
}

output "key_pair_private_keys" {
  value = {
    for key, private_key in tls_private_key.key : key => private_key.private_key_pem
  }
}

output "key_pair_public_keys" {
  value = {
    for key, public_key in tls_private_key.key : key => public_key.public_key_openssh
  }
}
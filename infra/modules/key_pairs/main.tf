resource "tls_private_key" "key" {
  for_each = toset(flatten([for group, instances in var.instance_groups : instances])) # 获取所有实例名称

  algorithm = "RSA"
  rsa_bits  = 2048
}

resource "aws_key_pair" "key_pair" {
  for_each = toset(flatten([for group, instances in var.instance_groups : instances]))

  key_name   = each.key
  public_key = tls_private_key.key[each.key].public_key_openssh
}




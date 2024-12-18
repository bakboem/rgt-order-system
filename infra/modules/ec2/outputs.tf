# 在 module.ec2_instances 中的 outputs.tf 文件
output "instance_ids" {
  value = { for instance in aws_instance.ec2_instance : instance.tags["Name"] => instance.id }
}


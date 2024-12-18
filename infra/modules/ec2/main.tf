resource "aws_instance" "ec2_instance" {
  for_each = { for idx, instance in local.all_instances : instance.name => instance }

  ami                   = each.value.ami_id
  instance_type         = each.value.instance_type
  subnet_id             = each.value.subnet_id
  key_name              = each.value.key_pair
  security_groups       = toset(each.value.sg_id)  
  availability_zone     = each.value.availability_zone
  iam_instance_profile  = each.value.instance_profile

 root_block_device {
    volume_size = each.value.size
    volume_type = each.value.type
    tags = {
      Name = "${each.value.name}_root_volume"
    }
  }
  tags = {
    Name = each.value.name
  }
}

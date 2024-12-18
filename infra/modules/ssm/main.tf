

resource "aws_ssm_parameter" "rgt_ip" {
  name  =  "bastion_ip" 
  type  = "SecureString"
  value = var.rgt_ip   
  tier  = "Standard"
}


resource "aws_ssm_parameter" "key_pair" {
  for_each = var.key_pairs
  name  = "keys_${each.key}_private" 
  type  = "SecureString"
  value = each.value
  tier  = "Standard"
}


resource "aws_ssm_parameter" "rgt_security_id" {
  name  = "rgt_security_id"
  type  = "SecureString"
  value = var.rgt_sg_id
  tier  = "Standard"
}
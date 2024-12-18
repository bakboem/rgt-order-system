output "vpc_id" {
  value = module.vpc.vpc_id
}


output "aws_availability_zones" {
  value = data.aws_availability_zones.available.names
}

output "rgt_public_ip" {
 value = aws_eip.rgt.public_ip
}
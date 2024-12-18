variable "vpc_id" {
  description = "The ID of the VPC"
}

variable "allowed_ips" {
  description = "List of allowed IPs for SSH access"
  type        = list(string)
}

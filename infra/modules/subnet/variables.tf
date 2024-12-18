variable "vpc_id" {
  description = "AWS VPC ID"
  type = string
}

variable "availability_zone" {
  description = "AWS Availability Zone"
  default     = "ap-northeast-2a"
}

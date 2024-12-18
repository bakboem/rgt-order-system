variable "rgt_subnet_id" {
  description = "The ID of the RGT subnet"
  type        = string
}

variable "perfix" {
  description = "The name prefix for the gateway resources"
  type        = string
  default     = "rgt"
}


variable "vpc_id" {
  description = "vpc_id"
  type        = string
}

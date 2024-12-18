variable "instance_groups" {
  description = "A map of instance groups and their associated instances"
  type        = map(list(string))
}


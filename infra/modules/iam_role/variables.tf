variable "role_name" {
  description = "The name of the IAM Role"
  type        = string
}

variable "policy_statements" {
  description = "The policy statements to attach to the IAM Role"
  type = list(object({
    Effect   = string
    Action   = list(string)
    Resource = list(string)
    Condition = optional(any, null) 
  }))
}
variable "rgt_ip" {
  type = string
}
variable "key_pairs" {
  type = map(string)
  description = "Map of key pairs with instance names as keys and private keys as values"
}
variable "rgt_sg_id" {
  type = string
}
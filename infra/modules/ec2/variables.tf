variable "instance_configs" {
  description = "EC2 instance configuration"
  type        = map(any)
}

locals {
  all_instances = flatten([
    for service, config in var.instance_configs : [
      for idx, subnet_id in flatten([config.subnet_id]) :
      {
        name              = length(config.name) > 1 ? config.name[idx] : config.name[0]
        subnet_id         = subnet_id
        instance_type     = length(config.instance_type) > 1 ? config.instance_type[idx] : config.instance_type[0]
        instance_profile  = length(config.instance_profile) > 1 ? config.instance_profile[idx] : config.instance_profile[0]
        availability_zone = length(config.availability_zone) > 1 ? config.availability_zone[idx] : config.availability_zone[0]
        sg_id             = config.sg_id
        ami_id            = length(config.ami_id) > 1 ? config.ami_id[idx] : config.ami_id[0]
        key_pair          = length(config.key_pair) > 1 ? config.key_pair[idx] : config.key_pair[0]
        size              = length(config.size) > 1 ? config.size[idx] : config.size[0]
        type              = length(config.type) > 1 ? config.type[idx] : config.type[0]
      }
    ]
  ])
}

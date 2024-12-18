
data "aws_ssm_parameter" "latest_ami" {
  name = "/aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2"
}

data "aws_availability_zones" "available" {
  state = "available"
}


provider "aws" {
  region = "ap-northeast-2"
}

module "vpc" {
  source = "./modules/vpc"
}
module "subnet" {
  source = "./modules/subnet"
  vpc_id = module.vpc.vpc_id
  depends_on = [module.vpc]
}

module "gateway" {
  source = "./modules/gateway"
  vpc_id = module.vpc.vpc_id
  rgt_subnet_id = module.subnet.rgt_subnet_id
  depends_on = [module.vpc,module.subnet]
}

module "security_groups" {
  source      = "./modules/security_groups"
  vpc_id      = module.vpc.vpc_id
  allowed_ips = ["61.82.161.233/32"]
}

module "key_pairs" {
  source = "./modules/key_pairs"
  instance_groups = var.instance_groups
}


module "iam_role" {
  source          = "./modules/iam_role"
  role_name       = "ec2-ssm-role"
  policy_statements = [
    {
      Effect   = "Allow"
      Action   = ["ssm:GetParameter", "ssm:GetParameters", "ssm:DescribeParameters"]
      Resource = ["arn:aws:ssm:ap-northeast-2:123456789012:parameter/codera/*"]
    },
    {
      Effect   = "Allow"
      Action   = ["ecr:GetAuthorizationToken", "ecr:BatchCheckLayerAvailability", "ecr:GetDownloadUrlForLayer", "ecr:BatchGetImage"]
      Resource = ["*"]
    },
    {
      Effect   = "Allow"
      Action   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
      Resource = ["arn:aws:logs:ap-northeast-2:945655789140:log-group:vpc-log:*"]
    },
    {
      Effect   = "Allow"
      Action   = ["s3:ListBucket", "s3:GetObject", "s3:PutObject","s3:ListAllMyBuckets"]
      Resource = [
        "arn:aws:s3:::*",       
        "arn:aws:s3:::*/*"     
      ]
    }
  ]
  depends_on = [module.gateway]
}

locals {
  instance_configs = {
    rgt = {
      subnet_id         = [module.subnet.rgt_subnet_id]
      instance_type     = ["t3.nano"]
      instance_profile  = [module.iam_role.instance_profile_name]
      availability_zone = ["ap-northeast-2a"]
      sg_id             = [module.security_groups.rgt_sg_id]
      ami_id            = [data.aws_ssm_parameter.latest_ami.value]
      key_pair          = [module.key_pairs.key_names["rgt_main"]]
      name              = ["rgt_main"]
      size              = [8]
      type              = ["gp3"]
    }
  }
}

module "ec2_instances" {
  source = "./modules/ec2"
  instance_configs = local.instance_configs
  depends_on = [module.iam_role]
}


resource "aws_eip" "rgt" {
  instance   = module.ec2_instances.instance_ids["rgt_main"]  
  depends_on = [module.ec2_instances]  
  tags = {
    Name = "rgt_public_ip"
  }
  lifecycle {
    prevent_destroy = true
  }
}


module "ssm" {
  source           = "./modules/ssm"
  rgt_ip       = aws_eip.rgt.public_ip
  rgt_sg_id    = module.security_groups.rgt_sg_id
  key_pairs = module.key_pairs.key_pair_private_keys
  depends_on = [aws_eip.rgt,module.security_groups]
}

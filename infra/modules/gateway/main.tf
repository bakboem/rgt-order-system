resource "aws_internet_gateway" "main" {
  vpc_id = var.vpc_id
  tags = {
    Name = "${var.perfix}-igw"
  }
  
}

# 创建路由表
resource "aws_route_table" "main" {
  vpc_id = var.vpc_id
  tags = {
    Name = "${var.perfix}-route-table"
  }
  
}

# 配置默认路由指向 IGW
resource "aws_route" "default" {
  route_table_id         = aws_route_table.main.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.main.id
  
}

# 将路由表关联到子网 (Bastion)
resource "aws_route_table_association" "bastion" {
  subnet_id      = var.rgt_subnet_id
  route_table_id = aws_route_table.main.id
  
}
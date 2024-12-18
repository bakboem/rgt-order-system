
resource "aws_subnet" "rgt" {
  vpc_id            = var.vpc_id
  cidr_block        = "10.0.2.0/24"
  availability_zone = var.availability_zone
  tags = {
    Name = "rgt-subnet"
  }
}
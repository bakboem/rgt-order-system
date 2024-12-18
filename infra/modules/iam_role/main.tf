resource "aws_iam_role" "new_role" {
  name = var.role_name

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect    = "Allow",
        Principal = {
          Service = "ec2.amazonaws.com"
        },
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_policy" "policy" {
  name        = "${var.role_name}-policy"
  description = "Policy for EC2 to access SSM Parameter Store"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [for statement in var.policy_statements : merge(statement, {
      Condition = statement.Condition != null ? jsondecode(statement.Condition) : {}
    })]
  })
}


resource "aws_iam_role_policy_attachment" "attach" {
  role       = aws_iam_role.new_role.name
  policy_arn = aws_iam_policy.policy.arn
}

resource "aws_iam_instance_profile" "instance_profile" {
  name = "${var.role_name}-profile"
  role = aws_iam_role.new_role.name
}

output "instance_profile_name" {
  value = aws_iam_instance_profile.instance_profile.name
}

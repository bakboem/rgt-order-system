output "internet_gateway_id" {
  description = "The ID of the Internet Gateway"
  value       = aws_internet_gateway.main.id
}

output "route_table_id" {
  description = "The ID of the Route Table"
  value       = aws_route_table.main.id
}

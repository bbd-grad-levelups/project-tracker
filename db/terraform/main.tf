# configure provider
provider "aws" {
  region  = "eu-west-1"
  profile = "" # create profile with aws access key and access key id
}

# create vpc
resource "aws_vpc" "project-tracker-vpc" {
  cidr_block           = "23.0.0.0/16"
  enable_dns_hostnames = true

  tags = {
    Name = "project-tracker-vpc"
  }
}

# use data source to get all availablility zones in region
# data "aws_availability_zones" "available_zones" {}

# create subnet in the first az
resource "aws_subnet" "subnet_az1" {
  vpc_id            = aws_vpc.project-tracker-vpc.id
  availability_zone = "eu-west-1a"
}

# create subnet in the second az
resource "aws_subnet" "subnet_az2" {
  vpc_id            = aws_vpc.project-tracker-vpc.id
  availability_zone = "eu-west-1b"
}

# create security group for the web server
resource "aws_security_group" "ws_security_group" {
  name        = "project tracker web server security group"
  description = "enable http access on port 80"
  vpc_id      = aws_vpc.project-tracker-vpc.id

  ingress {
    description      = "http access"
    from_port        = 80
    to_port          = 80
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"] # adjust
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"] # adjust
  }

  tags   = {
    Name = "project tracker web server security group"
  }
}

# create security group for the database
resource "aws_security_group" "db_security_group" {
  name        = "project tracker db security group"
  description = "enable mssql access on port 1433"
  vpc_id      = aws_vpc.project-tracker-vpc.id

  ingress {
    description      = "mssql access"
    from_port        = 1433
    to_port          = 1433
    protocol         = "tcp"
    security_groups  = [aws_security_group.ws_security_group.id]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"] # adjust
  }

  tags   = {
    Name = "project tracker db security group"
  }
}

# create subnet group for the rds instance
resource "aws_db_subnet_group" "db_subnet_group" {
  name         = "project tracker subnet group"
  subnet_ids   = [aws_subnet.subnet_az1.id, aws_subnet.subnet_az2.id]
  description  = "subnet group for rds instance"

  tags   = {
    Name = "project tracker subnet group"
  }
}

# create rds instance
resource "aws_db_instance" "project_tracker_db" {
  engine                  = "sqlserver-ex"
  engine_version          = "15.00.4345.5.v1"
  multi_az                = false
  identifier              = "project-tracker-db"
  username                = "" # add variable
  password                = "" # add variable
  instance_class          = "db.t3.micro"
  allocated_storage       = 20
  db_subnet_group_name    = aws_db_subnet_group.db_subnet_group.name
  vpc_security_group_ids  = [aws_security_group.db_security_group.id]
  availability_zone       = "eu-west-1a"
  db_name                 = "project_tracker_db"
  skip_final_snapshot     = true
}

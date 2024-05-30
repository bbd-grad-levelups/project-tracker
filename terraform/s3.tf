resource "aws_s3_bucket" "beanstalk_release_bucket" {
  bucket        = "project-tracker-deploy-bucket"
  force_destroy = true
}

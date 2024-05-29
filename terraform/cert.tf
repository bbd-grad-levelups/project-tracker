
resource "aws_acm_certificate" "cert_backend" {
  domain_name       = aws_elastic_beanstalk_environment.beanstalk_env.endpoint_url
  validation_method = "DNS"
 
  lifecycle {
    create_before_destroy = true
  }
}
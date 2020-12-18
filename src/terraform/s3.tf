locals {
  lambda_s3_bucket = "${local.app_name}-lambda-${local.environment}"
  #   environment = "${local.environment}"
  lambda_bucket_key   = "${local.app_name}-lambda.zip"
  lambda_zip_location = "../../dist"
  lambda_zip_path     = "${local.lambda_zip_location}/lambda.zip"
}

resource "aws_s3_bucket" "lambda_bucket" {
  bucket        = local.lambda_s3_bucket
  acl           = "private"
  force_destroy = true

  tags = {
    Name        = local.lambda_s3_bucket
    Environment = local.environment
  }

  versioning {
    enabled = true
  }
}

resource "aws_s3_bucket_object" "lambda_upload_zip" {
  bucket = local.lambda_s3_bucket
  key    = local.lambda_bucket_key
  source = local.lambda_zip_path
}
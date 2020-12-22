locals {
  lambda_function_name  = "${local.app_name}-${local.environment}-get"
  lambda_handler        = "src/lambda/get.ts"
  lambda_memory_size    = "128"
  lambda_timeout        = 5
  lambda_publish        = true
  lambda_runtime        = "nodejs12.x"
  lambda_tracing_config = "Active"
}

resource "aws_lambda_function" "get_lambda" {
  function_name = local.lambda_function_name
  role          = local.iam_for_xclusives_lambda
  handler       = local.lambda_handler
  s3_bucket     = aws_s3_bucket.lambda_bucket.id
  s3_key        = aws_s3_bucket_object.lambda_upload_zip.key
  description   = "GET function for xclusives application"
  memory_size   = local.lambda_memory_size
  timeout       = local.lambda_timeout
  publish       = local.lambda_publish
  tags          = local.product_tags

  # The filebase64sha256() function is available in Terraform 0.11.12 and later
  # For Terraform 0.11.11 and earlier, use the base64sha256() function and the file() function:
  # source_code_hash = "${base64sha256(file("lambda_function_payload.zip"))}"
  #   source_code_hash = filebase64sha256("lambda_function_payload.zip")

  runtime = local.lambda_runtime

  tracing_config {
    mode = local.lambda_tracing_config
  }

  environment {
    variables = {
      businessTable      = ""
      businessTypesTable = ""
      rateTable          = ""
      commentTable       = ""
    }
  }
}
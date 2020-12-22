locals {
  app_name     = "xclusives"
  environment  = "dev"
  product_tags = map("xclusives", "app")
  region       = "us-east-1"
  iam_for_xclusives_lambda = "arn:aws:iam::695738586291:role/iam_for_exclusives_lambda"
}
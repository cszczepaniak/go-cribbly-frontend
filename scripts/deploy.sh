set -ex

targetCommit=$1
cd infrastructure/
aws s3 cp s3://go-cribbly-frontend-artifacts/$GITHUB_SHA.zip artifact.zip
unzip artifact.zip -d artifact

sudo npm i -g aws-cdk
npm install
cdk bootstrap aws://$AWS_ACCOUNT_NUMBER/us-east-2
cdk synth
cdk deploy --require-approval=never
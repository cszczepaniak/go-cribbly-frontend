import { Stack, StackProps } from "aws-cdk-lib";
import { SPADeploy } from "cdk-spa-deploy";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class InfrastructureStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    new SPADeploy(this, id).createSiteWithCloudfront({
      indexDoc: "index.html",
      websiteFolder: "artifact",
    });
  }
}

import { App } from '@aws-cdk/core';
import { PipelineStack } from './pipeline-stack';
import { PipelineStage } from './pipeline-stage';

const app = new App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT!,
  region: 'us-west-2',
};

const pipeline = new PipelineStack(app, `TestPipeline`, { env });
pipeline.addPipelineStage(new PipelineStage(app, 'Dev', { env }));

app.synth();

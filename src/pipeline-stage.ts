import { Construct, Stage, StageProps } from '@aws-cdk/core';
import { EmptyStack } from './empty-stack';

export class PipelineStage extends Stage {
  constructor(scope: Construct, id: string, props: StageProps) {
    super(scope, id, props);

    new EmptyStack(this, 'empty', {});
  }
}

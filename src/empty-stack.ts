import { Construct, Stack, StackProps } from '@aws-cdk/core';

export class EmptyStack extends Stack {
  constructor(construct: Construct, id: string, props: StackProps) {
    super(construct, id, props);

    // Nothing here!
  }
}

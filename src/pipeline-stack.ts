import {
  BuildSpec,
  ComputeType,
  LinuxBuildImage,
  PipelineProject,
} from '@aws-cdk/aws-codebuild';
import { Repository } from '@aws-cdk/aws-codecommit';
import { Artifact } from '@aws-cdk/aws-codepipeline';
import { CodeBuildAction, CodeCommitSourceAction } from '@aws-cdk/aws-codepipeline-actions';
import { Construct, Stack, StackProps } from '@aws-cdk/core';
import { CdkPipeline } from '@aws-cdk/pipelines';
import { PipelineStage } from './pipeline-stage';

export class PipelineStack extends Stack {
  private pipeline: CdkPipeline;
  private readonly sourceArtifact: Artifact;
  private readonly cloudAssemblyArtifact: Artifact;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    this.sourceArtifact = new Artifact();
    this.cloudAssemblyArtifact = new Artifact();

    const repo = new Repository(this, 'CodeRepo', {
      repositoryName: 'MyRepo',
    });

    const project = new PipelineProject(this, 'CdkBuildProject', {
      environment: {
        buildImage: LinuxBuildImage.STANDARD_5_0,
        computeType: ComputeType.LARGE,
        privileged: true,
      },
      buildSpec: BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            'runtime-versions': {
              nodejs: 14,
            },
          },
          build: {
            commands: [
              'yarn install --frozen-lockfile',
              'yarn run build',
            ],
          },
        },
        artifacts: {
          'base-directory': 'cdk.out',
          files: '**/*',
        },
      }),
    });

    const synthAction = new CodeBuildAction({
      actionName: 'Synth',
      input: this.sourceArtifact,
      outputs: [this.cloudAssemblyArtifact],
      project,
    });

    this.pipeline = new CdkPipeline(this, 'Pipeline', {
      sourceAction: new CodeCommitSourceAction({
        repository: repo,
        branch: 'mainline',
        output: this.sourceArtifact,
        actionName: 'Source',
      }),
      cloudAssemblyArtifact: this.cloudAssemblyArtifact,
      synthAction,
    });
  }

  public addPipelineStage(stage: PipelineStage) {
    this.pipeline.addApplicationStage(stage);
  }
}

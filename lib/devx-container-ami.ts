import type { GuStackProps } from '@guardian/cdk/lib/constructs/core';
import { GuStack } from '@guardian/cdk/lib/constructs/core';
import type { App } from 'aws-cdk-lib';
import {
	InstanceProfile,
	ManagedPolicy,
	Role,
	ServicePrincipal,
} from 'aws-cdk-lib/aws-iam';
import {
	CfnDistributionConfiguration,
	CfnImagePipeline,
	CfnImageRecipe,
	CfnInfrastructureConfiguration,
} from 'aws-cdk-lib/aws-imagebuilder';

export class DevxContainerAmi extends GuStack {
	constructor(scope: App, id: string, props: GuStackProps) {
		super(scope, id, props);

		const recipe = new CfnImageRecipe(this, 'DevxContainerRecipe', {
			name: `devx-ami-${props.stage}-recipe`,
			parentImage:
				'arn:aws:imagebuilder:eu-west-1:aws:image/amazon-linux-2-arm64/2024.6.11',
			components: [
				{
					componentArn:
						'arn:aws:imagebuilder:eu-west-1:aws:component/amazon-corretto-17-jre/1.0.0/1',
				},
			],
			version: '1.0.0',
		});

		const role = new InstanceProfile(this, 'ImageBuilderProfie', {
			role: new Role(this, 'ImageBuilderRole', {
				assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
				managedPolicies: [
					ManagedPolicy.fromAwsManagedPolicyName(
						'EC2InstanceProfileForImageBuilder',
					),
				],
			}),
		});

		const config = new CfnInfrastructureConfiguration(
			this,
			'InfrastructureConfiguration',
			{
				name: `devx-ami-${props.stage}-config`,
				instanceProfileName: role.instanceProfileName,
			},
		);

		const distribution = new CfnDistributionConfiguration(
			this,
			'DevxContainerDistribution',
			{
				name: `devx-ami-${props.stage}-distribution`,
				distributions: [
					{
						region: 'eu-west-1',
						amiDistributionConfiguration: {},
					},
				],
			},
		);

		new CfnImagePipeline(this, 'DevxAmiPipeline', {
			name: `devx-ami-${props.stage}-pipeline`,
			description: 'Pipeline for creating the devx AMI',
			infrastructureConfigurationArn: config.attrArn,
			imageRecipeArn: recipe.attrArn,
			distributionConfigurationArn: distribution.attrArn,
		});
	}
}

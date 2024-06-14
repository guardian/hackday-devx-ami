import 'source-map-support/register';
import { GuRoot } from '@guardian/cdk/lib/constructs/root';
import { DevxContainerAmi } from '../lib/devx-container-ami';

const app = new GuRoot();
new DevxContainerAmi(app, 'DevxContainerAmi-euwest-1-CODE', {
	stack: 'playground',
	stage: 'CODE',
	env: { region: 'eu-west-1' },
});
new DevxContainerAmi(app, 'DevxContainerAmi-euwest-1-PROD', {
	stack: 'playground',
	stage: 'PROD',
	env: { region: 'eu-west-1' },
});

import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { DevxContainerAmi } from "./devx-container-ami";

describe("The DevxContainerAmi stack", () => {
  it("matches the snapshot", () => {
    const app = new App();
    const stack = new DevxContainerAmi(app, "DevxContainerAmi", { stack: "playground", stage: "TEST" });
    const template = Template.fromStack(stack);
    expect(template.toJSON()).toMatchSnapshot();
  });
});

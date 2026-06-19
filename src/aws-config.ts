import { Amplify } from "aws-amplify";

// AWS Cognito Configuration using the exact credentials provided
export const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: "ap-southeast-2_zLb3FmHj8",
      userPoolClientId: "3fg0hh8323vfuqvreg1vn01d71",
      loginWith: {
        email: true,
      },
    },
  },
};

/**
 * Initializes and configures AWS Amplify Auth.
 */
export function configureAmplify() {
  try {
    Amplify.configure(awsConfig);
    console.log(
      "AWS Amplify Cognito configured successfully. User Pool ID:",
      awsConfig.Auth.Cognito.userPoolId,
    );
  } catch (error) {
    console.error("Failed to configure AWS Amplify:", error);
  }
}

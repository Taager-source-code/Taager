import * as unleash from 'unleash-client';
import Env from '../../../Env';

let unleashInstance;

//TODO: once we move towards DI container, make this code into a singleton class that gets injected
export const connect = async () => {
  unleashInstance = await unleash.startUnleash({
    url: Env.GITLAB_FEATURE_FLAGS_URL,
    instanceId: Env.GITLAB_FEATURE_FLAGS_INSTANCE_ID,
    appName: Env.GITLAB_FEATURE_FLAGS_ENVIRONMENT,
  });
};

export const isEnabled = (toggleName, tagerId) => {
  const unleashContext = {
    userId: `${tagerId}`,
  };
  return unleashInstance.isEnabled(toggleName, unleashContext);
};
/*GITLAB_FEATURE_FLAGS_URL=https://gitlab.com/api/v4/feature_flags/unleash/22464385
GITLAB_FEATURE_FLAGS_INSTANCE_ID=_xVR4M9zy5FzZS1kRo4N
GITLAB_FEATURE_FLAGS_ENVIRONMENT=dev*/



import { microsoftAuthApiRef } from '@backstage/core-plugin-api';
import { SignInPageBlueprint } from '@backstage/plugin-app-react';
import { SignInPage } from '@backstage/core-components';
import { createFrontendModule } from '@backstage/frontend-plugin-api';
import React from 'react';

const signInPage = SignInPageBlueprint.make({
  params: {
    loader: async () => props =>
      React.createElement(SignInPage, {
        ...props,
        providers: [
          'guest',
          {
            id: 'microsoft-auth-provider',
            title: 'Microsoft',
            message: 'Sign in using Microsoft Entra ID',
            apiRef: microsoftAuthApiRef,
          },
        ],
      }),
  },
});

export const signInPageModule = createFrontendModule({
  pluginId: 'app',
  extensions: [signInPage],
});

import { createApp } from '@backstage/frontend-defaults';
import { createFrontendModule } from '@backstage/frontend-plugin-api';
import apiDocsPlugin from '@backstage/plugin-api-docs/alpha';
import catalogPlugin from '@backstage/plugin-catalog/alpha';
import catalogGraphPlugin from '@backstage/plugin-catalog-graph/alpha';
import catalogImportPlugin from '@backstage/plugin-catalog-import/alpha';
import { microsoftAuthApiRef } from '@backstage/core-plugin-api';
import kubernetesPlugin from '@backstage/plugin-kubernetes/alpha';
import orgPlugin from '@backstage/plugin-org/alpha';
import { SignInPageBlueprint } from '@backstage/plugin-app-react';
import scaffolderPlugin from '@backstage/plugin-scaffolder/alpha';
import searchPlugin from '@backstage/plugin-search/alpha';
import techdocsPlugin from '@backstage/plugin-techdocs/alpha';
import userSettingsPlugin from '@backstage/plugin-user-settings/alpha';
import { navModule } from './modules/nav';
import { themeModule } from './modules/theme';
import { MedicaSignInPage } from './components/SignInPage';

const signInPage = SignInPageBlueprint.make({
  params: {
    loader: async () => props => (
      <MedicaSignInPage
        {...props}
        providers={[
          'guest',
          {
            id: 'microsoft-auth-provider',
            title: 'Microsoft',
            message: 'Sign in using Entra ID',
            apiRef: microsoftAuthApiRef,
          },
        ]}
      />
    ),
  },
});

export default createApp({
  features: [
    apiDocsPlugin,
    catalogPlugin,
    catalogGraphPlugin,
    catalogImportPlugin,
    kubernetesPlugin,
    orgPlugin,
    scaffolderPlugin,
    searchPlugin,
    techdocsPlugin,
    userSettingsPlugin,
    navModule,
    themeModule,
    createFrontendModule({
      pluginId: 'app',
      extensions: [signInPage],
    }),
  ],
});

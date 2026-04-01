import { createApp } from '@backstage/frontend-defaults';
import apiDocsPlugin from '@backstage/plugin-api-docs/alpha';
import catalogPlugin from '@backstage/plugin-catalog/alpha';
import catalogGraphPlugin from '@backstage/plugin-catalog-graph/alpha';
import catalogImportPlugin from '@backstage/plugin-catalog-import/alpha';
import kubernetesPlugin from '@backstage/plugin-kubernetes/alpha';
import orgPlugin from '@backstage/plugin-org/alpha';
import scaffolderPlugin from '@backstage/plugin-scaffolder/alpha';
import searchPlugin from '@backstage/plugin-search/alpha';
import techdocsPlugin from '@backstage/plugin-techdocs/alpha';
import userSettingsPlugin from '@backstage/plugin-user-settings/alpha';
import { navModule } from './modules/nav';
import { signInPageModule } from './modules/signInPage';

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
    signInPageModule,
  ],
});

import { createFrontendModule } from '@backstage/frontend-plugin-api';
import { ThemeBlueprint } from '@backstage/plugin-app-react';
import { UnifiedThemeProvider } from '@backstage/theme';
import { medicaTheme } from '../../themes/medicaTheme';
import React from 'react';

export const themeModule = createFrontendModule({
  pluginId: 'app',
  extensions: [
    ThemeBlueprint.make({
      params: {
        theme: {
          id: 'medica-theme',
          title: 'Medica Theme',
          variant: 'light',
          Provider: ({ children }: { children: React.ReactNode }) => (
            <UnifiedThemeProvider theme={medicaTheme}>
              {children}
            </UnifiedThemeProvider>
          ),
        },
      },
    }),
  ],
});

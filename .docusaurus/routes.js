import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/markdown-page',
    component: ComponentCreator('/markdown-page', '3d7'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', '455'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', '8b6'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', '096'),
            routes: [
              {
                path: '/docs/development/',
                component: ComponentCreator('/docs/development/', '930'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/development/api',
                component: ComponentCreator('/docs/development/api', '067'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/development/contributing',
                component: ComponentCreator('/docs/development/contributing', '98b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/development/database',
                component: ComponentCreator('/docs/development/database', '611'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/development/debugging',
                component: ComponentCreator('/docs/development/debugging', '4d5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/development/deployment',
                component: ComponentCreator('/docs/development/deployment', '89c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/development/environment',
                component: ComponentCreator('/docs/development/environment', '9ee'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/development/project-structure',
                component: ComponentCreator('/docs/development/project-structure', 'f96'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/development/scripts',
                component: ComponentCreator('/docs/development/scripts', '05d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/development/setup',
                component: ComponentCreator('/docs/development/setup', '375'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/development/troubleshooting',
                component: ComponentCreator('/docs/development/troubleshooting', '1ef'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/development/ui-framework',
                component: ComponentCreator('/docs/development/ui-framework', '437'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/development/workflow',
                component: ComponentCreator('/docs/development/workflow', '3da'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/intro',
                component: ComponentCreator('/docs/intro', '61d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/prisma-abstraction/',
                component: ComponentCreator('/docs/prisma-abstraction/', '288'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/prisma-abstraction/block',
                component: ComponentCreator('/docs/prisma-abstraction/block', '3ed'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/prisma-abstraction/fill-in-the-blank',
                component: ComponentCreator('/docs/prisma-abstraction/fill-in-the-blank', '82a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/prisma-abstraction/folder',
                component: ComponentCreator('/docs/prisma-abstraction/folder', 'cd8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/prisma-abstraction/points-update',
                component: ComponentCreator('/docs/prisma-abstraction/points-update', '0c1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/prisma-abstraction/question',
                component: ComponentCreator('/docs/prisma-abstraction/question', '0ad'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/prisma-abstraction/quiz',
                component: ComponentCreator('/docs/prisma-abstraction/quiz', '62d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/prisma-abstraction/topic',
                component: ComponentCreator('/docs/prisma-abstraction/topic', '59d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/prisma-abstraction/user',
                component: ComponentCreator('/docs/prisma-abstraction/user', '480'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', 'e5f'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];

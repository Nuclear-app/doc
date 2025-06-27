import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '5ff'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '5ba'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'a2b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', 'c3c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '156'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '88c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '000'),
    exact: true
  },
  {
    path: '/markdown-page',
    component: ComponentCreator('/markdown-page', '3d7'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', '797'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', '132'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', '9e1'),
            routes: [
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

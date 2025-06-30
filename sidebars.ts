import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Prisma Abstraction Layer',
      link: {
        type: 'doc',
        id: 'prisma-abstraction/README',
      },
      items: [
        'prisma-abstraction/user',
        'prisma-abstraction/block',
        'prisma-abstraction/folder',
        'prisma-abstraction/quiz',
        'prisma-abstraction/question',
        'prisma-abstraction/topic',
        'prisma-abstraction/fill-in-the-blank',
        'prisma-abstraction/points-update',
      ],
    },
    {
      type: 'category',
      label: 'Development Guide',
      link: {
        type: 'doc',
        id: 'development/README',
      },
      items: [
        'development/setup',
        'development/project-structure',
        'development/scripts',
        'development/environment',
        'development/database',
        'development/workflow',
        'development/ui-framework',
        'development/api',
        'development/debugging',
        'development/deployment',
        'development/troubleshooting',
        'development/contributing',
      ],
    },
  ],

  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
   */
};

export default sidebars;

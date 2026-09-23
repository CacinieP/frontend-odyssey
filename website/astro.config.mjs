import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://CacinieP.github.io',
  base: '/frontend-odyssey',
  integrations: [
    starlight({
      title: 'Frontend Odyssey',
      description: 'A bilingual frontend learning journey: from HTML/CSS/JS to TypeScript, React, and AI Agents',
      defaultLocale: 'en',
      locales: {
        en: { label: 'English', lang: 'en' },
        zh: { label: '中文', lang: 'zh-CN' },
      },
      social: {
        github: 'https://github.com/CacinieP/frontend-odyssey',
      },
      sidebar: [
        {
          label: 'Getting Started',
          translations: { 'zh-CN': '开始学习' },
          autogenerate: { directory: 'guides' },
        },
        {
          label: 'I. HTML',
          translations: { 'zh-CN': 'I. HTML' },
          autogenerate: { directory: '01-html' },
        },
        {
          label: 'II. CSS',
          translations: { 'zh-CN': 'II. CSS' },
          autogenerate: { directory: '02-css' },
        },
        {
          label: 'III. JavaScript',
          translations: { 'zh-CN': 'III. JavaScript' },
          autogenerate: { directory: '03-javascript' },
        },
      ],
    }),
  ],
});

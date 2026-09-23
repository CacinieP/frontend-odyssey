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
          items: [
            { slug: 'guides/introduction' },
          ],
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
        {
          label: 'IV. TypeScript',
          translations: { 'zh-CN': 'IV. TypeScript' },
          autogenerate: { directory: '04-typescript' },
        },
        {
          label: 'V. React',
          translations: { 'zh-CN': 'V. React' },
          autogenerate: { directory: '05-react' },
        },
        {
          label: 'VI. Engineering',
          translations: { 'zh-CN': 'VI. 工程化' },
          autogenerate: { directory: '06-engineering' },
        },
        {
          label: 'VII. AI Agents',
          translations: { 'zh-CN': 'VII. AI 智能体' },
          autogenerate: { directory: '07-ai-agents' },
        },
      ],
    }),
  ],
});

import { defineConfig } from 'vocs'

export default defineConfig({
  title: 'drbot',
  description: 'A (local) music bot for discord',
  sidebar: [
    {
      text: 'Getting Started',
      link: '/getting-started',
    },
    {
      text: 'Docker',
      link: '/running-with-docker',
    },
    {
      text: 'Without Docker',
      link: '/running-without-docker',
    },
    {
      text: 'Usage',
      link: '/usage',
    },
    {
      text: 'Troubleshooting',
      link: '/troubleshooting',
    },
  ],
})

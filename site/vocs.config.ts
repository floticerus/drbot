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
      text: 'Creating Discord Bot',
      link: '/creating-discord-bot',
    },
    {
      text: 'Usage',
      items: [
        {
          text: 'Slash Commands',
          link: '/usage-slash-commands',
          items: [
            {
              text: '/clear',
              link: '/command-clear',
            },
            {
              text: '/np',
              link: '/command-np',
            },
            {
              text: '/pause',
              link: '/command-pause',
            },
            {
              text: '/play',
              link: '/command-play',
            },
            {
              text: '/playall',
              link: '/command-playall',
            },
            {
              text: '/queue',
              link: '/command-queue',
            },
            {
              text: '/scan',
              link: '/command-scan',
            },
            {
              text: '/search',
              link: '/command-search',
            },
            {
              text: '/shuffle',
              link: '/command-shuffle',
            },
            {
              text: '/skip',
              link: '/command-skip',
            },
            {
              text: '/stats',
              link: '/command-stats',
            },
            {
              text: '/stop',
              link: '/command-stop',
            },
          ].sort(({ text: textA }, { text: textB }) => {
            const a = textA.toLowerCase()
            const b = textB.toLowerCase()
            return a > b ? 1 : a < b ? -1 : 0
          }),
        },
      ],
    },
    {
      text: 'Troubleshooting',
      link: '/troubleshooting',
    },
  ],
})

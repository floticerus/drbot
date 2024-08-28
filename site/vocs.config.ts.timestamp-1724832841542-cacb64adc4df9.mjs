// vocs.config.ts
import { defineConfig } from "file:///Users/kvonflotow/Projects/dbot/site/node_modules/vocs/_lib/index.js";
var vocs_config_default = defineConfig({
  title: "drbot",
  description: "A (local) music bot for discord",
  logoUrl: {
    light: "/images/drbot-sm4_256.png",
    dark: "/images/drbot-sm4_256.png"
  },
  sidebar: [
    {
      text: "Getting Started",
      link: "/getting-started"
    },
    {
      text: "Docker",
      link: "/running-with-docker"
    },
    {
      text: "Without Docker",
      link: "/running-without-docker"
    },
    {
      text: "Creating Discord Bot",
      link: "/creating-discord-bot"
    },
    {
      text: "Usage",
      items: [
        {
          text: "Slash Commands",
          link: "/usage-slash-commands",
          items: [
            {
              text: "/clear",
              link: "/command-clear"
            },
            {
              text: "/np",
              link: "/command-np"
            },
            {
              text: "/pause",
              link: "/command-pause"
            },
            {
              text: "/play",
              link: "/command-play"
            },
            {
              text: "/playall",
              link: "/command-playall"
            },
            {
              text: "/queue",
              link: "/command-queue"
            },
            {
              text: "/scan",
              link: "/command-scan"
            },
            {
              text: "/search",
              link: "/command-search"
            },
            {
              text: "/shuffle",
              link: "/command-shuffle"
            },
            {
              text: "/skip",
              link: "/command-skip"
            },
            {
              text: "/stats",
              link: "/command-stats"
            },
            {
              text: "/stop",
              link: "/command-stop"
            }
          ].sort(({ text: textA }, { text: textB }) => {
            const a = textA.toLowerCase();
            const b = textB.toLowerCase();
            return a > b ? 1 : a < b ? -1 : 0;
          })
        }
      ]
    },
    {
      text: "Troubleshooting",
      link: "/troubleshooting"
    }
  ]
});
export {
  vocs_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidm9jcy5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMva3ZvbmZsb3Rvdy9Qcm9qZWN0cy9kYm90L3NpdGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9rdm9uZmxvdG93L1Byb2plY3RzL2Rib3Qvc2l0ZS92b2NzLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMva3ZvbmZsb3Rvdy9Qcm9qZWN0cy9kYm90L3NpdGUvdm9jcy5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2b2NzJ1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICB0aXRsZTogJ2RyYm90JyxcbiAgZGVzY3JpcHRpb246ICdBIChsb2NhbCkgbXVzaWMgYm90IGZvciBkaXNjb3JkJyxcbiAgbG9nb1VybDoge1xuICAgIGxpZ2h0OiAnL2ltYWdlcy9kcmJvdC1zbTRfMjU2LnBuZycsXG4gICAgZGFyazogJy9pbWFnZXMvZHJib3Qtc200XzI1Ni5wbmcnLFxuICB9LFxuICBzaWRlYmFyOiBbXG4gICAge1xuICAgICAgdGV4dDogJ0dldHRpbmcgU3RhcnRlZCcsXG4gICAgICBsaW5rOiAnL2dldHRpbmctc3RhcnRlZCcsXG4gICAgfSxcbiAgICB7XG4gICAgICB0ZXh0OiAnRG9ja2VyJyxcbiAgICAgIGxpbms6ICcvcnVubmluZy13aXRoLWRvY2tlcicsXG4gICAgfSxcbiAgICB7XG4gICAgICB0ZXh0OiAnV2l0aG91dCBEb2NrZXInLFxuICAgICAgbGluazogJy9ydW5uaW5nLXdpdGhvdXQtZG9ja2VyJyxcbiAgICB9LFxuICAgIHtcbiAgICAgIHRleHQ6ICdDcmVhdGluZyBEaXNjb3JkIEJvdCcsXG4gICAgICBsaW5rOiAnL2NyZWF0aW5nLWRpc2NvcmQtYm90JyxcbiAgICB9LFxuICAgIHtcbiAgICAgIHRleHQ6ICdVc2FnZScsXG4gICAgICBpdGVtczogW1xuICAgICAgICB7XG4gICAgICAgICAgdGV4dDogJ1NsYXNoIENvbW1hbmRzJyxcbiAgICAgICAgICBsaW5rOiAnL3VzYWdlLXNsYXNoLWNvbW1hbmRzJyxcbiAgICAgICAgICBpdGVtczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0ZXh0OiAnL2NsZWFyJyxcbiAgICAgICAgICAgICAgbGluazogJy9jb21tYW5kLWNsZWFyJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHRleHQ6ICcvbnAnLFxuICAgICAgICAgICAgICBsaW5rOiAnL2NvbW1hbmQtbnAnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdGV4dDogJy9wYXVzZScsXG4gICAgICAgICAgICAgIGxpbms6ICcvY29tbWFuZC1wYXVzZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0ZXh0OiAnL3BsYXknLFxuICAgICAgICAgICAgICBsaW5rOiAnL2NvbW1hbmQtcGxheScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0ZXh0OiAnL3BsYXlhbGwnLFxuICAgICAgICAgICAgICBsaW5rOiAnL2NvbW1hbmQtcGxheWFsbCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0ZXh0OiAnL3F1ZXVlJyxcbiAgICAgICAgICAgICAgbGluazogJy9jb21tYW5kLXF1ZXVlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHRleHQ6ICcvc2NhbicsXG4gICAgICAgICAgICAgIGxpbms6ICcvY29tbWFuZC1zY2FuJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHRleHQ6ICcvc2VhcmNoJyxcbiAgICAgICAgICAgICAgbGluazogJy9jb21tYW5kLXNlYXJjaCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0ZXh0OiAnL3NodWZmbGUnLFxuICAgICAgICAgICAgICBsaW5rOiAnL2NvbW1hbmQtc2h1ZmZsZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0ZXh0OiAnL3NraXAnLFxuICAgICAgICAgICAgICBsaW5rOiAnL2NvbW1hbmQtc2tpcCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0ZXh0OiAnL3N0YXRzJyxcbiAgICAgICAgICAgICAgbGluazogJy9jb21tYW5kLXN0YXRzJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHRleHQ6ICcvc3RvcCcsXG4gICAgICAgICAgICAgIGxpbms6ICcvY29tbWFuZC1zdG9wJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXS5zb3J0KCh7IHRleHQ6IHRleHRBIH0sIHsgdGV4dDogdGV4dEIgfSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgYSA9IHRleHRBLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAgIGNvbnN0IGIgPSB0ZXh0Qi50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgICByZXR1cm4gYSA+IGIgPyAxIDogYSA8IGIgPyAtMSA6IDBcbiAgICAgICAgICB9KSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICB7XG4gICAgICB0ZXh0OiAnVHJvdWJsZXNob290aW5nJyxcbiAgICAgIGxpbms6ICcvdHJvdWJsZXNob290aW5nJyxcbiAgICB9LFxuICBdLFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBOFIsU0FBUyxvQkFBb0I7QUFFM1QsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsT0FBTztBQUFBLEVBQ1AsYUFBYTtBQUFBLEVBQ2IsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLElBQ1AsTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQO0FBQUEsTUFDRSxNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxNQUNFLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxJQUNSO0FBQUEsSUFDQTtBQUFBLE1BQ0UsTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLElBQ1I7QUFBQSxJQUNBO0FBQUEsTUFDRSxNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsSUFDUjtBQUFBLElBQ0E7QUFBQSxNQUNFLE1BQU07QUFBQSxNQUNOLE9BQU87QUFBQSxRQUNMO0FBQUEsVUFDRSxNQUFNO0FBQUEsVUFDTixNQUFNO0FBQUEsVUFDTixPQUFPO0FBQUEsWUFDTDtBQUFBLGNBQ0UsTUFBTTtBQUFBLGNBQ04sTUFBTTtBQUFBLFlBQ1I7QUFBQSxZQUNBO0FBQUEsY0FDRSxNQUFNO0FBQUEsY0FDTixNQUFNO0FBQUEsWUFDUjtBQUFBLFlBQ0E7QUFBQSxjQUNFLE1BQU07QUFBQSxjQUNOLE1BQU07QUFBQSxZQUNSO0FBQUEsWUFDQTtBQUFBLGNBQ0UsTUFBTTtBQUFBLGNBQ04sTUFBTTtBQUFBLFlBQ1I7QUFBQSxZQUNBO0FBQUEsY0FDRSxNQUFNO0FBQUEsY0FDTixNQUFNO0FBQUEsWUFDUjtBQUFBLFlBQ0E7QUFBQSxjQUNFLE1BQU07QUFBQSxjQUNOLE1BQU07QUFBQSxZQUNSO0FBQUEsWUFDQTtBQUFBLGNBQ0UsTUFBTTtBQUFBLGNBQ04sTUFBTTtBQUFBLFlBQ1I7QUFBQSxZQUNBO0FBQUEsY0FDRSxNQUFNO0FBQUEsY0FDTixNQUFNO0FBQUEsWUFDUjtBQUFBLFlBQ0E7QUFBQSxjQUNFLE1BQU07QUFBQSxjQUNOLE1BQU07QUFBQSxZQUNSO0FBQUEsWUFDQTtBQUFBLGNBQ0UsTUFBTTtBQUFBLGNBQ04sTUFBTTtBQUFBLFlBQ1I7QUFBQSxZQUNBO0FBQUEsY0FDRSxNQUFNO0FBQUEsY0FDTixNQUFNO0FBQUEsWUFDUjtBQUFBLFlBQ0E7QUFBQSxjQUNFLE1BQU07QUFBQSxjQUNOLE1BQU07QUFBQSxZQUNSO0FBQUEsVUFDRixFQUFFLEtBQUssQ0FBQyxFQUFFLE1BQU0sTUFBTSxHQUFHLEVBQUUsTUFBTSxNQUFNLE1BQU07QUFDM0Msa0JBQU0sSUFBSSxNQUFNLFlBQVk7QUFDNUIsa0JBQU0sSUFBSSxNQUFNLFlBQVk7QUFDNUIsbUJBQU8sSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLEtBQUs7QUFBQSxVQUNsQyxDQUFDO0FBQUEsUUFDSDtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQTtBQUFBLE1BQ0UsTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLElBQ1I7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K

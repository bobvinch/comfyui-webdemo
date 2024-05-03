// https://nuxt.com/docs/api/configuration/nuxt-config
import AutoImport from "unplugin-auto-import/vite";


export default defineNuxtConfig({
        ssr: false,
        app: {
            keepalive: true,
            head: {
                title: {
                    textContent: 'AI大模型助手-最好用最简单的AI工具'
                },
                meta: [
                    // <meta name="viewport" content="width=device-width, initial-scale=1">
                    {name: 'google-site-verification', content: '4SOiCOVLrSZsGqZKhVt7dEKsatxjHCU5TfwcPkpvU1E'},
                    {name: 'viewport', content: 'width=device-width, initial-scale=1,user-scalable=no'},
                    {
                        name: 'description',
                        content: '一款跨平台的AI工具，只需要点点鼠标就可以完成各种自媒体和商业文案，商业大片、商品图片和模特写真，更有AI文生视频，助力自媒体创作'
                    },
                    {name: 'keywords', content: 'AI文案，AI工具，AI摄影，chatGPT,sora,AI视频，AI写真，AI电商'},
                ]
            }
        },
        // 自动引入
        imports: {
            autoImport: true
        },
        runtimeConfig: {
            // 需要写在public里面，否则客户端无法访问
            public: {
                basellmUrl: process.env.NUXT_PUBLIC_BASELLM_URL,
                wxauthredirectUri: process.env.NUXT_PUBLIC_WXAUTHREDIRECT_URI,
                baseApiurl: process.env.NUXT_PUBLIC_BASE_APIURL,
                baseSocketurl: process.env.NUXT_PUBLIC_BASE_SOCKETURL,
                baseVitsurl:process.env.NUXT_PUBLIC_BASE_VITSURL,
                ossRegion: process.env.NUXT_PUBLIC_OSS_REGION,
                ossBucket: process.env.NUXT_PUBLIC_OSS_BUCKET,
                ossSecret: process.env.NUXT_PUBLIC_OSS_SECRET,
                ossKey: process.env.NUXT_PUBLIC_OSS_KEY,
            }
        },
        routeRules: {
            "/ai/*": {
                ssr: false
            },
            "/edit/*": {
                ssr: false
            }
        },
        modules: [
            '@pinia/nuxt',
            '@pinia-plugin-persistedstate/nuxt',
            'vuetify-nuxt-module',
            // '@nuxt/ui',
            'nuxt-icon',
            '@nuxtjs/i18n',
            '@ant-design-vue/nuxt',
            // '@nuxtjs/tailwindcss',
            'nuxt-primevue',
            // '@nuxtjs/dotenv',
            '@vueuse/nuxt',
            "@nuxt/ui",
            // "nuxt-electron"
        ],
        // electron: {
        //     build: [
        //         {
        //             // Main-Process entry file of the Electron App.
        //             entry: 'electron/main.ts',
        //         }
        //     ]
        // },
        // primevue: {
        //     /* Options */
        // },
        // css: ['primevue/resources/themes/aura-light-green/theme.css'],
        i18n: {
            vueI18n: 'i18n.config.ts' // if you are using custom path, default
        },
        vuetify: {
            moduleOptions: {
                /* module specific options */
            },
        },
        vue: {
            propsDestructure: true,
        },
        vite: {
            vue: {},
            esbuild: {
                drop: ['debugger'],
                // pure: ['console.log', 'console.error', 'console.warn', 'console.debug', 'console.trace'],
            },
            server: {
                proxy: {
                    // "/api": {
                    //     target: "http://127.0.0.1:3001",
                    //     changeOrigin: true,
                    //     rewrite: (path) => path.replace(/^\/api/, "")
                    // },
                    // "/websocket": {
                    //     target: "http://region-8.autodl.pro:23781",
                    //     changeOrigin: true,
                    //     ws: true,
                    //     rewrite: (path) => path.replace(/^\/websocket/, "")
                    // },
                    // "/socket.io": {
                    //     target: "http://127.0.0.1:3002/socket.io",
                    //     changeOrigin: true,
                    //     ws: true,
                    //     rewrite: (path) => path.replace(/^\/socket.io/, "")
                    // },
                    // "/vits": {
                    //     target: "http://127.0.0.1:5000",
                    //     changeOrigin: true,
                    //     rewrite: (path) => path.replace(/^\/vits/, "")
                    // }
                }
            },
            plugins: [
                AutoImport({
                    imports: ["vue", "vue-router", "pinia"],
                    dts: 'auto-import.d.ts', // 指明 .d.ts 文件的位置和文件名
                }),],
        },
        css: ['~/assets/css/main.scss'],
        devtools: {enabled: true}
    }
)
/**
 * 全局配置文件
 */
export const useGlobalConfig = {
    APP: {
        name: "AI in one",
        version: "1.0.0",
        description: "AI in one",
        author: "AI in one",
        homepage: "/ai/chat",
        loginpage: '/auth/login',
        pages:
            {
                // 登录页右侧内容设置
                loginSliders: [
                    {
                        icon: "mdi-currency-usd-off",
                        title: " 基础能力 永久免费",
                        subtitle: "基础AI大模型，文生图，图生图功能永久免费"
                    },
                    {
                        icon: "mdi-update",
                        title: "行业应用 持续更新",
                        subtitle: "基础AI大模型，文生图，图生图功能永久免费"
                    },
                    {
                        icon: "mdi-alpha-c-circle",
                        title: "商用授权 安心使用",
                        subtitle: "AI能力全部接入官方AI，放心无忧使用"
                    },
                    {
                        icon: "mdi-tooltip-edit-outline",
                        title: "极简主义 轻松使用",
                        subtitle: "主打即开即用，无需任何学习成本"
                    },
                    {
                        icon: "mdi-timer-edit-outline",
                        title: "商业落地 抢先体验",
                        subtitle: "快速精品的AI商用落地，第一时间体验"
                    }

                ],
                //官网地址
                homepage_url: "https://www.gptpro.ink",
                // 微信客服地址
                service_url:"https://work.weixin.qq.com/kfid/kfc1bf83fcf005d3715",
                //联系邮箱地址
                contactEmail: "bocuiai@gptpro.ink",
                // 主页logo
                login_logo: "/logo/website_logo_home.png",
                //侧边栏logo-dark
                sidebar_logo_dark: "/logo/website_logo_dark.png",
                //侧边栏logo-light
                sidebar_logo_light: "/logo/website_logo_light.png",
                // 口号
                login_slogn: "为创造性工作者提供最好用的AI工作流",
                //公众号
                wechat_official_url:'https://wangbo0808.oss-cn-shanghai.aliyuncs.com/assets/qrcode_for_gh_ab766f8432d6_430.jpg',
            }

    },
    jiangying: {
        localProjectPath: 'D:/JianYingProject/',  //本地剪映项目文件地址，将导出的素材存放到这个路径下面
        duration: 5000000,// 素材默认时长，图片时有效，单位毫秒
    },
    Draw: {
        exceedSizeRemind: "建议图片尺寸在4MB以内，长宽不超过1024",
        cloth_types: [
            {
                text: '默认',
                value: 'dress'
            },
            {
                text: '上衣',
                value: 'tops'
            },
            {
                text: '外套',
                value: 'coat'
            },
            {
                text: '裙子',
                value: 'skirt'
            },
            {
                text: '裤子',
                value: 'pants'
            },
            {
                text: '包',
                value: 'bag'
            },
            {
                text: '鞋子',
                value: 'shoes'
            },
            {
                text: '帽子',
                value: 'hat'
            }
        ],
        // 绘画API来源选择
        apisources: [
            {
                text: 'SD3官方API',
                value: 'sd3'
            },
            {
                text: 'ComfyUI',
                value: 'default'
            }
        ],
        // SD3参数选项，风格
        SD3_aspect_ratios: [
            {
                name: '默认1:1',
                value: '1:1'
            },
            {
                name: '16:9',
                value: '16:9'
            },
            {
                name: '21:9',
                value: '21:9'
            },
            {
                name: '2:3',
                value: '2:3'
            },

            {
                name: '3:2',
                value: '3:2'
            },
            {
                name: '3:4',
                value: '3:4'
            },
            {
                name: '4:3',
                value: '4:3'
            },
            {
                name: '9:16',
                value: '9:16'
            },
        ],
        SD3_style_presets: [
            {
                name: '默认',
                value: ''
            },
            {
                name: '3D模型',
                value: '3d-model'
            },
            {
                name: '模拟胶片',
                value: 'analog-film'
            },
            {
                name: '动画',
                value: 'anime'
            },
            {
                name: '电影',
                value: 'cinematic'
            },
            {
                name: '数字艺术',
                value: 'digital-art'
            },
            {
                name: '漫画书',
                value: 'comic-book'
            },
            {
                name: '增强',
                value: 'enhance'
            },
            {
                name: '奇幻',
                value: 'fantasy-art'
            },
            {
                name: '等距投影',
                value: 'isometric'
            },
            {
                name: '线稿',
                value: 'line-art'
            },
            {
                name: '低聚合度',
                value: 'low-poly'
            },
            {
                name: '造型-化合物',
                value: 'modeling-compound'
            },
            {
                name: '霓虹朋克',
                value: 'neon-punk'
            },
            {
                name: '折纸艺术',
                value: 'origami'
            },
            {
                name: '摄影',
                value: 'photographic'
            },
            {
                name: '像素艺术',
                value: 'pixel-art'
            },
            {
                name: '模糊纹理',
                value: 'tile-texture'
            },

        ]

    },
    LLM: {
        defaultModel: "gpt-3.5-turbo",
        models: [
            {
                "title": "GPT3.5",
                "name": "gpt-3.5-turbo",
                "icon": "mdi-fire",
                "iconpath": "https://wangbo0808.oss-cn-shanghai.aliyuncs.com/assets/GPT3.png"
            },
            {
                "title": "GPT4.0",
                "name": "gpt-4-vision-preview",
                "icon": "mdi-fire",
                "iconpath": "https://wangbo0808.oss-cn-shanghai.aliyuncs.com/assets/gpt4.png"
            },
            {
                "title": "讯飞星火",
                "name": "SparkDesk",
                "icon": "mdi-fire",
                "iconpath": "https://wangbo0808.oss-cn-shanghai.aliyuncs.com/assets/ifly_spark.png"
            },
            {
                "title": "智谱AI",
                "name": "chatglm_turbo",
                "icon": "mdi-fire",
                "iconpath": "https://wangbo0808.oss-cn-shanghai.aliyuncs.com/assets/zhipu.png"
            },
            {
                "title": "文心千帆",
                "name": "ERNIE-Bot-4",
                "icon": "mdi-fire",
                "iconpath": "https://wangbo0808.oss-cn-shanghai.aliyuncs.com/assets/%E6%96%87%E5%BF%83%E5%8D%83%E5%B8%86128.png"
            },
            {
                "title": "通义千问",
                "name": "qwen-max",
                "icon": "mdi-fire",
                "iconpath": "https://wangbo0808.oss-cn-shanghai.aliyuncs.com/assets/logo_alitongyi.jpg"
            }
        ],
        // AI推文和AI绘画的预置提示词，绘图不理想可以修改这里，场景和人物特征均作为内容输入给大模型
        presetPrompts: {
            aidraw: "Stable Diffusion”是一种类似于DALLE-2的AI艺术生成模型。以下是一些用Stable Diffusion生成AI艺术的提示词示例：\n" +
                "\n" +
                "例子1：b&w photo of 42 y.o man in black clothes, bald, face, half body, body, high detailed skin, skin pores, coastline, overcast weather, wind, waves, 8k uhd, dslr, soft lighting, high quality, film grain, Fujifilm XT3\n" +
                "\n" +
                "例子2：8k portrait of beautiful cyborg with brown hair, intricate, elegant, highly detailed, majestic, digital photography, art by artgerm and ruan jia and greg rutkowski surreal painting gold butterfly filigree, broken glass, (masterpiece, sidelighting, finely detailed beautiful eyes: 1.2), hdr\n" +
                "\n" +
                "例子3：best quality, masterpiece, (realistic:1.2), 1 girl, brown hair, brown eyes,Front, detailed face, beautiful eyes\n" +
                "\n" +
                "例子4：ghost inside a hunted room, art by lois van baarle and loish and ross tran and rossdraws and sam yang and samdoesarts and artgerm, digital art, highly detailed, intricate, sharp focus, Trending on Artstation HQ, deviantart, unreal engine 5, 4K UHD image\n" +
                "\n" +
                "这些提示词遵循以下规则：\n" +
                "\n" +
                "遵循示例提示词的结构，这意味着首先描述绘画主体，然后描述场景，然后添加绘画笔触、情绪、绘画风格、灯光、服装、镜头、头发等， 然后是best quality,、masterpiece、8K这样表达高质量照片的词语，所有这些词语之间用逗号分隔。\n" +
                "\n" +
                "每当我列出一个主题，你不能简单的翻译，而需要像一个资深的影视导演，去构思一个能够表现出这个主题的一个场景，然后将这个场景按照上面的规则编写为详细提示词，用英语编写，不需要翻译成中文，直接输出结果,需要特助强调和注意是如果我的指令中包含人物特征和场景，你需要重点将人物特征和场景进行细化描述并转换为提示词！"
        },

    },
    Auth: {
        homepage: "/",
        NotNeedLogin: ["/", "/auth/signup", "/auth/login", "/status/loading", "/test/test", "/edit/editor"],
        passwordSecret: "test-passwordSecret",
        tokenSecret: "this is a very secret secret",
    }
}
<template>
    <iframe sandbox="allow-scripts allow-top-navigation" scrolling="no" width="300" height="400" frameBorder="0" allowTransparency="true" :src="setSrc"></iframe>
    </template>
    
    <script>
    import { computed } from 'vue'
    export default {
       props:{
          //应用唯一标识，在微信开放平台提交应用审核通过后获得
          appid : String,
          //应用授权作用域，拥有多个作用域用逗号（,）分隔，网页应用目前仅填写snsapi_login即可
          scope : String,
          //重定向地址，需要进行UrlEncode
          redirect_uri : String,
          //用于保持请求和回调的状态，授权请求后原样带回给第三方。该参数可用于防止csrf攻击（跨站请求伪造攻击），建议第三方带上该参数，可设置为简单的随机数加session进行校验
          state : {
              type : String,
              default: ''
          },
          //提供"black"、"white"可选，默认为黑色文字描述。详见文档底部FAQ
          theme : {
              type : String,
              default: 'black'
          },
          // 自定义样式链接，第三方可根据实际需求覆盖默认样式。详见文档底部FAQ
          href : {
              type : String,
              default: ''
          },
          // true：手机点击确认登录后可以在 iframe 内跳转到 redirect_uri，false：手机点击确认登录后可以在 top window 跳转到 redirect_uri。默认为 false。
          self_redirect : {
              type : String,
              default: 'default'
          },
          // sdk的扩展字符串，但是在这里就默认了jssdk，暂时不建议修改
          login_type : {
              type : String,
              default: 'jssdk'
          },
    },
      setup (props) {
        const setSrc = computed(()=>{
          const _url = 'https://open.weixin.qq.com/connect/qrconnect?appid='+ props.appid
            + '&scope=' + props.scope
            + '&redirect_uri='  + props.redirect_uri
            + '&state=' + props.state
            + '&login_type=' + props.login_type
            + '&style=' + props.theme
            + '&self_redirect=' + props.self_redirect
            + '&href=' + props.href;
          return _url;
        })
        return {
          setSrc
        }
      }
    }
    </script>
    
    <!-- Add "scoped" attribute to limit CSS to this component only -->
    <style scoped>
    h3 {
      margin: 40px 0 0;
    }
    ul {
      list-style-type: none;
      padding: 0;
    }
    li {
      display: inline-block;
      margin: 0 10px;
    }
    a {
      color: #42b983;
    }
    </style>
    
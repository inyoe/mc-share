# mc-share
## 组件简介
* PC分享页面组件，代替百度分享。
* 解决第三方插件引用稳定性问题、业务需求适配问题、HTTPS与HTTP兼容问题。提高UI与事件可定制性。
* 分享途径包含：微博、QQ、QQ空间、人人网、豆瓣、百度首页（登录后）、百度贴吧、微信二维码
* 组件本身不生成分享按钮
* 兼容IE8+
<br>

## 组件包含文件：
* mc-share.js - 组件主功能模块
* ms-share.css - 微信二维码弹窗样式
* qrcode.min.js - 微信二维码生成依赖库（[https://github.com/davidshimjs/qrcodejs](https://github.com/davidshimjs/qrcodejs)）
<br>

## 使用方法：

*HTML*

``` html
<dl class="demo-share" id="share">
    <dt>分享到：</dt>
    <dd class="share-item" data-share="weibo">微博</dd>
    <dd class="share-item" data-share="qq">QQ</dd>
    <dd class="share-item" data-share="qzone">QQ空间</dd>
    <dd class="share-item" data-share="renren">人人网</dd>
    <dd class="share-item" data-share="douban">豆瓣</dd>
    <dd class="share-item" data-share="bdpage">百度首页</dd>
    <dd class="share-item" data-share="bdtieba">百度贴吧</dd>
    <dd class="share-item" data-share="weixin">微信二维码</dd>
</dl>

<script src="./src/mc-share.js"></script>
```

*JavaScript(Global)*
``` javascript
new MCShare('share', {
    style: './src/mc-share.css',
    qrcodejs: './src/qrcode.min.js',
    initCb: function() {
        console.log('init')
    },
    triggerCb: function(type) {
        console.log(type)
    }
})
```

*JavaScript(RequireJs)*

``` javascript
require.config({
    paths: {
        'mcshare': './src/mc-share'
    }
})


define(['mcshare'], function(MCShare) {
    new MCShare('share', {
        style: './src/mc-share.css',
        qrcodejs: './src/qrcode.min.js',
        initCb: function() {
            console.log('init')
        },
        triggerCb: function(type) {
            console.log(type)
        }
    })
})
```
<br>

## 配置参数

| params | type | description |
| --- | --- | --- |
| id | String | 容器元素id。 |
| config (Object)： |  |  |
| url | String | 被分享的URL，默认取当前地址。 |
| title | String | 被分享的标题，默认取当前页面标题。 |
| photo | String | 被分享的图片路径，默认取当前页面html结构里第一张图片。 |
| desc | String | 被分享的描述，默认取当前页面<meta name="description">里的内容。 |
| initCb | Function | 组件实例化完成后回调。 |
| triggerCb | Function | 每次分享按钮触发后回调。 |
| style | String | css样式地址，可填绝对路径，默认 ‘./mc-share.css'。如有微信分享(data-share="weixin")则会加载。另：可自己引入css，把该参数设为空则不会加载报错。 |
| qrcodejs | String | qrcodejs地址，可填绝对路径，默认 './qrcode.min.js'。如有微信分享(data-share="weixin")则会加载。另：可自己引入qrcodejs，把该参数设为空则不会加载报错，但要确保qrcodejs被加载后再实例化组件。 |
| className | String | 分享按钮元素className，默认为 'share-item'，元素可不用&lt;a&gt;标签。 |

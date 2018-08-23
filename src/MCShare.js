/**
* @Method       MCShare
* @Version      1.0
* @Author       Peter Pan
* @Last Update  2018-08-15
*/

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], function () {
            return (root.MCShare = factory());
        });
    } else {
        root.MCShare = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {

    // BEGIN
    var MCShare = function(eleId, option) {
        this.container = null;
        this.wxOption = {
            show: false,
            node: null,
            id: null
        };
        this.loadQrcode = {
            addScript: false,
            loaded: false
        };
        this.config = {
            url: '',
            title: '',
            photo: '',
            desc: '',
            className: 'share-item',
            qrcodejs: './qrcode.min.js',
            style: './MCShare.css',
            initCb: null,
            triggerCb: null
        };

        this.typeList = {
            weibo: 'http://service.weibo.com/share/share.php?ralateUid=&language=zh_cn&', //微博
            qq: 'https://connect.qq.com/widget/shareqq/index.html?', //QQ
            qzone: 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?', //QQ空间
            renren: 'http://widget.renren.com/dialog/share?', //人人网
            douban: 'https://www.douban.com/recommend/?sel=&v=1&', //豆瓣
            bdpage: 'http://s.share.baidu.com?to=bdhome&from=addtobaidu&', //百度首页
            bdtieba: 'http://tieba.baidu.com/f/commit/share/openShareApi?', //百度贴吧
            weixin: '' //微信二维码
        };

        this.init(eleId, option);
    }

    MCShare.prototype = {
        constructor: MCShare,

        init: function(eleId, option) {
            if (typeof eleId !== 'string') return;

            var items = null;

            this.container = document.getElementById(eleId);
            if (this.container) {
                items = this.findClass(this.config.className, this.container);
            } else {
                return;
            }

            if (Object.prototype.toString.call(option).toLowerCase() === '[object object]') {
                for (var key in option) {
                    this.config[key] = option[key];
                }
            }

            this.urlSplice();

            this.bindEvent(items);

            typeof this.config.initCb === 'function' && this.config.initCb();

        },

        checkOption: function() {
            var CFG = this.config;

            if (!CFG.url) {
                CFG.url = window.location.href;
            }

            if (!CFG.title) {
                CFG.title = document.title;
            }

            if (!CFG.photo) {
                var aImg = document.getElementsByTagName('img');
                if (aImg.length) {
                    CFG.photo = aImg[0].src;
                }
            }

            if (!CFG.desc) {
                var aMeta = document.getElementsByTagName('meta');
                for (var i = 0, l = aMeta.length; i < l; i++) {
                    if (aMeta[i].name == 'description') {
                        CFG.desc = aMeta[i].content;
                        break;
                    }
                }
            }
        },

        urlSplice: function() {
            var TL = this.typeList,
                CFG = this.config;

            this.checkOption();

            TL.weixin  += CFG.url;
            TL.weibo   += 'url=' + CFG.url + '&appkey=&title=' + CFG.title + '&pic=' + CFG.photo;
            TL.bdpage  += 'url=' + CFG.url + '&title=' + CFG.title;
            TL.bdtieba += 'url=' + CFG.url + '&title=' + CFG.title + '&desc=' + CFG.desc + '&comment=&pic=' + CFG.photo;
            TL.qzone   += 'url=' + CFG.url + '&desc=' + CFG.desc + '&title=' + CFG.title + '&pics=' + CFG.photo;
            TL.qq      += 'url=' + CFG.url + '&desc=&title=' + CFG.title + '&summary=' + CFG.desc + '&pics=' + CFG.photo;
            TL.douban  += 'url=' + CFG.url + '&title=' + CFG.title + '&text=' + CFG.desc + '&image=' + CFG.photo;
            TL.renren  += 'resourceUrl=' + CFG.url + '&srcUrl=' + CFG.url + '&images=' + CFG.photo + '&description=' + CFG.desc + '&title=' + CFG.title;
        },

        addQrcodeJs: function() {
                var that = this,
                    qrcodejs = document.createElement('SCRIPT');

            if (that.config.qrcodejs) {
                qrcodejs.onload = qrcodejs.onreadystatechange = function() {
                    if (typeof window.QRCode === 'function') {
                        that.loadQrcode.loaded = true;
                    }
                }
                qrcodejs.onerror = function() {
                    console.error('Can not find QrCodeJs');
                }

                qrcodejs.src = that.config.qrcodejs;

                document.body.appendChild(qrcodejs);
            } else if (typeof window.QRCode === 'function') {
                that.loadQrcode.loaded = true;
            }
        },

        addWxDialogStyle: function() {
            if (this.config.style) {
                var style = document.createElement('link');
                style.rel = 'stylesheet';
                style.href = this.config.style;
                document.body.appendChild(style);
            }
        },

        showWxDialog: function() {
            var wxOpt = this.wxOption;

            if (!wxOpt.node) {
                wxOpt.id = new Date().getTime();
                wxOpt.node = document.createElement('div');
                wxOpt.node.className = 'MCShare_wx_dialog';
                wxOpt.node.innerHTML = '<div class="MCShare_wx_dialog_head"><h4>分享到微信朋友圈</h4><span class="MCShare_wx_dialog_close" id="MCShare_wx_dialog_close_' + wxOpt.id + '">x</span></div><div class="MCShare_wx_dialog_content"><div id="MCShare_wx_dialog_qrcode"></div><p>打开微信，点击底部的“发现”，<br>使用“扫一扫”即可将网页分享至朋友圈。</p></div>';

                document.body.appendChild(wxOpt.node);

                new QRCode(document.getElementById('MCShare_wx_dialog_qrcode'), {
                    text: this.typeList['weixin'],
                    width: 200,
                    height: 200,
                    colorDark : "#000000",
                    colorLight : "#ffffff",
                    correctLevel : QRCode.CorrectLevel.H
                });
            } else {
                document.body.appendChild(wxOpt.node);
            }

            wxOpt.show = true;
        },

        bindEvent: function(items) {
            var that = this;

            for (var i = 0, l = items.length; i < l; i++) {
                ;(function() {
                    var type = items[i].getAttribute('data-share');
                    if (that.typeList[type]) {

                        // Load QrCodeJs && dialogStyle
                        if (type === 'weixin' && !that.loadQrcode.addScript) {
                            that.loadQrcode.addScript = true;
                            that.addQrcodeJs();
                            that.addWxDialogStyle();
                        }

                        that.addEvent(items[i], 'click', function() {
                            if (type === 'weixin') {
                                if (that.loadQrcode.loaded && !that.wxOption.show) {
                                    that.showWxDialog();
                                }
                            } else {
                                window.open(that.typeList[type]);
                            }

                            typeof that.config.triggerCb === 'function' && that.config.triggerCb(type);
                        })
                    }
                }())
            }

            if (that.loadQrcode.addScript) {
                that.addEvent(document.body, 'click', function(event) {
                    var event = event || window.event,
                        target = event.target || event.srcElement;

                    if (target.id === 'MCShare_wx_dialog_close_' + that.wxOption.id) {
                        document.body.removeChild(that.wxOption.node);
                        that.wxOption.show = false;
                    }
                })
            }
        },

        findClass: function(targetClass, parent) {
            var ele, target;

            if (typeof parent === 'undefined') {
                parent = document;
            }

            if (typeof document.getElementsByClassName === 'function') {
                target = parent.getElementsByClassName(targetClass);
            } else {
                ele = parent.getElementsByTagName('*');
                target = [];

                for (var i = 0, l = ele.length; i < l; i++) {
                    var aClass = ele[i].className.split(' ');
                    for (var j = 0, l2 = aClass.length; j < l2; j++) {
                        if (aClass[j] === targetClass) {
                            target.push(ele[i]);
                            break;
                        }
                    }
                }
            }

            return target;
        },

        addEvent: function(el, event, handler){
            if (document.addEventListener) {
                el.addEventListener(event, handler, false);
            } else {
                el.attachEvent('on' + event, handler)
            }
        }
    }

    return MCShare;
    //END

}));
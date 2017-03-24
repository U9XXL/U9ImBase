
(function () {
    window.u9 = window.u9 || {};
    window.u9.version = '1.0.0';
})();

/**
 * 初始化及生成共享数据获取接口
 */
(function (u9) {
    /**
     * 初始化
     * cfg配置项如下：
     *      - {String} mainAppId 主应用ID，必填
     *      - {String} appId 轻应用ID，必填
     *      - {String} pageParam 共享数据，仅调试模式配置
     */
    u9.init = function (cfg) {
        u9.mainAppId = cfg.mainAppId;
        u9.appId = cfg.appId;

        if (!window.summer) {
            createGetter(cfg.pageParam || {}, u9);
        }
    };

    if (!window.summer) {
        return;
    }

    createGetter(summer.pageParam || {}, u9);

    function createGetter(pageParam, providerObj) {
        for (var namespace in pageParam) {
            providerObj[namespace] = get(pageParam[namespace]);
        }

        function get(obj) {
            return function (key) {
                if (arguments.length) {
                    return obj[key];
                }
                return obj;
            };
        }
    }
})(window.u9);

/**
 * 数据存储目录获取
 */
 (function (u9) {
    // 获取主应用根目录
    u9.getRootDir = function () {
        if (!window.cordova) {
            return '';
        }
        return cordova.file.externalRootDirectory || cordova.file.dataDirectory + u9.mainAppId + '/';
    };
    // 获取主应用数据缓存目录
    u9.getDataDir = function () {
        if (!window.cordova) {
            return '';
        }
        return u9.getRootDir() + 'data/';
    };
    // 获取主应用子应用存放目录
    u9.getAppsDir = function () {
        if (!window.cordova) {
            return '';
        }
        return u9.getRootDir() + 'apps/';
    };
    // 获取子应用文件绝对路径
    u9.getAbsolutePath = function (src, appId) {
        if (!window.cordova) {
            return '';
        }
        return u9.getAppsDir() + appId || u9.appId + '/' + src;
    };
 })(window.u9);

 /**
  * 轻应用间跳转接口
  */
 (function (u9) {
    /**
     * 打开轻应用
     * cfg配置项如下：
     *      - {String} id 跳转目标轻应用ID，必填
     *      - {String} url 跳转目标轻应用index.html路径，必填，相对路径，相对于目标轻应用
     *      - {String} pageParam 共享数据，可选，仅配置额外数据，基础共享数据会统一加上
     *      - {String} animation 跳转动画，可选
     */
    u9.openWin = function (cfg) {
        if (!window.summer) {
            return;
        }

        cfg.url = u9.getAbsolutePath(cfg.url, cfg.id);

        var pageParam = summer.pageParam || {};
        for (var key in cfg.pageParam) {
            pageParam[key] = cfg.pageParam[key];
        }
        cfg.pageParam = pageParam;

        if (!cfg.animation) {
            cfg.animation = {
                type: "push",
                subType: "from_right",
                duration: 200
            };
        }

        summer.openWin(cfg);
    };

    /**
     * 关闭当前轻应用
     */
    u9.closeWin = function () {
        if (!window.summer) {
            return;
        }

        summer.closeWin();
    };
 })(window.u9);

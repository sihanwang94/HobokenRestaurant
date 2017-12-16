define(function (require) {
    var $ = require('jquery'),
        EventBase = require('mod/eventBase'),
        Class = require('mod/class'),
        Ajax = require('mod/ajax');

    var DEFAULTS = {
        //接口地址
        url: '',
        //数据模板
        tpl: '',
        //ajax请求方法
        ajaxMethod: 'get',
        //判断成功的ajax
        isAjaxResSuccess: function (res) {
            return res.code == 200;
        },
        //从ajax返回中解析出数据
        getRowsFromAjax: function (res) {
            return res.data.rows;
        },
        //从ajax返回中解析出总记录数
        getTotalFromAjax: function (res) {
            return res.data.total;
        },
        //提供给外部解析ajax返回的数据
        parseData: $.noop,
        //提供给模板引擎，以便得到满足其要求的数据
        renderParse: function(paredRows){
            return {
                rows: paredRows
            }
        },
        //组件初始化完毕后的回调
        afterInit: $.noop,
        //ajax请求之前的事件回调
        beforeAjax: $.noop,
        //ajax请求之后的事件回调
        afterAjax: $.noop,
        //ajax请求成功的事件回调
        success: $.noop,
        //ajax请求失败的事件回调
        error: $.noop,
        //PageView相关的option，为空表示不采用分页
        pageView: {},
        //SortView相关的option，为空表示不采用排序管理
        sortView: false,
        //在调用query方法的时候，是否自动对SortView进行reset
        resetSortWhenQuery: false,
        //查询延时
        queryDelay: 0,
    };

    var ListViewBase = Class({
        instanceMembers: {
            init: function (element, options) {
                var $element = this.$element = $(element),
                    opts = this.options = this.getOptions(options),
                    that = this;

                //初始化，注册事件管理的功能：EventBase
                this.base($element);

                //模板方法，方便子类继承实现，在此处添加特有逻辑
                this.initStart();

                //设置数据属性名称、命名空间名称
                this.dataAttr = this.constructor.dataAttr;
                this.namespace = '.' + this.dataAttr;
                //存放查询条件
                this.filter = {};

                //模板方法，方便子类继承实现，在此处添加特有逻辑
                this.initMiddle();

                //初始化分页组件
                //createPageView必须返回继承了PageViewBase类的实例
                //这里没有做强的约束，只能靠编码规范来约束
                this.pageView = this.createPageView();
                if (this.pageView) {
                    //注册分页事件
                    this.pageView.on('pageViewChange' + this.pageView.namespace, function () {
                        that.refresh();
                    });
                }

                //初始化模板管理组件，用于列表数据的渲染
                //createTplEngine必须返回继承了TplBase类的实例
                //这里没有做强的约束，只能靠编码规范来约束
                this.itemTplEngine = this.createTplEngine();

                //初始化排序组件
                //createSortView必须返回继承了SortViewBase类的实例
                //这里没有做强的约束，只能靠编码规范来约束
                this.sortView = this.createSortView();
                if (this.sortView) {
                    //注册排序事件
                    this.sortView.on('sortViewChange' + this.sortView.namespace, function () {
                        that.refresh();
                    });
                }

                //模板方法，方便子类继承实现，在此处添加特有逻辑
                this.beforeBindEvents();

                //绑定所有事件回调
                this.bindEvents();

                //模板方法，方便子类继承实现，在此处添加特有逻辑
                this.initEnd();

                $element.data(this.dataAttr, this);

                this.trigger('afterInit' + this.namespace);
            },
            //以下四个为模板方法
            initStart: $.noop,
            initMiddle: $.noop,
            beforeBindEvents: $.noop,
            initEnd: $.noop,
            //子类实现此方法，提供分页管理对象
            createPageView: $.noop,
            //子类实现此方法，提供模板管理对象
            createTplEngine: $.noop,
            //子类实现此方法，提供排序管理对象
            createSortView: $.noop,
            //子类可以覆盖此方法，以便添加更多的事件管理，但是在实现此方法时，一定要通过this.base调用父类的方法
            bindEvents: function () {
                var opts = this.options;

                //绑定所有事件回调
                if (typeof(opts.afterInit) === 'function') {
                    this.on('afterInit' + this.namespace, $.proxy(opts.afterInit, this));
                }
                if (typeof(opts.beforeAjax) === 'function') {
                    this.on('beforeAjax' + this.namespace, $.proxy(opts.beforeAjax, this));
                }
                if (typeof(opts.afterAjax) === 'function') {
                    this.on('afterAjax' + this.namespace, $.proxy(opts.afterAjax, this));
                }
                if (typeof(opts.success) === 'function') {
                    this.on('success' + this.namespace, $.proxy(opts.success, this));
                }
                if (typeof(opts.error) === 'function') {
                    this.on('error' + this.namespace, $.proxy(opts.error, this));
                }
            },
            getOptions: function (options) {
                var defaults = this.getDefaults(),
                    _opts = $.extend({}, defaults, this.$element.data() || {}, options),
                    opts = {};

                //保证返回的对象内容项始终与当前类定义的DEFAULTS的内容项保持一致
                for (var i in defaults) {
                    if (Object.prototype.hasOwnProperty.call(defaults, i)) {
                        opts[i] = _opts[i];
                    }
                }

                return opts;
            },
            getDefaults: function () {
                return this.constructor.DEFAULTS;
            },
            getParams: function () {
                //参数由：分页，排序字段以及查询条件构成
                return $.extend({},
                    this.pageView ? this.pageView.getParams() : {},
                    this.sortView ? this.sortView.getParams() : {},
                    this.filter);
            },
            renderData: function (data) {
                //通过模板引擎渲染数据
                return this.itemTplEngine.render(data);
            },
            refresh: function () {
                return _query.call(this, false);
            },
            //query方法，用来实现列表的数据查询功能
            //外部可将查询参数的值以键值对的形式传递到newFilter参数里面
            query: function (newFilter, append) {
                //调用_query
                return _query.call(this, true, newFilter, append);
            },
            //模板方法，供子类实现，方便添加请求前的逻辑
            beforeQuery: $.noop,
            //模板方法，供子类实现，方便添加查询取消时的逻辑
            queryCancel: $.noop,
            //模板方法，供子类实现，方便添加后请求后的逻辑
            afterQuery: $.noop,
            //模板方法，供子类实现，方便添加请求成功后的逻辑
            querySuccess: $.noop,
            //模板方法，供子类实现，方便添加请求失败后的逻辑
            queryError: $.noop,
        },
        extend: EventBase,
        staticMembers: {
            DEFAULTS: DEFAULTS,
            dataAttr: 'listView'
        }
    });

    //更新查询条件
    //如果append为false，那么用newFilter替换当前的查询条件
    //否则，仅仅将newFilter包含的参数复制到当前的查询条件里面去
    function updateFilter(newFilter, append) {
        var filter;

        if (newFilter) {
            if (append === false) {
                filter = newFilter;
            } else {
                filter = $.extend({}, this.filter, newFilter);
            }
            this.filter = filter;
        }
    }

    //_query函数中关键的模板方法与事件的调用顺序：
    // method: beforeQuery
    // [method: queryCancel]
    // event: beforeAjax
    // 1-成功：
    //  method: querySuccess
    //  event: success
    //  method: afterQuery
    //  event: afterAjax
    // 2-失败：
    //  method: queryError
    //  event: error
    //  method: afterQuery
    //  event: afterAjax
    function _query(clear, newFilter, append) {
        var that = this,
            opts = this.options;

        if (!opts.url) return false;

        //调用子类可能实现了的beforeQuery方法，以便为该子类添加统一的一些query前的逻辑
        if (this.beforeQuery(clear) === false) {
            this.queryCancel(clear);
            return false;
        }

        if (clear) {
            //更新查询条件
            updateFilter.call(this, newFilter, append);

            //重置分页组件
            this.pageView && this.pageView.reset();
        }

        //禁用分页组件，防止重复操作
        this.pageView && this.pageView.disable();

        //还原排序组件
        this.sortView && opts.resetSortWhenQuery && this.sortView.reset();

        //触发beforeAjax事件，以便外部根据特有的场景添加特殊的逻辑
        this.trigger('beforeAjax' + this.namespace);

        if (opts.queryDelay) {
            var dtd = $.Deferred();
            var timer = setTimeout(function () {
                clearTimeout(timer);
                _request().done(function () {
                    dtd.resolve.apply(dtd, arguments);
                }).fail(function () {
                    dtd.reject.apply(dtd, arguments);
                });
            }, opts.queryDelay);

            return $.when(dtd);
        } else {
            return _request();
        }

        function _request() {
            return Ajax[opts.ajaxMethod](opts.url, that.getParams())
                .done(function (res) {
                    //判断ajax是否请求成功
                    var isSuccess = opts.isAjaxResSuccess(res),
                        rows = [],
                        total = 0;

                    if (isSuccess) {
                        //得到所有行
                        rows = opts.getRowsFromAjax(res);

                        that.originalRows = rows;

                        //得到总记录数
                        total = opts.getTotalFromAjax(res);

                        //刷新分页组件
                        that.pageView && that.pageView.refresh(total);

                        var parsedRows = opts.parseData(rows);
                        if (!parsedRows) {
                            parsedRows = rows;
                        }

                        that.parsedRows = parsedRows;

                        //调用子类实现的querySuccess方法，通常在这个方法内做列表DOM的渲染
                        that.querySuccess(that.renderData(opts.renderParse(parsedRows)), {
                            clear: clear,
                            total: total
                        });

                        //触发success事件，以便外部根据特有的场景添加特殊的逻辑
                        that.trigger('success' + that.namespace);

                        _always();

                        //触发afterAjax事件，以便外部根据特有的场景添加特殊的逻辑
                        that.trigger('afterAjax' + that.namespace);
                    } else {
                        _fail();
                    }
                })
                .fail(_fail);
        }

        function _fail() {
            //调用子类实现的queryError方法，以便子类实现特定的加载失败的展示逻辑
            that.queryError({
                clear: clear
            });

            //触发error事件，以便外部根据特有的场景添加特殊的逻辑
            that.trigger('error' + that.namespace);

            _always();

            //触发afterAjax事件，以便外部根据特有的场景添加特殊的逻辑
            that.trigger('afterAjax' + that.namespace);
        }

        function _always() {
            //重新恢复分页组件的操作
            that.pageView && that.pageView.enable();

            //调用子类实现的afterQuery方法，以便子类实现特定的请求之后的逻辑
            that.afterQuery({
                clear: clear
            });
        }
    }

    return ListViewBase;
});
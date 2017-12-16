define(function (require) {

    var $ = require('jquery'),
        ListView = require('mod/listView/simpleListView'),
        api = {
            list: 'originaldata.json',
        };

    var list = window.l = new ListView('#rest_list', {
        url: api.list,
        tpl: ['{{#rows}}<li class="rest-entry">', // can change to the exact form you want
            '    <a href="#" class="diggit">',
            '        <span class="diggit-num">{{like}}</span>',
            '        <span class="diggit-text">Recommand</span>',
            '    </a>',
            '    <div class="cell pl15">',
            '        <h3 class="f14 mb5 lh18"><a href="#" class="rest-title">{{name}}{{index}}</a></h3>',
            '        <p class="pt5 mb5 lh24 g3 fix">',
            '            <img src="{{avatar}}" alt="" class="bdc p1 w50 h50 l mr5">{{cuisine}}</p>',
            '        <p class="mt10 lh20"><a href="#" class="rest-local">{{location}}</a><span class="dib ml15 mr15">started {{started_time}}</span><a',
            '                href="#" class="rest-stas">comment({{comment}})</a><a href="#" class="rest-stas">visited({{visited}})</a></p>',
            '    </div>',
            '</li>{{/rows}}'].join(''),
        parseData: function (data) {
            var start = list.pageView.data.start;

            data.forEach(function (d) {
                d.index = start;
                start = start + 1;
            });
        },
        pageView: {
            defaultSize: 3
        },
        sortView: {
            config: [
                {field: 'name', value: ''},
                {field: 'cuisine', value: 'desc', order: 2, type: 'int'},
                {field: 'price', value: 'asc', order: 1, type: 'int'}
            ]
        },
        beforeAjax: function () {
            var html = [],
                params = list.getParams(),
                hasOwn = Object.prototype.hasOwnProperty;

            for (var i in params) {
                if (hasOwn.call(params, i)) {
                    html.push('<p>' + i + ' : ' + JSON.stringify(params[i]) + '</p>');
                }
            }

            $('#log').html(html.join(''));
        }
    });

    list.query();
});
/**
 * Created by kite on 13.10.15.
 */
$(function() {
    var H = 20,
        W = $("body").width(),
        padding = 2;

    var from, to, xScale;
    var cytoData;

    var svg = d3.select("div.cyto_plot").append("svg").attr("width", W).attr("height", H);

    $.ajax({
        url: "/gene-browser/services/bands",
        method: "GET",
        //data: {chr:"chrA1"},
        data: {chr:"chr1"},
        success: function (data) {
            console.log(data);
            cytoData = data;

            to = d3.max(data, function(d) {return d.end});
            from = d3.min(data, function(d) {return d.start});

            xScale = d3.scale.linear()
                .domain([from, to])
                .range([0, W - padding]);

            drawCytoBands(data)
        }
    });

    function position(data) {
        return data.start;
    }

    function drawCytoBands(data) {
        var groups = svg.selectAll("g").data(data, position);

        // Enter
        var g = groups.enter().append("g").attr("class", "cyto");
        var times = 0;
        g.datum(function(d) {
            var _g = d3.select(this);

            if (d.stain == 'ACEN') {
                times = _drawCent(_g, times);
            } else {
                if (d.stain == 'STALK') {
                    _drawStalk(_g, d);
                } else {
                    _drawRect(_g);
                }
            }
        });

        // Exit
        groups.exit().remove();
    }

    function _drawCent(_g, times) {
        _g.append("polygon").attr({
            points: function(data) {
                var x1 = xScale(data.start);
                var x2 = xScale(data.end) != x1 ? xScale(data.end) : (x1 + 1);
                if (times == 0) {
                    return x1 + ",0 " + x1 + ",20 "+ x2 +", 10";
                } else {
                    return x1 +", 10 " + x2 + ",0 " + x2 + ",20 ";
                }
            },
            'stroke-width':1,
            fill:'#eee',
            stroke:'black'
        });

        return ++times;
    }

    function _drawStalk(_g, d) {
        var x1 = xScale(d.start);
        var x2 = xScale(d.end) != x1 ? xScale(d.end) : (x1 + 1);

        if (x2 > x1 + 11) {
            _g.append("polygon").attr({
                points: function() {return x1 + ",0 " + x1 + ",20 "+ (x1 + 5) +", 10"},
                'stroke-width':1,
                fill:'#eee',
                stroke:'black'
            });
            _g.append("polygon").attr({
                points: function() {return (x2 - 5) + ", 10 " + x2 + ",0 " + x2 + ",20 "},
                'stroke-width':1,
                fill:'#eee',
                stroke:'black'
            });
            _g.append("line").attr({
                x1: x1 + 5,
                y1: H/2,
                x2: x2 - 5,
                y2: H/2,
                'stroke-width':1,
                stroke:'black'
            });
        } else {
            _g.append("line").attr({
                x1: x1 + 5,
                y1: H/2,
                x2: x2 - 5,
                y2: H/2,
                'stroke-width':1,
                stroke:'black'
            });
        }
    }

    function _drawRect(_g) {
        _g.append("rect").attr({
            x: function(data) {return xScale(data.start)},
            y: 0,
            width: function(data) {return xScale(data.end) - xScale(data.start) < 1 ? 1 : xScale(data.end) - xScale(data.start)},
            height: H,
            fill: function(data) {
                switch (data.stain) {
                    case 'GNEG': {return '#eee'}
                    case 'GPOS25' || 'GPOS50' || 'GPOS75' || 'GPOS100' || 'GVAR' : {return '#000'}
                }
            },
            'fill-opacity': function (data) {
                if (data.stain == 'GPOS25' || data.stain == 'GPOS50' || data.stain == 'GPOS75' || data.stain == 'GPOS100') {
                    var stainVal = data.stain.substr(4);
                    return stainVal / 100;
                } else {
                    return 1;
                }
            },
            'stroke-width':1,
            stroke:'black'
        });
    }
});

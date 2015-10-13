/**
 * Created by kite on 13.10.15.
 */
$(function() {
    var H = 20,
        W = $("body").width(),
        padding = 2;


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

            drawCytoBands(data)
        }
    });

    function position(data) {
        return data.start;
    }

    function drawCytoBands(data) {
        var to = d3.max(data, function(d) {return d.end});
        var from = d3.min(data, function(d) {return d.start});

        var xScale = d3.scale.linear()
            .domain([from, to])
            .range([0, W - padding]);

        var groups = svg.selectAll("g").data(data, position);

        /*groups.enter().append("rect").attr({
            x: function(data) {return xScale(data.start)},
            y: 0,
            width: function(data) {return xScale(data.end) - xScale(data.start) < 1 ? 1 : xScale(data.end) - xScale(data.start)},
            height: H,
            fill: function(data) {
                switch (data.stain) {
                    case 'GNEG': {return '#eee'}
                    case 'ACEN': {return '#f00'}
                    case 'GPOS25' || 'GPOS50' || 'GPOS75' || 'GPOS100' || 'GVAR' : {return '#000'}
                    case 'STALK' : {return '#00f'}
                }
            },
            'fill-opacity': function (data) {
                if (data.stain == 'GPOS25' || data.stain == 'GPOS50' || data.stain == 'GPOS75' || data.stain == 'GPOS100') {
                    var stainVal = data.stain.substr(4);
                    return stainVal / 100;
                } else {
                    return 1;
                }
            }
        });*/

        var g = groups.enter().append("g").attr("class", "cyto");
        var times = 0;
        g.datum(function(d) {
            var _g = d3.select(this);

            if (d.stain == 'ACEN') {
                _g.append("polygon").attr({
                    points: function(data) {
                        var x1 = xScale(data.start);
                        var x2 = xScale(data.end) != x1 ? xScale(data.end) : 1;
                        if (times == 0) {
                            times++;
                            return x1 + ",0 " + x1 + ",20 "+ x2 +", 10";
                        } else {
                            return x1 +", 10 " + x2 + ",0 " + x2 + ",20 ";
                        }
                    },
                    'stroke-width':1,
                    fill:'#eee',
                    stroke:'black'
                });
            } else {
                _g.append("rect").attr({
                    x: function(data) {return xScale(data.start)},
                    y: 0,
                    width: function(data) {return xScale(data.end) - xScale(data.start) < 1 ? 1 : xScale(data.end) - xScale(data.start)},
                    height: H,
                    fill: function(data) {
                        switch (data.stain) {
                            case 'GNEG': {return '#eee'}
                            case 'GPOS25' || 'GPOS50' || 'GPOS75' || 'GPOS100' || 'GVAR' : {return '#000'}
                            case 'STALK' : {return '#00f'}
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
    }
});

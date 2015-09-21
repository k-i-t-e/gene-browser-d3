$(function() {
    var dataSet = [ { key: 0, value: 5 },
        { key: 1, value: 10 },
        { key: 2, value: 13 },
        { key: 3, value: 19 },
        { key: 4, value: 21 },
        { key: 5, value: 25 },
        { key: 6, value: 22 },
        { key: 7, value: 18 },
        { key: 8, value: 15 },
        { key: 9, value: 13 },
        { key: 10, value: 11 },
        { key: 11, value: 12 },
        { key: 12, value: 15 },
        { key: 13, value: 20 },
        { key: 14, value: 18 },
        { key: 15, value: 17 },
        { key: 16, value: 16 },
        { key: 17, value: 18 },
        { key: 18, value: 23 },
        { key: 19, value: 25 } ];

    var W = $("body").width();
    var H = 150;

    var svg = d3.select("div#canvas")
        .append("svg")
        .attr("width", W)
        .attr("height", H);

    function key(d) {
        return d.key;
    }
    var circles = svg.selectAll("circle").data(dataSet, key).enter().append("circle");

    circles.attr("cx", function (d, i) {
        return (i * 50) + 30;
    })
        .attr("cy", function () {
            return H / 2;
        })
        .attr("r", function (d) {
            return d.value;
        });

    var xPadding = 25;
    var maxData = d3.max(dataSet, function(d) {return d.value});
    var zoomY = 5;
    var xScale = d3.scale.ordinal()
        .domain(d3.range(dataSet.length))
        .rangeRoundBands([11, W], 0.05);

    var yScale = d3.scale.linear()
        .domain([d3.max(dataSet, function(d) {return d.value}), 0])
        .rangeRound([10, H]);

    svg = d3.select("div#plot").append("svg").attr("width", W).attr("height", H);

    svg.selectAll("rect").data(dataSet, key).enter().append("rect")
        .attr({
            y: function (data) {
                return yScale(data.value);
            },
            x: function (data, i) {
                return xScale(i);
            },
            height: function (data) {
                return H - yScale(data.value);
            },
            width: xScale.rangeBand(),
            fill: "teal",
            'fill-opacity': function (data) {
                return data.value / maxData;
            }
        });
    // Labels
    svg.selectAll("text").data(dataSet, key).enter().append("text")
        .text(function(data) {
            return data.value;
        })
        .attr("class", "label")
        .attr({
            y: function (data) {
                return yScale(data.value) + 3*zoomY;
            },
            x: function (data, i) {
                return xScale(i) + (W / dataSet.length - 5) / 2;
            },
            fill:"white",
            'font-family':'sans-serif',
            'text-anchor':'middle'
        });

    var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(5);
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate("+ xPadding +", 0)")
        .call(yAxis);

    d3.select("button#update").on("click", function () {
        var len = dataSet.length;
        dataSet = [];
        for (var i = 0; i < len; i++) {
            dataSet.push({key :i, value: Math.floor(Math.random() * 100)});
        }

        yScale.domain([d3.max(dataSet, function(d) {return d.value}), 0]);

        svg.selectAll("rect")
            .data(dataSet, key)
            .transition().duration(1000)
            .delay(function(data, i) {
                return data.value * 10;
            })
            .each("start", function() {      // <-- Executes at start of transition
                d3.select(this)
                    .attr("fill", "cyan")
            })
            .attr({
                y: function (data) {
                    return yScale(data.value);
                },
                x: function (data, i) {
                    return xScale(i);
                },
                height: function (data) {
                    return H - yScale(data.value);
                },
                width: xScale.rangeBand(),
                fill: "teal",
                'fill-opacity': function (data) {
                    return data.value / d3.max(dataSet, function(d) {return d.value});
                }
            });

        svg.selectAll("text.label").data(dataSet, key)
            .transition().duration(1000)
            .delay(function(data, i) {
                return data.value * 10;
            })
            .text(function(data) {
                return data.value;
            })
            .attr({
                y: function (data) {
                    return yScale(data.value) + 3*zoomY;
                },
                x: function (data, i) {
                    return xScale(i) + (W / dataSet.length - 5) / 2;
                },
                fill:"white",
                'font-family':'sans-serif',
                'text-anchor':'middle'
            });

        yAxis.scale(yScale);
        svg.select("g.axis")
            .transition().duration(1000)
            .call(yAxis);
    });

    d3.select("button#add").on("click", function() {
        var newNumber = Math.floor(Math.random() * 100);
        var newKey = d3.max(dataSet, function(d) {return d.key}) + 1;
        dataSet.push({key : newKey, value : newNumber});

        xScale.domain(d3.range(dataSet.length));
        yScale.domain([d3.max(dataSet, function(d) {return d.value}), 0]);

        var bars = svg.selectAll("rect").data(dataSet, key);
        var labels = svg.selectAll("text.label").data(dataSet, key);

        bars.enter()
            .append("rect")
            .attr({
                y: function (data) {
                    return yScale(data.value);
                },
                x: W,
                height: function (data) {
                    return H - yScale(data.value);
                },
                width: xScale.rangeBand(),
                fill: "teal",
                'fill-opacity': function (data) {
                    return data.value / d3.max(dataSet, function(d) {return d.value});
                }
            });

        labels.enter().append("text")
            .text(function(data) {
                return data.value;
            })
            .attr("class", "label")
            .attr({
                y: function (data) {
                    return yScale(data.value) + 3*zoomY;
                },
                x: function (data, i) {
                    return W + (W / dataSet.length - 5) / 2;
                },
                fill:"white",
                'font-family':'sans-serif',
                'text-anchor':'middle'
            });

        bars.transition().duration(1000)
            .attr({
                y: function (data) {
                    return yScale(data.value);
                },
                x: function (data, i) {
                    return xScale(i);
                },
                height: function (data) {
                    return H - yScale(data.value);
                },
                width: xScale.rangeBand(),
                fill: "teal",
                'fill-opacity': function (data) {
                    return data.value / d3.max(dataSet, function(d) {return d.value});
                }
            });

        labels.transition().duration(1000)
            .delay(function(data, i) {
                return data.value * 10;
            })
            .text(function(data) {
                return data.value;
            })
            .attr({
                y: function (data) {
                    return yScale(data.value) + 3*zoomY;
                },
                x: function (data, i) {
                    return xScale(i) + (W / dataSet.length - 5) / 2;
                },
                fill:"white",
                'font-family':'sans-serif',
                'text-anchor':'middle'
            });
    });

    d3.select("button#remove").on("click", function() {
        var id = Math.floor(Math.random() * dataSet.length);
        if (id == dataSet.length) {
            id--;
        }
        dataSet.splice(id, 1);

        xScale.domain(d3.range(dataSet.length));
        yScale.domain([d3.max(dataSet, function(d) {return d.value}), 0]);

        var bars = svg.selectAll("rect").data(dataSet, key);
        var labels = svg.selectAll("text.label").data(dataSet, key);

        bars.exit()
            .transition()
            .duration(1000)
            .attr("y", H)
            .remove();

        labels.exit()
            .transition()
            .duration(1000)
            .attr("y", H)
            .remove();

        bars.transition().duration(1000)
            .attr({
                y: function (data) {
                    return yScale(data.value);
                },
                x: function (data, i) {
                    return xScale(i);
                },
                height: function (data) {
                    return H - yScale(data.value);
                },
                width: xScale.rangeBand(),
                fill: "teal",
                'fill-opacity': function (data) {
                    return data.value / d3.max(dataSet, function(d) {return d.value});
                }
            });

        labels.transition().duration(1000)
            .delay(function(data, i) {
                return data.value * 10;
            })
            .text(function(data) {
                return data.value;
            })
            .attr({
                y: function (data) {
                    return yScale(data.value) + 3*zoomY;
                },
                x: function (data, i) {
                    return xScale(i) + (W / dataSet.length - 5) / 2;
                },
                fill:"white",
                'font-family':'sans-serif',
                'text-anchor':'middle'
            });
    })
});
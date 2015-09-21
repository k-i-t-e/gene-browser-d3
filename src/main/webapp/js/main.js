$(function() {
    var dataSet = [25, 7, 5, 26, 11, 8, 25, 14, 23, 19,
        14, 11, 22, 29, 11, 13, 12, 17, 18, 10,
        24, 18, 25, 9, 3];

    var W = $("body").width();
    var H = 150;

    var svg = d3.select("div#canvas")
        .append("svg")
        .attr("width", W)
        .attr("height", H);

    var circles = svg.selectAll("circle").data(dataSet).enter().append("circle");

    circles.attr("cx", function (d, i) {
        return (i * 50) + 30;
    })
        .attr("cy", function () {
            return H / 2;
        })
        .attr("r", function (d) {
            return d;
        });

    var xPadding = 25;
    var maxData = d3.max(dataSet);
    var zoomY = 5;
    var xScale = d3.scale.ordinal()
        .domain(d3.range(dataSet.length))
        .rangeRoundBands([11, W], 0.05);

    var yScale = d3.scale.linear()
        .domain([d3.max(dataSet), 0])
        .rangeRound([10, H]);

    svg = d3.select("div#plot").append("svg").attr("width", W).attr("height", H);

    svg.selectAll("rect").data(dataSet).enter().append("rect")
        .attr({
            y: function (data) {
                return yScale(data);
            },
            x: function (data, i) {
                return xScale(i);
            },
            height: function (data) {
                return H - yScale(data);
            },
            width: xScale.rangeBand(),
            fill: "teal",
            'fill-opacity': function (data) {
                return data / maxData;
            }
        });
    // Labels
    svg.selectAll("text").data(dataSet).enter().append("text")
        .text(function(data) {
            return data;
        })
        .attr("class", "label")
        .attr({
            y: function (data) {
                return yScale(data) + 3*zoomY;
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
            dataSet.push(Math.floor(Math.random() * 100));
        }

        yScale.domain([d3.max(dataSet), 0]);

        svg.selectAll("rect")
            .data(dataSet)
            .transition().duration(1000)
            .delay(function(data, i) {
                return data*10;
            })
            .each("start", function() {      // <-- Executes at start of transition
                d3.select(this)
                    .attr("fill", "cyan")
            })
            .attr({
                y: function (data) {
                    return yScale(data);
                },
                x: function (data, i) {
                    return xScale(i);
                },
                height: function (data) {
                    return H - yScale(data);
                },
                width: xScale.rangeBand(),
                fill: "teal",
                'fill-opacity': function (data) {
                    return data / d3.max(dataSet);
                }
            });

        svg.selectAll("text.label").data(dataSet)
            .transition().duration(1000)
            .delay(function(data, i) {
                return data*10;
            })
            .text(function(data) {
                return data;
            })
            .attr({
                y: function (data) {
                    return yScale(data) + 3*zoomY;
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
        dataSet.push(newNumber);

        xScale.domain(d3.range(dataSet.length));
        yScale.domain([d3.max(dataSet), 0]);

        var bars = svg.selectAll("rect").data(dataSet);
        var labels = svg.selectAll("text.label").data(dataSet);

        bars.enter()
            .append("rect")
            .attr({
                y: function (data) {
                    return yScale(data);
                },
                x: function (data) {
                    return W;
                },
                height: function (data) {
                    return H - yScale(data);
                },
                width: xScale.rangeBand(),
                fill: "teal",
                'fill-opacity': function (data) {
                    return data / d3.max(dataSet);
                }
            });

        labels.enter().append("text")
            .text(function(data) {
                return data;
            })
            .attr("class", "label")
            .attr({
                y: function (data) {
                    return yScale(data) + 3*zoomY;
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
                    return yScale(data);
                },
                x: function (data, i) {
                    return xScale(i);
                },
                height: function (data) {
                    return H - yScale(data);
                },
                width: xScale.rangeBand(),
                fill: "teal",
                'fill-opacity': function (data) {
                    return data / d3.max(dataSet);
                }
            });

        labels.transition().duration(1000)
            .delay(function(data, i) {
                return data*10;
            })
            .text(function(data) {
                return data;
            })
            .attr({
                y: function (data) {
                    return yScale(data) + 3*zoomY;
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
        yScale.domain([d3.max(dataSet), 0]);

        var bars = svg.selectAll("rect").data(dataSet);
        var labels = svg.selectAll("text.label").data(dataSet);

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
                    return yScale(data);
                },
                x: function (data, i) {
                    return xScale(i);
                },
                height: function (data) {
                    return H - yScale(data);
                },
                width: xScale.rangeBand(),
                fill: "teal",
                'fill-opacity': function (data) {
                    return data / d3.max(dataSet);
                }
            });

        labels.transition().duration(1000)
            .delay(function(data, i) {
                return data*10;
            })
            .text(function(data) {
                return data;
            })
            .attr({
                y: function (data) {
                    return yScale(data) + 3*zoomY;
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
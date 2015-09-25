/**
 * Created by kite on 21.09.15.
 */
// Here goes vcfPlot

$(function() {
    var vcfH = 100;
    var zoom = 1;
    var from = 0, to = 239107476, chrId = "A1";
    var W = $("body").width();
    var minWidth = 0.3;
    var padding = 2;
    var axisPadding = 18;
    var vcfData;
    var browseFrame = to - from;
    var minBigZoom = 5;

    var leftBuffer, rightBuffer;

    var svgVcf = d3.select("div#variation_plot").append("svg").attr("width", W).attr("height", vcfH + axisPadding);

    function position(data) {
        return data.position;
    }

    function loadVariations(chrId, from, to, update) {
        $.ajax({
            url: "/gene-browser/services/variants",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                chrId: chrId,
                from: from,
                to: to,
                bigZoom: zoom > minBigZoom,
                width: W - padding
            }),
            success: function (data) {
                console.log(data);
                vcfData = data;

                drawVcf(data, update);
            }
        });

        //loadBuffers();
    }

    function loadBuffers() {
        var fromBuf;
        var toBuf;
        if (to - 2 * browseFrame > 0) {
            fromBuf = from - 2 * browseFrame;
            toBuf = to - 2 * browseFrame;
            $.ajax({
                url: "/gene-browser/services/variants",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    chrId: chrId,
                    from: fromBuf,
                    to: toBuf,
                    bigZoom: zoom > minBigZoom,
                    width: W - padding
                }),
                success: function (data) {
                    leftBuffer = data;
                }
            });

        }

        fromBuf = from + 2 * browseFrame;
        toBuf = to + 2 * browseFrame;

        $.ajax({
            url: "/gene-browser/services/variants",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                chrId: chrId,
                from: fromBuf,
                to: toBuf,
                bigZoom: zoom > minBigZoom,
                width: W - padding
            }),
            success: function (data) {
                rightBuffer = data;
            }
        });
    }

    function drawVcf(data, update) {
        var xScale = d3.scale.linear()
            .domain([from, to])
            .range([0, W - padding]);

        var groups = svgVcf.selectAll("g.vcf").data(data, position);

        // who enter
        var g = groups.enter().append("g").attr("class", "vcf");
        var width = zoom > minBigZoom ? W / (to - from) : 1;

        g.append("rect").attr({
            class:"ref",
            y: axisPadding,
            x: function (data, i) {return xScale(data.position)},
            height: vcfH / 2,
            width: width > minWidth ? width : minWidth,
            fill: "red"
        });

        g.append("rect")
            .attr({
                class:"alt",
                y: vcfH / 2 + axisPadding,
                x: function (data, i) {return xScale(data.position)},
                height:vcfH / 2,
                width: width > minWidth ? width : minWidth,
                fill: function (data) {return data.hom ? "red" : "blue"}
            });

        g.append("text")
            .attr({
                class:"alt-label",
                y:axisPadding + vcfH / 4,
                x:function (data, i) {return xScale(data.position) + width/2},
                fill:"white",
                'font-size':width < 32 ? width.toFixed() + 'px' : 32 + 'px',
                'font-family':'sans-serif',
                'text-anchor':'middle'
            })
            .text(function(data) {return width > 1 ? data.alt[0] : ""});

        // who update
        g = groups;
        g.selectAll("rect.ref").attr({
            class:"ref",
            y: axisPadding,
            x: function (data, i) {
                return xScale(data.position);
            },
            height: vcfH / 2,
            width: width > minWidth ? width : minWidth,
            fill: "red"
        });

        g.selectAll("rect.alt").attr({
            class:"alt",
            y: vcfH / 2 + axisPadding,
            x: function (data, i) {return xScale(data.position)},
            height: vcfH / 2,
            width: width > minWidth ? width : minWidth,
            fill: function (data) {return data.hom ? "red" : "blue"}
        });

        g.selectAll("text.alt-label")
            .attr({
                y:axisPadding + vcfH / 4,
                x:function (data, i) {return xScale(data.position) + width/2},
                fill:"white",
                'font-size':width < 32 ? width.toFixed() + 'px' : 32 + 'px',
                'font-family':'sans-serif',
                'text-anchor':'middle'
            })
            .text(function(data) {return width > 1 ? data.alt[0] : ""});

        //who remove
        groups.exit().remove();

        var yAxis = d3.svg.axis().scale(xScale).orient("top");
        if (update) {
            svgVcf.select("g.axis")
                .call(yAxis);
        } else {
            svgVcf.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(0, " + axisPadding + ")")
                .call(yAxis);
        }

        groups.on("mouseover", null);
        groups.on("mouseover", function(data) {
            //Get this bar's x/y values, then augment for the tooltip
            var e = d3.event;

            d3.select("#tooltip")
                .style("left", e.clientX + "px")
                .style("top", e.clientY + "px")
                .select("#ref").text(data.ref);
            d3.select("#tooltip").select("#alt").text(data.alt.join(", "));
            d3.select("#tooltip").select("#pos").text(data.position);

            d3.select("#tooltip").classed("hidden", false);
        }).on("mouseout", function() {
            d3.select("#tooltip").classed("hidden", true);
        });
    }

    loadVariations(chrId, from, to, false);
    $('#chrId').val(chrId);
    $('#from').val(from);
    $('#to').val(to);
    $("#zoom").val(zoom);

    $("button#search").on("click", function(e) {
        e.preventDefault();
        chrId = $('#chrId').val();
        from = $('#from').val();
        to = $('#to').val();

        loadVariations(chrId, from, to, false);
    });

    function zoomIn() {
        zoom++;
        $("#zoom").val(zoom);
        browseFrame /= 2;
        to = Math.ceil(from + browseFrame);
        $('#to').val(to);
        loadVariations(chrId, from, to, true);
    }

    function zoomOut() {
        if (zoom > 1) {
            zoom--;
            $("#zoom").val(zoom);
            browseFrame *= 2;
            to = Math.ceil(from + browseFrame);
            $('#to').val(to);
            loadVariations(chrId, from, to, true);
        }
    }

    function moveRight() {
        from += Math.ceil(browseFrame / 2);
        to += Math.ceil(browseFrame / 2);
        $('#to').val(to);
        $('#from').val(from);
        /*if (rightBuffer[rightBuffer.length - 1].position >= to) {
            console.log("using cache");
        } else {*/
            loadVariations(chrId, from, to, true);
        //}
    }

    function moveLeft() {
        if (to - Math.ceil(browseFrame / 2) > 0 && from > 0) {
            from = from - Math.ceil(browseFrame / 2) > 0 ? from - Math.ceil(browseFrame / 2) : 0;
            to -= Math.ceil(browseFrame / 2);
            $('#to').val(to);
            $('#from').val(from);
            loadVariations(chrId, from, to, true);
        }
    }

    function _retreiveFromBuffer(buffer, right) {
        var buf = [];
        for (var i = 0; i < buffer.length; i++) {
            if (right) {
                if (buffer[i].position > to) {
                    //buf.push(buffer[i]);
                    buf = buffer.splice(0, i-1);
                }
            } else {
                if (buffer[i].position < from && (i <= buffer[i].length - 2)) {
                    //buf.push(buffer[i]);
                    buf = buffer.splice(i + 1, buffer.length - 1);
                }
            }
        }

        //for (var i = 0; )
    }

    $("button#zoom_out").on("click", function(e) {
        e.preventDefault();
        zoomOut();
    });

    $("button#zoom_in").on("click", function(e) {
        e.preventDefault();
        zoomIn();
    });

    $("button#moveRight").on("click", function (e) {
        e.preventDefault();
        moveRight();
    });

    $("button#moveLeft").on("click", function (e) {
        e.preventDefault();
        moveLeft();
    });
});

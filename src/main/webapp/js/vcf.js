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
                to: to
            }),
            success: function (data) {
                console.log(data);
                vcfData = data;

                drawVcf(data, update);
            }
        });
    }

    function drawVcf(data, update) {
        var xScale = d3.scale.linear()
            /*.domain([
                d3.min(data, position), //0
                d3.max(data, position)
            ])*/
            .domain([from, to])
            .range([0, W - padding]);

        var groups = svgVcf.selectAll("g.vcf").data(data, position);

        // who enter
        var g = groups.enter().append("g").attr("class", "vcf");
        var width = W / (to - from);

        g.append("rect").attr({
            class:"ref",
            y: axisPadding,
            x: function (data, i) {return xScale(data.position)},
            height: vcfH / 2,
            width: width > minWidth ? width : minWidth,
            fill: "blue"
        });

        g.append("rect")
            .attr({
                class:"alt",
                y: vcfH / 2 + axisPadding,
                x: function (data, i) {return xScale(data.position)},
                height:vcfH / 2,
                width: width > minWidth ? width : minWidth,
                fill: "red"
            });

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
            fill: "blue"
        });

        g.selectAll("rect.alt").attr({
            class:"alt",
            y: vcfH / 2 + axisPadding,
            x: function (data, i) {return xScale(data.position)},
            height: vcfH / 2,
            width: width > minWidth ? width : minWidth,
            fill: "red"
        });

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

    loadVariations("A1", from, to, false);
    $('#chrId').val("A1");
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
        loadVariations(chrId, from, to, true);
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

    $("button#zoom_out").on("click", function(e) {
        e.preventDefault();
        /*if (zoom > 1) {
            zoom--;
            //W = $("body").width() * zoom;
            $("#zoom").val(zoom);
            var to = $('#to').val() * 2;
            $('#to').val(to);
            //d3.select("div#variation_plot").select("svg").attr("width", W);
            loadVariations($('#chrId').val(), $('#from').val(), to, true);
            //drawVcf(vcfData, true);
        }*/
        zoomOut();
    });

    $("button#zoom_in").on("click", function(e) {
        e.preventDefault();
        /*zoom++;
         //W = $("body").width() * zoom;
         $("#zoom").val(zoom);
         //d3.select("div#variation_plot").select("svg").attr("width", W);
         var to = $('#to').val() / 2;
         $('#to').val(to.toFixed());
         loadVariations($('#chrId').val(), $('#from').val(), to.toFixed(), true);
         //drawVcf(vcfData, true);*/
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

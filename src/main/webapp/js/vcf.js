/**
 * Created by kite on 21.09.15.
 */
// Here goes vcfPlot

$(function() {
    var vcfH = 100;
    var zoom = 1;
    var W = $("body").width() * zoom;
    var minWidth = 0.3;
    var padding = 2;
    var vcfData;
    var svgVcf = d3.select("div#variation_plot").append("svg").attr("width", W).attr("height", vcfH);

    function position(data) {
        return data.position;
    }

    function loadVariations(chrId, from, to) {
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

                drawVcf(data);
            }
        });
    }

    function drawVcf(data) {
        var xScale = d3.scale.linear()
            .domain([
                d3.min(data, position),
                d3.max(data, position)
            ])
            .range([0, W - padding]);

        var groups = svgVcf.selectAll("g").data(data, position);

        // who enter
        var g = groups.enter().append("g");
        var width = W / (d3.max(data, function (d) {
                return d.position
            }) - d3.min(data, function (d) {
                return d.position
            }));

        g.append("rect").attr({
            class:"ref",
            y: 0,
            x: function (data, i) {
                return xScale(data.position);
            },
            height: vcfH / 2,
            width: width > minWidth ? width : minWidth,
            fill: "blue"
        });

        g.append("rect")
            .attr({
                class:"alt",
                y: vcfH / 2,
                x: function (data, i) {
                    return xScale(data.position);
                },
                height: function (data) {
                    return vcfH / 2;
                },
                width: width > minWidth ? width : minWidth,
                fill: "red"
            });

        // who update
        g = groups;
        g.selectAll("rect.ref").attr({
            class:"ref",
            y: 0,
            x: function (data, i) {
                return xScale(data.position);
            },
            height: vcfH / 2,
            width: width > minWidth ? width : minWidth,
            fill: "blue"
        });

        g.selectAll("rect.alt").attr({
            class:"alt",
            y: vcfH / 2,
            x: function (data, i) {
                return xScale(data.position);
            },
            height: function (data) {
                return vcfH / 2;
            },
            width: width > minWidth ? width : minWidth,
            fill: "red"
        });

        //who remove
        groups.exit().remove();
    }

    loadVariations("A1", 29186, 239107476);

    $("button#search").on("click", function(e) {
        e.preventDefault();
        var chrId = $('#chrId').val();
        var from = $('#from').val();
        var to = $('#to').val();

        loadVariations(chrId, from, to);
    });

    $("button#zoom_in").on("click", function(e) {
        e.preventDefault();
        zoom++;
        W = $("body").width() * zoom;
        $("#zoom").val(zoom);
        d3.select("div#variation_plot").select("svg").attr("width", W);
        drawVcf(vcfData);
    })
});

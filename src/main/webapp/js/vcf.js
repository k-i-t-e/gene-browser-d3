/**
 * Created by kite on 21.09.15.
 */
// Here goes vcfPlot

$(function() {
    var vcfH = 100;
    var W = $("body").width();
    var svgVcf = d3.select("div#variation_plot").append("svg").attr("width", W).attr("height", vcfH);

    $.ajax({
        url: "/gene-browser/services/variants",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            chrId: "A1",
            from: 2772000,
            to: 2774500
        }),
        success: function (data) {
            console.log(data);
            var xScale = d3.scale.linear()
                .domain([
                    d3.min(data, function (d) {
                        return d.position
                    }),
                    d3.max(data, function (d) {
                        return d.position
                    })
                ])
                .range([0, W]);

            var groups = svgVcf.selectAll("rect").data(data).enter().append("g");
            groups.append("rect").attr({
                y: 0,
                x: function (data, i) {
                    return xScale(data.position);
                },
                height: vcfH / 2,
                width: W / (d3.max(data, function (d) {
                    return d.position
                }) - d3.min(data, function (d) {
                    return d.position
                })),
                fill: "blue"
            });

            groups.append("rect")
                .attr({
                    y: vcfH / 2,
                    x: function (data, i) {
                        return xScale(data.position);
                    },
                    height: function (data) {
                        return vcfH / 2;
                    },
                    width: W / (d3.max(data, function (d) {
                        return d.position
                    }) - d3.min(data, function (d) {
                        return d.position
                    })),
                    fill: "red"
                });
        }
    });
});

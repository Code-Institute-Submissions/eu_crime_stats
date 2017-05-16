/**
 * Created by Cormac Liston on 12/05/2017.
 */
// HELPER FUNCTION to to see if filters are working correctly
function print_filter(filter){
    //	first check that the filter if of valid type
    var f=eval(filter);
    if (typeof(f.length) != "undefined") {}else{}
    if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
    if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
    console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
}

function buildGraphs(euCrimeStats){

    console.log('euCrimeStats');
    console.log(euCrimeStats);

    //  CROSSFILTER the data
    var indexedData = crossfilter(euCrimeStats);

    /////////////////////////////////////////////////////////
    //  PIE CHART
    /////////////////////////////////////////////////////////
    var yearDim = indexedData.dimension(function(d){
       return +d.year;
    });
    var yearlyTotal = yearDim.group().reduceSum(function(d){
       return d.totalCrimes;
    });
    yearPieChart
        .width(250)
        .height(250)
        .slicesCap(10)
        .innerRadius(20)
        .dimension(yearDim)
        .group(yearlyTotal);
    yearPieChart2
        .width(250)
        .height(250)
        .slicesCap(10)
        .innerRadius(20)
        .dimension(yearDim)
        .group(yearlyTotal);
        //.colors(["#a60000","#ff0000", "#ff4040","#ff7373","#67e667","#39e639","#00cc00"]);

    /////////////////////////////////////////////////////////
    //  LINE CHART
    // X - AXIS is date
    // Y - AXIS is number of Assaults for the country
    /////////////////////////////////////////////////////////
    var dateDim = indexedData.dimension(function(d){return d.date});
    var minDate = dateDim.bottom(1)[0].date;
    var maxDate = dateDim.top(1)[0].date;

    var irelandSVGrp = dateDim.group().reduceSum(function(d){
        if(d.eu_member_state=='Ireland'){
            return d.sexual_violence;
        }else{
            return 0;
        }
    });
    var englandSVGrp = dateDim.group().reduceSum(function(d){
        if(d.eu_member_state=='England'){
            return d.sexual_violence;
        }else{
            return 0;
        }
    });
    var scotlandSVGrp = dateDim.group().reduceSum(function(d){
        if(d.eu_member_state=='Scotland'){
            return d.sexual_violence;
        }else{
            return 0;
        }
    });
    var walesSVGrp = dateDim.group().reduceSum(function(d){
        if(d.eu_member_state=='Wales'){
            return d.sexual_violence;
        }else{
            return 0;
        }
    });
    var northernIrelandSVGrp = dateDim.group().reduceSum(function(d){
        if(d.eu_member_state=='Northern Ireland'){
            return d.sexual_violence;
        }else{
            return 0;
        }
    });
    var restOfUKSVGrp = dateDim.group().reduceSum(function(d){
        if(d.eu_member_state=='Northern Ireland' || d.eu_member_state=='Wales' || d.eu_member_state=='Scotland' ){
            return d.sexual_violence;
        }else{
            return 0;
        }
    });

    crimeLineChartIreland
        .width(600)
        .height(300)
        .dimension(dateDim)
        .group(irelandSVGrp,"Ireland")
        //.dashStyle([1,1])
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel('Sexual Violence')
        .xAxisLabel('Year')
        .colors(irelandColor);

    crimeLineChartEngland
        .width(600)
        .height(300)
        .dimension(dateDim)
        .group(englandSVGrp,"England")
        .margins({top: 10, right: 50, bottom: 30, left: 40})
        //.dashStyle([2,2])
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel('Sexual Violence')
        .xAxisLabel('Year')
        .colors(englandColor);

    crimeLineChartScotland
        .width(600)
        .height(300)
        .dimension(dateDim)
        .group(scotlandSVGrp,"Scotland")
        //.dashStyle([3,3])
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel('Sexual Violence')
        .xAxisLabel('Year')
        .colors(scotlandColor);

    crimeLineChartWales
        .width(600)
        .height(300)
        .dimension(dateDim)
        .group(walesSVGrp,"Wales")
        //.dashStyle([4,4])
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel('Sexual Violence')
        .xAxisLabel('Year')
        .colors(walesColor);

    crimeLineChartNorthernIreland
        .width(600)
        .height(300)
        .dimension(dateDim)
        .group(northernIrelandSVGrp,"Northern Ireland")
        //.dashStyle([5,5])
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel('Sexual Violence')
        .xAxisLabel('Year')
        .colors(northernIrelandColor);

    crimeLineChartRestOfUk
        .width(600)
        .height(300)
        .dimension(dateDim)
        .group(restOfUKSVGrp,"Scotland,Wales,N.I.")
        //.dashStyle([5,5])
        .renderArea(true)
        .x(d3.time.scale().domain([minDate,maxDate]))
        .yAxisLabel('Sexual Violence')
        .xAxisLabel('Year')
        .colors(restOfUkColor);

    countriesLineChart
        .width(800)
        .height(400)
        .x(d3.time.scale().domain([minDate,maxDate]))
        //.yAxisLabel(dc.legend().x(400).y(120).itemHeight(13).gap(5))
        .yAxisLabel('Sexual Violence')
        .xAxisLabel('Year')
        .legend(dc.legend().x(650).y(120).itemHeight(13).gap(5))
        .renderHorizontalGridLines(true)
        .compose([
            dc.lineChart(countriesLineChart)
                .dimension(dateDim)
                //.renderArea(true)
                .colors(irelandColor)
                .group(irelandSVGrp,"Ireland"),
                //.dashStyle([1,1]),
            /*dc.lineChart(countriesLineChart)
                .dimension(dateDim)
                //.renderArea(true)
                .colors('#E1FF74')
                .group(englandAssaultGrp,"England"),
                //.dashStyle([2,2]),*/
            dc.lineChart(countriesLineChart)
                .dimension(dateDim)
                //.renderArea(true)
                .colors(scotlandColor)
                .group(scotlandSVGrp,"Scotland"),
                //.dashStyle([3,3]),
            dc.lineChart(countriesLineChart)
                .dimension(dateDim)
                //.renderArea(true)
                .colors(walesColor)
                .group(walesSVGrp,"Wales"),
                //.dashStyle([4,4]),
            dc.lineChart(countriesLineChart)
                .dimension(dateDim)
                //.renderArea(true)
                .colors(northernIrelandColor)
                .group(northernIrelandSVGrp,"Northern Ireland")
                //.dashStyle([5,5]),
            /*dc.lineChart(countriesLineChart)
                .dimension(dateDim)
                //.renderArea(true)
                .colors(restOfUkColor)
                .group(restOfUKAssaultGrp,"Scotland,Wales,N.I.")
                //.dashStyle([5,5]),*/
        ])
        .brushOn(false);
    dc.renderAll();
}



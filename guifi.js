
//$( "#selectionbox1" ).buttonset();
//$( "#selectionbox2" ).buttonset();
//$( "#selectionbox3" ).buttonset();

            var dataset = "barcelones"
            var client = null //var client = 'client'
            var ap = null //var ap = 'ap'
            var Supernode = null //var Supernode = 'Supernode'


var vis = d3.select("body")
    .append("svg")
    .attr("width", 1420)
    .attr("height", 1000)
    
var container = vis.append("g")
    
redraw = function(){
    container.attr("transform","translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
}


function init () {

    d3.json("data/guifi-d3-" + dataset + ".min.json",function(data){
        var width = 1420, height = 1000;

        var nodeSizeScale = d3.scale.sqrt()
            .range([5,40])
            .domain([0,100]);

        var labelDistance = 0;

        zoom = d3.behavior.zoom();
        zoom.scaleExtent([0.12,3])

        var nodes = [];
        var links = [];
        var nodes_aux = {};

        vis.on("mousemove", mousemove);
        vis.call(zoom.on("zoom", redraw));

        var tooltip =  d3.select("body")
            .append("div")
            .attr("id","tooltip")
            .html("")
            .attr("class", "tooltip")
            .style("display","none");

        function mousemove() {
            d3.selectAll(".tooltip")
               .style("opacity",function(d){return 0.9;})
               .style("background","white")
               .style("left", (d3.event.pageX + 14) + "px")
               .style("top", (d3.event.pageY - 12) + "px");
        }

        data.nodes.forEach(function(d){
            //var ap = 'ap'    
            if(d.type!=client && d.type!=ap && d.type!=Supernode){
                var node = nodes.push({label:d.name,status:d.STATUS,type:d.type,id:d.id}) - 1 ;
                nodes_aux[d.id]=node;
            }
        });

        data.links.forEach(function(d){
            var link = {id:d.id,link_type:d.type,source:nodes[nodes_aux[d.source]],target:nodes[nodes_aux[d.target]],weight:1};
            if(link.source!=null && link.target!=null){
                links.push(link);
            }
            else{
                //console.log(d.id);
            }
        });

        var force = d3.layout.force()
                    .size([width, height])
                    .nodes(nodes,function(d){return id;})
                    .links(links)
                    .gravity(1).linkDistance(50).charge(-4000).linkStrength(10);

        force.start();

        var link = container.selectAll("line.link")
                    .data(links,function(d){return d.id;})
                    .enter()
                    .append("line")
                    .attr("class", "link")
                    .style("stroke", function(d) {switch (d.link_type) {case 'wds':return "orange";case 'ap/client':return "#3383bb";}})
                    .style("stroke-width", function(d) {switch (d.link_type) {case 'wds':return "3";case 'ap/client':return "1";}});

        var node = container.selectAll(".node")
                    .data(force.nodes())
                    .enter()
                    .append("g")
                    .attr("class", "node");

        var circles = node.append("a").attr("xlink:href", function(d) {return "http://www.guifi.net/node/" + d.id;})
                        .append("circle")
                        .attr("r", function(d) {return nodeSizeScale(d.weight);})
                        .attr("class", function(d) {switch (d.type) {case 'ap':return "circulo ap";case 'client':return "circulo client";case 'Supernode':return "circulo supernode";}}); 

                      node.append("a")
                        .attr("xlink:href", function(d) {return "http://www.guifi.net/node/" + d.id;})
                        .append("text")
                        .attr("class", "labeln")
                        .attr("dx", 30)
                        .attr("dy", ".35em")
                        .text(function(d, weight) {if(d.weight>=6){ return d.label;}});
                    
        circles.on("mouseout", function(d) {
            tooltip.style("display", "none");
        });

        circles.on("mouseover", function(d) {
            tooltip.style("display", "block")
            .html("<span>" + d.label + "<br>" + d.id + " " + d.status + "</span>");
        });
                      
        var updateLink = function() {
                this.attr("x1", function(d) {return d.source.x;})
                    .attr("y1", function(d) {return d.source.y;})
                    .attr("x2", function(d) {return d.target.x;})
                    .attr("y2", function(d) {return d.target.y;});
        }

        var updateNode = function() {
                this.attr("transform", function(d) {return "translate(" + d.x + "," + d.y + ")";});
        }

        force.on("tick", function() {node.call(updateNode);link.call(updateLink);});

    });
}

init ();

// return the name of the dataset which is currently selected
function getChosenDataset () {
    var select = document.getElementById("dataset");
    return select.options[select.selectedIndex].value;
}

function getChosenSelection3 () {
    var selectbox3 = document.getElementById("check3");
    return selectbox3.checked;
    console.log(selectbox3.checked); 
}

function getChosenSelection2 () {
    var selectbox2 = document.getElementById("check2");
    return selectbox2.checked;
}

function getChosenSelection1 () {
    var selectbox1 = document.getElementById("check1");
    return selectbox1.checked;
}

function updateDataSet () {
    var link = d3.selectAll("line.link").remove();
    var node = d3.selectAll(".node").remove();
    var node = d3.selectAll("circle").remove();

    dataset = getChosenDataset ();
    console.log(dataset);   
    init();
}

function updateSelection3 () {
    var link = d3.selectAll("line.link").remove();
    var node = d3.selectAll(".node").remove();
    var node = d3.selectAll("circle").remove();

    selectbox3 = getChosenSelection3 ();
        console.log(selectbox3); 
    if(selectbox3==true){ap = null;} else{ ap ="ap";}
        console.log(ap,client,Supernode); 
    init();
}

function updateSelection2 () {
    var link = d3.selectAll("line.link").remove();
    var node = d3.selectAll(".node").remove();
    var node = d3.selectAll("circle").remove();

    selectbox2 = getChosenSelection2 ();
   
    if(selectbox2==true){client = null;} else{ client = "client"}
    console.log(selectbox2,ap,client,Supernode); 
    init();
}

function updateSelection1 () {
    var link = d3.selectAll("line.link").remove();
    var node = d3.selectAll(".node").remove();
    var node = d3.selectAll("circle").remove();

    selectbox1 = getChosenSelection1 ();

    if(selectbox1==true){Supernode = null;} else{ Supernode = "Supernode"}
    console.log(selectbox1,ap,client,Supernode); 
    init();
}

// listen to the form fields changing
document.getElementById("check3").addEventListener ("change", updateSelection3, false);
document.getElementById("check2").addEventListener ("change", updateSelection2, false);
document.getElementById("check1").addEventListener ("change", updateSelection1, false);
document.getElementById("dataset").addEventListener ("change", updateDataSet, false);
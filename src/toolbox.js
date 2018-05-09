var fS = "#ff433d", sS = "#ffffff", tS = "#248bda";
/*
        color = d3.scaleLinear()
        .domain([0, 30, 100])
        .range(["#f90000", "#ffffff" , "#0019ff"]),
*/

function foo(){console.log(papersFiltered.length)}

/*
    Toolbox
*/
function toggle ( element ){
	// If the checkbox is checked, disabled the slider.
	// Otherwise, re-enable it.
	if ( !this.checked ) {
		element.setAttribute('disabled', true);
	} else {
		element.removeAttribute('disabled');
	}
}

function toggleAE (){
    showExclude = this.checked
}

function toggleAA (){
    showAll = this.checked
}

function createSliders(){
    /*
        MNP slider
    */
    noUiSlider.create(sliderTP, {
        start: 2,
        step: 1,
        connect: [false, true],
        range: {
            'min': 0,
            'max': 10
        }});
    sliderTP.noUiSlider.on('update', function( values, handle ) {
        var value = values[handle];
        value = value.substring(0,value.length-3)
        inputNumberTP.value = value
        thetaPap  = value
        authorGraph()


    });
    sliderTP.setAttribute('disabled', true);
    d3.select('#input-numberTP').value = 2;
    inputNumberTP.addEventListener('change', function(){
        if(this.value>10)
            this.value = 10
        thetaPap = this.value;
       sliderTP.noUiSlider.set([this.value]);
    });
    if(checkboxTP){
        checkboxTP.checked = false;
        checkboxTP.addEventListener('click', function(){
	   toggle.call(this, sliderTP);
        authorGraph()
        });
    }
    /*
        MNoC slider
    */
    noUiSlider.create(sliderTOC, {
        start: 2,
        step: 1,
        connect: [false, true],
        range: {
            'min': 0,
            'max': 20
        }});
    sliderTOC.noUiSlider.on('update', function( values, handle ) {
        var value = values[handle];
        value = value.substring(0,value.length-3)
        inputNumberTOC.value = value
        thetaCit  = value
        if(papersFiltered.length>0)
            paperGraph(papersFiltered, citPrint, idPs, simulation)
    });
    sliderTOC.setAttribute('disabled', true);
    d3.select('#input-numberTOC').value = 10;
    inputNumberTOC.addEventListener('change', function(){
        if(this.value>50)
            this.value = 50
        thetaCit = this.value;
       sliderTOC.noUiSlider.set([this.value]);
    });
    if(checkboxTOC){
        checkboxTOC.checked = false;
        checkboxTOC.addEventListener('click', function(){
	   toggle.call(this, sliderTOC);
        if(papersFiltered.length>0)
            paperGraph(papersFiltered, citPrint, idPs, simulation)
        });
    }
}

function updateColorMap(){
    /*
        1. change stops
        2. remove/redraw rectangle
        3. update colormap range
    */
    d3.select("#firstStopS")
        .style("stop-color", fS)
    d3.select("#secondStopS")
        .style("stop-color", sS)
    d3.select("#thirdStopS")
        .style("stop-color", tS)
    
    d3.select("#cmp").transition()
    .duration(300)
    .attr("fill", "url(#grad2)")
    
    color.range([fS, sS , tS])
    if(papersFiltered.length>0)
        paperGraph(papersFiltered, citPrint, idPs, simulation)
}

function colorMappingInit(){
    d3.select("#svgColorP")
        .append("text").text("0")
        .attr("x", "7%")
        .attr("y", "98%")
        .attr("fill", "black")
    d3.select("#svgColorP")
        .append("text").text("30")
        .attr("x", "54%")
        .attr("y", "98%")
        .attr("fill", "black")
    d3.select("#svgColorP")
        .append("text").text("100")
        .attr("x", "89%")
        .attr("y", "97%")
        .attr("fill", "black")
    
    d3.select('#color_value1').on("change", function(){
        /*Aggiungere rettangolo sopra testo e onchange rimuovi+riaggiungi*/
        fS = "#"+this.value
        console.log(this)
        updateColorMap()
        });
    d3.select('#color_value2').on("change", function(){
        sS = "#"+this.value
        updateColorMap()
    });
    d3.select('#color_value3').on("change", function(){
        tS = "#"+this.value
        updateColorMap()
    });
}

function checkboxesInit(){
    authViz.addEventListener('change', function(){
            authorGraph()
    });
}

function setPopUps(){
    let svg = toolboxSvg;
    svg.style("width", "300px")
        .style("height", "200px")
    /*
    SPAN-ids:
    conflict-a
    area-paper-a
    paper-info-a
    MNP
    MNoC
    colorMapP
    stats
    apn
    anpn
    pn
    npn
    */
    svg.append("rect")
        .attr("id", "rect-pop")
         .attr('x',0)
         .attr('y',0)
         .attr('width', "100%")
         .attr('height',"130px")
         .attr('fill',"#eaeaea")
         //.attr('opacity',0.1)
         .attr('opacity',0)
         .style("border-radius", "30px")
        .attr("stroke","##878787")
        .attr("stroke-width","3")
    
    d3.selectAll('.pop-up')
        .on('mouseover', function(){popup(this.id, svg)})
    .on('mouseout', function(){hide_popup()})
    
    
}

function toolboxInit(){
    createSliders()
    colorMappingInit()
    checkboxesInit()
    setPopUps()
}
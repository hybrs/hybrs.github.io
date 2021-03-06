var graph = [],
    alpha = 0.7,
    beta = 0.3,
    oldH = 250,
    oldHAG = 350,
    onlyag = false,
    _docHeight, resize_pn = false,
    resize_ag = false,
    terms = {},
    old_loading = "",
    jddata = [],
    confli = "⛔ ",
    conflir = "⚠ ",
    p_ico = "imgs/key1.png",
    np_ico = "imgs/np.png",
    a_ico = "imgs/omini.png",
    anp_ico = "imgs/anp.png",
    loader_str = "<div class=\"loader text-center\"></div>",
    auths_in_g = new Set([]),
    start = true,
    click = false,
    clickExp = false,
    stoolboxSvg = d3.select("#tb-svg"),
    authTable = d3.select("#authTable"),
    authors = [],
    resize_modal = false,
    AP = [],
    ANP = [],
    lines = [],
    authsReview = [],
    authsReview_obj = [],
    idA_rev, revDict = {}, //id_rev: [[ida1, namea1]...]
    altRev = [],
    altRev_obj = [],
    coord_hist = {},
    authsExclude = [],
    authsExclude_obj = [],
    authsConflict = [],
    authsConflict_obj = [],
    authsDef = [],
    papers = [],
    papersPrint = [],
    papersCit = {},
    authDict = {}, // [idA][oldX, newX]
    authHist = {}, // {idA, year1:[idList], year2:[idList]...}
    inC = [],
    outC = [],
    its = 0,
    undos = [],
    redos = [],
    sep1 = '§',
    sep2 = '£',
    zoomFact = 1.0,
    dy = 0,
    old_dy = 0,
    old_zoomFact = 1.0,
    citPrint = [],
    papersIndex = {},
    papersFiltered = [],
    authsFiltered = [],
    citations = [],
    width = $(".ap").width(),
    inSz = 100,
    outSz = 100,
    height = $(".ap").height(),
    heightA = $(".aa").height(),
    heightAG = $(".ag").height(),
    heightP = 2000,
    baseHeight = 2000,
    h = height,
    w = width,
    oldw = w,
    old_pprint = [],
    thetaPap = 1,
    thetaN = 10,
    thetaC = 12,
    thetaY = 7,
    inputNumberTP = document.getElementById('input-numberTP'),
    sliderTP = document.getElementById('thetaPap'),
    thetaCit = 8,
    inputNumberTOC = document.getElementById('input-numberTOC'),
    sliderTOC = document.getElementById('thetaCit'),
    svgP, svgAG, svgAGn, svgAxis, popText, popRect, popTextA, popRectA, popRectAX, popTextAx,
    thehtml,
    idP, idInfo,
    showExclude = true,
    showAll = false,
    idA, idAs = [],
    idPs = [],
    ul,
    simulation, simulationA,
    minYear = 1995,
    minInCits = 100,
    maxInCits = 0,
    maxYear = 2018,
    prevHeight = 0,
    prevWidth = 0,
    checkboxTP = $('#MNP'),
    //checkboxTOC = $('#MNoC'),
    checkboxTN = $('#N'),
    checkboxTC = $('#C'),
    checkboxTY = $('#lastYearOfP'),
    checkboxC = $('#cb-confl'),
    checkboxA = $('#cb-av'),
    authViz = document.getElementById('authViz'),
    color10 = d3.scaleOrdinal(d3.schemeCategory10),
    color20b = d3.scaleOrdinal(d3.schemeCategory20), //20b categorical cmap
    colorjj = d3.scaleOrdinal().domain([0, 1, 2, 3, 4, 5, 6])
    .range(["white", "yellow", "red", "green", "blue", "black", "gray"]), //color10,
    c20 = false,
    ctype = 0,
    colorA = d3.scaleLinear()
    .domain([0, 10, 30])
    .range(["rgba( 178, 0, 0, 0.901 )", "#ffffff", "rgba( 17, 0, 178, 0.845 )"]),
    firststop = "#ffff99",
    secondstop = "#00cc99",
    rel_color = "rgba( 56, 90, 110, 0.792 )"
    color = d3.scaleLinear()
    .domain([0, 100]) //#ffff99
    .range(["#00cc99", "#ffff99"]),
    color_rel = d3.scaleLinear()
    .domain([0, 1]) //#ffff99
    .range(["white", rel_color]),
    //        .range(["#f90000", "#ffffff" , "#0019ff"]),
    rscale = d3.scaleLinear()
    .domain([0, 40])
    .range([5, 20]),
    xConstrained = d3.scaleLinear()
    .domain([minYear, maxYear])
    .range([10, width - 40]),
    fullscreen = false,
    xaxis = d3.axisBottom().scale(xConstrained),
    loader = "<div id=\"ldr\" class=\"cssload-loader\">Loading data <span id = \"ldr-val\" style=\"width: auto; font-size: 0.6em\">0</span>%</div>";

function score_auth(at) {
    let score = 0.0,
        pl = at.paperList;

    pl.map(function (el) {
        if (idPs.includes(el))
            score += alpha
        else if (papersPrint.includes(el))
            score += beta
    })
    return score
}

function rankAuths(auths) {
    let an = auths.length;
    for (var i = 0; i < an; i++) {
        //for(var j = 0; j < npl; j++)
        auths[i].score = score_auth(auths[i])
        auths[i].order = order(auths[i])
    }
    return auths
}


function FShandler() {
    setTimeout(function () {
        if (
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
        ) {
            return
        } else {
            $("#gAG").removeAttr("transform")
            d3.select("#svgAG").call(d3.zoom().transform, d3.zoomIdentity);
            d3.select("#fullscreen_btn").attr("y", () => $("#AG-container").height() - 40)
            document.getElementById("fullscreen_btn").setAttributeNS('http://www.w3.org/1999/xlink', 'href', "imgs/fscreen.PNG");
        }

    }, 400);
    /*
        setTimeout(function(){ 
            if(clickJ) unclick_j()
            if(click) unclick_auth(clkA)
            if(clickP) unclick_pap(clkPp)
            simulationA = setAGSimulation()
            //authorGraph()
            let wfactor = $("#AG-container").width()/prevWidth,
                hfactor = $("#AG-container").height()/prevHeight;
            authsDef.forEach(function(d){
                if (d.userX){
                    d.userX *= wfactor
                    d.userY *= hfactor
                }
            })
            authorGraph()
        }, 400);
      */
}


function full_screen() {
    prevWidth = $("#AG-container").width()
    prevHeight = $("#AG-container").height()
    // are we in fulls creen mode?
    if (
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
    ) {
        // exit full-screen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }

        document.getElementById("fullscreen_btn").setAttributeNS('http://www.w3.org/1999/xlink', 'href', "imgs/fscreen.PNG");

        //Restore RN

    } else {

        let i = document.getElementById("AG-container");
        document.getElementById("fullscreen_btn").setAttributeNS('http://www.w3.org/1999/xlink', 'href', "imgs/exit.png");

        // go full-screen
        if (i.requestFullscreen) {
            i.requestFullscreen();
            ret = true;
        } else if (i.webkitRequestFullscreen) {
            i.webkitRequestFullscreen();
            ret = true;
        } else if (i.mozRequestFullScreen) {
            i.mozRequestFullScreen();
            ret = true;
        } else if (i.msRequestFullscreen) {
            i.msRequestFullscreen();
            ret = true;
        }

    }
    //fullscreen=!fullscreen

}



function color_papers(){
    d3.selectAll(".paper_in_bars").attr("fill", function (d){
        if(idPs.includes(d.id) || papersPrint.includes(d.id))
            return c20 ? color_j(d) : color_n(d)
        else return "rgba( 217, 217, 217, 1 )"
    })
    d3.selectAll(".papersNode").attr("fill", function(d) {
        if(c20)
            return color_j(d)
        else return color_n(d)})  
                                        
}

function change_cmap(index){
    /**
     * 0 : total cit count
     * 1 : local relevance (degree of nodes) (p.out + p.in)
     * 2 : venue
     */

    //

    switch (index) {
        case 2:
            $(".cmpClass").hide()
            let y_coords = d3.scaleLinear().domain([0,j_lists[choosen_j].j_list.length]).range([170, 330]);
            svgAxis.selectAll("jrect")
                .data(jddata.concat(["Other"]))
                .enter()
                .append("rect").attr("class","jrect")
                .attr("id", (d)=>"j"+(d == "Other" ? 7 : jddata.indexOf(d)))
                .attr("height", 10)
                .attr("width", 10)
                .attr("y", function (d){
                    return d != "Other" ? y_coords(j_lists[choosen_j].j_list.indexOf(d)) : y_coords(6)
                })
                .attr("x", 20)
                .attr("fill", (d) => colorjj_(j_lists[choosen_j].j_list.indexOf(d)))
                .style("pointer-events", "all")
                //scrivere handler in mouse-handlers.js
                .on("click", cmap_click)
                .on("mouseenter", cmap_on)
                .on("mouseout", cmap_out)
                .on("dblclick", cmap_dbl)
                //evidenziare border e paperi su mouse over
            svgAxis.selectAll(".jtext")
                .data(jddata.concat(["Other"]))
                .enter()
                .append("text").attr("class", "jtext")
                .attr("id", (d)=>"jt"+(d == "Other" ? 7 : jddata.indexOf(d)))
                .attr("y", (d) => d != "Other" ? y_coords(j_lists[choosen_j].j_list.indexOf(d))+8 : y_coords(6)+8)
                .attr("x", 35)
                .attr("text-anchor", "left")  
                .style("font-size", "8px")
                .text(function (d){
                    if(d!="Other"){
                    let num = papersFiltered.filter((el) => el.v_id == d || el.j_id == d ).length
                    return d+" "+num;
                    }else return d+" "+ papersFiltered.filter((el) => !jddata.includes(el.v_id) && !jddata.includes(el.j_id) ).length
            })
            c20 = true
            break;
        default:
            $(".cmpClass").show()
            d3.select("#top_cmstop").text(() => index == 0 ? "100": "1")
            d3.select("#thirdStopS").style("stop-color",index == 1 ? "white" : secondstop)
            d3.select("#firstStopS").style("stop-color",index == 1 ? rel_color : firststop)
            $("#cmpa")[0].attributes.title.nodeValue = index == 1 ? "Local relevance color-map" : "A color-map associated with the number of in-citations. The steps are 0 and 100."
            d3.selectAll(".jrect").remove()
            d3.selectAll(".jtext").remove()
            ctype = index
            c20 = false;
            break;
    }
    color_papers()
}
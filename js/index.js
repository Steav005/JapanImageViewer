/* off-canvas sidebar toggle */
$('[data-toggle=offcanvas]').click(function() {
    $('.row-offcanvas').toggleClass('active');
    $('.collapse').toggleClass('in').toggleClass('hidden-xs').toggleClass('visible-xs');
});
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

var fp = undefined;
var indexJS = undefined;
var cookie = Cookies.get('month');
if(cookie !== undefined) {
    cookie = JSON.parse(cookie);
}

$.getJSON("index.json", function(data){
    indexJS = data;
    if(cookie === undefined) setDefaultCookie();
    addPictures(cookie.month, cookie.year);
});

function setDefaultCookie(){
    year = 1900;
    month = 1;
    for(var i = 0; i < indexJS.length; i++){
        if(year < indexJS[i].date.year) {
            year = indexJS[i].date.year;
            month = indexJS[i].date.month;
        }else if(year === indexJS[i].date.year && month < indexJS[i].date.month){
            month = indexJS[i].date.month;
        }
    }
    cookie = {month: month, year: year};
    Cookies.set('month', {month: month, year: year});
}


function newFullpage(anchors, tooltips){
    fp = new fullpage('#fullpage', {
        //options here
        anchors: anchors,
        navigationTooltips: tooltips,
        navigation: true,
        verticalCentered: true,
        navigationPosition: 'right',
        autoScrolling:false,
        licenseKey: 'OPEN-SOURCE-GPLV3-LICENSE',
        css3: true
    });
}

function clearFullpage(){
    var fullpageDiv = document.getElementById("fullpage");
    while(fullpageDiv.children.length > 0) fullpageDiv.removeChild(fullpageDiv.firstChild)
    if(fp !== undefined) fp.destroy();
}

function addPictures(month, year){
    clearFullpage();

    var fullpageDiv = document.getElementById("fullpage");
    var tooltips = [];
    var anchor = [];
    var images = [];
    var image = undefined;

    for(var i = 0; i < indexJS.length; i++){
        image = indexJS[i];
        if(image.date.month === month && image.date.year === year) images.push(image);
    }
    images.sort(function(a,b){
        if(b.date.day - a.date.day !== 0) return b.date.day - a.date.day;
        else if(a.date.hour - b.date.hour !== 0) return a.date.hour - b.date.hour;
        else return a.date.minute - b.date.minute;
    })

    var day = images[0].date.day + 1;
    for (var i = 0; i < images.length; i++){
        image = images[i];
        if(day > image.date.day){
            day = image.date.day;
            var container = document.createElement('div');
            container.setAttribute('class', 'section');
            container.setAttribute('id', day.toString());
            fullpageDiv.append(container);
            tooltips.push(day.toString() + ". " + months[month - 1]);
            anchor.push(day.toString() + months[month - 1].toString())
        }
        $('#' + day.toString()).append("<a data-fancybox='gallery' href='images/" + image.file.toString() + "'><img src='thumbnails/" + image.file.toString() + "'></a>")
    }

    newFullpage(anchor, tooltips);
}


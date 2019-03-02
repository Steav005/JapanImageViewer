/* off-canvas sidebar toggle */
$('[data-toggle=offcanvas]').click(function() {
    $('.row-offcanvas').toggleClass('active');
    $('.collapse').toggleClass('in').toggleClass('hidden-xs').toggleClass('visible-xs');
});
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const Months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

let fp = undefined;
let indexJS = undefined;
let cookie = Cookies.get('month');
if(cookie !== undefined) {
    cookie = JSON.parse(cookie);
}

$.getJSON("data/index.json", function(data){
    indexJS = [];
    for(let i = 0; i < data.length; i++){
        const file = data[i];
        const nFile = {};
        nFile.file = file.file;
        nFile.date = {};
        const date = file['Date and Time'].split(' ')[0].split(':');
        const time = file['Date and Time'].split(' ')[1].split(':');
        nFile.date.year = date[0];
        nFile.date.month = date[1];
        nFile.date.day = date[2];
        nFile.date.hour = time[0];
        nFile.date.minute = time[1];
        nFile.date.second = time[2];
        indexJS.push(nFile);
    }

    if(cookie === undefined) setDefaultCookie();
    generateMenu(cookie.month, cookie.year);
    addPictures(cookie.month, cookie.year);
});

function changeMonth(month, year){
    cookie = {month: month.toString(), year: year.toString()};
    Cookies.set('month', cookie, {expires: 1});

    addPictures(cookie.month, cookie.year);
}

function setDefaultCookie(){
    let year = 1900;
    let month = 1;
    for(let i = 0; i < indexJS.length; i++){
        if(year < indexJS[i].date.year) {
            year = indexJS[i].date.year;
            month = indexJS[i].date.month;
        }else if(year === indexJS[i].date.year && month < indexJS[i].date.month){
            month = indexJS[i].date.month;
        }
    }
    cookie = {month: month, year: year};
    Cookies.set('month', {month: month, year: year}, {expires: 1});
}

function generateMenu(month, year){
    dates = [];
    for(i = 0; i < indexJS.length; i++){
        const textDate = indexJS[i].date.month.toString() + ":" + indexJS[i].date.year.toString();
        if(!dates.includes(textDate)) dates.push(textDate);
    }
    dates.sort(function(a, b) {
        const dateA = a.split(':');
        const dateB = b.split(':');
        if(dateB[0] !== dateA[0]) return dateB[0] - dateA[0];
        else return dateB[1] - dateA[1];
    });

    for(i = 0; i < dates.length; i++){
        const date = dates[i].split(':');
        $('#menu-content').append("<li onclick='changeMonth(" + date[0] + ", " + date[1] + ")'><a>" + Months[date[0] - 1] + " " + date[1] + "</a></li>")
    }
}

function newFullpage(anchor, tooltips){
    fp = new fullpage('#fullpage', {
        //options here
        anchors: anchor,
        navigationTooltips: tooltips,
        navigation: true,
        verticalCentered: true,
        navigationPosition: 'right',
        autoScrolling: false,
        fitToSection: false,
        licenseKey: 'OPEN-SOURCE-GPLV3-LICENSE',
        css3: true
    });
}

function clearFullpage(){
    var fullpageDiv = document.getElementById("fullpage");
    while(fullpageDiv.children.length > 0) fullpageDiv.removeChild(fullpageDiv.firstChild);
    if(fp !== undefined) fp.destroy();
}

function addPictures(month, year){
    clearFullpage();

    let fullpageDiv = document.getElementById("fullpage");
    const tooltips = [];
    const anchor = [];
    const images = [];
    let image = undefined;
    for(let i = 0; i < indexJS.length; i++){
        image = indexJS[i];
        if(image.date.month === month && image.date.year === year) images.push(image);
    }

    images.sort(function(a,b){
        if(b.date.day !== a.date.day) return b.date.day - a.date.day;
        else if(a.date.hour !== b.date.hour) return a.date.hour - b.date.hour;
        else if(a.date.minute !== b.date.minute) return a.date.minute - b.date.minute;
        else return a.date.second - b.date.second;
    });

    let day = images[0].date.day + 1;
    for (let i = 0; i < images.length; i++){
        image = images[i];
        if(day > image.date.day){
            day = image.date.day;
            const container = document.createElement('div');
            container.setAttribute('class', 'section fp-auto-height');
            container.setAttribute('id', day.toString());
            fullpageDiv.append(container);
            tooltips.push(day.toString() + ". " + months[month - 1]);
            anchor.push(day.toString() + months[month - 1].toString());
            $('#' + day.toString()).append("<h1 class='text-white'>" + day.toString() + "th " + months[month - 1].toString() + "</h1>")
        }
        $('#' + day.toString()).append("<a data-fancybox='gallery' href='data/images/" + image.file.toString() + "'><img src='data/thumbnails/" + image.file.toString() + "'></a>")
    }
    newFullpage(anchor, tooltips);
}


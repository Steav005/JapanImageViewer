$(document).ready(function() {
    $('[data-toggle=offcanvas]').click(function() {
        $('.row-offcanvas').toggleClass('active');
    });
});

fp = new fullpage('#fullpage', {
    //options here
    anchors: ['first', 'second'],
    autoScrolling:false,
    licenseKey: 'OPEN-SOURCE-GPLV3-LICENSE'
});
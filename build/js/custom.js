jQuery(document).ready(function () {
    dynamicCssVariables();
    toggleBootstrapTogglesOnHover();
    bootstrapFunctionalities();
    circleChartAndProgressBar();
    bootstrapCarousal();
    setInterval(function () { countDownDate(); }, 1000);
    listToggler();
    navbarToggler();
    formvalidation();
    AOS.init({
        duration: 1000,
    })

    jQuery(window).resize(function () {
        dynamicCssVariables();
    });

    $('input[type=radio][name=amount]').change(function () {
        $('#amountentered').val(this.value);
    });

    
    setTimeout(() => {
        addClassWhenSiteIsLoaded();
    }, 1800);

    $(window).on("load", function () {
        dynamicCssVariables();
        setTimeout(() => {
            addClassWhenSiteIsLoaded();
        }, 500);
    });
});


/***************************/
// dynamic css variables
function dynamicCssVariables() {
    var containerOffset = jQuery(".container").offset().left;
    var siteHeaderHeight = jQuery("#siteHeader").innerHeight();
    jQuery("body").css({
        "--containerOffset": containerOffset + "px",
        "--siteHeaderHeight": siteHeaderHeight + "px",
    });
}


/***************************/
// bootstrap functionalities
function bootstrapFunctionalities() {
    // enable tooltip
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
}

/***************************/
// general bootstrap togglers on hover
function toggleBootstrapTogglesOnHover() {
    // dropdown
    jQuery(".dropdown").hover(function (e) {
        jQuery(".dropdown").not(this).find(".dropdown-menu").removeClass("show");
    });
}

/***************************/
// check if element in viewport
function isScrolledIntoView(elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

/***************************/
// Percentage Circle
function circleChartAndProgressBar() {

    (function ($) {
        $.fn.extend({
            //pass the options variable to the function
            percentcircle: function (options) {
                //Set the default values, use comma to separate the settings, example:
                var defaults = {
                    animate: true,
                    diameter: 125,
                    guage: 5,
                    coverBg: '#fff',
                    bgColor: '#efefef',
                    fillColor: '#7bc5a2',
                    percentSize: '0px',
                    percentWeight: 'normal'
                },
                    styles = {
                        cirContainer: {
                            'width': defaults.diameter,
                            'height': defaults.diameter
                        },
                        cir: {
                            'position': 'relative',
                            'text-align': 'center',
                            'width': defaults.diameter,
                            'height': defaults.diameter,
                            'border-radius': '100%',
                            'background-color': defaults.bgColor,
                            'background-image': 'linear-gradient(91deg, transparent 50%, ' + defaults.bgColor + ' 50%), linear-gradient(90deg, ' + defaults.bgColor + ' 50%, transparent 50%)'
                        },
                        cirCover: {
                            'position': 'relative',
                            'top': defaults.guage,
                            'left': defaults.guage,
                            'text-align': 'center',
                            'width': defaults.diameter - (defaults.guage * 2),
                            'height': defaults.diameter - (defaults.guage * 2),
                            'border-radius': '100%',
                            'background-color': defaults.coverBg
                        },
                        percent: {
                            'display': 'block',
                            'width': defaults.diameter,
                            'height': defaults.diameter,
                            'line-height': defaults.diameter + 'px',
                            'vertical-align': 'middle',
                            'font-size': defaults.percentSize,
                            'font-weight': defaults.percentWeight,
                            'color': defaults.fillColor
                        }
                    };

                var that = this,
                    template = '<div><div class="ab"><div class="cir"><span class="perc">{{percentage}}</span></div></div></div>',
                    options = $.extend(defaults, options)

                function init() {
                    that.each(function () {
                        var $this = $(this),
                            //we need to check for a percent otherwise set to 0;
                            perc = Math.round($this.data('percent')), //get the percentage from the element
                            deg = perc * 3.6,
                            stop = options.animate ? 0 : deg,
                            $chart = $(template.replace('{{percentage}}', perc + '%'));
                        //set all of the css properties forthe chart
                        $chart.css(styles.cirContainer).find('.ab').css(styles.cir).find('.cir').css(styles.cirCover).find('.perc').css(styles.percent);

                        $this.append($chart); //add the chart back to the target element
                        setTimeout(function () {
                            animateWhenInView(deg, parseInt(stop), $chart.find('.ab')); //both values set to the same value to keep the function from looping and animating	
                        }, 250)
                    });
                }

                var animateWhenInView = function (stop, curr, $elm) {
                    $(window).on('scroll', function () {

                        if (isScrolledIntoView($elm)) {

                            function animateChart() {

                                var deg = curr;
                                if (curr <= stop) {
                                    if (deg >= 180) {
                                        $elm.css('background-image', 'linear-gradient(' + (90 + deg) + 'deg, transparent 50%, ' + options.fillColor + ' 50%),linear-gradient(90deg, ' + options.fillColor + ' 50%, transparent 50%)');
                                    } else {
                                        $elm.css('background-image', 'linear-gradient(' + (deg - 90) + 'deg, transparent 50%, ' + options.bgColor + ' 50%),linear-gradient(90deg, ' + options.fillColor + ' 50%, transparent 50%)');
                                    }
                                    curr++;
                                    setTimeout(function () {
                                        animateChart(stop, curr, $elm);
                                    }, 1);
                                }

                            };
                            animateChart();
                        }

                    });
                }

                init(); //kick off the goodness
            }
        });

    })(jQuery);

    $('.circle-chart').percentcircle({
        animate: true,
        diameter: 125,
        guage: 5,
        percentSize: '0px',
        coverBg: '#fff',
        bgColor: '#efefef',
        fillColor: '#7bc5a2',
    });

    // always show tooltip 
    $('.circle-chart,.progress-bar').tooltip({ placement: 'bottom', trigger: 'manual' }).tooltip('show');

    $(window).on('scroll', function () {

        if (isScrolledIntoView($('.progress-bar'))) {
            var progress = $('.progress-bar').attr('data-bs-original-title');
            $('.progress-bar').css('width', progress);
        }

    });
}


/***************************/
// countdown manager
function countDownDate() {

    var inputDate = jQuery("#countdown").attr("countdate");

    var endTime = new Date(inputDate);
    endTime = (Date.parse(endTime) / 1000);

    var now = new Date();
    now = (Date.parse(now) / 1000);

    var timeLeft = endTime - now;

    var days = Math.floor(timeLeft / 86400);
    var hours = Math.floor((timeLeft - (days * 86400)) / 3600);
    var minutes = Math.floor((timeLeft - (days * 86400) - (hours * 3600)) / 60);
    var seconds = Math.floor((timeLeft - (days * 86400) - (hours * 3600) - (minutes * 60)));

    if (hours < "10") { hours = "0" + hours; }
    if (minutes < "10") { minutes = "0" + minutes; }
    if (seconds < "10") { seconds = "0" + seconds; }

    $("#countdown").html(`<div>${days}<span>Days</span></div><div>${hours}<span>HR</span></div><div>
    ${minutes}<span>MIN</span></div><div> ${seconds}<span>SEC</span></div>`);
}


/***************************/
// customizing default bootstrap carousal
function bootstrapCarousal() {
    let items = document.querySelectorAll('.carousel .carousel-item')

    items.forEach((el) => {
        const minPerSlide = 4
        let next = el.nextElementSibling
        for (var i = 1; i < minPerSlide; i++) {
            if (!next) {
                // wrap carousel by using first child
                next = items[0]
            }
            let cloneChild = next.cloneNode(true)
            el.appendChild(cloneChild.children[0])
            next = next.nextElementSibling
        }
    })

}



/***************************/
//list toggler
function listToggler() {
    function chekIfSlidable() {
        $(".list-toggler").each(function () {
            if ($(this).hasClass("toggle-mobile")) {
                if ($(window).width() < 576) {
                    $(this).next("ul").hide();
                    $(this).addClass("slidable");
                } else {
                    $(this).next("ul").show();
                    $(this).removeClass("slidable");
                }
            } else if ($(this).hasClass("toggle-tab")) {
                if ($(window).width() < 767) {
                    $(this).next("ul").hide();
                    $(this).addClass("slidable");
                } else {
                    $(this).next("ul").show();
                    $(this).removeClass("slidable");
                }
            } else {
                if (!$(this).hasClass("active")) $(this).next("ul").hide();
                $(this).addClass("slidable");
            }
        });
    }
    chekIfSlidable();

    $(window).resize(function () {
        chekIfSlidable();
    });

    $(".list-toggler").click(function () {
        if ($(this).hasClass("slidable")) {
            $(this).toggleClass("active");
            $(this).next("ul").slideToggle();
        }
    });
}

/***************************/
// navbar toggle manager
function navbarToggler() {
    jQuery('.navbar-toggler').click(function () {
        jQuery('body').toggleClass('nav-open');
    })
}


/***************************/
// add class to body when the webpage is initially loaded
function addClassWhenSiteIsLoaded() {
    $("body").addClass('loaded');
}


/***************************/
// form validation
function formvalidation() {

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
}
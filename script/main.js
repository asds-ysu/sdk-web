if (typeof window.location.origin === "undefined"){
    window.location.origin = window.location.protocol + "//" + window.location.host;
}

$.ajaxSetup({
    contentType: "application/json; charset=utf-8"
});

var utils = {
    renderPageTemplate: function(templateId, data) {
        var _data = data || {};
        var templateScript = $(templateId).html();
        var template = Handlebars.compile(templateScript);

        $("#page-container").empty();
        $("#page-container").append(template(_data));
    },

    pageNotFoundError: function() {
        var data = {
            errorMessage: "404 - Page Not Found"
        };

        this.renderPageTemplate("#error-page-template", data);
    },

    fetch: function(url, data) {
        var _data = data || {};
        return $.ajax({
            context: this,
            url: window.location.origin + "/" + url,
            data: _data,
            method: "GET",
            dataType: "JSON"
        });
    }
};

var router = {
    routes: {},
    init: function() {
        console.log('router was created...');
        this.bindEvents();
        $(window).trigger("hashchange");
    },
    bindEvents: function() {
        $(window).on("hashchange", this.render.bind(this));
    },
    render: function() {
        var keyName = window.location.hash.split("/")[0];
        var url = window.location.hash;

        $("#page-container")
            .find(".active")
            .hide()
            .removeClass("active");

        if (this.routes[keyName]) {
            this.routes[keyName](url);
        } else {
            utils.pageNotFoundError();
        }
    }
};

var spaRoutes = {
    // Default route (home page)
    "": function(url) {
        console.log('home was called...');
        utils.renderPageTemplate("#home-page-template");
    },
    "#home": function(url) {
        console.log('home was called...');
        utils.renderPageTemplate("#home-page-template");
    },
    "#about": function(url) {
        console.log('about was called...');
        utils.renderPageTemplate("#about-page-template");
    },
    "#services": function(url) {
        console.log('services was called...');
        utils.renderPageTemplate("#services-page-template");
    }
};

// Create a new instance of the router
var spaRouter = $.extend({}, router, {
    routes: spaRoutes
});

spaRouter.init();
window.location.hash = "";

$(function() {
    $("#about").on("click", function() {
        var data = {
            action: "about_click",
            params: {}
        }
        sendRequest(data);
    });

    $("#home").on("click", function() {
        var data = {
            action: "home_click",
            params: {}
        }
        sendRequest(data);
    });

    $("#services").on("click", function() {
        var data = {
            action: "services_click",
            params: {}
        }
        sendRequest(data);
    });

    $(document).on('click', '.subscribe_btn', function()  { 
        var email = $(this).siblings('input[type=email]').val();
        var data = {
            action: "subscribe_btn_click",
            params: {
                param1: email
            }
        }
        sendRequest(data);
    });

    $(document).on('submit', '.quote', function(e) { 
        e.preventDefault();

        var name = $(this).find('input[name="name"]').val();
        var email = $(this).find('input[name="email"]').val();
        var msg = $(this).find('textarea[name="message"]').val();

        var data = {
            action: "quote_btn_click",
            params: {
                param1: name,
                param2: email,
                param3: msg
            }
        }
        sendRequest(data);
    });


    function sendRequest(data) {
        var request = {
            timestamp: new Date().getTime(),
            user_id: getGuid(),
            session_id: getGuid(),
            action: data.action,
            params: data.params,
            country: "AM",
            url: window.location.href
        }
        
        $.ajax({ 
            url: 'http://10.1.10.6:8125/upload',
            data: JSON.stringify(request),
            type: "post",
            contentType: "applicaiton/json",
            success: function(result) {
                console.log("success");
                console.log(result);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR)
            }
        });
    } 
 
});

function getGuid() {
    var nav = window.navigator;
    var screen = window.screen;
    var guid = nav.mimeTypes.length;

    guid += nav.userAgent.replace(/\D+/g, '');
    guid += nav.plugins.length;
    guid += screen.height || '';
    guid += screen.width || '';
    guid += screen.pixelDepth || '';

    return guid;
};

var A = function(){
    return {
        init: function(){
            $('#nav ul ul').hide();
            A.addListeners();
        },

        addListeners: function(){
            var thisLib = this;
            $('#nav').click(function(e){
                var target = $(e.target);
                var node = target.parent();
                $("#nav li.current-tab").removeClass('current-tab');
                if (target.is("a")){
                    var url = target.attr("href");
                    var subpage = url.match(/\/(\w+)$/)[1];
                    thisLib.loadTabbedSubpage(subpage, url);
                    node.addClass("current-tab");
                    return false;
                }
                else {
                     if (target.is("li"))
                        node = target;
                    node.next().slideToggle('normal');  //assume a ul after a li
                }
                
            });
        },
        
        loadTabbedSubpage: function(subpage, url){
            var thisLib = this;
            $.ajax({
                url: url+"/?xhr",
                type: 'GET',
                success: function(json){
                    thisLib.loadCSS("/media/stylesheets/"+subpage+".css");
                    $('#subpage').html(json);
                    thisLib.loadScript("/media/scripts/"+subpage+".js", function(){
                        A[subpage].init();
                    });
                    
                }
            });
        },
        
        loadCSS: function(stylesheet_location) {
            $("head").append("<link rel='stylesheet' type='text/css' href='" + stylesheet_location + "' />");
        },
        
        loadScript: function(script_src, callback) {
            var script = document.createElement("script");
            script.type = "text/javascript";

            if (script.readyState) {  //IE
                script.onreadystatechange = function() {
                    if (script.readyState == "loaded" || script.readyState == "complete") {
                        script.onreadystatechange = null;
                        if (callback) 
                            callback();
                    }
                };
            } else {  //Others
                script.onload = function() {
                    if (callback) 
                        callback();
                };
            }
                
            script.src = script_src;
            document.getElementsByTagName("head")[0].appendChild(script);
        },
        
        
    };
}();

function addCSRFtoken() {
    //add CSRF token for Django 1.2.5+ compatibility
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    $.ajaxSetup({
                beforeSend: function(xhr, settings) {
                    if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                        // Only send the token to relative URLs i.e. locally.
                        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
//                                $("#csrfmiddlewaretoken").val());
                    }
                }
            });
}

$(document).ready(function(){
    addCSRFtoken();
	A.init();
});

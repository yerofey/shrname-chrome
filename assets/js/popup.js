// @ts-nocheck
"use strict";

const el_error = $(".app .result .error"),
    el_form = $(".app .result .form"),
    el_form_copy = $(".app .result .form .button"),
    el_form_input = $(".app .result .form .input"),
    el_loading = $(".app .result .loading"),
    el_qr_a = $(".app .result .qr-image a"),
    el_qr_img = $(".app .result .qr-image img"),
	shrname = "https://shortly.pro/";

const App = {
    init: function (d) {
        el_form_input.attr("placeholder", App.langText("inputPlaceholder"));
    },
    inputCopyLink: function () {
        Func.copyToClipboard(el_form_input.value());
    },
    inputSelectLink: function () {
        el_form_input.select();
    },
    langText: function (d) {
        return chrome.i18n.getMessage("extension" + Func.capitalizeFirstLetter(d));
    },
    work: function (d) {
        let link = encodeURIComponent(d.url);
        if (link !== "https://shortly.pro/") {
            let b = new XMLHttpRequest();
            b.open("GET", shrname + "_/api/?app=aAMHu&url=" + link, true);
            b.onreadystatechange = function () {
                if (b.readyState === 4) {
                    DOM.hide(el_error);
                    DOM.hide(el_form);
                    DOM.hide(el_loading);
                    el_qr_a.attr("href", el_qr_img.get("%default"));
                    el_qr_img.attr("src", el_qr_img.get("%default"));
                    let c = JSON.parse(b.responseText);
                    if (typeof c.error === "undefined") {
                        el_form_input.value(c.result_url);
                        el_qr_a.attr("href", c.qr_url);
                        el_qr_img.attr("src", c.qr_url);
                        DOM.show(el_form);
                        App.inputSelectLink();
                    } else {
                        DOM.show(el_error);
                        el_error.html(App.langText("extensionError") + ": " + c.description);
                    }
                }
            };
            b.send();
        } else {
        }
    },
};

const DOM = {
    hide: function (d) {
        d.removeClass("_shown").addClass("_hidden");
    },
    show: function (d) {
        d.removeClass("_hidden").addClass("_shown");
    },
};

const Func = {
    capitalizeFirstLetter: function (d) {
        return d.charAt(0).toUpperCase() + d.slice(1);
    },
    copyToClipboard: function (d) {
        let a = document.createElement("input");
        a.style.position = "fixed";
        a.style.opacity = "0";
        a.value = d;
        document.body.appendChild(a);
        a.select();
        document.execCommand("Copy");
        document.body.removeChild(a);
    },
};

(function () {
    App.init();
    chrome.tabs.getSelected(null, function (d) {
        App.work(d);
    });
    el_form_copy.on("click", function () {
        App.inputCopyLink();
    });
    el_form_input.on("focus", function () {
        App.inputSelectLink();
    });
})();

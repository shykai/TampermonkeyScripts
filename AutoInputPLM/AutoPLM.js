// ==UserScript==
// @name         PLM日报自动填写时间和类型
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://183.62.9.179:28080/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function () {
        const story_div = document.querySelector('body');
        if (story_div)
        {
            const callback = function(mutationsList, observer) {
                for(let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        var doa = document.querySelectorAll('iframe[name*=extcomp]')
                        doa.forEach(function(e){
                            e.onload = function(){
                                if (e.contentWindow.document.head.querySelector('title').innerText == "新建花费时间")
                                {
                                    e.contentWindow.document.querySelector('select[name=type]').value=2;
                                    e.contentWindow.document.querySelector('input[name=hour]').value='8h';
                                }
                            };
                        })
                        break;
                    }
                }
            };
            const config = { attributes: false, childList: true, subtree: false };
            const observer = new MutationObserver(callback);
            observer.observe(story_div, config);
            //observer.disconnect();
        }
    };

})();
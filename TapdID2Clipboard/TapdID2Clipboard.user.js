// ==UserScript==
// @name         TapdID2Clipboard
// @version      0.4
// @description  快速复制粘贴Tapd的ID至剪切板
// @author       shykai
// @match        *://www.tapd.cn/*
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';

    function insertAfter(newEl, targetEl) {
        var parentEl = targetEl.parentNode;
        if (parentEl.lastChild == targetEl) {
            parentEl.appendChild(newEl);
        } else {
            parentEl.insertBefore(newEl, targetEl.nextSibling);
        }
    }

    var STATUS_COLOR_MAP = {
        NORMAL: "#bfbfbf",
        HOVER: "#8a8a8a",
        SUCCESS: "#1296db",
        FAIL: "#d81e06",
    };
    function addClipIco(ico, value) {
        var containerEle = document.createElement("span");
        containerEle.setAttribute("title", value);

        var svg = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );

        var path = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );
        svg.style.width = "15px";
        svg.style.padding = "0 2px";
        svg.style.cursor = "pointer";

        svg.setAttribute("viewBox", "0 0 1024 1024");
        svg.setAttribute("version", "1.1");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        path.setAttribute(
            "d",
            "M877.714286 0H265.142857c-5.028571 0-9.142857 4.114286-9.142857 9.142857v64c0 5.028571 4.114286 9.142857 9.142857 9.142857h566.857143v786.285715c0 5.028571 4.114286 9.142857 9.142857 9.142857h64c5.028571 0 9.142857-4.114286 9.142857-9.142857V36.571429c0-20.228571-16.342857-36.571429-36.571428-36.571429zM731.428571 146.285714H146.285714c-20.228571 0-36.571429 16.342857-36.571428 36.571429v606.514286c0 9.714286 3.885714 18.971429 10.742857 25.828571l198.057143 198.057143c2.514286 2.514286 5.371429 4.571429 8.457143 6.285714v2.171429h4.8c4 1.485714 8.228571 2.285714 12.571428 2.285714H731.428571c20.228571 0 36.571429-16.342857 36.571429-36.571429V182.857143c0-20.228571-16.342857-36.571429-36.571429-36.571429zM326.857143 905.371429L228.457143 806.857143H326.857143v98.514286zM685.714286 941.714286H400V779.428571c0-25.257143-20.457143-45.714286-45.714286-45.714285H192V228.571429h493.714286v713.142857z"
        );
        path.setAttribute("fill", STATUS_COLOR_MAP.NORMAL);
        svg.appendChild(path);

        svg.addEventListener("mouseenter", function () {
            path.setAttribute("fill", STATUS_COLOR_MAP.HOVER);
        });
        svg.addEventListener("mouseleave", function () {
            path.setAttribute("fill", STATUS_COLOR_MAP.NORMAL);
        });

        svg.addEventListener("click", function (e) {
            e.stopPropagation();
            GM_setClipboard(value);
            path.setAttribute("fill", STATUS_COLOR_MAP.SUCCESS);
        });

        containerEle.appendChild(svg);

        insertAfter(containerEle, ico);
    }

    function queryId(tr) {
        if (tr.hasAttribute('bug_id'))
        {
            return tr.getAttribute('bug_id').slice(-7);
        }
        if (tr.hasAttribute('story_id'))
        {
            return tr.getAttribute('story_id').slice(-7);
        }
        if (tr.hasAttribute('task_id'))
        {
            return tr.getAttribute('task_id').slice(-7);
        }
        if (tr.hasAttribute('id'))
        {
            return tr.getAttribute('id').slice(-7);
        }
        return "";
    }

    function doIcos(tr, icoDesc){
        var icos = tr.querySelectorAll(icoDesc);
        icos.forEach(function(ico){
            addClipIco(ico, "ID"+queryId(tr));
        })
    }
    
    function addIcoClickToCopyID(tr) {
        doIcos(tr, ".ico-bug");
        doIcos(tr, ".ico-story-child");
        doIcos(tr, ".ico-task");
        doIcos(tr, ".tag_task");
        doIcos(tr, ".workitem-icon");
    }

    function doObserverAsyncTab(tab) {
        if (tab)
        {
            const callback = function(mutationsList, observer) {
                for(let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        tab.querySelectorAll("tr[class*=row]").forEach(function (tr) {addIcoClickToCopyID(tr);});
                        tab.querySelectorAll("tr[class='']").forEach(function (tr) {addIcoClickToCopyID(tr);});
                        break;
                    }
                }
            };
            const config = { attributes: false, childList: true, subtree: false };
            const observer = new MutationObserver(callback);
            observer.observe(tab, config);
            //observer.disconnect();
        }
    }

    window.onload = function () {
        document.querySelectorAll("tr[class*=row]")
            .forEach(function(tr){
            addIcoClickToCopyID(tr);
        });

        doObserverAsyncTab(document.getElementById('div_subcontent_TrackingMemberTask'));
        doObserverAsyncTab(document.getElementById('div_subcontent_StoryandTask'));
        doObserverAsyncTab(document.getElementById('div_subcontent_Bugs'));
        doObserverAsyncTab(document.getElementById('tab-bug-div'));


    }
})();

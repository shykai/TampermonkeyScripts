// ==UserScript==
// @name         Tapd2Mantis
// @version      0.2
// @description  关联Tapd的缺陷至Mantis上
// @author       Shykai
// @match        *://www.tapd.cn/*
// @grant        GM_xmlhttpRequest
// @connect      mantis.xunmei.com
// ==/UserScript==
'use strict';
(function () {
    function insertBefore(newEl, targetEl) {
        targetEl.parentNode.insertBefore(newEl, targetEl);
    };

    function doTrs(tr) {
        var bugs = tr.querySelectorAll(".growing-title-inner");
        bugs.forEach(function (div){
            var bugName = div.querySelector("a[href]");
            const tkl = bugName.text.match(/(#)([0-9]{2,})/);
            if (tkl && tkl.length > 0)
            {
                var realname = bugName.text.replace(tkl[0], "");
                bugName.text = realname;
                var containerEle = document.createElement("a");
                containerEle.text=containerEle.title=tkl[0];
                containerEle.href="http://mantis.xunmei.com/view.php?id="+tkl[2];
                containerEle.className=bugName.className;
                insertBefore(containerEle,bugName)
                GM_xmlhttpRequest({
                    method: "GET",
                    url: containerEle.href,
                    onload: function(response) {
                        if (response.status == 200)
                        {
                            var el = new DOMParser().parseFromString(response.responseText, "text/html");
                            var mantisStatus = el.getElementsByClassName('bug-status')[1].innerText;
                            containerEle.text = "#"+mantisStatus;
                            var tapdStatus = tr.className;
                            if (mantisStatus.trim() == "已解决" || mantisStatus.trim() == "已关闭")
                            {
                                if (/rowNOTdone/.test(tapdStatus)) containerEle.style.color="red";
                            }
                            else
                            {
                                if (/rowdone/.test(tapdStatus)) containerEle.style.color="red";
                            }
                        }
                    }
                });
            }
        })
    }
    window.onload = function () {
        document
            .querySelectorAll("#bug_list_content > tbody > tr")
            .forEach(function (tr) {
            doTrs(tr)
        });

        document
            .querySelectorAll("#bugquery_table > tbody > tr")
            .forEach(function (tr) {
            doTrs(tr)
        });

        document
            .querySelectorAll("#story_list_content > tbody > tr")
            .forEach(function (tr) {
            doTrs(tr)
        });


        const subcontent_TrackingMemberTask = document.getElementById('div_subcontent_TrackingMemberTask');
        if (subcontent_TrackingMemberTask)
        {
            const callback = function(mutationsList, observer) {
                // Use traditional 'for loops' for IE 11
                for(let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        document.querySelectorAll("tr[type=bug]").forEach(function (tr) {doTrs(tr);});
                        break;
                    }
                }
            };
            const config = { attributes: false, childList: true, subtree: false };
            const observer = new MutationObserver(callback);
            observer.observe(subcontent_TrackingMemberTask, config);
            //observer.disconnect();
        }

        const subcontent_Bugs = document.getElementById('div_subcontent_Bugs');
        if (subcontent_Bugs)
        {
            const callback = function(mutationsList, observer) {
                for(let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        document.querySelectorAll("#bugs-list-tbody > tr").forEach(function (tr) {doTrs(tr);});
                        break;
                    }
                }
            };
            const config = { attributes: false, childList: true, subtree: false };
            const observer = new MutationObserver(callback);
            observer.observe(subcontent_Bugs, config);
            //observer.disconnect();
        }

        const bug_div = document.getElementById('tab-bug-div');
        if (bug_div)
        {
            const callback = function(mutationsList, observer) {
                for(let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        document.querySelectorAll("#bugs-list-tbody > tr").forEach(function (tr) {doTrs(tr);});
                        break;
                    }
                }
            };
            const config = { attributes: false, childList: true, subtree: false };
            const observer = new MutationObserver(callback);
            observer.observe(bug_div, config);
            //observer.disconnect();
        }

        const story_div = document.getElementById('div_subcontent_StoryandTask');
        if (story_div)
        {
            const callback = function(mutationsList, observer) {
                for(let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        document.querySelectorAll("#stories_tasks_content > tbody > tr").forEach(function (tr) {doTrs(tr);});
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
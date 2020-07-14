// ==UserScript==
// @name         Tapd2Mantis
// @version      0.1
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
            var bugName = div.querySelector("a");
            const tkl = bugName.text.match(/(#)([0-9]{4})/);
            if (tkl && tkl.length > 0)
            {
                var realname = bugName.text.replace(tkl[0], "");
                div.querySelector("a").text = realname;
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
                                if (tapdStatus == "rowNOTdone") containerEle.style.color="red";
                            }
                            else
                            {
                                if (tapdStatus == "rowdone") containerEle.style.color="red";
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

        // 选择需要观察变动的节点
        const subcontent_TrackingMemberTask = document.getElementById('div_subcontent_TrackingMemberTask');
        if (subcontent_TrackingMemberTask)
        {
            // 当观察到变动时执行的回调函数
            const callback = function(mutationsList, observer) {
                // Use traditional 'for loops' for IE 11
                for(let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        document.querySelectorAll("tr[type=bug]").forEach(function (tr) {doTrs(tr);});
                        break;
                    }
                }
            };
            // 观察器的配置（需要观察什么变动）
            const config = { attributes: false, childList: true, subtree: false };
            // 创建一个观察器实例并传入回调函数
            const observer = new MutationObserver(callback);
            // 以上述配置开始观察目标节点
            observer.observe(subcontent_TrackingMemberTask, config);
            // 之后，可停止观察
            //observer.disconnect();
        }

        // 选择需要观察变动的节点
        const subcontent_Bugs = document.getElementById('div_subcontent_Bugs');
        if (subcontent_Bugs)
        {
            // 当观察到变动时执行的回调函数
            const callback = function(mutationsList, observer) {
                // Use traditional 'for loops' for IE 11
                for(let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        document.querySelectorAll("#bugs-list-tbody > tr").forEach(function (tr) {doTrs(tr);});
                        break;
                    }
                }
            };
            // 观察器的配置（需要观察什么变动）
            const config = { attributes: false, childList: true, subtree: false };
            // 创建一个观察器实例并传入回调函数
            const observer = new MutationObserver(callback);
            // 以上述配置开始观察目标节点
            observer.observe(subcontent_Bugs, config);
            // 之后，可停止观察
            //observer.disconnect();
        }

        // 选择需要观察变动的节点
        const bug_div = document.getElementById('tab-bug-div');
        if (bug_div)
        {
            // 当观察到变动时执行的回调函数
            const callback = function(mutationsList, observer) {
                // Use traditional 'for loops' for IE 11
                for(let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        document.querySelectorAll("#bugs-list-tbody > tr").forEach(function (tr) {doTrs(tr);});
                        break;
                    }
                }
            };
            // 观察器的配置（需要观察什么变动）
            const config = { attributes: false, childList: true, subtree: false };
            // 创建一个观察器实例并传入回调函数
            const observer = new MutationObserver(callback);
            // 以上述配置开始观察目标节点
            observer.observe(bug_div, config);
            // 之后，可停止观察
            //observer.disconnect();
        }

    };
})();
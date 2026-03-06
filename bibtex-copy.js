// ==UserScript==
// @name         Google Scholar Copy BibTeX
// @namespace    blog.icespite.top
// @version      1.0.0
// @description  点击 BibTeX 链接时直接复制到剪贴板
// @author       IceSpite
// @match        https://scholar.google.com/scholar*
// @match        https://scholar.google.com.hk/scholar*
// @connect      scholar.googleusercontent.com
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @license MIT
// ==/UserScript==

(function () {
    'use strict';

    const SHOW_NOTIFICATION = true;

    function notify(msg, x, y) {
        if (!SHOW_NOTIFICATION) return;

        const div = document.createElement("div");
        div.textContent = msg;

        div.style.position = "fixed";
        div.style.left = x + "px";
        div.style.top = y + "px";
        div.style.transform = "translate(10px,10px)";
        div.style.background = "rgba(50,50,50,0.9)";
        div.style.color = "#fff";
        div.style.padding = "6px 10px";
        div.style.borderRadius = "6px";
        div.style.fontSize = "13px";
        div.style.zIndex = 9999;
        div.style.pointerEvents = "none";
        div.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
        div.style.transition = "opacity 0.3s";

        document.body.appendChild(div);

        setTimeout(() => {
            div.style.opacity = "0";
            setTimeout(() => div.remove(), 300);
        }, 1000);
    }

    function copyBibtex(url, x, y) {

        GM_xmlhttpRequest({
            method: "GET",
            url: url,

            onload: function (res) {

                if (res.status !== 200) {
                    notify("BibTeX 获取失败", x, y);
                    return;
                }

                GM_setClipboard(res.responseText, "text");
                notify("BibTeX 已复制", x, y);
            },

            onerror: function () {
                notify("请求失败", x, y);
            }
        });
    }

    function handleClick(e) {

        const link = e.target.closest("a.gs_nta.gs_nph");

        if (!link) return;

        if (link.classList.length !== 2) return;

        e.preventDefault();

        const x = e.clientX;
        const y = e.clientY;

        copyBibtex(link.href, x, y);
    }

    document.addEventListener("click", handleClick, true);

})();

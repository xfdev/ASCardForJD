// ==UserScript==
// @name         ASCardForJD
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  try to take over the world!
// @author       You
// @match        https://card.jd.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var orderinfo = document.getElementById('orderinfo');
    if (orderinfo) {
        // 创建文本框
        var textarea = document.createElement('textarea');
        textarea.className = document.getElementById('orderinfo').className;
        textarea.style.margin = "0px 0px 10px";
        textarea.style.width = "370px";
        textarea.style.height = "100px";
        orderinfo.parentNode.insertBefore(textarea, orderinfo);

        var copyLabel = document.createElement('p');
        copyLabel.style.color = 'red';
        textarea.parentNode.insertBefore(copyLabel, textarea);

        // 获取订单信息
        var table = orderinfo.getElementsByTagName("tbody");
        // 商品编号
        var num = table[1].rows[1].cells[0].innerHTML;
        num = num.replace(/\s+/g,"");// 去除空格
        var money = "0";
        if (num == "11170365589") {money = "50"}
        if (num == "11183343342") {money = "100"}
        if (num == "11183368356") {money = "200"}
        if (num == "11183445154") {money = "500"}
        if (num == "13138170874") {money = "1000"}

        // 处理表格
        var spans = table[0].getElementsByTagName("span");
        var string = "";
        for (var i = 0; i < spans.length; i++) {
            var card = spans[i].innerHTML;
            var pswd = spans[i+1].innerHTML;
            string = string + card + " " + pswd + " " + money + "\n";
            i++;
        }
        textarea.value = string;
        textarea.select();
        navigator.clipboard.writeText(string)
            .then(() => {
            copyLabel.innerText = "卡密已复制到粘贴板";
        })
            .catch(err => {
            // 如果用户没有授权，则抛出异常
            // console.error('无法复制内容：', err);
            copyLabel.innerText = "无法复制内容：" + err;
        });
    }
})();
// ==UserScript==
// @name         考拉自动提交-订单确认页
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://buy.kaola.com/order/confirm.html?from=detailfp
// @match        https://buy.kaola.com/virtualOrder/confirm.html
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
	// 屏蔽错误日志 -url:https://analytics.163.com/ntes -url:https://rev.da.netease.com/
    // 金额元素
	var moneyLabel = document.getElementsByClassName("j-total")[0];
	moneyLabel.addEventListener('DOMNodeInserted', function(e) {
		var ttboxDiv = document.getElementsByClassName("ttbox")[0];
		// 面值
        var parValue = ttboxDiv.getElementsByTagName("b")[0].innerText;
        // 数量
        var num = ttboxDiv.getElementsByTagName("b")[1].innerText;
        // 金额
        var money = document.getElementsByClassName("j-total")[0].innerText;
        if (money <= parValue*num*0.9) {
        	// 提交
        	document.getElementById("submitbtn").click();
        	console.log("已提交");
        } else {
        	console.log("没打折，去刷新："+money);
            //setTimeout('window.location.reload()', 500);
            window.location.reload();
        }
    });
    console.log("已绑定");
})();

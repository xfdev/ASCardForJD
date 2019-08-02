// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://goods.kaola.com/product/5286007.html*
// @match        https://goods.kaola.com/product/5286150.html*
// @match        https://goods.kaola.com/product/5287147.html*
// @match        https://goods.kaola.com/product/5287149.html*
// @match        https://goods.kaola.com/product/5288081.html*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.onload=function(){
        // 判断售价
        var currentPrice = document.getElementsByClassName("PInfo_r currentPrice")[0];
        var money = currentPrice.getElementsByTagName("span")[0].innerText;

        // 面值
        var parValue = document.getElementsByClassName("selectedLi")[0].innerText;
        if (money <= parValue*0.9) {
        	// 获取限购数量
        	var maxText = document.getElementById('js_dometxt').innerText;
			var length = maxText.length;
			var maxNum = maxText.substring(4,length-1);
			for (var i = 1; i < maxNum; i++) {
				// 点击加号，购买最大量
				document.getElementsByClassName("ctrnum-b ctrnum-b-ad icon-plus")[0].click();
			}
			// 立即购买
        	document.getElementById('buyBtn').click();
        } else {
        	document.getElementById('buyBtn').innerText = "目前无折扣";
        }
    }
})();
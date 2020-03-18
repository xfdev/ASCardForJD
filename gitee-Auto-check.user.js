// ==UserScript==
// @name         gitee 账号测试
// @namespace    https://gitee.com/*
// @version      0.0.2
// @description  try to take over the world!
// @author       xfdev
// @match        https://gitee.com/
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// ==/UserScript==

(function() {
	'use strict';

	// Your code here...
	var str = "abcdefghijklmnopqrstuvwxyz";
	var arr = str.split("");
	var i = 8;
	var j = 22;
	var k = 21;

	var count = 0;
	var unregister = "";
	// var checkInterval = setInterval(fr_check, 3500);
	fr_check();

	function fr_check() {

		var valI = arr[i];
		var valJ = arr[j];
		var valK = arr[k];
		var val = valI + valJ + valK;
		var data = "do=user_username&val=" + val;

		GM_xmlhttpRequest({
			method: "POST",
			url: "https://gitee.com/check",
			data: data,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			onload: function(res) {
				if (res.status == 200) {
					if (res.responseText == 1) {
						console.log("ijk = " + i + "," + j + "," + k + " ========== 成功 ========== " + count + ", val = "+val);
						unregister = unregister + count + ":" + val + "    ";
						count++;
						if (count%20 == 0) {
							console.log(unregister);
						}
					} else {
						console.log("ijk = " + i + "," + j + "," + k + ",res = " + res.responseText + " : " + val);
					}

					var arrLength = arr.length - 1;
					if (k < arrLength) {
						k++;
					} else {
						k = 0;
						if (j < arrLength) {
							j++;
						} else {
							j = 0;
							if (i < arrLength) {
								i++;
							} else {
								console.log("循环完成");
								return;
							}
						}
					}

					setTimeout(fr_check, 2200);
				}
			}
		});
	}

})();
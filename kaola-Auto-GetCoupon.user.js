// ==UserScript==
// @name         考拉 - 定时自动抢券
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  19-10-23 考拉活动
// @author       You
// @match        https://pages.kaola.com/pages/activity/ae7390ccf3394b72b99fd6487fd14113.shtml*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @run-at       document-end
// ==/UserScript==

(function() {
	'use strict';

	// 修改token
	var token = "9ca17ae2e6ffcda170e2e6eea3b362bbecbab3d75fe9ef8ab3c14a828a9babee3e87968ebad169fbada1bae52af0feaec3b92aa389c0b9c169a19aa28dd05f869b9bb3c55b8febe1b3d95a9bb200dadb258b99ee9e";

	let date;
	let hours;
	let minutes;
	let seconds;
	let milliseconds;
	setInterval(() => {
		date = new Date();
		hours = date.getHours();
		minutes = date.getMinutes();
		seconds = date.getSeconds();
		milliseconds = date.getMilliseconds();
		if (hours == 10 || hours == 14 || hours == 22) {
			if (minutes == 0 && seconds < 1) {
				// 10:00:01:500 之前
				if (milliseconds < 300) {
					fr_requestRedeemCode();
				}
			}
		} else if (hours == 9 || hours == 13 || hours == 21) {
			if (minutes == 59 && seconds == 59 && milliseconds > 200) {
				fr_requestRedeemCode();
			}
		}

	}, 100);

	function fr_requestRedeemCode() {

		var couponURL = "https://pages.kaola.com/pages/coupon/h5/exchange.html?hcAntiCheatToken=";
		var activityId = "&hcAntiCheatActivityId=pages_activity_coupon&userEnv=H5&redeemCode=";

		var codeURL = "https://pages.kaola.com/pages/region/advance/ae7390ccf3394b72b99fd6487fd14113.html?type=1";

		GM_xmlhttpRequest({
			method: "GET",
			url: codeURL,
			onload: function(res) {
				if (res.status == 200) {

					var jsonObj = JSON.parse(res.responseText);
					var array = jsonObj.data[1].businessObj.content.settings;
					// console.log(array);
					for (var i = 0; i < array.length; i++) {
						var redeemCode = array[i].redeemCode;
						var s = couponURL + token + activityId + redeemCode;
						fr_requestCoupon(s, i);
						console.log("请求券" + i + " = " + s);
					}
				}
			}
		});
	}

	function fr_requestCoupon(couponURL, index) {
		GM_xmlhttpRequest({
			method: "GET",
			url: couponURL,
			onload: function(res) {
				if (res.status == 200) {

					var resJsonObj = JSON.parse(res.responseText);
					console.log("返回券" + index + " = ");
					console.log(resJsonObj);
				}
			}
		});
	}

})();
// ==UserScript==
// @name         考拉5 - 抢苹果卡券
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://pages.kaola.com/pages/activity/ae7390ccf3394b72b99fd6487fd14113.shtml*
// @grant        none
// ==/UserScript==

(function() {
	'use strict';

	// Your code here...
	var title = 5;
	// 新建定时器
	var couponArray;
	var checkViewInterval = setInterval(checkView, 100);
	var cancelClickTimeout;
	var autoClickInterval;
	var arrLength = 0;

	setTimeout(cancelCheckView, 7000);

	function checkView() {
		couponArray = document.getElementsByClassName('hotarea c-hotarea');

		if (couponArray.length) {
			autoClick(); // 先立即执行一次
			autoClickInterval = setInterval(autoClick, 240);
			cancelClickTimeout = setTimeout(cancelClick, 3000);

			console.log('couponArray length =', couponArray.length);
			clearInterval(checkViewInterval);

		} else {
			console.log('券 array is nil');
		}
	}

	function cancelCheckView() {
		clearInterval(checkViewInterval);
		console.log('取消获取 view');
	}

	function cancelClick() {
		clearInterval(autoClickInterval);
		console.log('取消自动点击');
		// window.location.reload();
	}

	function autoClick() {

		var coupon = couponArray[title-1];
		// 获取到对象，做点击判断
		var stamp = coupon.getElementsByClassName('stamp');
		if (stamp.length == 1) {
			console.log('coupon', title, '有邮戳。。。');
		} else {
			console.log('coupon', title, '执行点击。。。');
			coupon.click();
		}
	}
})();
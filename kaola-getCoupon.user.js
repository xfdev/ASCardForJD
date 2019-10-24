// ==UserScript==
// @name         考拉 - 抢苹果卡券
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
	// 新建定时器
	var quanArray;
	var getViewTime = setInterval(checkView, 100);
	var autoCancel = setTimeout(cancelTime, 5000);
	var autoClickTime;
	var arrLength = 0;

	function checkView() {
		quanArray = document.getElementsByClassName('hotarea c-hotarea');

		if (quanArray.length) {
			console.log('quanArray =', quanArray);
			console.log('取消循环');
			clearInterval(getViewTime);

			arrLength = quanArray.length;
			// autoClick(); // 先立即执行一次
			autoClickTime = setInterval(autoClick, 330);
		} else {
			console.log('quan array is nil');
		}
	}

	function cancelTime() {
		// body...
		clearInterval(getViewTime);
		console.log('自动取消定时器');
		window.location.reload();
	}

	function autoClick() {
		var i = arrLength - 1;
		var quan = quanArray[i];
		console.log('quan item = ', quan);
		// 获取到对象，做点击判断
		var stamp = quan.getElementsByClassName('stamp');
		if (stamp.length == 1) {
			console.log('有邮戳。。。');
		} else {
			console.log('无邮戳，执行点击');
			quan.click();
		}
		arrLength--;
		if (arrLength == 0) {
			clearInterval(autoClickTime);
			console.log('arrLength = 0, 取消自动点击');
		}
	}
})();
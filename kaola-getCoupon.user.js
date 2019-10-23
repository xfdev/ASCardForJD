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
	var getViewTime = setInterval(checkView, 100);
	var autoCancel = setTimeout(cancelTime, 10000);

	function checkView() {
		var quanArray = document.getElementsByClassName('hotarea c-hotarea');
		console.log('quanArray =', quanArray);

		if (quanArray.length) {
			console.log('取消循环');
			clearInterval(getViewTime);

			for (var i = 0; i < quanArray.length; i++) {
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
			}
		} else {
			console.log('quan array is nil');
		}
	}

	function cancelTime() {
		// body...
		clearInterval(getViewTime);
		console.log('自动取消定时器');
	}
})();
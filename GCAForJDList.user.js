// ==UserScript==
// @name         GCAForJDList
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://order.jd.com/center/list.action?t=34-62&d=1&s=4096
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      card.jd.com
// ==/UserScript==

(function() {
	'use strict';

    // 必须等页面渲染完成后执行
    window.onload=function(){
        // Your code here...
        var orderTb = document.getElementsByClassName("td-void order-tb");
        if (orderTb) {
        	var tbodys = orderTb[0].tBodies;
        	for (var i = 0; i < tbodys.length; i++) {

        		var body = tbodys[i];
        		var orderid = body.id;
        		orderid = orderid.substring(3);

                var div = document.createElement("div");

        		var title = body.getElementsByClassName("p-extra")[0];// title 下面的div
        		var titleParentNode = title.parentNode;
        		// 在title下面的div之前插入创建的div
        		titleParentNode.insertBefore(div, title);

                // 获取商品标题
                var moneyTitle = body.getElementsByClassName("a-link")[0].text;
                var money = moneyTitle.match("[0-9]+")[0];
                // 创建文本框
                var textarea = document.createElement('textarea');
                textarea.style.margin = "0px 0px 10px";
                textarea.style.width = "325px";
                textarea.style.height = "70px";
                textarea.style.overflowY = "auto";
                textarea.id = "fr_textarea-" + orderid;
                textarea.placeholder = money;
                div.appendChild(textarea);

                // 复制按钮
                var copyBtn = document.createElement('button');
                copyBtn.style.margin = "0px 10px 0px";
                copyBtn.style.width = "60px";
                copyBtn.style.height = "21px";
                copyBtn.innerHTML = "复制卡密";
                copyBtn.onclick = fr_clickCopy;
                copyBtn.id = "fr_copyBtn-" + orderid;
                div.appendChild(copyBtn);

                var requestBtn = document.createElement('button');
                requestBtn.style.margin = "0px 10px 0px";
                requestBtn.style.width = "60px";
                requestBtn.style.height = "21px";
                requestBtn.innerHTML = "请求卡密";
                requestBtn.id = "fr_requestBtn-" + orderid;
                requestBtn.onclick = fr_clickRequest;
                div.appendChild(requestBtn);
            }
        }
    }

    function fr_clickCopy() {
        var orderid = this.id.substring(11);
        var textareaId = "fr_textarea-" + orderid;
        var textarea = document.getElementById(textareaId);
        textarea.select();
        var string = textarea.value;
        navigator.clipboard.writeText(string)
        .then(() => {
            this.innerText = "已复制";
        })
        .catch(err => {
            // 如果用户没有授权，则抛出异常
            // console.error('无法复制内容：', err);
            this.innerText = "无法复制内容：" + err;
        });
    }

    function fr_clickRequest() {
        // https://card.jd.com/order/order_detail.action?orderId=
        this.innerHTML = "请求中...";
        var orderid = this.id.substring(14);
        var textarea = document.getElementById("fr_textarea-" + orderid);
        var money = textarea.placeholder;
        var url = "https://card.jd.com/order/order_detail.action?orderId=" + orderid;
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(res) {
                if (res.status == 200) {
                    this.innerHTML = "请求成功";
                    var regex = new RegExp("(?<=copyToClipboard\\(\\').*(?=\\'\\);)", "g");// 这里要用双反斜杠，要不然会直接过滤掉不被正则接收
                    var htmlText = res.responseText;
                    var arr = htmlText.match(regex);
                    var string = "";
                    for (var i = 0; i < arr.length; i++) {
                        var card = arr[i];
                        var pswd = arr[i+1];
                        string = string + card + " " + pswd + " " + money + "\n";
                        i++;
                    }
                    textarea.value = string;
                    var copyBtn = document.getElementById("fr_copyBtn-" + orderid);
                    copyBtn.click();
                }
            }
        });
    }
})();
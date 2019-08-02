(function() {
	'use strict';

    // Your code here...
    // 必须等页面渲染完成后执行
    window.onload=function(){
    	var orderTbs = document.getElementsByClassName("myOdr_tb1");
    	for (var i = 0; i < orderTbs.length; i++) {
    		var table = orderTbs[i];
    		var gorderIdText = table.getElementsByClassName("gorderId")[0].innerText;
    		var orderid = gorderIdText.substring(4);

    		// 创建三个控件的div
    		var div = document.createElement("div");  

    		var sku_mod = table.getElementsByClassName("sku_mod")[0];// title 下面的div
    		var titleParentNode = sku_mod.parentNode;
        	// 在title下面的div之前插入创建的div
        	titleParentNode.insertBefore(div, sku_mod);

        	// 面值
        	var parValue = sku_mod.innerText;

        	// 创建文本框
        	var textarea = document.createElement('textarea');
        	textarea.style.margin = "0px 0px 10px";
        	textarea.style.width = "300px";
        	textarea.style.height = "80px";
        	textarea.style.fontSize = "10px";
        	textarea.style.overflowY = "auto";
        	textarea.id = "fr_textarea-" + orderid;
        	textarea.placeholder = parValue;
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
    	// https://buy.kaola.com/rechargeantis/needverify.html?orderId=xxxxxx
        this.innerHTML = "请求中...";
        var orderid = this.id.substring(14);
        var textarea = document.getElementById("fr_textarea-" + orderid);
        var money = textarea.placeholder;
        var url = "https://buy.kaola.com/rechargeantis/needverify.html?orderId=" + orderid;
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(res) {
                if (res.status == 200) {
                	document.getElementById("fr_requestBtn-" + orderid).innerHTML = "请求成功";

                    var jsonObj = JSON.parse(res.responseText);
                    var arr = jsonObj.kamiList;
                    var string = "";
                    for (var i = 0; i < arr.length; i++) {
                    	var card = arr[i];
                    	var cardNo = card.appStoreNo;
                    	var cardPSWD = card.appStoreCode;
                        string = string + cardNo + " " + cardPSWD + " " + money + "\n";
                    }
                    textarea.value = string;
                    var copyBtn = document.getElementById("fr_copyBtn-" + orderid);
                    copyBtn.click();
                }
            }
        });
    }
})();





















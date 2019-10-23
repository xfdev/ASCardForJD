// ==UserScript==
// @name         苹果卡列表页
// @namespace    https://github.com/xfdev/GCAForJD
// @version      0.0.1(190524)
// @description  try to take over the world!
// @author       xfdev
// @match        https://order.jd.com/center/list.action*s=4096*
// @match        https://order.jd.com/center/list.action?d=1&s=4096&t=34-62&page=*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      card.jd.com
// ==/UserScript==

(function() {
    'use strict';

    var requestCurrentIndex = 0;
    var isRequestAll = false;
    var orderIdArr;
    var allString = "";

    // 创建顶部bigDiv
    var bigDiv = document.createElement("div");

    var orderTable = document.getElementsByClassName("td-void order-tb")[0]; // 大表哥
    var orderTableParentNode = orderTable.parentNode;
    orderTableParentNode.insertBefore(bigDiv, orderTable);

    // 创建文本框
    var textarea = document.createElement('textarea');
    textarea.style.margin = "0px 0px 10px";
    textarea.style.width = "325px";
    textarea.style.height = "70px";
    textarea.style.overflowY = "auto";
    textarea.id = "fr_textarea-all";
    textarea.placeholder = "请求本页数据";
    bigDiv.appendChild(textarea);
    // 复制按钮
    var copyBtn = document.createElement('button');
    copyBtn.style.margin = "0px 10px 0px";
    copyBtn.style.width = "60px";
    copyBtn.style.height = "21px";
    copyBtn.innerHTML = "复制卡密";
    copyBtn.onclick = fr_clickCopyAll;
    copyBtn.id = "fr_copyBtn-all";
    bigDiv.appendChild(copyBtn);

    var requestBtn = document.createElement('button');
    requestBtn.style.margin = "0px 10px 0px";
    requestBtn.style.width = "100px";
    requestBtn.style.height = "21px";
    requestBtn.innerHTML = "请求本页卡密";
    requestBtn.id = "fr_requestBtn-all";
    requestBtn.onclick = fr_clickRequestAll;
    bigDiv.appendChild(requestBtn);

    // 必须等页面渲染完成后执行
    window.onload = function() {
        // Your code here...
        var orderTb = document.getElementsByClassName("td-void order-tb");
        if (orderTb) {
            var tbodys = orderTb[0].tBodies;
            for (var i = 0; i < tbodys.length; i++) {

                var body = tbodys[i];
                var orderid = body.id;
                orderid = orderid.substring(3);

                var div = document.createElement("div");

                var title = body.getElementsByClassName("p-extra")[0]; // title 下面的div
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
        fr_CopyWithElementId(textareaId, this);
    }

    function fr_clickCopyAll() {
        var textareaId = "fr_textarea-all";
        fr_CopyWithElementId(textareaId, this);
    }

    function fr_CopyWithElementId(textareaId, btn) {
        var textarea = document.getElementById(textareaId);
        textarea.select();
        var string = textarea.value;
        navigator.clipboard.writeText(string)
            .then(() => {
                btn.innerText = "已复制";
            })
            .catch(err => {
                btn.innerText = "无法复制内容：" + err;
            });
    }

    // 请求数据
    function fr_clickRequest() {
        // https://card.jd.com/order/order_detail.action?orderId=
        isRequestAll = false;
        this.innerHTML = "请求中...";
        var orderid = this.id.substring(14);
        fr_requestWithOrderId(orderid);
    }

    function fr_clickRequestAll() {
        isRequestAll = true;
        var string = $ORDER_CONFIG['finishOrderIds'];
        orderIdArr = string.split(",");
        fr_requestWithIndex(requestCurrentIndex);
    }

    function fr_requestWithIndex(i) {
        // if(i>=3) {
        //     // 请求完成
        //     var tmptextareaAll = document.getElementById("fr_textarea-all");
        //     tmptextareaAll.value = allString;
        //     document.getElementById("fr_requestBtn-all").innerHTML = "请求成功";
        //     return;
        // }
        if (i < orderIdArr.length) {
            var orderid = orderIdArr[i];
            fr_requestWithOrderId(orderid);
        } else {
            // 请求完成
            var textareaAll = document.getElementById("fr_textarea-all");
            textareaAll.value = allString;
            document.getElementById("fr_requestBtn-all").innerHTML = "请求成功";
        }
    }

    function fr_requestWithOrderId(orderid) {
        var textarea = document.getElementById("fr_textarea-" + orderid);
        var money = textarea.placeholder;
        var url = "https://card.jd.com/order/order_detail.action?orderId=" + orderid;
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(res) {
                if (res.status == 200) {
                    document.getElementById("fr_requestBtn-" + orderid).innerHTML = "请求成功";

                    // 正则表达式，环视，顺序环视，逆序环视，英文翻译为中文叫断言
                    // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions
                    // https://weekly.js.org/mix/regular-expression.html
                    // (?<=a) 匹配a后边的文本，(?=z) 匹配z前边的文本。 (?<=开始匹配且不包含).*(?=结束匹配且不包含)
                    var htmlText = res.responseText;

                    var allMoney = htmlText.match("(?<=商品总金额：</span>￥).*(?=</li)")[0];
                    var voucher = htmlText.match("(?<=优惠券：</span>￥).*(?=</li)")[0];
                    var discount = (1 - voucher/allMoney).toFixed(4);// 小数点四舍五入保留4位

                    var regex = new RegExp("(?<=copyToClipboard\\(\\').*(?=\\'\\);)", "g"); // 这里要用双反斜杠，要不然会直接过滤掉不被正则接收
                    var arr = htmlText.match(regex);
                    var string = "";
                    for (var i = 0; i < arr.length; i++) {
                        var card = arr[i];
                        var pswd = arr[i + 1];
                        string = string + card + " " + pswd + " " + money + " " + discount + "\n";
                        i++;
                    }

                    textarea.value = string;
                    if (isRequestAll) {
                        allString = allString + string;

                        requestCurrentIndex++;
                        fr_requestWithIndex(requestCurrentIndex);
                    } else {
                        var copyBtn = document.getElementById("fr_copyBtn-" + orderid);
                        copyBtn.click();
                    }
                }
            }
        });
    }
})();
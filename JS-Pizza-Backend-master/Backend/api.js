/**
 * Created by chaika on 09.02.16.
 */
var Pizza_List = require('./data/Pizza_List');

exports.getPizzaList = function (req, res) {
    res.send(Pizza_List);
};

function base64(str) {
    return new Buffer(str).toString('base64');
}

var crypto = require('crypto');

function sha1(string) {
    var sha1 = crypto.createHash('sha1');
    sha1.update(string);
    return sha1.digest('base64');
}

var LIQPAY_PUBLIC_KEY = 'i64394400941';
var LIQPAY_PRIVATE_KEY = 'Xtm4bAWVtwAY2UTA8RBdjq5eQ4zxiru33yQSHXlx';
exports.createOrder = function (req, res) {
    var order_info = req.body;
    var descr = "Замовлення піци: "+order_info.name+"\n"+
        "Адреса доставки: "+order_info.address+"\n"+
    "Телефон: "+order_info.phone+"\n";
    order_info.pizzas.forEach(element => {
        descr=descr+"- "+element.quantity+"шт.";
        if(element.size=="small_size") {
            descr=descr+" [Мала] ";
        } else {
            descr=descr+" [Велика] ";
        }
        descr=descr+element.pizza+"\n";
    });
    console.log(order_info);
    var order = {
        version: 3,
        public_key: LIQPAY_PUBLIC_KEY,
        action: "pay",
        amount: order_info.price,
        currency: "UAH",
        description: descr,
        order_id: Math.random(),
        sandbox: 1
    };
    var data = base64(JSON.stringify(order));
    var signature = sha1(LIQPAY_PRIVATE_KEY + data + LIQPAY_PRIVATE_KEY);
    res.send({
        data: data,
        signature: signature,
        success: true
    });
};
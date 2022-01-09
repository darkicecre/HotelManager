var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://admin:GgI094u5Yf0DguJ0@cluster0.wo3to.mongodb.net/HotelManager?retryWrites=true&w=majority";
var mongo = new MongoClient(url,{useNewUrlParser:true});

const list = (req, res) => {
    const paramString = new URLSearchParams(req.query);
    const username = paramString.get("username");
    mongo.connect((err, db) => {
        if (err) throw err;
        console.log("Kết nối thành công");
        var dbo = db.db("HotelManager");  // Tên database
        const cursor = dbo.collection('HoaDon').find({});
        cursor.toArray((err, objs) => {
            if (err) throw err;
            db.close();
            data = objs;
            res.render('businessAnalyst/payBillList', {
                title: "Hotel",
                UserName: username,
                BusinessAnalyst: true,
                data
            });
        })
    });
}

const SalesList = (req, res) =>{
    const paramString = new URLSearchParams(req.query);
    const username = paramString.get("username");
    mongo.connect((err, db) => {
        if (err) throw err;
        console.log("Kết nối thành công");
        var dbo = db.db("HotelManager");  // Tên database
        const sumCursor = dbo.collection('HoaDon').aggregate([
            {
                "$group": {
                    "_id": "$Phong",
                    "TongDoanhThu": { $sum: "$ThanhTien"}
                }
            }
        ]);
        sumCursor.toArray((err,data)=>{
            let Sum = 0;
            data.forEach(Element => Sum += Element.TongDoanhThu);
            data.forEach(Element => Element = Object.assign(Element, {TiLe: Math.round(Element.TongDoanhThu/Sum*100)}));
            data.push({_id:'Tổng Cộng', TongDoanhThu: Sum, TiLe: 100})
            res.render('businessAnalyst/SalesList', {
                title: "Thống kê doanh thu",
                UserName: username,
                BusinessAnalyst: true,
                data,
            })
        })
    });
}

const UsageList = (req, res) =>{
    const paramString = new URLSearchParams(req.query);
    const username = paramString.get("username");
    mongo.connect((err, db) => {
        if (err) throw err;
        console.log("Kết nối thành công");
        var dbo = db.db("HotelManager");  // Tên database
        const sumCursor = dbo.collection('HoaDon').aggregate([
            {
                "$group": {
                    "_id": "$Phong",
                    "TongNgayThue": { $sum: "$SoNgayThue"}
                }
            }
        ]);
        sumCursor.toArray((err,data)=>{
            console.log(data);
            let Sum = 0;
            data.forEach(Element => Sum += Element.TongNgayThue);
            data.forEach(Element => Element = Object.assign(Element, {TiLe: Math.round(Element.TongNgayThue/Sum*100)}));
            data.push({_id:'Tổng Cộng', TongNgayThue: Sum, TiLe: 100})
            res.render('businessAnalyst/UsageList', {
                title: "Thống kê mật độ",
                UserName: username,
                BusinessAnalyst: true,
                data,
            })
        })
    });
}

module.exports = { list, SalesList, UsageList}; 
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://admin:GgI094u5Yf0DguJ0@cluster0.wo3to.mongodb.net/HotelManager?retryWrites=true&w=majority";
var mongo = new MongoClient(url,{useNewUrlParser:true});

const list = (req,res) => {
    mongo.connect((err,db)=>{
        if(err) throw err;
        console.log("Kết nối thành công");
        var dbo = db.db("HotelManager");  // Tên database
        const cursor = dbo.collection('DanhSachPhong').find({"TinhTrang": "Trống"});
        cursor.toArray((err,objs)=>{
            if(err) throw err;
            db.close();
            data=objs;
            res.render('customer/booking',{
                title: "Hotel",
                data
            });
        })
    });
}

const book = (req,res)=>{
    
}

module.exports = { list }; 
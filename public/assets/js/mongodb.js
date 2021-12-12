var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb+srv://admin:GgI094u5Yf0DguJ0@cluster0.wo3to.mongodb.net/HotelManager?retryWrites=true&w=majority";
    var mongo = new MongoClient(url,{useNewUrlParser:true});
    mongo.connect((err,db)=>{
        if(err) throw err;
    
        console.log("Kết nối thành công");
        var dbo = db.db("HotelManager");  // Tên database
        dbo.collection("TaiKhoan").find().toArray((err,objs)=>{
            if(err) throw err;

            if(objs.lenght!=0) console.log("Dang nhap thanh cong");
            console.log(objs)
            db.close();
        })
    
    });
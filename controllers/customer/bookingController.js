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
    mongo.connect((err,db)=>{
        if(err) throw err;
        console.log("Kết nối thành công");
        var dbo = db.db("HotelManager");  // Tên database
        console.log(req.params)
        const cursor = dbo.collection('DanhSachPhong').findOne({"Phong": req.params.Phong}, function(err, objs){
            if(err) throw err;
            db.close();
            res.render('customer/makeBookingNote',{
                title: "Tạo phiếu thuê phòng.",
                phong: objs.Phong,
            });
        });
    });
}

const savetoDB = (req,res)=>{
    console.log(req)
    const {phong, ngayThue, hoTen, loai, cMND, diaChi, soKhach} = req.body;
    if(phong == "" || ngayThue =="" || hoTen=="" || loai=="" || cMND=="" || diaChi==""){
        res.render('customer/makeBookingNote',{
            title: "Thất bại!",
            alertFail: "Có trường còn trống! Vui lòng nhập lại.",
            phong: phong
        });
    }
    else{
        mongo.connect(async (err,db)=>{
            console.log("Ket noi de luu");
            var dbo = db.db("HotelManager"); //Tên database
            const cursor = dbo.collection('DanhSachPhong').findOne({"Phong": phong}, async function(err, objs){
                if(err) throw err;
                await dbo.collection("PhieuThuePhong").insertOne({
                    Phong: phong,
                    DonGia: objs.DonGia,
                    NgayThue: ngayThue,
                    HoTen: hoTen,
                    Loai: loai,
                    CMND: cMND,
                    DiaChi: diaChi,
                    SoKhach: soKhach,
                })
                await dbo.collection("DanhSachPhong").updateOne(
                    {Phong: phong},
                    {
                        $set: { 'TinhTrang': 'Đã book'},
                        $currentDate: { lastModified: true }
                    }
                )
                db.close();
                res.render('customer/makeBookingNote',{
                    title: "Thành công!",
                    alertSuccess: "Đặt phòng thành công!"
                });
            });
        })
    }
}

module.exports = { list, book, savetoDB }; 
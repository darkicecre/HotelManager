var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://admin:GgI094u5Yf0DguJ0@cluster0.wo3to.mongodb.net/HotelManager?retryWrites=true&w=majority";
var mongo = new MongoClient(url,{useNewUrlParser:true});

const list = (req,res) => {
    const paramString = new URLSearchParams(req.query);
    const username = paramString.get("username");
    mongo.connect((err,db)=>{
        if(err) throw err;
        console.log("Kết nối thành công");
        var dbo = db.db("HotelManager");  // Tên database
        const cursor = dbo.collection('DanhSachPhong').find({"TinhTrang": "Trống"});
        cursor.toArray((err,objs)=>{
            if(err) throw err;
            db.close();
            data=objs;
            res.render('letan/booking',{
                title: "Hotel",
                LeTan: true,
                UserName: username,
                data
            });
        })
    });
}

const book = (req,res)=>{
    const paramString = new URLSearchParams(req.query);
    const username = paramString.get("username");
    mongo.connect((err,db)=>{
        if(err) throw err;
        console.log("Kết nối thành công");
        var dbo = db.db("HotelManager");  // Tên database
        console.log(req.params)
        const cursor = dbo.collection('DanhSachPhong').findOne({"Phong": req.params.Phong}, function(err, objs){
            if(err) throw err;
            db.close();
            res.render('letan/makeBookingNote',{
                title: "Tạo phiếu thuê phòng.",
                LeTan: true,
                UserName: username,
                phong: objs.Phong,
                loaiPhong: objs.LoaiPhong,
            });
        });
    });
}

const savetoDB = (req,res)=>{
    console.log(req)
    const {username, phong, loaiPhong, ngayThue, hoTen, loai, cMND, diaChi, soKhach} = req.body;
    console.log(username);
    if(phong == "" || ngayThue =="" || hoTen=="" || loai=="" || cMND=="" || diaChi==""){
        res.render('letan/makeBookingNote',{
            title: "Thất bại!",
            alertFail: "Có trường còn trống! Vui lòng nhập lại.",
            phong: phong,
            LeTan: true,
            UserName: username,
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
                    LoaiPhong: loaiPhong,
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
                res.render('letan/makeBookingNote',{
                    title: "Thành công!",
                    alertSuccess: "Đặt phòng thành công!",
                    LeTan: true,
                    UserName: username,
                });
            });
        })
    }
}

module.exports = { list, book, savetoDB }; 
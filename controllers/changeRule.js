var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://admin:GgI094u5Yf0DguJ0@cluster0.wo3to.mongodb.net/HotelManager?retryWrites=true&w=majority";
var mongo = new MongoClient(url, { useNewUrlParser: true });
var Double = require("Mongodb").Double;

const list = (req, res) => {
    const paramString = new URLSearchParams(req.query);
    const username = paramString.get("username");
    mongo.connect((err, db) => {
        if (err) throw err;
        console.log("Kết nối thành công");
        var dbo = db.db("HotelManager");  // Tên database
        const cursor = dbo.collection('LoaiPhong').find({});
        cursor.toArray((err, objs) => {
            if (err) throw err;
            db.close();
            data = objs;
            res.render('admin/TypeRoomList', {
                title: "Hotel",
                UserName: username,
                Admin: true,
                data
            });
        })
    });
}

const addTypeRoom = (req, res) => {
    const paramString = new URLSearchParams(req.query);
    const username = paramString.get("username");
    res.render('admin/addNewTypeRoom', {
        Admin: true,
        UserName: username,
    })
}

const addNewTypeRoom = (req, res) => {
    const { username, loaiPhong, donGia } = req.body;
    console.log(req.body);
    mongo.connect((err, db) => {
        var dbo = db.db("HotelManager"); //Tên database
        if (loaiPhong == "" || donGia == "") {
            res.render('admin/addNewTypeRoom', {
                title: "Thất bại!",
                alertFail: "Có trường còn trống! Vui lòng nhập lại.",
                loaiPhong,
                donGia,
                Admin: true,
                UserName: username,
            })
        }
        else {
            const isExist = dbo.collection('LoaiPhong').find({ Loai: loaiPhong }).count(async (err, result) => {
                console.log(result);
                if (result > 0) {
                    res.render('admin/addNewTypeRoom', {
                        title: "Thất bại!",
                        alertFail: "Loại phòng đã tồn tại.",
                        loaiPhong,
                        donGia,
                        Admin: true,
                        UserName: username,
                    })
                }
                else {
                    await dbo.collection("LoaiPhong").insertOne({
                        Loai: loaiPhong,
                        DonGia: Double(donGia),
                    })
                    res.render('admin/addNewTypeRoom', {
                        title: "Thành công!",
                        alertSuccess: "Thêm loại phòng thành công!",
                        loaiPhong,
                        donGia,
                        Admin: true,
                        UserName: username,
                    });
                }
            });
        }
    })
}

const deleteTypeRoom = (req, res) => {
    const paramString = new URLSearchParams(req.query);
    const username = paramString.get("username");
    mongo.connect(async (err, db) => {
        if (err) throw err;
        var dbo = db.db("HotelManager");  // Tên database
        console.log(req.params);
            dbo.collection('LoaiPhong').deleteOne({ Loai: req.params.Loai }, (err) => {
                if (err) throw err;
                const cursor = dbo.collection('LoaiPhong').find({});
                cursor.toArray((err, objs) => {
                    if (err) throw err;
                    data = objs;
                    res.render('admin/TypeRoomList', {
                        title: "Tạo phiếu thuê phòng.",
                        Admin: true,
                        UserName: username,
                        Notifi: "Delete thành công",
                        data
                    });
                })
            });
    });
}

const editTypeRoomForm = (req, res) => {
    const paramString = new URLSearchParams(req.query);
    const username = paramString.get("username");
    mongo.connect((err, db) => {
        if (err) throw err;
        var dbo = db.db("HotelManager");  // Tên database
        dbo.collection('LoaiPhong').findOne({ Loai: req.params.Loai }, (err, objs) => {
            if (err) throw err;
            res.render('admin/editTypeRoom', {
                Admin: true,
                UserName: username,
                dataTypeRoom: objs,
            })
        });
    });
}

const editTypeRoom = (req, res) => {
    const { username, loaiPhong, donGia} = req.body;
    mongo.connect( async (err, db) => {
        if (err) throw err;
        var dbo = db.db("HotelManager");  // Tên database
        if ( donGia == "") {
            dbo.collection('LoaiPhong').findOne({ Loai: loaiPhong }, (err, objs) => {
                if (err) throw err;
                res.render('admin/editTypeRoom', {
                    title: "Thất bại!",
                    alertFail: "Có trường còn trống! Vui lòng nhập lại.",
                    Admin: true,
                    UserName: username,
                    dataTypeRoom: objs,
                })
            });
        }
        else {
            await dbo.collection("LoaiPhong").updateOne(
                { Loai: loaiPhong },
                {
                    $set: { 'DonGia': Double(donGia) },
                    $currentDate: { lastModified: true }
                }
            )
            res.render('admin/editTypeRoom', {
                title: "Thành công!",
                alertSuccess: "Thay đổi thông tin thành công!",
                Admin: true,
                UserName: username,
            })
        }
    });
}

module.exports = { list, addTypeRoom, addNewTypeRoom, deleteTypeRoom, editTypeRoomForm, editTypeRoom}; 
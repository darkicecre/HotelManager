var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://admin:GgI094u5Yf0DguJ0@cluster0.wo3to.mongodb.net/HotelManager?retryWrites=true&w=majority";
var mongo = new MongoClient(url, { useNewUrlParser: true });

const list = (req, res) => {
    const paramString = new URLSearchParams(req.query);
    const username = paramString.get("username");
    mongo.connect((err, db) => {
        if (err) throw err;
        console.log("Kết nối thành công");
        var dbo = db.db("HotelManager");  // Tên database
        const cursor = dbo.collection('DanhMucPhong').find({});
        cursor.toArray((err, objs) => {
            if (err) throw err;
            db.close();
            data = objs;
            res.render('admin/roomList', {
                title: "Hotel",
                UserName: username,
                Admin: true,
                data
            });
        })
    });
}

const addRoom = (req, res) => {
    const paramString = new URLSearchParams(req.query);
    const username = paramString.get("username");
    mongo.connect((err, db) => {
        if (err) throw err;
        console.log("Kết nối thành công");
        var dbo = db.db("HotelManager");  // Tên database
        const cursor = dbo.collection('LoaiPhong').find({});
        cursor.toArray((err, objs) => {
            res.render('admin/addNewRoom', {
                Admin: true,
                UserName: username,
                data: objs
            })
        })
    })
}

const addNewRoom = (req, res) => {
    const { username, phong, loai, ghiChu } = req.body;
    console.log(req.body);
    mongo.connect((err, db) => {
        var dbo = db.db("HotelManager"); //Tên database
        if (phong == "" || loai == "") {
            const cursor = dbo.collection('LoaiPhong').find({});
            cursor.toArray((err, objs) => {
                res.render('admin/addNewRoom', {
                    title: "Thất bại!",
                    alertFail: "Có trường còn trống! Vui lòng nhập lại.",
                    Phong: phong,
                    Loai: loai,
                    GhiChu: ghiChu,
                    Admin: true,
                    UserName: username,
                    data: objs
                })
            })
        }
        else {
            const isExist = dbo.collection('DanhMucPhong').find({ Phong: phong }).count((err, result) => {
                console.log(result);
                if (result > 0) {
                    const cursor = dbo.collection('LoaiPhong').find({});
                    cursor.toArray((err, objs) => {
                        res.render('admin/addNewRoom', {
                            title: "Thất bại!",
                            alertFail: "Tên phòng đã tồn tại.",
                            Phong: phong,
                            Loai: loai,
                            GhiChu: ghiChu,
                            Admin: true,
                            UserName: username,
                            data: objs
                        })
                    })
                }
                else {
                    const cursor = dbo.collection('LoaiPhong').findOne({ Loai: loai }, async (err, objs) => {
                        await dbo.collection("DanhMucPhong").insertOne({
                            Phong: phong,
                            GhiChu: ghiChu,
                            DonGia: objs.DonGia,
                            LoaiPhong: loai,
                        })
                        await dbo.collection("DanhSachPhong").insertOne({
                            Phong: phong,
                            TinhTrang: "Trống",
                            DonGia: objs.DonGia,
                            LoaiPhong: loai,
                        })
                        const cursor = dbo.collection('LoaiPhong').find({});
                        cursor.toArray((err, objs) => {
                            res.render('admin/addNewRoom', {
                                title: "Thành công!",
                                alertSuccess: "Thêm phòng thành công!",
                                Phong: phong,
                                Loai: loai,
                                GhiChu: ghiChu,
                                Admin: true,
                                UserName: username,
                                data: objs
                            })
                        })
                    });
                }
            });
        }
    })
}

const deleteRoom = (req, res) => {
    const paramString = new URLSearchParams(req.query);
    const username = paramString.get("username");
    mongo.connect(async (err, db) => {
        if (err) throw err;
        var dbo = db.db("HotelManager");  // Tên database
        console.log(req.params);
        dbo.collection('DanhMucPhong').deleteOne({ Phong: req.params.Phong }, (err) => {
            if (err) throw err;
            dbo.collection('DanhSachPhong').deleteOne({ Phong: req.params.Phong }, (err) => {
                if (err) throw err;
                const cursor = dbo.collection('DanhMucPhong').find({});
                cursor.toArray((err, objs) => {
                    if (err) throw err;
                    data = objs;
                    res.render('admin/roomList', {
                        title: "Xóa",
                        Admin: true,
                        UserName: username,
                        Notifi: "Delete thành công",
                        data
                    });
                })
            });
        });
    });
}

const editRoomForm = (req, res) => {
    const paramString = new URLSearchParams(req.query);
    const username = paramString.get("username");
    mongo.connect((err, db) => {
        if (err) throw err;
        var dbo = db.db("HotelManager");  // Tên database
        dbo.collection('DanhMucPhong').findOne({ Phong: req.params.Phong }, (err, objs) => {
            if (err) throw err;
            dataRoom = objs;
            console.log(objs.GhiChu);
            const cursor = dbo.collection('LoaiPhong').find({});
            cursor.toArray((err, objs) => {
                res.render('admin/editRoom', {
                    Admin: true,
                    UserName: username,
                    data: objs,
                    dataRoom: dataRoom,
                })
            })
        });
    });
}

const editRoom = (req, res) => {
    const { username, phong, loai, ghiChu } = req.body;
    mongo.connect((err, db) => {
        if (err) throw err;
        var dbo = db.db("HotelManager");  // Tên database
        if (phong == "" || loai == "") {
            dbo.collection('DanhMucPhong').findOne({ Phong: req.params.Phong }, (err, objs) => {
                if (err) throw err;
                dataRoom = objs;
                const cursor = dbo.collection('LoaiPhong').find({});
                cursor.toArray((err, objs) => {
                    res.render('admin/editRoom', {
                        title: "Thất bại!",
                        alertFail: "Có trường còn trống! Vui lòng nhập lại.",
                        Admin: true,
                        UserName: username,
                        data: objs,
                        dataRoom: dataRoom,
                    })
                })
            });
        }
        else {
            dbo.collection('LoaiPhong').findOne({Loai: loai}, async (err, result) => {
                if (err) throw err;
                const donGia = result.DonGia;
                await dbo.collection("DanhMucPhong").updateOne(
                    { Phong: phong },
                    {
                        $set: { 'DonGia': donGia, 'GhiChu': ghiChu, 'LoaiPhong': loai },
                        $currentDate: { lastModified: true }
                    }
                )
                await dbo.collection("DanhSachPhong").updateOne(
                    { Phong: phong },
                    {
                        $set: { 'DonGia': donGia, 'LoaiPhong': loai },
                        $currentDate: { lastModified: true }
                    }
                )
                res.render('admin/editRoom', {
                    title: "Thành công!",
                    alertSuccess: "Thay đổi thông tin thành công!",
                    Admin: true,
                    UserName: username,
                })
            });
        }
    });
}

module.exports = { list, addRoom, addNewRoom, deleteRoom, editRoomForm, editRoom}; 
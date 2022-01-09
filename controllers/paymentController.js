var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://admin:GgI094u5Yf0DguJ0@cluster0.wo3to.mongodb.net/HotelManager?retryWrites=true&w=majority";
var mongo = new MongoClient(url, { useNewUrlParser: true });
var Double = require("Mongodb").Double;
var Int32 = require("Mongodb").Int32;

const list = (req, res) => {
    const paramString = new URLSearchParams(req.query);
    const username = paramString.get("username");
    mongo.connect((err, db) => {
        if (err) throw err;
        console.log("Kết nối thành công");
        var dbo = db.db("HotelManager");  // Tên database
        const cursor = dbo.collection('DanhSachPhong').find({ "TinhTrang": "Đã book" });
        cursor.toArray((err, objs) => {
            if (err) throw err;
            db.close();
            data = objs;
            res.render('thungan/payment', {
                title: "Hotel",
                data,
                UserName: username,
                ThuNgan: true,
            });
        })
    });
}

const makeBill = (req, res) => {
    const paramString = new URLSearchParams(req.query);
    const username = paramString.get("username");
    mongo.connect((err, db) => {
        if (err) throw err;
        console.log("Kết nối thành công");
        var dbo = db.db("HotelManager");  // Tên database
        console.log(req.params)
        const cursor = dbo.collection('PhieuThuePhong').findOne({ "Phong": req.params.Phong }, function (err, objs) {
            console.log(objs)
            if (err) throw err;
            db.close();
            const currentDate = new Date();
            const today = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
            const bookingDate = new Date(objs.NgayThue);
            // Số ngày ở làm tròn lên (ví dụ ở 2 ngày 2 tiếng là ở 3 ngày)
            const numOfDates = Math.floor((currentDate.getTime() - bookingDate.getTime()) / (1000 * 3600 * 24)) + 1;
            let totalCash = numOfDates * objs.DonGia
            if (objs.SoKhach > 2){
                totalCash += (objs.SoKhach - 2)*totalCash*0.25;
            }
            if (objs.Loai == 'Nước ngoài'){
                totalCash *= 1.5;
            }
            res.render('thungan/makeBill', {
                title: "Tạo phiếu thuê phòng.",
                bookingNote: objs,
                date: today,
                bookingDates: numOfDates,
                money: totalCash,
                UserName: username,
                ThuNgan: true,
            });
        });
    });
}

const addBill = (req, res) => {
    console.log(req)
    const { username, hoTen, diaChi, ngayThue, ngayThanhToan, phong, loaiPhong, soNgayThue, donGia, thanhTien } = req.body;
    mongo.connect(async (err, db) => {
        console.log("Ket noi de luu");
        var dbo = db.db("HotelManager"); //Tên database
        // Thêm hóa đơn
        await dbo.collection("HoaDon").insertOne({
            HoTen: hoTen,
            DiaChi: diaChi,
            NgayThanhToan: ngayThanhToan,
            ThanhTien: Double(thanhTien),
            Phong: phong,
            LoaiPhong: loaiPhong,
            SoNgayThue: Int32(soNgayThue),
            DonGia: donGia,
        })
        // Cập nhật tình trạng phòng
        await dbo.collection("DanhSachPhong").updateOne(
            { Phong: phong },
            {
                $set: { 'TinhTrang': 'Trống' },
                $currentDate: { lastModified: true }
            }
        )
        // Xóa phiếu thuê phòng
        await dbo.collection("PhieuThuePhong").deleteOne({Phong: phong});
        db.close();
        res.render('thungan/makeBill', {
            title: "Thành công!",
            alertSuccess: "Phòng đã được thanh toán!",
            UserName: username,
            ThuNgan: true,
        });
    });
}

module.exports = { list, makeBill, addBill }; 
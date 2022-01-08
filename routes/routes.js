const express = require('express');
const router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://admin:GgI094u5Yf0DguJ0@cluster0.wo3to.mongodb.net/HotelManager?retryWrites=true&w=majority";
var mongo = new MongoClient(url,{useNewUrlParser:true});

//set routes for server
router.get('/',(req,res)=>{
    res.redirect('./login.html')
})
router.get('/login',(req,res)=>{
    const username = req.query.username;
    const pass = req.query.pass;
    var data=[];
    mongo.connect((err,db)=>{
        if(err) throw err;
        console.log("Kết nối thành công");
        var dbo = db.db("HotelManager");  // Tên database
        dbo.collection("TaiKhoan").find({"username":username,"password":pass}).toArray((err,objs)=>{
            if(err) throw err;
            if(objs.lenght!=0) console.log("Dang nhap thanh cong");
            db.close();
            data=objs;
            res.json(data)
        })
    });
   // res.json(data)
})

//set controller for router
// mainPage
const mainPageCtrl = require('../controllers/mainPageController');
const adminCtrl = require('../controllers/CRUDRoomController');
router.get('/mainPage/Guest',mainPageCtrl.list);
router.get('/mainPage/LeTan', mainPageCtrl.leTan);
router.get('/mainPage/ThuNgan', mainPageCtrl.thuNgan);
router.get('/mainPage/Admin', adminCtrl.list);

// customer
const customerCtrl = require('../controllers/customerController');
router.get('/availableRoom/',customerCtrl.list);

// thu ngân
const paymentCtrl = require('../controllers/paymentController');
router.get('/payment/', paymentCtrl.list);
router.get('/payment/makeBill/:Phong', paymentCtrl.makeBill);
router.post('/payment//addBill', paymentCtrl.addBill);

// lễ tân
const bookingCtrl = require('../controllers/bookingController');
router.get('/booking/',bookingCtrl.list);

router.get('/booking/makeBookingNote/:Phong', bookingCtrl.book);
router.post('/booking/addBookingNote', bookingCtrl.savetoDB);

// admin
router.get('/admin/', adminCtrl.list);
router.get('/admin/addNewRoom', adminCtrl.addRoom);
router.post('/admin/addNewRoom', adminCtrl.addNewRoom);
router.get('/admin/deleteRoom/:Phong', adminCtrl.deleteRoom);
router.get('/admin/editRoomForm/:Phong', adminCtrl.editRoomForm);
router.post('/admin/editRoom', adminCtrl.editRoom)


module.exports = router;


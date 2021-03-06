const express = require('express');
const cors = require('cors');
const hbs = require('hbs');
const path = require('path');
const app = express();
// mongo.connect((err,db)=>{
//     if(err) throw err;
    
//     console.log("Kết nối thành công");
//     var dbo = db.db("HotelManager");  // Tên database
//     dbo.collection("TaiKhoan").find().toArray((err,objs)=>{
//         if(err) throw err;
//         if(objs.lenght!=0) console.log("Dang nhap thanh cong");
//         console.log(objs)
//         db.close();
//     })
// });

//routes
const { redirect } = require('express/lib/response');
const routes = require('./routes/routes');
// const customerMainPage = require('./routes/mainpage');
// const customerAvailableRoom = require('./routes/customer/availableRoom');
// const booking = require('./routes/letan/booking');
// const payment = require('./routes/thungan/payment');
// const admin = require('./routes/admin/adminRoutes');
//hbs
app.set('view engine', 'hbs');
app.set('views',  path.join(__dirname, 'views'));
hbs.registerPartials(__dirname + '/views/partials', function (err) {});

//cors
app.use(cors());
app.use(express.json());
app.use(express.urlencoded(
    {extended:true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

//set routes for server
// app.get('/',(req,res)=>{
//     res.redirect('./login.html')
// })
// app.get('/login',(req,res)=>{
//     const username = req.query.username;
//     const pass = req.query.pass;
//     var data=[];
//     mongo.connect((err,db)=>{
//         if(err) throw err;
//         console.log("Kết nối thành công");
//         var dbo = db.db("HotelManager");  // Tên database
//         dbo.collection("TaiKhoan").find({"username":username,"password":pass}).toArray((err,objs)=>{
//             if(err) throw err;
//             if(objs.lenght!=0) console.log("Dang nhap thanh cong");
//             db.close();
//             data=objs;
//             res.json(data)
//         })
//     });
//    // res.json(data)
// })
// app.use('/customer',customerMainPage);
// app.use('/mainPage',customerMainPage);
// app.use('/availableRoom', customerAvailableRoom);
// app.use('/booking', booking);
// app.use('/payment',payment);
// app.use('/home', customerMainPage);
// app.use('/admin', admin);
//do not change
const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log("Server listening on port "+ port));
const list = (req,res) => {
    res.render('customer/mainPage',{
        title: "Hotel",
        UserName: "Guest",
        Guest: "guest",
    });
}

const leTan = (req, res) => {
    const paramString = new URLSearchParams(req.query);
    const username = paramString.get("username");
    res.render('customer/mainPage',{
        title: "Lễ Tân",
        UserName: username,
        LeTan: true,
    });
}

const thuNgan = (req, res) => {
    const paramString = new URLSearchParams(req.query);
    const username = paramString.get("username");
    res.render('customer/mainPage',{
        title: "Thu Ngan",
        UserName: username,
        ThuNgan: true,
    });
}

module.exports = { list, leTan, thuNgan}; 
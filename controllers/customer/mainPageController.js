const list = (req,res) => {
    res.render('customer/mainPage',{
        title: "Hotel"
    });
}

module.exports = { list }; 
var express = require("express");
var jsonfile = require("jsonfile");
var app = express();



app.set('port', process.env.PORT || 3000);

var file = './geo.json';


app.get("/geo:_id", function(req, res) {
    ///res.sendFile(__dirname + '/password.html');
    //res.jsonp({ lt: 30.0427448, ln: -17.8388992 });
    var _id = req.query._id;
    var data = jsonfile.readFileSync(file);
    var geo;
    if (data[_id]) {
        geo = data[_id];
    } else {
        geo = {};
    }
    res.jsonp(geo);
});
app.post('/geo:_id:lt:ln', function(req, res) {

    var _id = req.body._id;
    var lt = req.body.lt;
    var ln = req.body.ln;

    var data = jsonfile.readFileSync(file);

    if (_id && lt && ln) {
        if (!data[_id]) {
            data[_id] = {};
        }
        data[_id] = { lt: lt, ln: ln, ar: false };
    }

    jsonfile.writeFile(file, data, { spaces: 2 }, function(err) {
        res.jsonp(data);
    });

});
app.put('/geo:_id', function(req, res) {
    var _id = req.body._id;
    var data = jsonfile.readFileSync(file);
    if (data[_id]) {
        data[_id].ar= true;
        jsonfile.writeFile(file, data, { spaces: 2 }, function(err) {
            res.jsonp(data);
        });
    }

});

if (!module.parent) {
    app.listen(app.get('port'));
    console.log("server listening on port " + app.get('port'));
}
module.exports = app;
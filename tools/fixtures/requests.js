/**
 * Created by ernestomr87@gmail.com on 2/25/2016.
 */
require('./../../app');
var async = require('async');
var requestViewModel = require('./../../core/App/viewModels/requestViewModel');


var requests = [];

var user = {
    _id: "56ce604c20be99180627777f",

};

var days = [30 * 86400000, 15 * 86400000, 10 * 86400000, 25 * 86400000];

var req = {
    user: user,
    shipowner: "56ce1dd2cfca7ee80320fbc4",
    ship: "56b02fd22c98300c17a0d67b",
    bookDate: (new Date()).getTime() + days[0],
    experience: "56bf2574dd55511c0ca91d75",
    duration: "56bf05145e45a404018e17ad",
    price: 295,
    message: "Lorem ipsum ad his scripta blandit partiendo, eum fastidii accumsan euripidis in, eum liber hendrerit an. Qui ut wisi vocibus suscipiantur, quo dicit ridens inciderint id. Quo mundi lobortis reformidans eu, legimus senserit definiebas an eos. Eu sit tincidunt incorrupte definitionem, vis mutat affert percipit cu, eirmod consectetuer signiferumque eu per. In usu latine equidem dolores. Quo no falli viris intellegam, ut fugit veritus placerat per."
};

requests.push(req);
var user = {
    _id: "56ce608220be991806277780"
};

var req = {
    user: user,
    shipowner: "56ce1dd2cfca7ee80320fbc4",
    ship: "56b030562c98300c17a0d682",
    bookDate: (new Date()).getTime() + days[1],
    experience: "56bf2574dd55511c0ca91d75",
    duration: "56bf051b5e45a404018e17ae",
    price: 425,
    message: "Ius id vidit volumus mandamus, vide veritus democritum te nec, ei eos debet libris consulatu. No mei ferri graeco dicunt, ad cum veri accommodare. Sed at malis omnesque delicata, usu et iusto zzril meliore. Dicunt maiorum eloquentiam cum cu, sit summo dolor essent te. Ne quodsi nusquam legendos has, ea dicit voluptua eloquentiam pro, ad sit quas qualisque. Eos vocibus deserunt quaestio ei."
};

requests.push(req);

/*************************************************************************/

var user = {
    _id: "56ce604c20be99180627777f"
};

var req = {
    user: user,
    shipowner: "56ce1df1cfca7ee80320fbc5",
    ship: "56b034f82c98300c17a0d6af",
    bookDate: (new Date()).getTime() + days[2],
    experience: "56bf2574dd55511c0ca91d75",
    duration: "56bf05145e45a404018e17ad",
    price: 360,
    message: "Lorem ipsum ad his scripta blandit partiendo, eum fastidii accumsan euripidis in, eum liber hendrerit an. Qui ut wisi vocibus suscipiantur, quo dicit ridens inciderint id. Quo mundi lobortis reformidans eu, legimus senserit definiebas an eos. Eu sit tincidunt incorrupte definitionem, vis mutat affert percipit cu, eirmod consectetuer signiferumque eu per. In usu latine equidem dolores. Quo no falli viris intellegam, ut fugit veritus placerat per."
};

requests.push(req);
var user = {
    _id: "56ce608220be991806277780"
};

var req = {
    user: user,
    shipowner: "56ce1df1cfca7ee80320fbc5",
    ship: "56b0352e2c98300c17a0d6b6",
    bookDate: (new Date()).getTime() + days[3],
    experience: "56bf2574dd55511c0ca91d75",
    duration: "56bf051b5e45a404018e17ae",
    price: 512,
    message: "Ius id vidit volumus mandamus, vide veritus democritum te nec, ei eos debet libris consulatu. No mei ferri graeco dicunt, ad cum veri accommodare. Sed at malis omnesque delicata, usu et iusto zzril meliore. Dicunt maiorum eloquentiam cum cu, sit summo dolor essent te. Ne quodsi nusquam legendos has, ea dicit voluptua eloquentiam pro, ad sit quas qualisque. Eos vocibus deserunt quaestio ei."
};

requests.push(req);

async.map(requests, function (request, callback) {
    requestViewModel.createTest(request, request.user, function (err, req) {
        callback(err, req);
    });
}, function (err, result) {
    console.log(err, result);
});


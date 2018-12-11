const helpers = {};

helpers.isAuthenticated = (req , res , nex) => {
    if (req.isAuthenticated()) {
        return nex();
    }
    req.flash('error_msg' , 'Not Authorized');
    res.redirect('/users/signin');
}

module.exports = helpers;
module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }
        res.redirect('/');
    }, 
    ensureGuest: function(req, res, next) {
        if(req.isAuthenticated()) {
            // If logged in just go to dashboard, not welcome page
            res.redirect('/dashboard');
        } else {
            return next();
        }
    } 
}
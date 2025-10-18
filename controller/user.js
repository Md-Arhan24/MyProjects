const User = require('../models/user.js');

module.exports.getSingup = (req, res) => {
 return res.render("users/singup.ejs");
};

module.exports.postSingup = async (req, res) => {
  //here we dont use wrap async because when error occure we have to falsh.
  try {
    let { username, email, password } = req.body;
    const registedUser = new User({ username, email });
    const Orginaluser = await User.register(registedUser, password);
    console.log(Orginaluser);
    req.login(Orginaluser, (err) => {
      req.flash("success", "Successfully registerd!");
      return res.redirect('/listings');
    });
  } catch (e) {
    req.flash("error", e.message);
    return res.redirect("/singup");
  }
};

module.exports.getLogin = (req, res) => {
  //here we dont have to keep / for /users/login so just keep user/login.ejs
  return res.render("users/login.ejs");
};

module.exports.postLogin = async (req, res) => {
    //all the login work is done by passport , here we just take the previous url page after login we redirect it to there
    req.flash("success", "Successfully login");
    let redirectu = res.locals.redirectUrl || "/listings";
    return res.redirect(redirectu);
  };

module.exports.getLogout =  (req, res, next) => {
  //this req.logout takes callback
  req.logout((err) => {
    if (err) {
      req.flash("error", "error occured!");
      return next(err);
    }
    req.flash("success", "Successfully log out");
   return res.redirect("/login");
  });
}
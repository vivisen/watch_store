/* --Checking user is authorization or no. 
   //* if no : redirection user to the home page.
   //* else : continue work flow
*/
module.exports = (req, res, next) => {
  if (!req.session.user) return res.redirect("/");
  next();
};

module.exports._404 = (req, res) => {
  res.status(404).render("404", {
    title: "404 || NOT FOUND!",
  });
};

module.exports._500 = (req, res) => {
  res.status(500).render("500", {
    title: "500 || SERVER ERROR",
  });
};

module.exports = (totalProducts, perPage) => {
  const numberOfPaginations = Math.ceil(totalProducts / perPage);
  const paginations = [];
  for (let i = 1; i <= numberOfPaginations; i++) {
    paginations.push(i);
  }
  return paginations;
};

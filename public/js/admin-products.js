//! Variables
const deleteProductBtn = document.querySelectorAll(".delete-product");
const mig = new Mig(5000);

//! Functions
const deleteProduct = async ({ target }) => {
  const parent = target.parentElement;
  const closest = target.closest("div.shadow-md");
  const csrfToken = parent.querySelector("input[name=_csrf]").value;
  const productId = parent.querySelector("input[name=productId]").value;
  fetch(`/admin/product/${productId}`, {
    method: "DELETE",
    headers: {
      "CSRF-Token": csrfToken,
    },
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      mig.success("Deleted!", "Product deleted success fully!");
      return closest.remove();
    })
    .catch((err) => {
      console.log(err);
    });
};

//! eventListeners
deleteProductBtn.forEach((e) => e.addEventListener("click", deleteProduct));

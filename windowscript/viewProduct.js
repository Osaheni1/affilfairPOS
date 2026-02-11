const description = document.getElementById("description");
const prodImage = document.getElementById("prod_image");
const product = JSON.parse(localStorage.getItem("ManageInventory")) || null;

description.innerHTML = product.description;

prodImage.innerHTML = `<img
          src="https://affilfair.com/api/images/products/${product.images[0]}"
          alt="prod-img"
          class="h-60 w-60"
        />`;

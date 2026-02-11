const stockList = document.getElementById("stock_list");
const stockSearch = document.getElementById("stock_search");
const allProd = document.getElementById("all_prod");
const outStock = document.getElementById("out_stock");
const belowStock = document.getElementById("below_stock");
const user = JSON.parse(localStorage.getItem("user")) || null;

stockFunc(user.products);

function stockFunc(stocks) {
  stocks?.forEach((lt) => {
    let listDiv = document.createElement("div");
    listDiv.innerHTML = `<div class="flex text-xs py-1.5 border-b border-gray-300">
              <span class="w-3/6 text-nowrap overflow-hidden">${lt.shortName}</span>
              <span class="w-2/6 text-nowrap">${lt.barcode}</span>
              <span class="w-1/6 pl-3 ">${lt.stockQuantity}</span>
           
            </div>`;

    stockList.appendChild(listDiv.firstChild);
  });
}

stockSearch.addEventListener("input", (e) => {
  const displayItem = user.products?.filter((item) =>
    String(item.shortName).includes(stockSearch.value),
  );
  stockList.innerHTML = "";
  stockFunc(displayItem);
});

allProd.addEventListener("click", () => {
  outStock.classList.remove("border");
  belowStock.classList.remove("border");
  allProd.classList.add("border");

  stockList.innerHTML = "";
  stockFunc(user.products);
});

outStock.addEventListener("click", () => {
  outStock.classList.add("border");
  belowStock.classList.remove("border");
  allProd.classList.remove("border");
  const out = user.products.filter((outs) => outs.stockQuantity <= 0);
  stockList.innerHTML = "";
  stockFunc(out);
});

belowStock.addEventListener("click", () => {
  outStock.classList.remove("border");
  belowStock.classList.add("border");
  allProd.classList.remove("border");
  stockList.innerHTML = "";

  const transaction = dbl.transaction("lowstock", "readwrite");
  const store = transaction.objectStore("lowstock");

  const prods = store.getAll();

  prods.onsuccess = () => {
    let val = prods.result;
    const low = user.products.filter((outs) =>
      val.find(
        (v) =>
          outs._id === v._id &&
          outs.stockQuantity <= v.belowStock &&
          outs.stockQuantity > 0,
      ),
    );

    stockFunc(low);
  };
});

let dbl;

const requestl = indexedDB.open("LowStocks");

requestl.onerror = () => {
  console.log("Failed to open the DB");
};

requestl.onupgradeneeded = () => {
  dbl = requestl.result;
  const store = dbl.createObjectStore("lowstock", {
    keyPath: "id",
    autoIncrement: true,
  });
  store.createIndex("product_name", ["shortName"], { unique: false });
  store.createIndex("product_id", ["_id"], { unique: false });
};

requestl.onsuccess = function () {
  dbl = requestl.result;
};

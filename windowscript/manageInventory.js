const stockPiece = document.getElementById("stock_quantity");
const lowStock = document.getElementById("low_stock");
const addStock = document.getElementById("add_stock");
const removeStock = document.getElementById("remove_stock");
const viewProduct = document.getElementById("view_product");
const historyList = document.getElementById("inventory_history");
const product = JSON.parse(localStorage.getItem("ManageInventory")) || null;

let dbh;

addStock.addEventListener("click", () => {
  window.electronApi.ipcSend("show-type4-window", "addStock");
});
removeStock.addEventListener("click", () => {
  window.electronApi.ipcSend("show-type4-window", "removeStock");
});
lowStock.addEventListener("click", () => {
  window.electronApi.ipcSend("show-type2-window", "lowStock");
});
viewProduct.addEventListener("click", () => {
  window.electronApi.ipcSend("show-type4-window", "viewProduct");
});

stockPiece.textContent = product.stockQuantity;
console.log(product);

const requesth = indexedDB.open("transHistory");

requesth.onerror = () => {
  console.log("Failed to open the DB");
};

requesth.onupgradeneeded = () => {
  dbh = requesth.result;
  const store = dbh.createObjectStore("history", {
    keyPath: "id",
    autoIncrement: true,
  });
  // store.createIndex("product_name", ["shortName"], { unique: false });
  store.createIndex("history_id", ["id"], { unique: false });
};

requesth.onsuccess = function () {
  dbh = requesth.result;
  const transaction = dbh.transaction("history", "readwrite");
  const store = transaction.objectStore("history");
  // const colourIndex = store.index("history_id");
  const prodHistory = store.getAll();

  prodHistory.onsuccess = () => {
    const hist = prodHistory.result;
    const prodList = hist?.filter((his) => his.prodId === product._id);
    prodList?.reverse().forEach((lt) => {
      let listDiv = document.createElement("div");
      listDiv.innerHTML = `<div class="flex text-xs border-b border-gray-300">
            <span class="w-4/12 py-1.5 text-nowrap">${lt.description}</span>
            <span class="w-2/12 py-1.5 pl-3">${lt.transQuant}</span>
            <span class="w-2/12 pl-3 py-1.5">${lt.beforeTrans}</span>
            <span class="w-2/12 pl-3 py-1.5">${lt.afterTrans}</span>
            <span class="w-2/12 pl-3 py-1.5">${lt.date}</span>
          </div>`;

      historyList.appendChild(listDiv.firstChild);
    });
  };
};

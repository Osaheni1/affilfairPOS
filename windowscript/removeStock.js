const removeQuant = document.getElementById("remove_quant");
const stockAfter = document.getElementById("stock_after");
const itemName = document.getElementById("item_name");
const reason = document.getElementById("reason");
const removeBtn = document.getElementById("removestock_btn");
const product = JSON.parse(localStorage.getItem("ManageInventory")) || null;

let dbp;
let dbh;

itemName.value = product.shortName;
stockAfter.value = product.stockQuantity + Number(removeQuant.value);

removeQuant.addEventListener("input", () => {
  stockAfter.value = product.stockQuantity - Number(removeQuant.value);
});

removeBtn.addEventListener("click", () => {
  console.log("stoock button clicked");
  const data = {
    quantity: product.stockQuantity - Number(removeQuant.value),
    id: product._id,
  };
  window.electronApi.ipcSend("add-stock", data);
});

window.electronApi.ipcReceive("stock-added", (event, data) => {
  const requestp = indexedDB.open("AllProducts");

  requestp.onerror = () => {
    console.log("Failed to open the DB");
  };

  requestp.onupgradeneeded = () => {
    dbp = requestp.result;
    const store = dbp.createObjectStore("product", {
      keyPath: "id",
      autoIncrement: true,
    });
    store.createIndex("product_name", ["shortName"], { unique: false });
    store.createIndex("product_id", ["_id"], { unique: false });
  };

  requestp.onsuccess = function () {
    console.log("request created successfully");
    dbp = requestp.result;
    const transaction = dbp.transaction("product", "readwrite");
    const store = transaction.objectStore("product");

    const productIndex = store.index("product_id");
    const updateProduct = productIndex.get([product._id]);

    updateProduct.onsuccess = function () {
      updateProduct.result.stockQuantity =
        product.stockQuantity - Number(removeQuant.value);
      store.put(updateProduct.result);
      console.log(updateProduct.result);
      historyFunc();
      localStorage.setItem(
        "ManageInventory",
        JSON.stringify(updateProduct.result),
      );
      window.electronApi.ipcSend("close-type4-window");
    };
  };
});

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

  // localStorage.setItem("invoice", JSON.stringify(invoiceList));
};

function historyFunc() {
  const transaction = dbh.transaction("history", "readwrite");
  const store = transaction.objectStore("history");

  const histransaction = {
    prodId: product._id,
    date: new Date(Date.now()).toLocaleString(),
    transQuant: removeQuant.value,
    beforeTrans: product.stockQuantity,
    afterTrans: product.stockQuantity - Number(removeQuant.value),
    description: reason.value ? reason.value : "Damage product",
  };

  store.put(histransaction);
}

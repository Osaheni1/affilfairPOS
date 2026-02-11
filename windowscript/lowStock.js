const product = JSON.parse(localStorage.getItem("ManageInventory")) || null;
const lowQuant = document.getElementById("low_input");
const lowBtn = document.getElementById("low_btn");

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

lowBtn.addEventListener("click", () => {
  const transaction = dbl.transaction("lowstock", "readwrite");
  const store = transaction.objectStore("lowstock");

  let val = product;
  val["belowStock"] = lowQuant.value;
  store.put(val);

  window.electronApi.ipcSend("close-type2-window");
});

const inventoryList = document.getElementById("inventory_list");
const saleSearch = document.getElementById("input");

let proditem;
let dbp;

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

  const prodI = store.getAll();

  prodI.onsuccess = function () {
    proditem = prodI.result;
    const revProdItem = proditem.reverse();

    console.log(revProdItem);

    inventoryListFunc(revProdItem);
  };
};

saleSearch.addEventListener("input", (e) => {
  const displayItem = proditem?.filter((item) =>
    String(item.shortName).includes(saleSearch.value),
  );
  inventoryList.innerHTML = "";
  inventoryListFunc(displayItem);
});

function inventoryListFunc(revProdItem) {
  revProdItem.forEach((elem) => {
    let listDiv = document.createElement("div");
    listDiv.innerHTML = `<div class="flex text-xs border-b border-gray-300">
              <span class="w-4/12 py-1.5 text-nowrap">${elem.shortName}</span>
              <span class="w-2/12 py-1.5">${elem.barcode}</span>
              <span class="w-2/12 pl-3 py-1.5">${elem.category}</span>
              <span class="w-2/12 pl-3 py-1.5">${elem.price}</span>
              <span
                class="w-2/12 flex text-green-500 hover:bg-blue-100 cursor-default pl-5 py-1.5"
                id=${elem._id}
              >
                Manage Inventory
              </span>
            </div>`;

    elem.status === "Active" && inventoryList.appendChild(listDiv.firstChild);

    elem.status === "Active" &&
      document.getElementById(elem._id).addEventListener("click", () => {
        console.log("event clicked");
        localStorage.setItem("ManageInventory", JSON.stringify(elem));
        window.electronApi.ipcSend("show-type3-window", "manageInventory");
      });
  });
}

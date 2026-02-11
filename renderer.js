let itemList = document.getElementById("list");
const products = document.getElementById("products");
const dicountBtn = document.getElementById("discount");
const amountDiscounted = document.getElementById("amount_discounted");
const clearCartBtn = document.getElementById("clear_cart");
const itemQuantity = document.getElementById("item_quantity");
const totalNumItem = document.getElementById("total_numitem");
const total = document.getElementById("total");
const subtotal = document.getElementById("subtotal");
const printcheckbox = document.getElementById("printcheckbox");
const print = document.getElementById("print");
const salesBtn = document.getElementById("salesbtn");
const orderBtn = document.getElementById("orderbtn");
const invoiceBtn = document.getElementById("print_invoice");
const inventoryBtn = document.getElementById("inventory");
const stockBtn = document.getElementById("stock");
const signoutBtn = document.getElementById("signout");
const productSearch = document.getElementById("product_search");
const allProdBtn = document.getElementById("all_prod");
const categoryBtn = document.getElementById("category");
const discVal = JSON.parse(localStorage.getItem("discountedAmount")) || null;
const user = JSON.parse(localStorage.getItem("user")) || null;

console.log(discVal);
let proditem;
let toPrint;
let totalToPrint;
let toBePrinted;
let db;
let dbs;
let dbp;
let dbh;

allProdBtn.addEventListener("click", () => {
  categoryBtn.classList.remove("border");
  allProdBtn.classList.add("border");
  products.innerHTML = "";
  prodItemFunc(proditem);
});

categoryBtn.addEventListener("click", () => {
  categoryBtn.classList.add("border");
  allProdBtn.classList.remove("border");
  const cat = proditem?.map((c) => c.category);
  const category = [...new Set(cat)];
  console.log(category);
  products.innerHTML = "";
  category?.forEach((pro, i) => {
    let printDiv = document.createElement("div");

    printDiv.innerHTML = `<div
                  class="flex flex-col my-2 mr-2 w-36 border cursor-pointer text-xs font-bold border-gray-50 shadow rounded-xl" id="${pro}_cat"
                >
                  <img
                    src='assets/inventory.png'
                    alt="prod-img"
                    class="h-36 w-36"
                  />
                  <span class="mt-2 mx-1">${pro}</span>
                  
                </div>`;

    products.appendChild(printDiv.firstChild);

    document.getElementById(`${pro}_cat`).addEventListener("click", () => {
      const displayItem = proditem?.filter((item) =>
        item.category.includes(pro),
      );
      products.innerHTML = "";
      prodItemFunc(displayItem);
    });
  });
});

productSearch.addEventListener("input", (e) => {
  const displayItem = proditem?.filter((item) =>
    item.shortName.toLowerCase().includes(productSearch.value.toLowerCase()),
  );
  products.innerHTML = "";
  prodItemFunc(displayItem);
});

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

  // const cleared = store.clear();

  const prodI = store.getAll();

  prodI.onsuccess = function () {
    proditem = prodI.result;
    // const revProdItem = proditem.reverse()
    console.log("here on instance............");
    products.innerHTML = "";
    prodItemFunc(proditem);
  };
};

// window.electronApi.ipcReceive("testing things", () => {
//   console.log("hello there.....");
// });

window.electronApi.ipcReceive("get-all-products", async (event, user) => {
  console.log(user, "hello render");
  // clearList();
  // alert("hey i am here");

  localStorage.setItem("user", JSON.stringify(user));
  const dataa = await user.products;

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

    console.log("hey people");

    const cleared = store.clear();
    cleared.onsuccess = () => {
      console.log("cart cleared successfully");

      dataa?.forEach((prod, i) => {
        store.put(prod);
      });
      console.log("here on receive..........");
      products.innerHTML = "";
      prodItemFunc(dataa);
    };

    // window.electronApi.ipcSendSync("show-window", "sales");
    resetPrintItems();
  };
});

// window.electronApi.ipcReceive("update-user", async (event, reloadUser) => {
//   console.log(reloadUser, "hello render");
//   resetPrintItems();
//   // alert("i am here");

//   // localStorage.setItem("user", JSON.stringify(reloadUser));
// });

signoutBtn.addEventListener("click", () => {
  window.electronApi.ipcSend("logout-user");
});

amountDiscounted.textContent =
  discVal === null ? "# 0" : "# " + new Intl.NumberFormat().format(discVal);
printcheckbox.checked = true;

salesBtn.addEventListener("click", () => {
  window.electronApi.ipcSend("show-type3-window", "sales");
});

stockBtn.addEventListener("click", () => {
  console.log("i am here");
  window.electronApi.ipcSend("show-type3-window", "stock");
});

orderBtn.addEventListener("click", async () => {
  // await window.electronApi.ipcSend("reload-data", user._id);
  window.electronApi.ipcSend("show-type3-window", "onlineOrders");
});

inventoryBtn.addEventListener("click", () => {
  window.electronApi.ipcSend("show-type3-window", "inventory");
});

invoiceBtn.addEventListener("click", () => {
  const transaction = db.transaction("item", "readwrite");
  const store = transaction.objectStore("item");

  const toPrintr = store.getAll();

  toPrintr.onsuccess = function () {
    if (!toPrint[0])
      return window.electronApi.ipcSend(
        "warning-box",
        "No invoice content, select item first",
      );
    console.log(toPrintr.result);
    toPrint = toPrintr.result;
    const invoiceList = {
      billNumber: Date.now(),
      date: new Date(Date.now()).toLocaleString(),
      customer: "Anonymous",
      subtotal: toBePrinted,

      sales: toPrint,
    };
    localStorage.setItem("invoice", JSON.stringify(invoiceList));
    window.electronApi.ipcSend("show-type3-window", "invoice");
  };
});

print.addEventListener("click", () => {
  if (toBePrinted < 1)
    return window.electronApi.ipcSend(
      "warning-box",
      "No item to print, select item first",
    );
  const requests = indexedDB.open("Savedsales", 1);

  requests.onerror = () => {
    console.log("Failed to open the DB");
  };

  requests.onupgradeneeded = () => {
    dbs = requests.result;
    const store = dbs.createObjectStore("sale", {
      keyPath: "id",
      autoIncrement: true,
    });
    store.createIndex("bill_number", ["billNumber"], { unique: false });
  };

  requests.onsuccess = function () {
    dbs = requests.result;
    const transaction = dbs.transaction("sale", "readwrite");
    const store = transaction.objectStore("sale");
    const salesDetails = {
      user: user.name,
      billNumber: Date.now(),
      date: new Date(Date.now()).toLocaleString(),
      customer: "Anonymous",
      subtotal: toBePrinted,
      discount: Number(discVal),
      sales: toPrint,
    };

    store.put(salesDetails);
    localStorage.setItem("sale", JSON.stringify(salesDetails));

    if (printcheckbox.checked)
      window.electronApi.ipcSend("show-receipt-window");

    const transactionp = dbp.transaction("product", "readwrite");
    const storep = transactionp.objectStore("product");
    const productIndex = storep.index("product_id");
    toPrint.forEach((item) => {
      const updateProduct = productIndex.get([item._id]);
      historyFunc(item._id, item.quantity, item.stockQuantity);

      updateProduct.onsuccess = function () {
        updateProduct.result.stockQuantity = item.stockQuantity - item.quantity;
        storep.put(updateProduct.result);
        item.stockQuantity = item.stockQuantity - item.quantity;
        if (item._id === toPrint[toPrint.length - 1]._id) {
          console.log(toPrint);
          window.electronApi.ipcSend("complete-sale", toPrint);
          clearList();
        }
      };
    });
  };
});

dicountBtn.addEventListener("click", () => {
  if (!toPrint[0])
    return window.electronApi.ipcSend(
      "warning-box",
      "No item for discount, select item first",
    );
  const total = toPrint.reduce((acc, cur) => acc + cur.price * cur.quantity, 0);

  const discountval = { totalAmount: total, type: "percent", disAmount: 0 };

  localStorage.setItem("discount", JSON.stringify(discountval));
  window.electronApi.ipcSend("show-type2-window", "discount");
});

const request = indexedDB.open("ItemToPrint");

request.onerror = () => {
  console.log("Failed to open the DB");
};

request.onupgradeneeded = () => {
  db = request.result;
  const store = db.createObjectStore("item", {
    keyPath: "tag",
    autoIncrement: true,
  });
  store.createIndex("item_name", ["shortName"], { unique: false });
};

request.onsuccess = function () {
  db = request.result;

  itemToSavePrint();
};

// const proditem = [
//   { id: 1, name: "rice", qauntity: 6, amount: 30 },
//   { id: 2, name: "yam", qauntity: 7, amount: 100 },
//   { id: 3, name: "soap", qauntity: 3, amount: 77 },
//   { id: 4, name: "food", qauntity: 2, amount: 600 },
//   { id: 5, name: "1", qauntity: 9, amount: 55 },
// ];

// proditem?.forEach((pro, i) => {
//   console.log(pro);
//   let printDiv = document.createElement("div");

//   printDiv.innerHTML = `<div
//                   class="flex flex-col my-2 mr-2 w-36 border text-xs font-bold border-gray-50 shadow rounded-xl" id="${pro._id}_prod"
//                 >
//                   <img
//                     src="assets/facebook_4701482.png"
//                     alt="prod-img"
//                     class="h-36 w-36"
//                   />
//                   <span class="mt-2 mx-1">${pro.shortName}</span>
//                   <span class="my-2 mx-1">#${pro.price}</span>
//                 </div>`;

//   products.appendChild(printDiv.firstChild);
// });

// proditem?.forEach((pro, i) => {
//   document.getElementById(`${pro._id}_prod`).addEventListener("click", (e) => {
//     e.preventDefault();
//     const transaction = db.transaction("item", "readwrite");
//     const store = transaction.objectStore("item");
//     store.put(pro);
//     console.log(pro);
//     // e.preventDefault();
//     //   obj.push(pro);
//     // localStorage.setItem("drte", JSON.stringify([...toPrint, pro]));
//     localStorage.setItem("discountedAmount", "0");
//     location.reload();
//   });
// });
console.log(toPrint);

clearCartBtn.addEventListener("click", clearList);

function clearList() {
  const transaction = db.transaction("item", "readwrite");
  const store = transaction.objectStore("item");
  const cleared = store.clear();

  cleared.onsuccess = () => {
    console.log("cart cleared successfully");
    localStorage.setItem("discountedAmount", "0");
    location.reload();
  };
}

function prodItemFunc(proditem) {
  proditem?.forEach((pro, i) => {
    let printDiv = document.createElement("div");

    printDiv.innerHTML = `<div
                  class="flex flex-col my-2 mr-2 w-36 border cursor-pointer text-xs font-bold border-gray-50 shadow rounded-xl" id="${pro._id}_prod"
                >
                  <img
                    src="https://affilfair.com/api/images/products/${pro.images[0]}"
                    alt="prod-img"
                    class="h-36 w-36"
                  />
                  <span class="mt-2 mx-1">${pro.shortName}</span>
                  <span class="my-2 mx-1"># ${new Intl.NumberFormat().format(pro.price)}</span>
                </div>`;

    pro.status === "Active" && products.appendChild(printDiv.firstChild);
  });

  proditem?.forEach((pro, i) => {
    pro.status === "Active" &&
      document
        .getElementById(`${pro._id}_prod`)
        .addEventListener("click", (e) => {
          e.preventDefault();
          if (pro.stockQuantity < 1)
            return window.electronApi.ipcSend(
              "warning-box",
              `${pro.shortName} is out of stock!!!`,
            );
          const transaction = db.transaction("item", "readwrite");
          const store = transaction.objectStore("item");
          const torint = store.getAll();

          torint.onsuccess = function () {
            rint = torint.result;

            tt = rint[0] ? rint[rint.length - 1].tag : 0;
            pro["tag"] = toPrint.some((pr) => pr._id === pro._id)
              ? null
              : tt + 1;
            pro["user"] = user.name;
            pro["userId"] = user._id;
            pro["quantity"] = 1;
            store.put(pro);
            console.log(pro);
            // e.preventDefault();
            //   obj.push(pro);
            // localStorage.setItem("drte", JSON.stringify([...toPrint, pro]));
            amountDiscounted.textContent = "# 0";
            localStorage.setItem("discountedAmount", "0");
            // location.reload();
            itemList.innerHTML = "";
            itemToSavePrint();
          };
        });
  });
}

function itemToSavePrint() {
  const transaction = db.transaction("item", "readwrite");
  const store = transaction.objectStore("item");
  const colourIndex = store.index("item_name");

  const toPrintr = store.getAll();

  toPrintr.onsuccess = function () {
    console.log(toPrintr.result);
    toPrint = toPrintr.result;
    toPrint = toPrint?.filter((li) => li.user === user.name);

    itemQuantity.textContent = toPrint.length;
    totalNumItem.textContent = toPrint.reduce(
      (acc, curr) => acc + curr.quantity,
      0,
    );
    total.textContent =
      "# " +
      new Intl.NumberFormat().format(
        toPrint.reduce((acc, cur) => acc + cur.quantity * cur.price, 0),
      );

    toBePrinted =
      toPrint.reduce((acc, cur) => acc + cur.quantity * cur.price, 0) -
      Number(discVal);

    subtotal.textContent = new Intl.NumberFormat().format(toBePrinted);

    const revToPrint = toPrint.reverse();

    revToPrint.forEach((element, i) => {
      let listDiv = document.createElement("div");
      listDiv.innerHTML = `<div key='${
        element._id
      }' class='bg-white h-6 w-full flex items-center px-1 border-t border-gray-300' id='${
        element._id
      }_list'><span class='w-1/5 lg:w-2/6 ml-0.5 text-nowrap overflow-hidden mr-1'>${
        element.shortName
      }</span><span class='w-1/5 lg:w-1/6 ml-1 lg:ml-0.5'>${
        element.quantity
      }</span><span class='w-1/5 lg:w-1/6 pl-2'>${new Intl.NumberFormat().format(
        element.price,
      )}</span><span class='w-1/5 lg:w-1/6 pl-2'>${new Intl.NumberFormat().format(
        element.quantity * element.price,
      )}</span><span class='w-1/5 lg:w-1/6 flex ml-1'><img src='assets/edit.png' alt='edit' class='h-4 mr-4 lg:mr-6 cursor-pointer' id='${
        element._id
      }_edit'/><img src='assets/delete.png' alt='delete' class='h-4 cursor-pointer' id='${
        element._id
      }_delete'/></span></div>`;

      itemList.appendChild(listDiv.firstChild);

      document
        .getElementById(`${element._id}_delete`)
        .addEventListener("click", (e) => {
          const transaction = db.transaction("item", "readwrite");
          const store = transaction.objectStore("item");

          const colourIndex = store.index("item_name");

          const itemToD = store.getKey(element.tag);
          // const itemToD = colourIndex.getKey([`${element.shortName}`]);
          console.log(itemToD);

          itemToD.onsuccess = function () {
            console.log(itemToD.result);
            const deleteItem = store.delete(itemToD.result);

            deleteItem.onsuccess = function () {
              console.log(`${element.name} has been deleted`);

              amountDiscounted.textContent = "# 0";
              localStorage.setItem("discountedAmount", "0");
              // itemList.removeChild(
              //   document.getElementById(`${element.name}_list`)
              // );
              // location.reload();
              itemList.innerHTML = "";
              itemToSavePrint();
            };
          };
        });
      document
        .getElementById(`${element._id}_edit`)
        .addEventListener("click", (e) => {
          console.log(element.shortName + " is clicked");
          localStorage.setItem("update", JSON.stringify(element));

          window.electronApi.ipcSend("show-window", "updateCartItem");
        });
    });
  };
}

function resetPrintItems() {
  const request = indexedDB.open("ItemToPrint");

  request.onerror = () => {
    console.log("Failed to open the DB");
  };

  request.onupgradeneeded = () => {
    db = request.result;
    const store = db.createObjectStore("item", {
      keyPath: "tag",
      autoIncrement: true,
    });
    store.createIndex("item_name", ["shortName"], { unique: false });
  };

  request.onsuccess = function () {
    db = request.result;
    const transaction = db.transaction("item", "readwrite");
    const store = transaction.objectStore("item");
    const cleared = store.clear();

    cleared.onsuccess = () => {
      localStorage.setItem("discountedAmount", "0");
      // itemList.innerHTML = "";
      location.reload();
    };
  };
}

function historyFunc(id, quantity, instock) {
  const transaction = dbh.transaction("history", "readwrite");
  const store = transaction.objectStore("history");

  const histransaction = {
    prodId: id,
    date: new Date(Date.now()).toLocaleString(),
    transQuant: quantity,
    beforeTrans: instock,
    afterTrans: instock - quantity,
    description: "In store purchase",
  };

  store.put(histransaction);
}

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

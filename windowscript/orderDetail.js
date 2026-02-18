const orderId = document.getElementById("order_id");
const orderDate = document.getElementById("order_date");
const orderType = document.getElementById("order_type");
const customerEmail = document.getElementById("customer_email");
const checkout = document.getElementById("checkout");
const cancelOrder = document.getElementById("cancel_order");
const printcheckbox = document.getElementById("print_receipt");
const subtotal = document.getElementById("subtotal");
const payment = document.getElementById("payment");
const orderStatus = document.getElementById("order_status");
const orderList = document.getElementById("order_list");
const order = JSON.parse(localStorage.getItem("order")) || null;
const user = JSON.parse(localStorage.getItem("user")) || null;

let db;
let dbh;
let dbs;
let dbu;
let dbp;
let sale = [];

console.log(order);

orderId.textContent = order.id;
orderType.textContent = order.affiliate ? "Affiliate" : "Direct";
orderDate.textContent = new Date(order.date).toLocaleString();
customerEmail.textContent = order.email;
orderStatus.textContent = order.status;
payment.textContent = order.payment;

if (order.status !== "confirmed") {
  cancelOrder.disabled = true;
  checkout.disabled = true;
  cancelOrder.classList.remove("bg-red-800");
  cancelOrder.classList.add("bg-gray-300");
  checkout.classList.add("bg-gray-300");
}

subtotal.textContent =
  "# " +
  new Intl.NumberFormat().format(
    order.cart.reduce((acc, cur) => acc + cur.amount, 0),
  );

console.log(order);
order.cart.forEach((element) => {
  let item = user.products.filter((prod) => prod._id === element.productId)[0];

  item["quantity"] = element.quantity;
  sale.push(item);
  // user.products.find((pr) => pr._id);
  let listDiv = document.createElement("div");
  listDiv.innerHTML = ` <div class="flex text-xs py-1.5 border-b border-gray-300">
            <span class="w-2/6 text-nowrap overflow-hidden">${element.shortName ? element.shortName : element.productName}</span>
            <span class="w-1/6 pl-2">${new Intl.NumberFormat().format(element.amount)}</span>
            <span class="w-1/6 pl-4">${element.quantity}</span>
            <span class="w-1/6 pl-4">${new Intl.NumberFormat().format(element.amount * element.quantity)}</span>
            <span class="w-1/6 pl-4 ${item.stockQuantity > 0 ? "text-blue-600" : "text-red-600"}">${item.stockQuantity > 0 ? "In stock" : "Out of stock"}</span>
          </div>`;

  orderList.appendChild(listDiv);
});

window.electronApi.ipcReceive("reload-order", async (event, reloadOrder) => {
  console.log(reloadOrder, "hello render");
  new Notification("Orders action", { body: "Successful" });
  localStorage.setItem("order", JSON.stringify(reloadOrder.data.data));
  orderList.innerHTML = "";
  // location.reload();
  window.electronApi.ipcSend("close-type3-window");
});

window.electronApi.ipcReceive("update-user", async (event, reloadUser) => {
  console.log(reloadUser, "hello render");
  const ord = reloadUser.order.find((orde) => orde._id === order._id);
  localStorage.setItem("order", JSON.stringify(ord));
  localStorage.setItem("user", JSON.stringify(reloadUser));
  const dataa = await reloadUser.products;

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

    const cleared = store.clear();
    cleared.onsuccess = () => {
      console.log("cart cleared successfully");

      dataa?.forEach((prod, i) => {
        store.put(prod);
        if (prod._id === dataa[dataa.length - 1]._id) {
          clearPrintList();
          window.electronApi.ipcSend("close-type3-window");
        }
      });
    };
  };
});

window.electronApi.ipcReceive("updated", async (event, data) => {
  window.electronApi.ipcSend("reload-data", user._id);
  new Notification("Checkout", { body: "Successful" });
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
      customer: order.email,
      subtotal: order.cart.reduce((acc, cur) => acc + cur.amount, 0),
      discount: 0,
      sales: sale,
    };

    store.put(salesDetails);
    localStorage.setItem("sale", JSON.stringify(salesDetails));

    if (printcheckbox.checked)
      window.electronApi.ipcSend("show-receipt-window");
  };
});

cancelOrder.addEventListener("click", () => {
  console.log("cancel order");
  const val = { form: { status: "canceled" }, id: order._id };
  window.electronApi.ipcSend("update-order-status", val);
  cancelOrder.disabled = true;
  checkout.disabled = true;
  cancelOrder.classList.remove("bg-red-800");
  cancelOrder.classList.add("bg-gray-300");
  checkout.classList.add("bg-gray-300");
});

checkout.addEventListener("click", () => {
  console.log("checkout", sale);
  sale.forEach((item) =>
    historyFunc(item._id, item.quantity, item.stockQuantity),
  );
  // const val = ["e", "y", "w"];
  const val = { product: sale, order: order };
  window.electronApi.ipcSend("checkout-order", val);

  cancelOrder.disabled = true;
  checkout.disabled = true;
  cancelOrder.classList.remove("bg-red-800");
  cancelOrder.classList.add("bg-gray-300");
  checkout.classList.add("bg-gray-300");

  // const requestu = indexedDB.open("needUpdate", 1);

  // requestu.onerror = () => {
  //   console.log("Failed to open the DB");
  // };

  // requestu.onupgradeneeded = () => {
  //   dbu = requestu.result;
  //   const store = dbs.createObjectStore("update", {
  //     keyPath: "id",
  //     autoIncrement: true,
  //   });
  //   store.createIndex("name", ["shortName"], { unique: false });
  // };

  //  requestu.onsuccess = function () {
  //   dbu = requestu.result;
  //   const transaction = dbu.transaction("update", "readwrite");
  //   const store = transaction.objectStore("update");
  //   const salesDetails = {

  //   };

  //   store.put(salesDetails);
});

function clearPrintList() {
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
      console.log("cart cleared successfully");
      localStorage.setItem("discountedAmount", "0");
    };
  };
}

function historyFunc(id, quantity, instock) {
  const transactionh = dbh.transaction("history", "readwrite");
  const storeh = transactionh.objectStore("history");

  const histransaction = {
    prodId: id,
    date: new Date(Date.now()).toLocaleString(),
    transQuant: quantity,
    beforeTrans: instock,
    afterTrans: instock - quantity,
    description: "Online purchase",
  };

  storeh.put(histransaction);
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

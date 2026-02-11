const title = document.getElementById("title");
const display = document.getElementById("display");
const totalAmount = document.getElementById("total_amount");
const one = document.getElementById("one");
const two = document.getElementById("two");
const three = document.getElementById("three");
const four = document.getElementById("four");
const five = document.getElementById("five");
const six = document.getElementById("six");
const seven = document.getElementById("seven");
const eight = document.getElementById("eight");
const nine = document.getElementById("nine");
const zero = document.getElementById("zero");
const dot = document.getElementById("dot");
const del = document.getElementById("del");
const updateBtn = document.getElementById("update_btn");
const cart = JSON.parse(localStorage.getItem("update")) || null;

let db;

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
};

request.onsuccess = function () {
  db = request.result;
  console.log("Database is ready");
  updateBtn.addEventListener("click", () => {
    const transaction = db.transaction("item", "readwrite");
    const store = transaction.objectStore("item");

    const colourIndex = store.index("item_name");
    const updateItem = colourIndex.get([cart.shortName]);

    updateItem.onsuccess = function () {
      if (updateItem.result.stockQuantity < Number(dis))
        return window.electronApi.ipcSend(
          "warning-box",
          `${updateItem.result.stockQuantity} ${updateItem.result.shortName} left in stock`,
        );
      updateItem.result.quantity = Number(dis);
      store.put(updateItem.result);
      console.log(updateItem.result);
      // sabaru.result.colour = "Green"
      // store.put(sabaru.result);

      // console.log(sabaru.result);
      //   console.log(updateItem.result);
      localStorage.setItem("discountedAmount", "0");
      window.electronApi.ipcSend("close-update-window");
    };
    console.log("submit button selected");
  });
};

title.textContent = cart.shortName;
console.log(cart);
totalAmount.textContent = `# ${new Intl.NumberFormat().format(cart.price)}`;
// display.textContent = cart.qauntity;

let dis = "";

one.addEventListener("click", () => {
  dis += 1;
  display.textContent = dis;
  totalAmount.textContent = `# ${cart.price * Number(dis)}`;
});
two.addEventListener("click", () => {
  dis += 2;
  display.textContent = dis;
  totalAmount.textContent = `# ${cart.price * Number(dis)}`;
});
three.addEventListener("click", () => {
  dis += 3;
  display.textContent = dis;
  totalAmount.textContent = `# ${cart.price * Number(dis)}`;
});
four.addEventListener("click", () => {
  dis += 4;
  display.textContent = dis;
  totalAmount.textContent = `# ${cart.price * Number(dis)}`;
});
five.addEventListener("click", () => {
  dis += 5;
  display.textContent = dis;
  totalAmount.textContent = `# ${cart.price * Number(dis)}`;
});
six.addEventListener("click", () => {
  dis += 6;
  display.textContent = dis;
  totalAmount.textContent = `# ${cart.price * Number(dis)}`;
});
seven.addEventListener("click", () => {
  dis += 7;
  display.textContent = dis;
  totalAmount.textContent = `# ${cart.price * Number(dis)}`;
});
eight.addEventListener("click", () => {
  dis += 8;
  display.textContent = dis;
  totalAmount.textContent = `# ${cart.price * Number(dis)}`;
});
nine.addEventListener("click", () => {
  dis += 9;
  display.textContent = dis;
  totalAmount.textContent = `# ${cart.price * Number(dis)}`;
});
zero.addEventListener("click", () => {
  dis += 0;
  display.textContent = dis;
  totalAmount.textContent = `# ${cart.price * Number(dis)}`;
});
dot.addEventListener("click", () => {
  dis += ".";
  display.textContent = dis;
  totalAmount.textContent = `# ${cart.price * Number(dis)}`;
});
del.addEventListener("click", () => {
  dis = dis.slice(0, -1);
  display.textContent = dis;
  if (Number(dis) > 0) {
    totalAmount.textContent = `# ${cart.price * Number(dis)}`;
  } else totalAmount.textContent = "# 100";
});

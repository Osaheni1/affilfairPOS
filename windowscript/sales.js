const salesList = document.getElementById("sales_list");
const saleSearch = document.getElementById("sale_search");
const user = JSON.parse(localStorage.getItem("user")) || null;

let dbs;
let list

saleSearch.addEventListener("input", (e) => {
  console.log(saleSearch.value,'right here')
  // const actualList = list?.filter(li => li.user === user.name)
  const displayItem = list?.filter((item) =>
    
    String(item.billNumber).includes(saleSearch.value)
  );
   salesList.innerHTML = ""
    salesFunc(displayItem)
});

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
  const sales = store.getAll()

  sales.onsuccess = () => {
    list = sales.result
list = list?.filter(li => li.user === user.name)
    list.reverse()

    salesList.innerHTML = ""
    salesFunc(list)
  };
};

function salesFunc(lists){
  lists.forEach((lt) => {
      let listDiv = document.createElement("div");
      listDiv.innerHTML = `<div class="flex text-xs py-1.5 border-b border-gray-300">
              <span class="w-2/12">${lt.billNumber}</span>
              <span class="w-2/12 text-nowrap">${lt.date}</span>
              <span class="w-4/12 pl-3 text-nowrap">${lt.customer}</span>
              <span class="w-2/12 pl-3">${new Intl.NumberFormat().format(lt.subtotal)}</span>
              <span class="w-2/12 flex"
                ><img
                  src="../assets/delete.png"
                  alt="delete"
                  class="h-4 cursor-pointer mr-14 pl-2" id='${lt.billNumber}_delete'/><img
                  src="../assets/file.png"
                  alt="delete"
                  class="h-4 cursor-pointer" id='${lt.billNumber}_view'
              /></span>
            </div>`;

      salesList.appendChild(listDiv.firstChild);

      document
        .getElementById(`${lt.billNumber}_delete`)
        .addEventListener("click", () => {
          const transaction = dbs.transaction("sale", "readwrite");
          const store = transaction.objectStore("sale");

          const saleIndex = store.index("bill_number");
          const saleToD = saleIndex.getKey([lt.billNumber]);

          saleToD.onsuccess = function () {
            const deleteItem = store.delete(saleToD.result);

            deleteItem.onsuccess = function () {
              location.reload();
            };
          };
        });

      document
        .getElementById(`${lt.billNumber}_view`)
        .addEventListener("click", () => {
          localStorage.setItem("salesMade", JSON.stringify(lt));
          window.electronApi.ipcSend("show-type3-window", "salesDetail");
        });
    });
}
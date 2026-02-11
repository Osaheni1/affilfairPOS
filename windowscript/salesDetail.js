const detail = JSON.parse(localStorage.getItem("salesMade")) || null;
const billNumber = document.getElementById("bill_number");
const billDate = document.getElementById("bill_date");
const customer = document.getElementById("customer");
const total = document.getElementById("total");
const discount = document.getElementById("discount");
const subtotal = document.getElementById("subtotal");
const salesList = document.getElementById("sales_list");
const printReceiptBtn = document.getElementById("print_receipt");
const printInvoiceBtn = document.getElementById("print_invoice");

console.log(detail)

billNumber.textContent = detail.billNumber;
billDate.textContent = detail.date;
customer.textContent = detail.customer;
total.textContent =
  "# " + new Intl.NumberFormat().format(detail.sales.reduce((acc, cur) => acc + cur.stockQuantity * cur.price, 0));
subtotal.textContent = "# " + new Intl.NumberFormat().format(detail.subtotal);

discount.textContent = detail.discount ? "# " + new Intl.NumberFormat().format(detail.discount) : "# 0";

detail.sales.forEach((element) => {
  let listDiv = document.createElement("div");
  listDiv.innerHTML = ` <div class="flex text-xs py-1.5 border-b border-gray-300">
            <span class="w-3/6 text-nowrap">${element.shortName}</span>
            <span class="w-1/6 pl-2">${new Intl.NumberFormat().format(element.price)}</span>
            <span class="w-1/6 pl-4">${element.stockQuantity}</span>
            <span class="w-1/6 pl-4">${new Intl.NumberFormat().format(element.stockQuantity * element.price)}</span>
          </div>`;

  console.log(element);
  salesList.appendChild(listDiv);
});

printReceiptBtn.addEventListener("click", () => {
  localStorage.setItem("sale", JSON.stringify(detail));
  window.electronApi.ipcSend("show-receipt-window");
});

printInvoiceBtn.addEventListener("click", () => {
  localStorage.setItem("invoice", JSON.stringify(detail));
  window.electronApi.ipcSend("show-type3-window", "invoice");
});

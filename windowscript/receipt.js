const sale = JSON.parse(localStorage.getItem("sale")) || null;
const saleBillNumber = document.getElementById("bill_number");
const saleDate = document.getElementById("sale_date");
const saleList = document.getElementById("sale_list");
const total = document.getElementById("total");
const billTotal = document.getElementById("bill_total");
const companyName = document.getElementById("company_name");
const companyAddress = document.getElementById("company_address");
const companyPhone = document.getElementById("company_phone");
const companyEmail = document.getElementById("company_email");

const user = JSON.parse(localStorage.getItem("user")) || null;

console.log(user, "here in receipt");

companyName.textContent = user.name;
companyAddress.textContent = user.address + " " + user.city;
companyPhone.textContent = "+" + user.phone;
companyEmail.textContent = user.email;

saleBillNumber.textContent = sale.billNumber;
saleDate.textContent = sale.date;
total.textContent =
  "# " +
  new Intl.NumberFormat().format(
    sale.sales.reduce((acc, cur) => acc + cur.quantity * cur.price, 0),
  );

billTotal.textContent = "# " + new Intl.NumberFormat().format(sale.subtotal);

sale.sales.forEach((element) => {
  let listDiv = document.createElement("div");
  listDiv.innerHTML = `<div class="flex border-b border-dashed text-sm py-2">
            <span class="w-2/4 mr-2">${element.shortName}</span>
            <span class="w-1/4">${element.quantity}</span>
            <span class="w-1/4">${new Intl.NumberFormat().format(element.price)}</span>
            <span class="w-1/4">${new Intl.NumberFormat().format(element.quantity * element.price)}</span>
          </div>`;

  saleList.appendChild(listDiv.firstChild);
});
window.print();

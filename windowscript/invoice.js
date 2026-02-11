const invoice = JSON.parse(localStorage.getItem("invoice")) || null;
const user = JSON.parse(localStorage.getItem("user")) || null;

const customer = document.getElementById("customer_name");
const invoiceDate = document.getElementById("invoice_date");
const invoiceNumber = document.getElementById("invoice_number");
const invoiceList = document.getElementById("invoice_list");
const total = document.getElementById("total");
const subtotal = document.getElementById("subtotal");
const companyName = document.getElementById('company_name')
const companyAddress = document.getElementById('company_address')
const companyPhone = document.getElementById('company_phone')
const companyEmail = document.getElementById('company_email')

console.log(user, 'here in invoice')

companyName.textContent = user.name
companyAddress.textContent = user.address + " " + user.city 
companyPhone.textContent = '+' + user.phone
companyEmail.textContent = user.email

customer.textContent = invoice.customer;
invoiceDate.textContent = invoice.date;
invoiceNumber.textContent = invoice.billNumber;
total.textContent =
  "# " +
  new Intl.NumberFormat().format(invoice.sales.reduce((acc, cur) => acc + cur.stockQuantity * cur.price, 0));
subtotal.textContent =
  "# " +
  new Intl.NumberFormat().format(invoice.sales.reduce((acc, cur) => acc + cur.stockQuantity * cur.price, 0));

invoice.sales.forEach((element) => {
  let listDiv = document.createElement("div");
  listDiv.innerHTML = `<div class="flex text-sm py-2">
            <span class="w-3/6 text-nowrap">${element.shortName}</span>
            <span class="w-1/6">${new Intl.NumberFormat().format(element.price)}</span>
            <span class="w-1/6 ">${element.stockQuantity}</span>
            <span class="w-1/6">${new Intl.NumberFormat().format(element.stockQuantity * element.price)}</span>
          </div>`;

  invoiceList.appendChild(listDiv.firstChild);
});

window.print();

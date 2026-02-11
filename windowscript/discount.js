const discount = JSON.parse(localStorage.getItem("discount")) || null;

const cartTotal = document.getElementById("cart_total");
const discountBtn = document.getElementById("discount_btn");
const percentBtn = document.getElementById("percent");
const fixedBtn = document.getElementById("fixed");
const discountedAmount = document.getElementById("discounted_amount");
const inputDiscount = document.getElementById("input_discount");

cartTotal.textContent =
  "#" + new Intl.NumberFormat().format(discount.totalAmount);
inputDiscount.focus();

if (percentBtn.checked) discountedAmount.textContent = "#0";
if (fixedBtn.checked) discountedAmount.textContent = "0%";

let pVal;
let fVal;
percentBtn.addEventListener("click", () => {
  inputDiscount.focus();
  inputDiscount.value = "";
  pVal = true;
  fVal = false;
  percentBtn.checked = pVal;
  fixedBtn.checked = fVal;

  if (percentBtn.checked) discountedAmount.textContent = "#0";
  if (fixedBtn.checked) discountedAmount.textContent = "0%";
});

fixedBtn.addEventListener("click", () => {
  inputDiscount.focus();
  inputDiscount.value = "";
  pVal = false;
  fVal = true;
  percentBtn.checked = pVal;
  fixedBtn.checked = fVal;

  if (percentBtn.checked) discountedAmount.textContent = "#0";
  if (fixedBtn.checked) discountedAmount.textContent = "0%";
});

inputDiscount.addEventListener("keyup", () => {
  if (percentBtn.checked)
    discountedAmount.textContent =
      "#" + Math.floor((inputDiscount.value / 100) * discount.totalAmount);
  if (fixedBtn.checked)
    discountedAmount.textContent =
      Math.floor((inputDiscount.value / discount.totalAmount) * 100) + "%";
});

discountBtn.addEventListener("click", () => {
  if (percentBtn.checked)
    localStorage.setItem(
      "discountedAmount",
      JSON.stringify(discountedAmount.textContent.slice(1)),
    );
  if (fixedBtn.checked)
    localStorage.setItem(
      "discountedAmount",
      JSON.stringify(inputDiscount.value),
    );

  window.electronApi.ipcSend("close-type2-window");
});

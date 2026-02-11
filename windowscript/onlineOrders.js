const orderList = document.getElementById("order_list");
const orderSearch = document.getElementById("order_search");
const reload = document.getElementById("reload");
const user = JSON.parse(localStorage.getItem("user")) || null;

window.electronApi.ipcReceive("update-user", async (event, reloadUser) => {
  console.log(reloadUser, "hello render");
  new Notification("Orders update", { body: "Order list up to date" });

  localStorage.setItem("user", JSON.stringify(reloadUser));
  orderList.innerHTML = "";
  if (!reloadUser.order[0])
    return (orderList.innerHTML = "No online orders yet");
  ordersFunc(reloadUser.order);
});

document.addEventListener("DOMContentLoaded", async () => {
  await window.electronApi.ipcSend("reload-data", user._id);
  // ordersFunc(user.order);
  orderList.innerHTML = "Loading...";
});

reload.addEventListener("click", () => {
  console.log("reloaded");
  window.electronApi.ipcSend("reload-data", user._id);
});

console.log(user);
orderSearch.addEventListener("input", (e) => {
  console.log("right here");
  // const actualList = list?.filter(li => li.user === user.name)
  const displayItem = user.order?.filter((item) =>
    String(item.id).includes(orderSearch.value),
  );
  orderList.innerHTML = "";
  ordersFunc(displayItem);
});

function ordersFunc(lists) {
  lists?.reverse().forEach((lt) => {
    let listDiv = document.createElement("div");
    listDiv.innerHTML = `<div class="flex text-xs py-1.5 border-b border-gray-300">
              <span class="w-2/12 text-nowrap">${lt.id.slice(0, 18)}...</span>
              <span class="w-2/12 text-nowrap">${new Date(lt.date).toLocaleString()}</span>
              <span class="w-3/12 pl-3 text-nowrap overflow-hidden">${lt.email}</span>
              <span class="w-2/12 pl-3">${new Intl.NumberFormat().format(lt.cart.reduce((acc, cur) => acc + cur.amount * cur.quantity, 0))}</span>
              <span class="w-2/12 pl-3 ${lt.status === "canceled" && "text-red-600"} ${lt.status === "confirmed" && "text-green-600"} ${lt.status !== "confirmed" && lt.status !== "canceled" && "text-blue-600"}">${lt.status}</span>
              <span class="w-1/12 flex pl-5"
                ><img
                  src="../assets/file.png"
                  alt="delete"
                  class="h-5 cursor-pointer" id='${lt.id}_view'
              /></span>
            </div>`;

    orderList.appendChild(listDiv.firstChild);

    document.getElementById(`${lt.id}_view`).addEventListener("click", () => {
      localStorage.setItem("order", JSON.stringify(lt));
      // window.electronApi.ipcSend("show-type3-window", "orderDetail");
      window.electronApi.ipcSend("show-order-detail-window");
    });
  });
}

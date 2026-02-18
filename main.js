// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  session,
  net,
  dialog,
} = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("node:path");

let mainWindow;
let childWindow;
let type2ChildWindow;
let receiptWindow;
let type3Window;
let type4Window;
let orderDetailWindow;

autoUpdater.autoDownload = false;

function createWindow(status, data) {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 700,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    minWidth: 850,
    minHeight: 700,
  });

  // and load the index.html of the app.

  if (status === "ready") {
    console.log("nope");
    mainWindow.loadFile("index.html");
    // console.log(data.products);
  } else {
    console.log("yes");
    mainWindow.loadFile("./window/login.html");
  }

  mainWindow.once("ready-to-show", () => {
    console.log("Ready to show");
    // mainWindow.webContents.send("testing things");
    // const val = data?.products[0] && {data: data.products, user}

    mainWindow.webContents.send("get-all-products", data);
    mainWindow.show();
  });

  mainWindow.setMenu(null);
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

function createChildWindow(html) {
  childWindow = new BrowserWindow({
    width: 300,
    height: 400,
    maxHeight: 400,
    maxWidth: 300,
    minHeight: 400,
    minWidth: 300,
    show: false,
    parent: mainWindow,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },

    // movable: false,
    resizable: false,
    minimizable: false,
  });

  childWindow.loadFile(`./window/${html}.html`);

  childWindow.once("ready-to-show", () => {
    childWindow.show();
  });

  // Menu.setApplicationMenu(null)
  childWindow.setMenu(null);
}

function createType2ChildWindow(html) {
  type2ChildWindow = new BrowserWindow({
    width: 350,
    height: 245,
    maxHeight: 400,
    maxWidth: 300,
    minHeight: 400,
    minWidth: 300,
    show: false,
    parent: type3Window,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },

    // movable: false,
    resizable: false,
    minimizable: false,
  });

  // type2ChildWindow.loadFile(`./window/lowStock.html`);
  type2ChildWindow.loadFile(`./window/${html}.html`);

  type2ChildWindow.once("ready-to-show", () => {
    type2ChildWindow.show();
  });

  // Menu.setApplicationMenu(null)
  type2ChildWindow.setMenu(null);
}

function createReceiptWindow() {
  receiptWindow = new BrowserWindow({
    width: 350,
    height: 245,
    maxHeight: 400,
    maxWidth: 300,
    minHeight: 400,
    minWidth: 300,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },

    // movable: false,
    resizable: false,
    minimizable: false,
  });

  receiptWindow.loadFile("./window/receipt.html");

  receiptWindow.once("ready-to-show", () => {
    receiptWindow.show();
  });

  // Menu.setApplicationMenu(null)
  receiptWindow.setMenu(null);
}

function createType3Window(html) {
  type3Window = new BrowserWindow({
    width: 900,
    height: 600,
    maxHeight: 600,
    maxWidth: 900,
    minHeight: 600,
    minWidth: 900,
    show: false,
    // parent: mainWindow,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },

    // movable: false,
    resizable: false,
    minimizable: false,
  });

  // type3Window.loadFile(`./window/manageInventory.html`)
  type3Window.loadFile(`./window/${html}.html`);

  type3Window.once("ready-to-show", () => {
    type3Window.show();
  });

  // Menu.setApplicationMenu(null)
  type3Window.setMenu(null);
}
function createOrderDetailWindow() {
  orderDetailWindow = new BrowserWindow({
    width: 900,
    height: 600,
    maxHeight: 600,
    maxWidth: 900,
    minHeight: 600,
    minWidth: 900,
    show: false,
    parent: type3Window,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },

    // movable: false,
    resizable: false,
    minimizable: false,
  });

  // type3Window.loadFile(`./window/manageInventory.html`)
  orderDetailWindow.loadFile(`./window/orderDetail.html`);

  orderDetailWindow.once("ready-to-show", () => {
    orderDetailWindow.show();
  });

  // Menu.setApplicationMenu(null)
  orderDetailWindow.setMenu(null);
}

function createType4Window(html) {
  type4Window = new BrowserWindow({
    width: 500,
    height: 400,
    maxHeight: 300,
    maxWidth: 500,
    minHeight: 300,
    minWidth: 500,
    show: false,
    parent: type3Window,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },

    // movable: false,
    resizable: false,
    minimizable: false,
  });

  // type4Window.loadFile(`./window/removeStock.html`);
  type4Window.loadFile(`./window/${html}.html`);

  type4Window.once("ready-to-show", () => {
    type4Window.show();
  });

  // Menu.setApplicationMenu(null)
  type4Window.setMenu(null);
}

console.log(app.getPath("userData"));
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
 
  session.defaultSession.cookies
    .get({ name: "jwt" })
    .then(async (cookies) => {
      const jwt = cookies[0]?.value;

      if (jwt) {
        const user = await isLoggedinAPI(jwt);
        if (net.isOnline() && user.message !== "fetch failed") {
          if (user.status === "success") {
            const userId = user.data.user._id;
            const userAccount = await getUserAPI(userId, jwt);
            if (userAccount.status === "success") {
              createWindow("ready", userAccount.data.data);
            } else {
              errorMessage(
                "error",
                "Something went wrong",
                userAccount.message,
              );
            }
          } else {
            createWindow("login");
          }
        } else {
          errorMessage(
            "warning",
            "No internet connection",
            "Check your network connectivity and try again",
          );
        }
      } else {
        createWindow("login");
      }
    })
    .catch((error) => {
      errorMessage("error", "Something went wrong", error);
    });

  autoUpdater.checkForUpdates();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

autoUpdater.on("update-available", (info) => {
  dialog
    .showMessageBox(mainWindow, {
      type: "info",
      title: "Update Available",
      message: `A new version is available: ${info.version}. Do you want to download it now?`,
      buttons: ["Yes", "Later"],
    })
    .then((result) => {
      if (result.response === 0) {
        autoUpdater.downloadUpdate();
      }
    });
});

autoUpdater.on("update-downloaded", () => {
  dialog
    .showMessageBox(mainWindow, {
      type: "info",
      title: "Update Downloaded",
      message: "The new version is downloaded. Do you want to install it now?",
      buttons: ["Restart", "Later"],
    })
    .then((result) => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
});

function errorNoAction(type, title, message) {
  dialog.showMessageBox(mainWindow, {
    type: type,
    title: title,
    message: message,
  });
}

function errorMessage(type, title, message) {
  dialog
    .showMessageBox(mainWindow, {
      type: type,
      title: title,
      message: message,
      buttons: ["Try again", "Close app"],
    })
    .then((result) => {
      if (result.response === 1) {
        app.exit();
      } else {
        app.relaunch();
        app.quit();
      }
    });
}

async function getUserAPI(id, query) {
  try {
    const res = await fetch(`https://affilfair.com/api/users/${id}`, {
      credentials: "include",
      headers: {
        cookie: query,
      },
      mode: "cors",
      cache: "no-store",
    });
    // console.log(res);
    const data = await res.json();
    if (data.status !== "success") return data;
    // console.log(data);
    return data;
  } catch (err) {
    return err;
  }
}

async function isLoggedinAPI(query) {
  try {
    const res = await fetch(`https://affilfair.com/api/isloggedin`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",

        cookie: query,
      },
      mode: "cors",
      cache: "no-store",
    });
    const data = await res.json();

    if (data.status !== "success") return data;
    // if (data.status !== "success") return data.message

    // console.log(data);
    return data;
  } catch (err) {
    return err;
  }
}

async function loginUser(email, password) {
  try {
    const res = await fetch(`https://affilfair.com/api/users/login`, {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password,
      }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      mode: "cors",
      cache: "no-store",
    });
    const data = await res.json();

    if (data.status !== "success") return data;

    return data;
  } catch (err) {
    return err;
  }
}

async function updateOrderStatusAPI(form, id, query) {
  console.log(form, "homd");
  try {
    const res = await fetch(`https://affilfair.com/api/orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json", cookie: query },
      credentials: "include",
      mode: "cors",
      cache: "no-store",
    });

    const data = await res.json();

    if (data.status !== "success") return data;

    return data;
  } catch (err) {
    return err;
  }
}

async function editProductAPI(id, obj, query) {
  try {
    const res = await fetch(`https://affilfair.com/api/products/${id}`, {
      method: "PATCH",
      body: obj,
      credentials: "include",
      mode: "cors",
      cache: "no-store",
      headers: {
        cookie: query,
      },
    });

    const data = await res.json();
    if (data.status !== "success") return data;

    return data;
  } catch (err) {
    return err;
  }
}



// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on("show-window", (event, html) => {
  createChildWindow(html);
});
ipcMain.on("show-type2-window", (event, html) => {
  createType2ChildWindow(html);
});

ipcMain.on("show-receipt-window", (event) => {
  createReceiptWindow();
});

ipcMain.on("show-type3-window", (event, html) => {
  createType3Window(html);
});
ipcMain.on("show-type4-window", (event, html) => {
  createType4Window(html);
});

ipcMain.on("show-order-detail-window", (event) => {
  createOrderDetailWindow();
});

ipcMain.on("close-update-window", (event) => {
  childWindow.close();
  mainWindow.reload();
});

ipcMain.on("close-type2-window", (event) => {
  type2ChildWindow.close();
  mainWindow.reload();
});

ipcMain.on("close-type3-window", (event) => {
  orderDetailWindow.reload();
  type3Window.reload();
  // orderDetailWindow.close();
  // type3Window.close();
  mainWindow.reload();
});

ipcMain.on("close-type4-window", (event) => {
  type4Window.close();
  type3Window.reload();
});

ipcMain.on("warning-box", (event, message) => {
  errorNoAction("warning", "Something went wrong", message);
});

ipcMain.on("add-stock", async (event, data) => {
  if (net.isOnline()) {
    session.defaultSession.cookies
      .get({ name: "jwt" })
      .then(async (cookies) => {
        const jwt = cookies[0]?.value;
        const form = new FormData();
        form.append("stockQuantity", data.quantity);
        console.log("we are outside");
        const res = await editProductAPI(data.id, form, jwt);
        if (res.status !== "success") {
          return errorNoAction("error", "Something went wrong", res.message);
        }
        event.sender.send("stock-added");
      })
      .catch((error) => {
        errorNoAction("error", "Something went wrong", error);
      });
  } else {
    errorNoAction("error", "Internet Error", "No internet connection");
  }
});

ipcMain.on("complete-sale", (event, data) => {
  if (net.isOnline()) {
    session.defaultSession.cookies
      .get({ name: "jwt" })
      .then(async (cookies) => {
        const jwt = cookies[0]?.value;

        data.forEach(async (element, i) => {
          if (element.stockQuantity > 0 && element.status === "Active") {
            const form = new FormData();
            form.append("stockQuantity", element.stockQuantity);
            const res = await editProductAPI(element._id, form, jwt);
            if (res.status !== "success") {
              return errorNoAction(
                "error",
                "Something went wrong",
                res.message,
              );
            }
            if (element._id === data[data.length - 1]._id) {
              const userAccount = await getUserAPI(element.userId, jwt);
              if (userAccount.status === "success") {
                event.sender.send("get-all-products", userAccount.data.data);
              } else
                errorNoAction(
                  "error",
                  "Something went wrong",
                  userAccount.message,
                );
            }
          }

          if (element.stockQuantity <= 0 && element.status === "Active") {
            const obj = new FormData();
            obj.append("stockQuantity", element.stockQuantity);
            obj.append("status", "InActive");
            const res = await editProductAPI(element._id, obj, jwt);
            if (res.status !== "success") {
              return errorNoAction(
                "error",
                "Something went wrong",
                res.message,
              );
            }
            if (element._id === data[data.length - 1]._id) {
              const userAccount = await getUserAPI(element.userId, jwt);
              if (userAccount.status === "success") {
                event.sender.send("get-all-products", userAccount.data.data);
              } else
                errorNoAction(
                  "error",
                  "Something went wrong",
                  userAccount.message,
                );
            }
          }
        });
      })
      .catch((error) => {
        errorNoAction("error", "Something went wrong", error);
      });
  } else {
    errorNoAction("error", "Internet Error", "No internet connection");
  }
});

ipcMain.on("checkout-order", async (event, data) => {
  if (net.isOnline()) {
    session.defaultSession.cookies
      .get({ name: "jwt" })
      .then(async (cookies) => {
        const jwt = cookies[0]?.value;
        const products = data.product;
        const order = data.order;
        // const order = ["s", "g", "e"];
        order.cart.forEach(async (element, i) => {
          const val = products.find((prod) => prod._id === element.productId);
          val.stockQuantity = val.stockQuantity - element.quantity;
          console.log(val.stockQuantity);

          if (val.stockQuantity > 0 && val.status === "Active") {
            const form = new FormData();
            form.append("stockQuantity", val.stockQuantity);
            const res = await editProductAPI(val._id, form, jwt);
            if (res.status !== "success") {
              return errorNoAction(
                "error",
                "Something went wrong",
                res.message,
              );
            }
            if (
              element.productId === order.cart[order.cart.length - 1].productId
            ) {
              const resStatus = await updateOrderStatusAPI(
                { status: "completed" },
                order._id,
                jwt,
              );
              if (resStatus.status !== "success") {
                // createWindow("ready", userAccount.data.data);
                // errorNoAction("info", "Successful", `Order ${val.form.status}`);
                // event.sender.send("reload-order", resStatus);
                errorNoAction(
                  "error",
                  "Something went wrong",
                  resStatus.message,
                );
              }
              // errorNoAction(
              //   "info",
              //   "successful",
              //   "Item successfully checked out",
              // );
              event.sender.send("updated");
            }
          }

          if (val.stockQuantity <= 0 && val.status === "Active") {
            const obj = new FormData();
            obj.append("stockQuantity", val.stockQuantity);
            obj.append("status", "InActive");
            const res = await editProductAPI(val._id, obj, jwt);
            if (res.status !== "success")
              return errorNoAction(
                "error",
                "Something went wrong",
                res.message,
              );
            if (
              element.productId === order.cart[order.cart.length - 1].productId
            ) {
              const resStatus = await updateOrderStatusAPI(
                { status: "completed" },
                order._id,
                jwt,
              );
              if (resStatus.status === "success") {
                // createWindow("ready", userAccount.data.data);
                // errorNoAction("info", "Successful", `Order ${val.form.status}`);
                event.sender.send("reload-order", resStatus);
              } else {
                errorNoAction(
                  "error",
                  "Something went wrong",
                  resStatus.message,
                );
              }
              // errorNoAction(
              //   "info",
              //   "successful",
              //   "Item successfully checked out",
              // );
              event.sender.send("updated");
            }
          }
        });
      })
      .catch((error) => {
        errorNoAction("error", "Something went wrong", error);
      });
  } else {
    errorNoAction("error", "Internet Error", "No internet connection");
  }
});

ipcMain.on("update-order-status", async (event, val) => {
  // errorNoAction("warning", "Something went wrong", message);
  if (net.isOnline()) {
    session.defaultSession.cookies
      .get({ name: "jwt" })
      .then(async (cookies) => {
        const jwt = cookies[0]?.value;
        const res = await updateOrderStatusAPI(val.form, val.id, jwt);
        if (res.status === "success") {
          // createWindow("ready", userAccount.data.data);
          // errorNoAction("info", "Successful", `Order ${val.form.status}`);
          event.sender.send("reload-order", res);
        } else {
          errorNoAction("error", "Something went wrong", res.message);
        }
      })
      .catch((error) => {
        errorNoAction("error", "Something went wrong", error);
      });
  } else {
    errorNoAction("error", "Internet Error", "No internet connection");
  }
});

ipcMain.on("reload-data", async (event, data) => {
  if (net.isOnline()) {
    session.defaultSession.cookies
      .get({ name: "jwt" })
      .then(async (cookies) => {
        const jwt = cookies[0]?.value;
        const user = await getUserAPI(data, jwt);
        if (user.status === "success") {
          // createWindow("ready", userAccount.data.data);
          // errorNoAction("info", "Successful", "user updated");
          // mainWindow.webContents.send("get-all-products", user.data.data);
          // event.sender.send("get-all-products", user.data.data);
          event.sender.send("update-user", user.data.data);
        } else {
          errorNoAction("error", "Something went wrong", user.message);
        }
      })
      .catch((error) => {
        errorNoAction("error", "Something went wrong", error);
      });
  } else {
    errorNoAction("error", "Internet Error", "No internet connection");
  }
});

ipcMain.on("login-user", async (event, data) => {
  const user = await loginUser(data.email, data.password);
  if (net.isOnline() && user.message !== "fetch failed") {
    if (user.status === "success") {
      session.defaultSession.cookies
        .set({
          url: "https://affilfair.com",
          name: "jwt",
          value: user.token,
          expirationDate: Date.now() + 60 * 60 * 1000 * 24 * 30,
        })
        .then(() => {
          session.defaultSession.cookies.flushStore();
          session.defaultSession.cookies
            .get({ name: "jwt" })
            .then(async (cookies) => {
              app.relaunch();
              app.quit();
              // console.log(cookies);
              // const jwt = cookies[0].value;
              // const userId = user.data.user._id;
              // const userAccount = await getUserAPI(userId, jwt);

              // createWindow("ready", userAccount);

              // if (userAccount.status === "success") {
              //   console.log(userAccount);
              //   setTimeout(() => {
              //     mainWindow.webContents.send(
              //       "get-all-products",
              //       userAccount.products,
              //     );
              //   }, 500);
              //   mainWindow.loadFile("index.html");
              //   // createWindow("ready");
              // } else {
              //   errorMessage(
              //     "error",
              //     "Something went wrong",
              //     userAccount.message,
              //   );
              // }
            })
            .catch((error) => {
              errorNoAction("error", "Something went wrong", error);
            });
        })
        .catch((error) => {
          errorNoAction("error", "Something went wrong", error);
        });
    } else {
      errorNoAction("warning", "Something went wrong", user.message);
    }
  } else
    errorNoAction(
      "warning",
      "No internet connection",
      "Check your network connectivity and try again",
    );
});

ipcMain.on("logout-user", () => {
  session.defaultSession.cookies
    .remove("https://affilfair.com", "jwt")
    .then(() => {
      session.defaultSession.cookies.flushStore();
      session.defaultSession.cookies
        .get({ name: "jwt" })
        .then(async (cookies) => {
          mainWindow.loadFile("./window/login.html");
        })
        .catch((error) => {
          errorNoAction("error", "Something went wrong", error);
        });
    });
});

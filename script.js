const getElem = sel => document.querySelector(sel);

const popup = getElem(".popup");
const reconnectBtn = getElem(".btn-reconnect");
const popupIcon = getElem(".popup i");
const popupTitle = getElem(".popup .title");
const popupDesc = getElem(".popup .desc");

let isOnline = true;
let intervalId;

const addPopupContent = ({ icon = "", title = " ", desc = "" }) => {
  popupIcon.className = icon;
  popupTitle.innerText = title;
  popupDesc.innerHTML = desc;
};

const checkConnection = async () => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    isOnline = response.status >= 200 && response.status < 300;
  } catch (error) {
    isOnline = false;
    console.log(error);
  }

  handlePopup(isOnline);
};

const handlePopup = isOnline => {
  clearInterval(intervalId);

  if (isOnline) {
    addPopupContent({
      icon: "uil uil-wifi",
      title: "Connection Restored",
      desc: "Successfully connected to the Internet.",
    });
    popup.classList.replace("failed", "success");
    setTimeout(() => {
      popup.classList.remove("show", "success");
    }, 2000);
    return;
  }

  addPopupContent({
    icon: "uil uil-wifi-slash",
    title: "Connection Lost",
    desc: "Your connection is unavailable. Automatically reconnect in <b class='countdown'>10</b> seconds.",
  });
  popup.classList.add("show", "failed");

  let timer = 10;
  intervalId = setInterval(() => {
    getElem(".countdown").innerText = --timer;

    if (timer === 0) {
      checkConnection();
    }
  }, 1000);
};

reconnectBtn.onclick = checkConnection;

setInterval(() => isOnline && checkConnection(), 3000);

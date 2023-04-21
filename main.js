const contacts = document.cookie!==''?JSON.parse(document.cookie):new Array();

const whatsAppLinkBase = "https://api.whatsapp.com/send?phone=";
const whatsAppIcon = "images/iconmonstr-whatsapp-1.svg";

const telegramLinkBase = "https://web.telegram.org/z/";
const telegramIcon = "images/iconmonstr-telegram-1.svg";

const contactsTableBody = document.getElementById("contacts-table-body");
const buttonCreateNew = document.getElementById("button-create-new-contact");
const contactTotalLabel = document.getElementById("contact-total");
const popupFrame = document.getElementsByClassName("modal-overlay")[0];

const saveContactButton = document.getElementById("button-save");
const cancelButton = document.getElementById("button-cancel");
const nameInput = document.getElementById("contact-name");
const phoneInput = document.getElementById("contact-phone");
const form = document.getElementsByTagName("form")[0];

const allowedPhoneChars = "+0123456789 -";
const maxPhoneChars = 18;
const allowedSpacePositions = [3, 6, 8];
const allowedHifenPositions = [13];


updateTable()

buttonCreateNew.onclick = (e) => {
  showPopup();
};

saveContactButton.onclick = (e) => {
  e.preventDefault();
  form.checkValidity();
  form.reportValidity();
  if (phoneInput.value.length > 0) {
    if (!validatePhone()) {
      alert("Telefone inválido.");
      return;
    }

    if (contactExists()) {
      alert("Já existe um contato com esse nome.");
      return;
    }

    addNewContact();
    dismissPopup();
  }
};

cancelButton.onclick = (e) => {
  e.preventDefault();
  dismissPopup();
};

phoneInput.onkeydown = (e) => {
  return phoneMask(e);
};

function validatePhone() {
  if (phoneInput.value.length === maxPhoneChars) return true;
  return false;
}

function contactExists() {
  return (
    contacts.filter((contact) => contact.name === nameInput.value).length > 0
  );
}

function phoneMask(e) {
  if (e.key == "Backspace" && phoneInput.value.length > 0) return true;

  if (phoneInput.value.length >= maxPhoneChars) return false;

  if (!allowedPhoneChars.includes(e.key)) {
    return false;
  }

  if (e.key === "+" && phoneInput.value.length > 0) return false;
  if (e.key === " " && !allowedSpacePositions.includes(phoneInput.value.length))
    return false;
  if (e.key === "-" && !allowedHifenPositions.includes(phoneInput.value.length))
    return false;

  if (phoneInput.value.length === 0) {
    if (e.key !== "+") phoneInput.value += "+";
    return true;
  }

  if (allowedSpacePositions.includes(phoneInput.value.length)) {
    if (e.key !== " ") phoneInput.value += " ";
    return true;
  }

  if (allowedHifenPositions.includes(phoneInput.value.length)) {
    if (e.key !== "-") phoneInput.value += "-";
    return true;
  }
}

function addNewContact() {
  contacts.push({ name: nameInput.value, phone: phoneInput.value });
  document.cookie = JSON.stringify(contacts);
  updateTable();
}

function removeContact(contact) {
  contacts.splice(contacts.indexOf(contact), 1);
  document.cookie = JSON.stringify(contacts);
  updateTable();
}

function dismissPopup() {
  popupFrame.classList.remove("show");
  popupFrame.classList.add("hidden");
}

function showPopup() {
  nameInput.value = "";
  phoneInput.value = "";
  popupFrame.classList.remove("hidden");
  popupFrame.classList.add("show");
}

function updateTable() {
  contactsTableBody.innerHTML = "";
  contacts.forEach((contact) => {
    const newContactNode = document.createElement("tr");

    newContactNode.appendChild(createNameNode(contact));
    newContactNode.appendChild(createPhoneNode(contact));
    newContactNode.appendChild(createActionsMenu(contact));

    contactsTableBody.appendChild(newContactNode);
  });

  if(contacts.length > 0) {
    contactTotalLabel.innerHTML = "Total: " + contacts.length
  }else{
    contactTotalLabel.innerHTML = ""
  }
}

function createNameNode(contact) {
  const newNode = document.createElement("td");
  newNode.innerHTML = contact.name;
  return newNode;
}

function createPhoneNode(contact) {
  const newNode = document.createElement("td");
  newNode.innerHTML = contact.phone;
  return newNode;
}

function createActionsMenu(contact) {
  const newNode = document.createElement("td");
  const newActionsContainer = document.createElement("div");
  newActionsContainer.classList.add("record-actions");
  const newCallButton = createCallButton(contact);
  const newWhatsAppButton = createWhatsAppButton(contact);
  const newTelegramButton = createTelegramButton();
  const newDeleteButton = createDeleteButton(contact);

  newActionsContainer.appendChild(newCallButton);
  newActionsContainer.appendChild(newWhatsAppButton);
  newActionsContainer.appendChild(newTelegramButton);
  newActionsContainer.appendChild(newDeleteButton);

  newNode.appendChild(newActionsContainer);
  return newNode;
}

function createCallButton(contact) {
  const newButton = document.createElement("button");
  newButton.classList.add("button");
  newButton.classList.add("green");
  const newIconContainer = document.createElement("div");
  newIconContainer.classList.add("icon-container");
  const newLink = document.createElement("a");
  newLink.href = "tel:" + contact.phone.replaceAll(" ", "").replaceAll("-", "");
  const newIcon = document.createElement("span");
  newIcon.classList.add("icon");
  newIcon.classList.add("material-symbols-outlined");
  newIcon.innerHTML = "call";

  newButton.appendChild(newIconContainer);
  newIconContainer.appendChild(newLink);
  newLink.appendChild(newIcon);

  return newButton;
}

function createWhatsAppButton(contact) {
  const newButton = document.createElement("button");
  newButton.classList.add("button");
  newButton.classList.add("green");
  const newIconContainer = document.createElement("div");
  newIconContainer.classList.add("icon-container");
  const newLink = document.createElement("a");
  newLink.href =
    whatsAppLinkBase +
    contact.phone.replaceAll(" ", "").replaceAll("+", "").replaceAll("-", "");
  newLink.title = "Abrir o whatsapp";
  newLink.target = "_blank";
  newLink.rel = "noopener noreferrer";
  const newIcon = document.createElement("img");
  newIcon.src = whatsAppIcon;
  newIcon.alt = "Abrir o whatsapp";

  newButton.appendChild(newIconContainer);
  newIconContainer.appendChild(newLink);
  newLink.appendChild(newIcon);

  return newButton;
}

function createTelegramButton() {
  const newButton = document.createElement("button");
  newButton.classList.add("button");
  newButton.classList.add("telegram-btn");
  const newIconContainer = document.createElement("div");
  newIconContainer.classList.add("icon-container");
  const newLink = document.createElement("a");
  newLink.href = telegramLinkBase;
  newLink.title = "Abrir o telegram";
  newLink.target = "_blank";
  newLink.rel = "noopener noreferrer";
  const newIcon = document.createElement("img");
  newIcon.src = telegramIcon;
  newIcon.alt = "Abrir o telegram";

  newButton.appendChild(newIconContainer);
  newIconContainer.appendChild(newLink);
  newLink.appendChild(newIcon);

  return newButton;
}

function createDeleteButton(contact) {
  const newButton = document.createElement("button");
  newButton.classList.add("button");
  newButton.classList.add("red");
  const newIconContainer = document.createElement("div");
  newIconContainer.classList.add("icon-container");
  const newIcon = document.createElement("span");
  newIcon.classList.add("icon");
  newIcon.classList.add("material-symbols-outlined");
  newIcon.innerHTML = "delete";

  newButton.appendChild(newIconContainer);
  newIconContainer.appendChild(newIcon);

  newButton.onclick = () => {
    removeContact(contact);
  };

  return newButton;
}

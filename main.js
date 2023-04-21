const contacts = [];

const whatsAppLinkBase = 'https://api.whatsapp.com/send?phone='

const contactsTableBody = document.getElementById('contacts-table-body')
const buttonCreateNew = document.getElementById("button-create-new-contact");
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
    addNewContact();
    dismissPopup();
  }
};

phoneInput.onkeydown = (e) => {
  return phoneMask(e);
};

function validatePhone() {
  if (phoneInput.value.length === maxPhoneChars) return true;
  return false;
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

}

function dismissPopup() {
  popupFrame.classList.remove("show");
  popupFrame.classList.add("hidden");
}

function showPopup() {
  popupFrame.classList.remove("hidden");
  popupFrame.classList.add("show");
}

function updateTable() {

}
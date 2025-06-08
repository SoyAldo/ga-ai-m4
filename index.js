function getContacts() {
  const contactsString = localStorage.getItem("contacts");
  if (contactsString) {
    return JSON.parse(contactsString);
  } else {
    return [];
  }
}

function buildContactElement(contact) {
  const id = contact.codArea + contact.number;

  const contactElement = document.createElement("div");
  contactElement.className = "contact";
  contactElement.innerHTML = `
      <div class="contact--information">
        <h3 class="contact--name">${contact.name}</h3>
        <p class="contact--number">+${contact.codArea} ${contact.number}</p>
      </div>
      <div class="contact--options">
        <button class="contact--delete-button" type="button" id="${
          contact.codArea + contact.number
        }">X</button>
      </div>
      `;
  // Agrego funcionalidad al boton de eliminar
  const buttonElement = contactElement.querySelector(".contact--delete-button");
  buttonElement.addEventListener("click", () => {
    deleteContact(id);
    sendToastMessage(
      "¡Contacto eliminado!",
      "El contacto fue eliminado correctamente.",
      "ok"
    );
    loadContacts();
    updateContactAmountText();
  });
  // Devuelvo el elemento
  return contactElement;
}

function loadContacts() {
  // Obtengo los contactos
  const contacts = getContacts();
  // Obtengo el contenedor de contactos
  const contactsContainer = document.querySelector(".contacts");
  // Vacio el contenido del contenedor
  contactsContainer.innerHTML = ``;
  // Agrego nuevamente los nuevos contactos al contenedor
  contacts.map((contact) => {
    contactsContainer.appendChild(buildContactElement(contact));
  });
}

function saveContacts(contacts) {
  // Guardo los contactos
  localStorage.setItem("contacts", JSON.stringify(contacts));
}

function deleteContact(id) {
  // Obtengo los contactos
  const contacts = getContacts();
  // Filtro los contactos omitiendo el que tenga el mismo id
  const filteredContacts = contacts.filter(
    (contact) => id !== contact.codArea + contact.number
  );
  // Guardo los contactos filtrados
  saveContacts(filteredContacts);
}

async function updateContactAmountText() {
  const contactsString = localStorage.getItem("contacts");
  if (contactsString) {
    const contacts = JSON.parse(contactsString);
    const length = contacts.length;
    const textElement = document.querySelector(".information--amount");
    if (textElement) {
      if (length > 1) {
        textElement.textContent = `Tienes ${length} contactos`;
      } else if (length == 1) {
        textElement.textContent = `Tienes ${length} contacto`;
      } else {
        textElement.textContent = `¡No tienes ninún contacto!`;
      }
    }
  } else {
    const textElement = document.querySelector(".information--amount");
    if (textElement) textElement.textContent = `¡No tienes ninún contacto!`;
  }
}

async function showCreateModal() {
  const createContactModalElement = document.querySelector(
    ".create-contact-modal"
  );
  if (createContactModalElement) {
    createContactModalElement.className = "create-contact-modal display-block";
    const nameInput = document.getElementById("name");
    if (nameInput) nameInput.className = "input";
    const codAreaInput = document.getElementById("codArea");
    if (codAreaInput) codAreaInput.className = "input";
    const numberInput = document.getElementById("number");
    if (numberInput) numberInput.className = "input";
  }
}

async function hideCreateModal() {
  const createContactModalElement = document.querySelector(
    ".create-contact-modal"
  );
  if (createContactModalElement) {
    createContactModalElement.className = "create-contact-modal";
  }
}

async function addCreateContactSubmit() {
  const createContactFormElement = document.querySelector(
    ".create-contact-form"
  );

  if (createContactFormElement) {
    createContactFormElement.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(createContactFormElement);
      const name = formData.get("name");
      const codArea = formData.get("codArea");
      const number = formData.get("number");

      const contact = { name, codArea, number };

      if (name == "") {
        const input = document.getElementById("name");
        if (input) input.className = "input input-error";
      }
      if (codArea == "") {
        const input = document.getElementById("codArea");
        if (input) input.className = "input input-error";
      }
      if (number == "") {
        const input = document.getElementById("number");
        if (input) input.className = "input input-error";
      }

      if ([name, codArea, number].includes("")) {
        sendToastMessage(
          "¡Campos vacíos!",
          "Hay campos vacíos que debes completar.",
          "error"
        );
      } else {
        const contacts = getContacts();
        const id = contact.name + contact.codArea + contact.number;
        const found = contacts.find(
          (element) => element.name + element.codArea + element.number == id
        );
        if (found) {
          sendToastMessage(
            "¡Ya existe!",
            "Ya tienes un contacto con esos datos.",
            "error"
          );
        } else {
          createContact(contact);
          hideCreateModal();
          createContactFormElement.reset();
          sendToastMessage(
            "¡Contacto creado!",
            "El contacto fue creado con éxito.",
            "ok"
          );
        }
      }
    });
  }
}

function createContact(contact) {
  const contacts = getContacts();
  localStorage.setItem("contacts", JSON.stringify([...contacts, contact]));
  setTimeout(() => {
    loadContacts();
    updateContactAmountText();
  }, 1000);
}

async function sendToastMessage(title, message, type) {
  const toastContainer = document.getElementById("toast-container");
  toastContainer.className = "toast-container toast-visible";
  const toastTitle = document.getElementById("toast-title");
  const toastMessage = document.getElementById("toast-message");
  toastTitle.textContent = title;
  toastMessage.textContent = message;
  const toast = document.getElementById("toast");
  if (toast) {
    if (type == "ok") {
      toast.className = "toast toast-ok";
    } else {
      toast.className = "toast toast-error";
    }
  }
  setTimeout(() => {
    toastContainer.className = "toast-container";
  }, 4000);
}

async function generateRandomName() {
  const nameInput = document.getElementById("name");
  if (nameInput) {
    const res = await fetch("https://randomuser.me/api/");
    const data = await res.json();
    const person = data.results[0];
    if (person) {
      const name = person.name.first + " " + person.name.last;
      nameInput.value = name;
    }
  }
}

function main() {
  // Cargar los contactos desde el almacenamiento local
  loadContacts();
  // Actualizar contador de cantidad de contactos
  updateContactAmountText();
  // Agregar funcionalidad al agregar un contacto
  addCreateContactSubmit();
}

main();

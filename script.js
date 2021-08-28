import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, deleteField, onSnapshot, query, where } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { db } from "./firestore-me.js";

const modalWrapper = document.querySelector(".modal-wrapper");

// add user modal popup
const editModal = document.querySelector(".edit-modal");
const editModalForm = document.querySelector(".edit-modal .form");

// add user modal popup
const addModal = document.querySelector(".add-modal");
const addModalForm = document.querySelector(".add-modal .form");

const btnAdd = document.querySelector(".btn-add");

const tableUsers = document.querySelector(".table-users");
//assigned to each user
let userUniqueId;

//create element and render users
const renderUser = (doc) => {
  const docData = doc.data();
  const idData = doc.id;

  //   html attr passed in data-id so we use below
  const tr = `          
    <tr data-id="${idData}">
        <td>${docData.firstName}</td>
        <td>${docData.lastName}</td>
        <td>${docData.phone}</td>
        <td>${docData.email}</td>
    <td>
        <button class="btn btn-edit">Edit</button>
        <button class="btn btn-delete">Delete</button>
    </td>
    </tr>`;

  tableUsers.insertAdjacentHTML("beforeend", tr);

  // click edit user
  const btnEdit = document.querySelector(`[data-id="${idData}"] .btn-edit`);
  btnEdit.addEventListener("click", () => {
    editModal.classList.add("modal-show");

    userUniqueId = doc.id;

    editModalForm.firstName.value = docData.firstName;
    editModalForm.lastName.value = docData.lastName;
    editModalForm.phone.value = docData.phone;
    editModalForm.email.value = docData.email;
  });

  // click delete user... get the clicked button with specified id
  const btnDelete = document.querySelector(`[data-id="${idData}"] .btn-delete`);
  btnDelete.addEventListener("click", () => {
    deleteData(idData);
  });
};

// click add user button
btnAdd.addEventListener("click", () => {
  // class modal show will display the whole thing
  addModal.classList.add("modal-show");

  addModalForm.firstName.value = "";
  addModalForm.lastName.value = "";
  addModalForm.phone.value = "";
  addModalForm.email.value = "";
});

// user click anywhere outside modal
window.addEventListener("click", (e) => {
  //   modal thingy consists of the whole page, only the outside of the real box modal is the class add-modal, check html element of modal
  if (e.target == addModal) {
    addModal.classList.remove("modal-show");
  }

  if (e.target == editModal) {
    editModal.classList.remove("modal-show");
  }
});

// firestore function - getting all users from DB at the start
async function getUsersFromDb() {
  // users is the collection in firestore
  const querySnapshot = await getDocs(collection(db, "users"));
  //   console.log(querySnapshot);
  if (querySnapshot._snapshot.docChanges.length > 0) {
    querySnapshot.forEach((doc) => {
      // doc.data() method returns the data
      renderUser(doc);
    });
  } else {
    console.log("no users");
  }
}

//real time listener

const q = query(collection(db, "users"), where("users", "==", "users"));
const unsubscribe = onSnapshot(q, (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === "added") {
      console.log("Added something: ", change.doc.data(), change.doc.id);
      renderUser(change.doc);
    }
    if (change.type === "modified") {
      console.log("modified something: ", change.doc.data(), change.doc.id);
      let oldChildTableRowData = document.querySelector(`[data-id='${change.doc.id}']`);
      let oldChildParent = oldChildTableRowData.parentElement;

      let newParentTR = document.createElement("tr");
      newParentTR.setAttribute("data-id", change.doc.id);

      let firstNameTD = document.createElement("td");
      firstNameTD.innerHTML = change.doc.data().firstName;
      newParentTR.appendChild(firstNameTD);
      let lastNameTD = document.createElement("td");
      lastNameTD.innerHTML = change.doc.data().lastName;
      newParentTR.appendChild(lastNameTD);
      let phoneTD = document.createElement("td");
      phoneTD.innerHTML = change.doc.data().phone;
      newParentTR.appendChild(phoneTD);
      let emailTD = document.createElement("td");
      emailTD.innerHTML = change.doc.data().email;
      newParentTR.appendChild(emailTD);

      let lastTd = document.createElement("td");

      let editButton = document.createElement("button");
      editButton.classList.add("btn");
      editButton.classList.add("btn-edit");
      editButton.innerHTML = "Edit";
      lastTd.appendChild(editButton);

      let deleteButton = document.createElement("button");
      deleteButton.classList.add("btn");
      deleteButton.classList.add("btn-delete");
      deleteButton.innerHTML = "Delete";
      lastTd.appendChild(deleteButton);

      newParentTR.appendChild(lastTd);

      oldChildParent.replaceChild(newParentTR, oldChildTableRowData);
    }
    if (change.type === "removed") {
      console.log("removed something: ", change.doc.data(), change.doc.id);
      let tr = document.querySelector(`[data-id='${change.doc.id}']`);
      let tbody = tr.parentElement;
      tableUsers.removeChild(tbody);
    }
  });
});

// getUsersFromDb();

// firestore function -  delete data with specified id
async function deleteData(id) {
  await deleteDoc(doc(db, "users", id));
}

// firestore function - create user with specified params
async function createUserForDb(first, last, phone, email) {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      firstName: first,
      lastName: last,
      phone: phone,
      email: email,
      users: "users",
    });

    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

async function updateUserInDB(first, last, phone, email) {
  // this is for update
  const tempRef = doc(db, "users", userUniqueId);
  await updateDoc(tempRef, {
    firstName: first,
    lastName: last,
    phone: phone,
    email: email,
  });
}

// click submit in add button -- this will create new user
addModalForm.addEventListener("submit", (event) => {
  event.preventDefault();
  //   console.log(addModalForm.firstName.value);
  let first = addModalForm.firstName.value;
  let last = addModalForm.lastName.value;
  let phone = addModalForm.phone.value;
  let email = addModalForm.email.value;
  createUserForDb(first, last, phone, email);
  modalWrapper.classList.remove("modal-show");
});

// click submit in edit button -- this will create new user
editModalForm.addEventListener("submit", (event) => {
  event.preventDefault();
  //   console.log(addModalForm.firstName.value);
  let first = editModalForm.firstName.value;
  let last = editModalForm.lastName.value;
  let phone = editModalForm.phone.value;
  let email = editModalForm.email.value;

  updateUserInDB(first, last, phone, email);

  editModal.classList.remove("modal-show");
});

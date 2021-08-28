import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, deleteField } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { db } from "./firestore-me.js";

const modalWrapper = document.querySelector(".modal-wrapper");



// add user modal popup
const addModal = document.querySelector(".add-modal");
const addModalForm = document.querySelector(".add-modal .form");

const btnAdd = document.querySelector(".btn-add");

const tableUsers = document.querySelector(".table-users");

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
});

// user click anywhere outside modal
window.addEventListener("click", (e) => {
  //   modal thingy consists of the whole page, only the outside of the real box modal is the class add-modal, check html element of modal
  if (e.target == addModal) {
    addModal.classList.remove("modal-show");
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

getUsersFromDb();

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
    });

    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
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

// // this is for update
// const washingtonRef = doc(db, "cities", "DC");

// // Set the "capital" field of the city 'DC'
// await updateDoc(washingtonRef, {
//   capital: true
// });

console.log({{ secrets.REACT_APP_KIMI }});

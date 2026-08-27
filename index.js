import "core-js/stable";
import "regenerator-runtime/runtime";

const addBtn = document.querySelector(".add-btn");
const notesGrid = document.querySelector(".notes-grid");
const noNotesContainer = document.querySelector(".no-notes-container");
const overlay = document.querySelector(".overlay");
const popUp = document.querySelector(".pop-up");
const searchField = document.querySelector(".search-field");
const dropDown = document.querySelector(".drop-down");

let notes = [];
let type, title, content;
const iconNames = {
  work: "briefcase",
  personal: "person",
  ideas: "bulb",
  reminders: "notifications",
};

class Note {
  constructor(id, title, content, type, date) {
    ((this.id = id),
      (this.title = title),
      (this.content = content),
      (this.type = type),
      (this.date = date));
  }
}

const handleCloses = function () {
  const closeBtns = document.querySelectorAll(".icon-delete");
  if (closeBtns.length === 0) {
    return;
  }

  for (const btn of closeBtns) {
    btn.addEventListener("click", function (e) {
      notes = notes.filter(
        (note) => note.id !== e.target.closest(".note").dataset.id,
      );
      if (notes.length === 0) {
        noNotesContainer.classList.remove("hidden");
      }
      localStorage.setItem("notes", JSON.stringify(notes));
      if (searchField.value === "" && dropDown.value === "All Notes") {
        init();
      }
      e.target.closest(".note").remove();
    });
  }
};

const renderNoteHTML = function (id, title, content, type, date) {
  let html = `<div class="note" data-id="${id}">
          <p class="note-title">${title}</p>
          <p class="note-text">${content}
          </p>
          <div class="note-info">
            <div class="note-type ${type}">
              <ion-icon
                name="${iconNames[type]}-outline"
                class="icon-info"></ion-icon>
              <p class="note-type-text">${type[0].toUpperCase() + type.slice(1)}</p>
            </div>
            <p class="note-date">${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()},${date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`}</p>
          </div>
          <ion-icon name="trash-outline" class="icon-delete"></ion-icon>
        </div>`;
  notesGrid.insertAdjacentHTML("afterbegin", html);
};

const init = function () {
  const storedNotes = JSON.parse(localStorage.getItem("notes"));

  if (!storedNotes || storedNotes.length === 0) {
    notes = [];
    return;
  }
  notes = storedNotes;
  document.querySelectorAll(".note").forEach((note) => note.remove());
  noNotesContainer.classList.add("hidden");
  notes = JSON.parse(localStorage.getItem("notes"));

  notes.forEach((note) => {
    let dateStored = new Date(note.date);
    renderNoteHTML(note.id, note.title, note.content, note.type, dateStored);
  });
  handleCloses();
};

init();

const renderNote = function () {
  const inputTitle = document.querySelector(".input-title");
  const inputContent = document.querySelector(".input-content");

  title = inputTitle.value;
  content = inputContent.value;
  let date = new Date();
  let id = String(Date.now()).slice(-6);
  renderNoteHTML(id, title, content, type, date);
  let note = new Note(id, title, content, type, date);
  notes.push(note);
  localStorage.setItem("notes", JSON.stringify(notes));
  noNotesContainer.classList.add("hidden");
  handleCloses();
  closePopUp();
};

const openPopUp = function (e) {
  let htmlPopUp;
  if (e.target.classList.contains(".note-grid")) {
    return;
  }
  if (e.target.classList.contains("add-btn")) {
    htmlPopUp = `
    <div class="pop-up-top">
        <p class="pop-up-title">New Note</p>
        <ion-icon name="close-outline" class="icon-close"></ion-icon>
      </div>
    
    <form class="pop-up-main">
        <div class="title-group">
          <label for="title-field" class="label-pop-up">Title</label>
          <input
            required
            type="text"
            name="title-field"
            class="input-field input-title" />
        </div>
        <div class="content-group">
          <label for="title-field" class="label-pop-up">Content</label>
          <textarea
            required
            name="textarea-field"
            class="input-field input-content"></textarea>
        </div>
        <div class="tags-group">
          <label class="label-pop-up">Tags</label>
          <div class="tags">
            <div class="note-type work tag" data-type="work">
              <ion-icon name="briefcase-outline" class="icon-info"></ion-icon>
              <p class="note-type-text">Work</p>
            </div>
            <div class="note-type personal tag" data-type="personal">
              <ion-icon name="person-outline" class="icon-info"></ion-icon>
              <p class="note-type-text">Personal</p>
            </div>
            <div class="note-type ideas tag" data-type="ideas">
              <ion-icon name="bulb-outline" class="icon-info"></ion-icon>
              <p class="note-type-text">Ideas</p>
            </div>
            <div class="note-type reminders tag" data-type="reminders">
              <ion-icon
                name="notifications-outline"
                class="icon-info"></ion-icon>
              <p class="note-type-text">Reminders</p>
            </div>
          </div>
        </div>
        <button type="submit" class="add-note-btn btn">Save Note</button>
      </form>`;
    popUp.innerHTML = htmlPopUp;
    const tags = document.querySelector(".tags");
    tags.addEventListener("click", handleType);
    document
      .querySelector(".pop-up-main")
      .addEventListener("submit", renderNote);
  }
  if (e.target.closest(".note")) {
    const clickedNote = notes.find(
      (note) => note.id === e.target.closest(".note").dataset.id,
    );
    const clickedDate = new Date(clickedNote.date);
    htmlPopUp = `
    <div class="pop-up-top">
        <p class="pop-up-title">${clickedNote.title}</p>
        <ion-icon name="close-outline" class="icon-close"></ion-icon>
      </div>
    <div class="pop-up-content-box">
        <label class="label-pop-up">Content</label>
        <p class="text-pop-up">
          ${clickedNote.content}
        </p>
      </div>
      <div class="note-popup-info">
         <div class="note-type ${clickedNote.type}">
              <ion-icon
                name="${iconNames[clickedNote.type]}-outline"
                class="icon-info"></ion-icon>
              <p class="note-type-text">${clickedNote.type[0].toUpperCase() + clickedNote.type.slice(1)}</p>
            </div>
            <p class="note-date">${clickedDate.getDate()}.${clickedDate.getMonth() + 1}.${clickedDate.getFullYear()}, ${clickedDate.getHours()}:${clickedDate.getMinutes() < 10 ? `0${clickedDate.getMinutes()}` : `${clickedDate.getMinutes()}`}</p>
          </div>
      </div>`;
    popUp.innerHTML = htmlPopUp;
  }
  const btnClose = document.querySelector(".icon-close");
  btnClose.addEventListener("click", closePopUp);
  overlay.classList.remove("hidden");
  popUp.classList.remove("hidden");
};

const closePopUp = function () {
  overlay.classList.add("hidden");
  popUp.classList.add("hidden");
  const tagList = document.querySelectorAll(".tag");
  for (const tag of tagList) {
    tag.classList.remove("selected");
  }
};

const handleType = function (e) {
  if (
    e.target.classList.contains("tags") ||
    popUp.classList.contains("hidden")
  ) {
    return;
  }
  const tagList = document.querySelectorAll(".tag");
  for (const tag of tagList) {
    tag.classList.remove("selected");
  }
  e.target.closest(".tag").classList.add("selected");
  type = e.target.closest(".tag").dataset.type;
};

const filterNotes = function () {
  const searchResult = searchField.value;
  const searchType = dropDown.value;
  const allNotes = document.querySelectorAll(".note");
  allNotes.forEach((note) => note.remove());
  let searchedNotes;
  if (searchType === "All Notes" && searchResult !== "") {
    searchedNotes = notes.filter((note) => note.title.startsWith(searchResult));
  }
  if (searchType !== "All Notes" && searchResult === "") {
    searchedNotes = notes.filter((note) => note.type === searchType);
  }
  if (searchType !== "All Notes" && searchResult !== "") {
    searchedNotes = notes.filter(
      (note) => note.type === searchType && note.title.startsWith(searchResult),
    );
  }
  if (searchResult === "" && searchType === "All Notes") {
    searchedNotes = notes;
  }

  searchedNotes.forEach((note) =>
    renderNoteHTML(
      note.id,
      note.title,
      note.content,
      note.type,
      new Date(note.date),
    ),
  );
  handleCloses();
};

addBtn.addEventListener("click", openPopUp);
notesGrid.addEventListener("click", openPopUp);
overlay.addEventListener("click", closePopUp);
document.addEventListener("keydown", function (e) {
  if (!popUp.classList.contains("hidden")) {
    if (e.key === "Escape") {
      closePopUp();
    }
  }
});
searchField.addEventListener("input", filterNotes);
dropDown.addEventListener("change", filterNotes);

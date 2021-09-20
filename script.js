import colors from './colors.js';

const addBtn = document.getElementById('add');
let idx = [Math.floor(Math.random() * colors.length)];
const html = document.querySelector('html');

const notes = JSON.parse(localStorage.getItem('notes'));

const dates = JSON.parse(localStorage.getItem('dates'));

if (dates) {
  dates.forEach((date) => addNotesToDOM());
}

if (notes) {
  notes.forEach((note) => addNotesToDOM(note));
}

addBtn.addEventListener('click', () => addNotesToDOM());

function addNotesToDOM(text = '') {
  const activeColor = setColor();
  const notesWindow = document.createElement('div');
  notesWindow.classList.add('note');

  const html = /*html*/ `<div class="tools" style='background-color:${
    activeColor.background
  }'>

                          <button title='Copy' class="copy" style='color:${
                            activeColor.text
                          }'>
                            <i class="far fa-clipboard"></i>
                            </button>
                          <button title='Edit' class="edit"  style='color:${
                            activeColor.text
                          }'>
                          <i class="fas fa-edit"></i>
                          </button>
                          <button title='Delete' class="delete"  style='color:${
                            activeColor.text
                          }'> 
                          <i class="fas fa-trash-alt"></i>
                          </button>
                          </div>
                          <div class="main ${text ? '' : 'hidden'}"></div>
                          <textarea autofocus placeholder='//md syntax highlighting \n//click toggle edit when done\n' class='${
                            text ? 'hidden' : ''
                          }'></textarea>`;

  notesWindow.innerHTML = html;

  const delBtn = notesWindow.querySelector('.delete');
  const editBtn = notesWindow.querySelector('.edit');
  const copyBtn = notesWindow.querySelector('.copy');
  const main = notesWindow.querySelector('.main');
  const note = notesWindow.querySelector('textarea');
  //add date component
  const dateEl = document.createElement('span');
  dateEl.classList.add('post-date');
  const toolsBar = notesWindow.querySelectorAll('.tools');
  let time = new Date();
  time = dateFns.format(time, 'ddd,Do,MMM HH:mm');
  toolsBar.forEach((bar) => {
    bar.style.color = activeColor.text;
    bar.prepend(time);
  });

  //sth like this...
  //if dates ? date : toolsBar.prepend(dateEl);

  //markdown component
  note.value = text;

  main.innerHTML = marked(text);

  delBtn.addEventListener('click', () => {
    notesWindow.remove();

    updateLS();
  });

  editBtn.addEventListener('click', () => {
    main.classList.toggle('hidden');
    note.classList.toggle('hidden');
  });

  copyBtn.addEventListener('click', copyToClipboard);

  note.addEventListener('input', (e) => {
    const { value } = e.target;
    main.innerHTML = marked(value);

    updateLS();
  });

  document.body.appendChild(notesWindow);
}

//random color fn
function setColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}

//local storage upis
function updateLS() {
  const notes = [];
  const dates = [];

  const notesText = document.querySelectorAll('textarea');
  notesText.forEach((note) => notes.push(note.value));

  const ds = document.querySelectorAll('.post-date');
  ds.forEach((date) => dates.push(date.textContent));

  localStorage.setItem('notes', JSON.stringify(notes));
  localStorage.setItem('dates', JSON.stringify(dates));
}

//copy component
function copyToClipboard(e) {
  let content =
    e.target.parentElement.parentElement.nextElementSibling.nextElementSibling;
  content.classList.remove('hidden');
  content.select();
  document.execCommand('copy');
  content.classList.add('hidden');
}

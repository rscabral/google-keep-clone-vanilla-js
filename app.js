class App {
  constructor() {
    this.notes = [];
    this.$form = document.querySelector('#form');
    this.$noteTitle = document.querySelector('#note-title');
    this.$noteText = document.querySelector('#note-text');
    this.$formButtons = document.querySelector('#form-buttons');
    
    this.$placeholder = document.querySelector('#placeholder');
    
    this.$notes = document.querySelector('#notes');

    this.addEventListeners();
  }

  addEventListeners() {
    document.body.addEventListener('click', event => this.handleFormClick(event));

    this.$form.addEventListener('submit', event => {
      event.preventDefault();
      const title = this.$noteTitle.value;
      const text = this.$noteText.value;
      const isValidNote = title || text;

      if (isValidNote) {
        this.addNote({ title, text });        
      }
    });
  }

  handleFormClick(event) {
    const isFormClicked = this.$form.contains(event.target);

    if (isFormClicked) {
      this.openForm();
    } else {
      this.closeForm();
    }
  }

  openForm() {
    this.$form.classList.add('form-open');
    this.$noteTitle.style.display = 'block';
    this.$formButtons.style.display = 'block';
  }

  closeForm() {
    this.$form.classList.remove('form-open');
    this.$noteTitle.style.display = 'none';
    this.$formButtons.style.display = 'none';
  }

  addNote(note) {
    const { title, text } = note;
    
    const newTitle = title || 'Untitled';
    const nextId = this.notes.length > 0 
                      ? this.notes[this.notes.length -1].id + 1 : 1;
    const newNote = {
      id: nextId,
      title: newTitle,
      text,
      color: 'yellow'
    }
    this.notes = [...this.notes, newNote];

    this.displayNotes();
  }

  displayNotes() {
    const hasNotes = this.notes.length > 0;
    this.$placeholder.style = hasNotes ? 'note' : 'flex';

    this.$notes.innerHTML = this.notes.map(note => `
      <div style="background: ${note.color};" class="note">
        <div class="${note.title && 'note-title'}">${note.title}</div>
        <div class="note-text">${note.text}</div>
        <div class="toolbar-container">
          <div class="toolbar">
            <img class="toolbar-color" src="./assets/palette-icon.png">
            <img class="toolbar-delete" src="./assets/delete-trash-icon.png">
          </div>
        </div>
      </div>
    `).join('');
  }

}

new App();
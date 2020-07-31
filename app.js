class App {
  constructor() {
    this.notes = [];
    this.$form = document.querySelector('#form');
    this.$noteTitle = document.querySelector('#note-title');
    this.$noteText = document.querySelector('#note-text');
    this.$formButtons = document.querySelector('#form-buttons');    

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
        console.log(this.notes);
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
      newTitle,
      text,
      color: 'yellow'
    }
    this.notes = [...this.notes, newNote];
  }

}

new App();
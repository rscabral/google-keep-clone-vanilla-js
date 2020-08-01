class App {
  constructor() {
    this.notes = [];
    this.title = '';
    this.text = '';
    this.id = '';

    this.$form = document.querySelector('#form');
    this.$noteTitle = document.querySelector('#note-title');
    this.$noteText = document.querySelector('#note-text');
    this.$formButtons = document.querySelector('#form-buttons');
    this.$formCloseButton = document.querySelector('#form-close-button');
    
    this.$placeholder = document.querySelector('#placeholder');
    
    this.$notes = document.querySelector('#notes');
    
    this.$modal = document.querySelector('.modal');
    this.$modalTitle = document.querySelector('.modal-title');
    this.$modalText = document.querySelector('.modal-text');
    this.$modalCloseButton = document.querySelector('.modal-close-button');

    this.$colorTooltip = document.querySelector('#color-tooltip');

    this._eventNameNoteCreated = 'noteCreated';
    this._eventNameNoteUpdated = 'noteUpdated';
    this._eventNameNoteDeleted = 'noteDeleted';
    this._eventNameFormClickedOut = 'formClickedOut';
    this._eventNameModalClosed = 'modalClosed';

    this.addEventListeners();
  }

  addEventListeners() {
    document.body.addEventListener('click', event => { 
      this.handleFormClick(event);
      this.selectNote(event);
      this.openModal(event);
      this.deleteNote(event);
    });

    document.body.addEventListener('mouseover', event => 
      this.openTooltip(event)
    );

    document.body.addEventListener('mouseout', event => 
      this.closeTooltip(event)
    );

    document.body.addEventListener(this._eventNameNoteDeleted, event => 
      this.displayNotes()
    );

    this.$colorTooltip.addEventListener('mouseover', function() {
      this.style.display = 'flex';
    });

    this.$colorTooltip.addEventListener('mouseout', function() {
      this.style.display = 'none';
    });

    this.$colorTooltip.addEventListener('click', event => {
      const color = event.target.dataset.color;
      if (color) {
        this.editNoteColor(color);
      }
    });
    
    this.$form.addEventListener(this._eventNameNoteCreated, event => {
      this.displayNotes();
      this.closeForm();
    });

    this.$form.addEventListener(this._eventNameFormClickedOut, event => {
      const { note } = event.detail;
      this.hasNote(note) && this.addNote(note);
      this.closeForm();
    });

    this.$form.addEventListener('submit', event => {
      event.preventDefault();
      const title = this.$noteTitle.value;
      const text = this.$noteText.value;      

      if (this.hasNote({ title, text })) {
        this.addNote({ title, text });        
      }
    });

    this.$formCloseButton.addEventListener('click', event =>{
      event.stopPropagation();
      this.closeForm();
    });

    this.$modalCloseButton.addEventListener('click', event => {
      this.closeModal(event);
    });

    this.$modal.addEventListener(this._eventNameNoteUpdated, event => 
      this.displayNotes()
    );    
  }

  hasNote(note) {
    return note.title || note.text;
  }

  handleFormClick(event) {
    const isFormClicked = this.$form.contains(event.target);
  
    if (isFormClicked) {
      this.openForm();
    } else {
      this.createFormFocusedOutEvent();      
    }
  }

  createFormFocusedOutEvent() {
    const currentNote = {
      title: this.$noteTitle.value,
      text: this.$noteText.value
    };

    this.$form.dispatchEvent(
      new CustomEvent(this._eventNameFormClickedOut, { detail: { note: currentNote } })
    );
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
    this.$noteTitle.value = '';
    this.$noteText.value = '';
  }

  openModal(event) {
    if (event.target.matches('.toolbar-delete')) return; 

    if (event.target.closest('.note')) {
      this.$modal.classList.toggle('open-modal');      
      this.$modalTitle.value = this.title;
      this.$modalText.value = this.text;
    }
  }

  closeModal(event) {    
    this.$modal.classList.toggle('open-modal');
    this.riseModalClosedEvent();
  }

  riseModalClosedEvent() {
    this.$modal.dispatchEvent(
      new CustomEvent(this._eventNameModalClosed,
        {
          bubbles: true,
          detail: {
            id: this.id,
            title: this.$modalTitle.value,
            text: this.$modalText.value,
          },
        }
      )
    );
  }

  openTooltip(event) {
    if (!event.target.matches('.toolbar-color')) return;
    
    this.id = event.target.dataset.id;
    const noteCoordinates = event.target.getBoundingClientRect();
    const horizontal = noteCoordinates.left + window.scrollX;
    const vertical = noteCoordinates.top + window.scrollY;

    this.$colorTooltip.style.transform = `translate(${horizontal}px, ${vertical}px)`;
    this.$colorTooltip.style.display = 'flex';
  }

  closeTooltip(event) {
    if (!event.target.matches('.toolbar-color')) return;
    this.$colorTooltip.style.display = 'none';
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
    this.riseNoteCreatedEvent();    
  }

  editNote(note) {
    const { id, title, text } = note;
    this.notes = this.notes.map(note =>
      note.id === Number(id) ? { ...note, title, text } : note
    );
    this.riseNoteUpdatedEvent();
  }

  editNoteColor(color) {
    this.notes = this.notes.map(note =>
      note.id === Number(this.id) ? { ...note, color } : note
    );
    this.riseNoteUpdatedEvent();
  }

  deleteNote(event) {
    if (!event.target.matches('.toolbar-delete')) return;
    event.stopPropagation();
    const id = event.target.dataset.id;
    this.notes = this.notes.filter(note => note.id !== Number(id));
    this.riseNoteDeletedEvent();
  }

  selectNote(event) {
    const $selectedNote = event.target.closest('.note');
    if (!$selectedNote) return;

    const [$toolbar, $noteTitle, $noteText ] = $selectedNote.children;
    
    this.title = $noteTitle.innerText;
    this.text = $noteText.innerText;    
    this.id = $selectedNote.dataset.id; // data-id="value"
  }

  riseNoteCreatedEvent(note) {
    this.$form.dispatchEvent(new Event(this._eventNameNoteCreated));
  }

  riseNoteUpdatedEvent() {
    this.$modal.dispatchEvent(new Event(this._eventNameNoteUpdated));
  }

  riseNoteDeletedEvent() {
    document.body.dispatchEvent(new Event(this._eventNameNoteDeleted));
  }

  displayNotes() {
    const hasNotes = this.notes.length > 0;
    this.$placeholder.style = hasNotes ? 'note' : 'flex';

    this.$notes.innerHTML = this.notes.map(note => `
      <div style="background: ${note.color};" class="note" data-id="${note.id}">
        <div class="toolbar-container">
          <div class="toolbar">
              <img class="toolbar-color" data-id=${note.id} src="./assets/palette-icon.png">
              <img class="toolbar-delete" data-id=${note.id} src="./assets/delete-trash-icon.png">
            </div>
          </div>
        <div class="${note.title && 'note-title'}">${note.title}</div>
        <div class="note-text">${note.text}</div>
      </div>
    `).join('');
  }

}

new App();
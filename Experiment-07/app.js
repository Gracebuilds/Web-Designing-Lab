// React application with a plain-JavaScript fallback if the CDN is unavailable.
if (window.React && window.ReactDOM) {
  function App(){const[notes,setNotes]=React.useState(()=>JSON.parse(localStorage.getItem('react-lab-notes')||'[]'));const[title,setTitle]=React.useState(''),[content,setContent]=React.useState(''),[editing,setEditing]=React.useState(null);function persist(next){setNotes(next);localStorage.setItem('react-lab-notes',JSON.stringify(next))}function reset(){setTitle('');setContent('');setEditing(null)}function submit(e){e.preventDefault();if(!title.trim()||!content.trim())return;const next=editing===null?[...notes,{id:Date.now(),title:title.trim(),content:content.trim()}]:notes.map(n=>n.id===editing?{...n,title:title.trim(),content:content.trim()}:n);persist(next);reset()}function edit(n){setTitle(n.title);setContent(n.content);setEditing(n.id);window.scrollTo({top:0,behavior:'smooth'})}function remove(id){persist(notes.filter(n=>n.id!==id));if(editing===id)reset()}return React.createElement('main',{className:'shell'},React.createElement('a',{href:'../index.html'},'← All experiments'),React.createElement('h1',null,'My Notes'),React.createElement('p',null,'React single-page application. Add, update and delete notes; notes persist in this browser.'),React.createElement('form',{className:'note-form',onSubmit:submit},React.createElement('label',null,'Title',React.createElement('input',{value:title,onChange:e=>setTitle(e.target.value),required:true,placeholder:'Note title'})),React.createElement('label',null,'Content',React.createElement('textarea',{rows:4,value:content,onChange:e=>setContent(e.target.value),required:true,placeholder:'Write your note'})),React.createElement('div',null,React.createElement('button',null,editing===null?'Add note':'Update note'),editing!==null&&React.createElement('button',{type:'button',className:'cancel',onClick:reset},'Cancel'))),React.createElement('section',{className:'notes'},notes.length===0?React.createElement('p',null,'No notes yet. Add your first note above.'):notes.map(n=>React.createElement('article',{className:'note',key:n.id},React.createElement('h2',null,n.title),React.createElement('p',null,n.content),React.createElement('button',{onClick:()=>edit(n)},'Edit'),React.createElement('button',{className:'delete',onClick:()=>remove(n.id)},'Delete')))))}ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
} else {
  const root = document.getElementById('root');
  let notes = JSON.parse(localStorage.getItem('react-lab-notes') || '[]');
  let editingId = null;
  const esc = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  function render() {
    root.innerHTML = `
      <main class="shell">
        <a href="../index.html">← All experiments</a>
        <h1>My Notes</h1>
        <p>React Notes App — add, edit and delete notes. Your notes are saved in this browser.</p>
        <form class="note-form" id="noteForm">
          <label>Title<input id="noteTitle" required placeholder="Note title"></label>
          <label>Content<textarea id="noteContent" rows="4" required placeholder="Write your note"></textarea></label>
          <div><button type="submit">${editingId === null ? 'Add note' : 'Update note'}</button>${editingId !== null ? '<button type="button" class="cancel" id="cancelEdit">Cancel</button>' : ''}</div>
        </form>
        <section class="notes" id="notesList">${notes.length ? notes.map(n => `
          <article class="note"><h2>${esc(n.title)}</h2><p>${esc(n.content)}</p>
            <button type="button" data-edit="${n.id}">Edit</button><button type="button" class="delete" data-delete="${n.id}">Delete</button>
          </article>`).join('') : '<p>No notes yet. Add your first note above.</p>'}</section>
      </main>`;
    if (editingId !== null) {
      const current = notes.find(n => n.id === editingId);
      if (current) { document.getElementById('noteTitle').value = current.title; document.getElementById('noteContent').value = current.content; }
    }
    document.getElementById('noteForm').addEventListener('submit', e => {
      e.preventDefault();
      const title = document.getElementById('noteTitle').value.trim();
      const content = document.getElementById('noteContent').value.trim();
      if (!title || !content) return;
      if (editingId === null) notes.push({id:Date.now(),title,content});
      else notes = notes.map(n => n.id === editingId ? {...n,title,content} : n);
      save(); editingId = null; render();
    });
    document.getElementById('cancelEdit')?.addEventListener('click', () => { editingId = null; render(); });
    document.querySelectorAll('[data-edit]').forEach(btn => btn.addEventListener('click', () => { editingId = Number(btn.dataset.edit); render(); window.scrollTo(0,0); }));
    document.querySelectorAll('[data-delete]').forEach(btn => btn.addEventListener('click', () => { notes = notes.filter(n => n.id !== Number(btn.dataset.delete)); if (editingId === Number(btn.dataset.delete)) editingId = null; save(); render(); }));
  }
  function save() { localStorage.setItem('react-lab-notes', JSON.stringify(notes)); }
  render();
}
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [editing, setEditing] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState(null);

  // Fetch notes when the component loads
  useEffect(() => {
    fetchNotes();
  }, []);

  // Function to fetch notes from Supabase
  const fetchNotes = async () => {
    const { data } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });
    console.log(data);
    setNotes(data);
  };

  // Function to add or update a note
  const addOrUpdateNote = async () => {
    if (editing) {
      // Update the note
      await supabase
        .from('notes')
        .update({ title, body })
        .eq('id', currentNoteId);
      setEditing(false);
      setCurrentNoteId(null);
    } else {
      // Add a new note
      await supabase.from('notes').insert([{ title, body }]);
    }
    fetchNotes(); // Refresh notes after adding or updating
    setTitle(''); // Clear the title input
    setBody('');  // Clear the body input
  };

  // Function to delete a note by its ID
  const deleteNote = async (id) => {
    await supabase.from('notes').delete().eq('id', id);
    fetchNotes(); // Refresh notes after deleting
  };

  // Function to start editing a note
  const editNote = (note) => {
    setEditing(true);
    setCurrentNoteId(note.id);
    setTitle(note.title);
    setBody(note.body);
  };

  return (
    <div className="App">
      <h1>Note Taking App</h1>

      {/* Form to add or edit a note */}
      <div className="form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        ></textarea>
        <button onClick={addOrUpdateNote}>
          {editing ? 'Update Note' : 'Add Note'}
        </button>
      </div>

      {/* List of notes */}
      <div className="notes-list">
        {notes.map((note) => (
          <div key={note.id} className="note">
            <h2>{note.title}</h2>
            <p>{note.body}</p>
            <button onClick={() => editNote(note)}>Edit</button>
            <button onClick={() => deleteNote(note.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

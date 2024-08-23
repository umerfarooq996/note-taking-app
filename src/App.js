import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  // Fetch notes when the component loads
  useEffect(() => {
    fetchNotes();
  }, []);

  // Function to fetch notes from Supabase
  const fetchNotes = async () => {
    const { data } = await supabase.from('notes').select('*').order('created_at', { ascending: false });
    console.log(data)
    setNotes(data);
  };

  // Function to add a new note
  const addNote = async () => {
    await supabase.from('notes').insert([{ title, body }]);
    fetchNotes(); // Refresh notes after adding
    setTitle(''); // Clear the title input
    setBody('');  // Clear the body input
  };

  // Function to delete a note by its ID
  const deleteNote = async (id) => {
    await supabase.from('notes').delete().eq('id', id);
    fetchNotes(); // Refresh notes after deleting
  };

  return (
    <div className="App">
      <h1>Note Taking App</h1>
      
      {/* Form to add a new note */}
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
        <button onClick={addNote}>Add Note</button>
      </div>

      {/* List of notes */}
      <div className="notes-list">
        {notes.map((note) => (
          <div key={note.id} className="note">
            <h2>{note.title}</h2>
            <p>{note.body}</p>
            <button onClick={() => deleteNote(note.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

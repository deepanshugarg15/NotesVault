import React, { useState,useContext } from 'react'
import NoteContext from '../context/notes/noteContext';

const AddNote = (props) => {

    const context = useContext(NoteContext);
    const {addNote} = context;

    const[note,setNote] = useState({
        title:"",
        description:"",
        tag:""
    });

    const handleClick = (e)=>{
        e.preventDefault();
        console.log(note);
        addNote(note.title,note.description,note.tag);
        setNote({
          title:"",
          description:"",
          tag:""
      });
      props.showAlert("Note Added Successfully","success")
    }

    const onChange = (e)=>{
        setNote({...note, [e.target.name]:e.target.value})
    }

  return (
    <div className="container my-3">
    <h1>Add a Note</h1>
    <form>
      <div className="mb-3">
        <label htmlFor="title" className="form-label">
          Title
        </label>
        <input
          type="text"
          className="form-control"
          id="title"
          name='title'
          value={note.title}
          aria-describedby="emailHelp"
          onChange={onChange}
          minLength={5}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <input
          type="text"
          className="form-control"
          id="description"
          name='description'
          value={note.description}
          onChange={onChange}
          minLength={8}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="tag" className="form-label">
          Tag
        </label>
        <input
          type="text"
          className="form-control"
          value={note.tag}
          id="tag"
          name='tag'
          onChange={onChange}
        />
      </div>
      <button disabled={note.title.length<5 || note.description.length < 8} type="submit" className="btn btn-primary" onClick={handleClick}>
        Add Note
      </button>
    </form>
  </div>
  )
}

export default AddNote

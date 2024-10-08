import React, {useContext, useEffect, useRef, useState} from 'react';
import noteContext from "../context/notes/noteContext";
import NoteItem from "./NoteItem";
import AddNote from './AddNote';
import { useNavigate } from 'react-router-dom';

const Notes = (props) => {

    const context = useContext(noteContext);
    const {notes,getNotes,editNote} = context;
    let navigate = useNavigate();

    useEffect(()=>{

      
      if(localStorage.getItem('token')!==null){
        getNotes();
      }
      else{
        navigate('/login');
      }
       
        // eslint-disable-next-line
    },[])

    const ref = useRef(null);
    const refClose = useRef(null);
  
    const[note,setNote] = useState({
      id : "",
      etitle:"",
      edescription:"",
      etag:""
  });

    const updateNote = (currentNote)=>{
      ref.current.click();
      setNote({
        id:currentNote._id,
        etitle:currentNote.title,
        edescription:currentNote.description,
        etag:currentNote.tag
      });
      props.showAlert("Note Updated Successfully","danger");
      
    }

    const handleClick = (e)=>{
      console.log(note);
      editNote(note.id,note.etitle,note.edescription,note.etag)
      refClose.current.click();
  }

    const onChange = (e)=>{
      setNote({...note, [e.target.name]:e.target.value})
  }

  return (
    <>
    <AddNote showAlert={props.showAlert}/>

<button type="button" className="btn btn-primary" ref={ref} data-bs-toggle="modal" data-bs-target="#exampleModal">
  Launch demo modal
</button>

<div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Note</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
      <form>
      <div className="mb-3">
        <label htmlFor="etitle" className="form-label">
          Title
        </label>
        <input
          type="text"
          className="form-control"
          id="etitle"
          name='etitle'
          value={note.etitle}
          aria-describedby="emailHelp"
          onChange={onChange}
          minLength={5}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="edescription" className="form-label">
          Description
        </label>
        <input
          type="text"
          className="form-control"
          id="edescription"
          value={note.edescription}
          name='edescription'
          onChange={onChange}
          minLength={8}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="etag" className="form-label">
          Tag
        </label>
        <input
          type="text"
          className="form-control"
          id="etag"
          value={note.etag}
          name='etag'
          onChange={onChange}
        />
      </div>
    </form>
      </div>
      <div className="modal-footer">
        <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button disabled={ note.etitle.length < 5 || note.edescription.length < 8} onClick={handleClick} type="button" className="btn btn-primary">Update Note</button>
      </div>
    </div>
  </div>
</div>
    <div className="row my-3">
    <h1>Your Notes</h1>
    <div className="container">
    {notes.length === 0 && 'No Notes to display'}
    </div>
    {notes.map((note)=>{
      return <NoteItem key={note._id} updateNote={updateNote} note = {note} showAlert={props.showAlert}/>
    })}
  </div>
  </>
  )
}

export default Notes

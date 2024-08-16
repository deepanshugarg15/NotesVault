import React, {useContext} from 'react';
import NoteContext from "../context/notes/noteContext";

const NoteItem = (props) => {

    const context = useContext(NoteContext);
    const {deleteNote} = context;

  const { note,updateNote } = props;
  return (
    <div className="col-md-3">
      <div className="card my-3">
        {/* <img src="..." className="card-img-top" alt="..."> */}
        <div className="card-body">
            <div className="d-flex align-items-centre">
            <h5 className="card-title">{note.title}</h5>
          <i className="fa-solid fa-trash mx-2" onClick={()=>{deleteNote(note._id)}}></i>
          <i className="fa-solid fa-pen-to-square mx-2" onClick={()=>updateNote(note)}></i>
            </div>
          <p className="card-text">{note.description}</p>
          {/* <a href="#" className="btn btn-primary">Go somewhere</a> */}

        </div>
      </div>
    </div>
  );
};

export default NoteItem;

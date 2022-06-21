import {useEffect, useState} from "react";
import "./App.css";
import axios from "axios";

const BACKEND_URL = "http://10.65.132.54:3000";

function App() {
  const [itemToAdd, setItemToAdd] = useState("");
  const [items, setItems] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const handleChangeItem = (event) => {
    setItemToAdd(event.target.value);
  };

  const handleAddItem = () => {
    axios.post(`https://api.todoist.com/rest/v1/tasks`, {
      content: itemToAdd,
      completed: false,
    }, {
      headers: {
        Authorization: "Bearer 60d591eb137d0d7a9230603ca37b9b4ee1b0ccad"
      }
    }).then((response) => {
        setItems([ ...items, response.data])
    })
    setItemToAdd("");
  };


  const toggleItemDone = ({ id, completed }) => {
      axios.post(`https://api.todoist.com/rest/v1/tasks/${id}/close`, {
      }, {
        headers: {
          Authorization: "Bearer 60d591eb137d0d7a9230603ca37b9b4ee1b0ccad"
        }
      }).then(() => {
        setItems(items.map((item) => {
            if (item.id === id) {
                return {
                    ...item,
                    completed: !completed
                }
            }
            return item;
        }))
      })
  };

  const handleItemDelete = (id) => {
      axios.delete(`https://api.todoist.com/rest/v1/tasks/${id}`, {
        headers: {
          Authorization: "Bearer 60d591eb137d0d7a9230603ca37b9b4ee1b0ccad"
        }
      }).then(() => {
        getAllItems();
      })
  };

  const getAllItems = ()=>{
    axios.get(`https://api.todoist.com/rest/v1/tasks`, {
      headers: {
        Authorization: "Bearer 60d591eb137d0d7a9230603ca37b9b4ee1b0ccad"
      }
    }).then((response) => {
        setItems(response.data);
    })
  }

  useEffect(() => {
    getAllItems();
  }, [searchValue])

  return (
    <div className="todo-app">
      {/* App-header */}
      <div className="app-header d-flex">
        <h1>Todo List</h1>
      </div>

      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input
          type="text"
          className="form-control search-input"
          placeholder="type to search"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
        />
      </div>

      {/* List-group */}
      <ul className="list-group todo-list">
        {items.length > 0 ? (
          items.map((item) => (
            <li key={item.id} className="list-group-item">
              <span className={`todo-list-item${item.completed ? " done" : ""}`}>
                <span
                  className="todo-list-item-label"
                  onClick={() => toggleItemDone(item)}
                >
                  {item.content}
                </span>

                <button
                  type="button"
                  className="btn btn-outline-success btn-sm float-right"
                >
                  <i className="fa fa-exclamation" />
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm float-right"
                  onClick={() => handleItemDelete(item.id)}
                >
                  <i className="fa fa-trash-o" />
                </button>
              </span>
            </li>
          ))
        ) : (
          <div>No todos🤤</div>
        )}
      </ul>

      {/* Add form */}
      <div className="item-add-form d-flex">
        <input
          value={itemToAdd}
          type="text"
          className="form-control"
          placeholder="What needs to be done"
          onChange={handleChangeItem}
        />
        <button className="btn btn-outline-secondary" onClick={handleAddItem}>
          Add item
        </button>
      </div>
    </div>
  );
}

export default App;

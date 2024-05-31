import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useParams } from "react-router-dom";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faPenToSquare,
  faTrash,
  faPlusCircle,
  faInfo,
  faXmark,
  faFolderOpen,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../components/Navbar";
import "../styles/tables.css";
import "../styles/modal.css";
import "../styles/taskpage.css";

const TaskPage = () => {
  const { project_id } = useParams();
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const loggedUserId = decoded.id;
  const isAdmin = decoded.isAdmin;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [sortedTasks, setSortedTasks] = useState([]);
  const [modalMode, setModalMode] = useState("add");

  const status = ["Not Started", "In Progress", "Completed"];
  const [usersInProject, setUsersInProject] = useState([]);
  const [comments, setComments] = useState([]);
  const [selectedTask, setSelectedTask] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);

  console.log(refreshKey);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/projectuser/${project_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.data.success) {
          setUsersInProject(res.data.projectUsers);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const [values, setValues] = useState({
    project_id: project_id,
    user_id: "",
    summary: "",
    description: "",
    status: "",
    started_time: "",
    finish_time: "",
    created_date: new Date().toDateString(),
    created_user_id: loggedUserId,
  });

  const openModal = (mode, task = {}) => {
    setModalMode(mode);
    if (task.id != undefined) {
      const start_date = task.started_time.split("T")[0];
      const end_date = task.finish_time.split("T")[0];
      setValues({ ...task, started_time: start_date, finish_time: end_date });
    }
    setIsModalOpen(true);
  };

  const openDetailsModal = (task) => {
    setIsDetailsModalOpen(true);
    setSelectedTask(task);
    fetchComments(task.id);
    const start_date = task.started_time.split("T")[0];
    const end_date = task.finish_time.split("T")[0];
    setValues({ ...task, started_time: start_date, finish_time: end_date });
  };

  const closeDetailModal = () => {
    setIsDetailsModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setValues({
      project_id: project_id,
      user_id: "",
      summary: "",
      description: "",
      started_time: "",
      finish_time: "",
      created_date: new Date().toDateString(),
      created_user_id: loggedUserId,
    });
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3000/task/project/${project_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.data.success) {
          setTasks(res.data.tasks);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refreshKey, project_id]);

  const fetchComments = async (taskId) => {
    try {
      const res = await axios.get(`http://localhost:3000/comment/${taskId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        setComments(res.data.comments);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url =
      modalMode === "edit"
        ? `http://localhost:3000/task/update/${values.id}`
        : "http://localhost:3000/task";
    const method = modalMode === "edit" ? "put" : "post";
    axios({
      method,
      url,
      data: values,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (res.data.success) {
          setRefreshKey((oldKey) => oldKey + 1);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    closeModal();
  };

  const handleInput = (e) => {
    setValues({ ...values, [e.target.id]: e.target.value });
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    const comment = document.getElementById("commenttextarea").value;
    axios
      .post(
        `http://localhost:3000/comment/${selectedTask.id}`,
        {
          user_comment: comment,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          fetchComments(selectedTask.id);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const deleteTask = (task) => {
    axios
      .put(
        `http://localhost:3000/task/delete/${task.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          setRefreshKey((oldKey) => oldKey + 1);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleSelectChange = (e) => {
    setValues({ ...values, status: e.target.value });
  };

  const handleUserSelect = (e) => {
    setValues({ ...values, user_id: e.target.value });
  };

  const handleSelectChangeandSubmit = (e) => {
    setValues({ ...values, status: e.target.value });
    axios
      .put(
        `http://localhost:3000/task/${values.id}`,
        { status: e.target.value },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          setRefreshKey((oldKey) => oldKey + 1);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleStatusChangeSubmit = (e) => {
    e.preventDefault();
    axios
      .put(
        `http://localhost:3000/task/${values.id}`,
        { status: values.status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          setRefreshKey((oldKey) => oldKey + 1);
        }
      })
      .catch((err) => {
        console.error(err);
      });
    closeModal();
  };

  useEffect(() => {
    // Sort tasks by id (or any other criteria you prefer)
    const sorted = [...tasks].sort((a, b) => a.id - b.id);
    setSortedTasks(sorted);
  }, [tasks]);

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contantLabel={modalMode === "add" ? "Add Task" : "Edit Task"}
        ariaHideApp={false}
        overlayClassName={"Overlay"}
        className={"edittaskmodal"}
      >
        <div className="taskaddoreditdiv">
          <h2>{modalMode === "edit" ? "Edit Task" : "Add Task"}</h2>
          <form onSubmit={isAdmin ? handleSubmit : handleStatusChangeSubmit}>
            {isAdmin && (
              <>
                <div className="taskaddoreditdivrow">
                  <label htmlFor="summary">Summary</label>
                  <input
                    type="text"
                    id="summary"
                    value={values.summary}
                    onChange={handleInput}
                  />
                </div>
                <div className="taskaddoreditdivrow">
                  <label htmlFor="description">Description</label>
                  <input
                    type="text"
                    id="description"
                    value={values.description}
                    onChange={handleInput}
                  />
                </div>
                <div className="taskaddoreditdivrow">
                  <label htmlFor="started_time">Start Date</label>
                  <input
                    type="date"
                    id="started_time"
                    value={values.started_time}
                    onChange={handleInput}
                  />
                </div>
                <div className="taskaddoreditdivrow">
                  <label htmlFor="finish_time">Finish Date</label>
                  <input
                    type="date"
                    id="finish_time"
                    value={values.finish_time}
                    onChange={handleInput}
                    min={values.started_time}
                  />
                </div>
                <div className="taskaddoreditdivrow">
                  <label htmlFor="user_id">Assign User    </label>
                  <select
                    id="user_id"
                    value={values.user_id}
                    onChange={handleUserSelect}
                  >
                    {usersInProject.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
            <div className="taskaddoreditdivrow">
              <label htmlFor="status">Status    </label>
              <select
                id="statusSelect"
                value={values.status}
                onChange={handleSelectChange}
              >
                {status.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <div className="taskaddoreditdivbutton">
              <button>{modalMode === "edit" ? "Edit" : "Add"}</button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        isOpen={isDetailsModalOpen}
        onRequestClose={closeDetailModal}
        contantLabel={"Details"}
        ariaHideApp={false}
        overlayClassName={"Overlay"}
        className={"CommentModal"}
      >
        <div className="a123">
          <div className="b123">
            <div className="a1">
              <h2>{values.summary}</h2>
              <p>Description</p>
              <textarea className="decription-text-area" readOnly value={values.description}/>
            </div>
            <div className="a2">
              <span>Started Time: {values.started_time}</span>
              <br />
              <span>Finish Time: {values.finish_time}</span>
              <br />
              <span>Status: {values.status}</span>
              <br/>
              {values.user_id === loggedUserId && (<select
                id="statusSelect"
                value={values.status}
                onChange={handleSelectChangeandSubmit}
              >
                {status.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>)}
            </div>
            <div className="close-btn">
              <FontAwesomeIcon icon={faXmark} onClick={closeDetailModal} />
            </div>
          </div>
          <div className="c123">
            <div className="commentbox">
              <textarea
                placeholder="Enter comment..."
                rows={4}
                cols={30}
                className="a111"
                id="commenttextarea"
              />
              <button onClick={handleAddComment} className="acd2">
                Comment
              </button>
            </div>
<div className="comments-container">
<div className="comments">
              {comments.map((comment) => (
                <ul key={comment.id}>
                  <li>
                    {comment.user_name} says, {comment.user_comment} on{" "}
                    {new Date(comment.created_date).toLocaleDateString()}
                  </li>
                </ul>
              ))}
            </div>
</div>
          </div>
        </div>
      </Modal>

      <Navbar />

      <h1 className="tasks-h1">Tasks</h1>
      {isAdmin === true ? (
        <>
          <div className="add-pr">
            <div className="add-project">
              <h3>Create Task</h3>
              <FontAwesomeIcon
                title="Create new task"
                icon={faPlusCircle}
                className="add-btn"
                onClick={() => openModal("add")}
              />
            </div>
          </div>
        </>
      ) : null}
      <div className="table-div">
        {tasks.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Summary</th>
                <th>Description</th>
                <th>Status</th>
                <th>Owner User</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedTasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.summary}</td>
                  <td className="kk2">{task.description}</td>
                  <td className="td-taskstatus">{task.status}</td>
                  <td className="kk1">{task.user_name}</td>
                  <td className="td-actions">
                    <FontAwesomeIcon
                      icon={faFolderOpen}
                      title="Details"
                      className="comment-btn"
                      onClick={() => openDetailsModal(task)}
                    />
                    {isAdmin && (
                      <>
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                          title="Edit"
                          className="edit-btn"
                          onClick={() => openModal("edit", task)}
                        />
                        <FontAwesomeIcon
                          icon={faTrash}
                          title="Delete"
                          className="delete-btn"
                          onClick={() => deleteTask(task)}
                        />
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <h2>No tasks found</h2>
        )}
      </div>
    </>
  );
};

export default TaskPage;

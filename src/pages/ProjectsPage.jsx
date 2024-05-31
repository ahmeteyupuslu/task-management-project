import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  faListCheck,
  faPenToSquare,
  faTrash,
  faPlus,
  faXmark,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-modal";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/projectspage.css";
import "../styles/tables.css";
import "../styles/modal.css";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [usersInProject, setUsersInProject] = useState([]);
  const [usersNotInProject, setUsersNotInProject] = useState([]);
  const [selectedProject, setSelectedProject] = useState(99);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.data.success) {
          setAllUsers(res.data.users);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  },[isModalOpen]) ;

  const [values, setValues] = useState({
    project_name: "",
    description: "",
    owner_id: "",
    start_date: "",
    end_date: "",
    id: "",
  });

  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const isAdmin = decoded.isAdmin;

  const openModal = (mode, project = {}) => {
    setModalMode(mode);
    if (project.id != undefined) {
      const start_date = project.start_date.split("T")[0];
      const end_date = project.end_date.split("T")[0];
      setValues({ ...project, start_date: start_date, end_date: end_date });
      setSelectedProject(project.id);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setValues({
      project_name: "",
      description: "",
      owner_id: "",
      start_date: "",
      end_date: "",
      id: "",
    });
    setSelectedProject("");
    setUsersInProject([]);
    setSelectedProject(99);
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/project", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.data.success) {
          setProjects(res.data.projects);
          setRefresh(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refresh]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const url =
      modalMode === "edit"
        ? `http://localhost:3000/project/${values.id}`
        : "http://localhost:3000/project";
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
          setRefresh(true);
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

  const handleDelete = (id) => {
    axios
      .put(
        `http://localhost:3000/project/delete/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          setRefresh(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3000/projectuser/${selectedProject}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.data.success) {
          setUsersInProject(res.data.projectUsers);
          setRefresh(false);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [isModalOpen, refresh]);

  useEffect(() => {
    axios
      .get(
        `http://localhost:3000/projectuser/getusersnotinproject/${selectedProject}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          setUsersNotInProject(res.data.users);
          setRefresh(false);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [isModalOpen, refresh]);
  const handleAddUser = () => {
    const addUserValue = { project_id: values.id, user_id: selectedUserId };
    axios
      .post(`http://localhost:3000/projectuser/`, addUserValue, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.data.success) {
          setSelectedUserId("");
          setRefresh(true);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleDeleteUserfromProject = (user_id) => {
    const deleteUserValue = { project_id: values.id, user_id: user_id };
    axios.put(`http://localhost:3000/projectuser/delete`, deleteUserValue, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      if (res.data.success) {
        setRefresh(true);
      }
    });
  };

  const sortedProjects = [...projects].sort((a, b) => a.id - b.id);
  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel={modalMode === "edit" ? "Edit Project" : "Add Project"}
        ariaHideApp={false}
        className="Modal"
        overlayClassName="Overlay"
      >
        <div className="modal-div1">
          <h2>{modalMode === "edit" ? "Edit Project" : "Add Project"}</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="project_name">Project Name</label>
              <br />
              <input
                type="text"
                name="project_name"
                value={values.project_name}
                onChange={handleInput}
                id="project_name"
              />
            </div>
            <div>
              <label htmlFor="description">Description</label>
              <br />
              <input
                type="text"
                name="description"
                value={values.description}
                onChange={handleInput}
                id="description"
              />
            </div>
            <div>
              <label htmlFor="owner_id">Owner</label>
              <br />
              <select
                id="owner_id"
                value={values.owner_id}
                onChange={handleInput}
              >
                {allUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="start_date">Start Date</label>
              <br />
              <input
                type="date"
                name="start_date"
                value={values.start_date}
                onChange={handleInput}
                id="start_date"
              />
            </div>
            <div>
              <label htmlFor="end_date">End Date</label>
              <br />
              <input
                type="date"
                name="end_date"
                value={values.end_date}
                onChange={handleInput}
                id="end_date"
                min={values.start_date}
              />
            </div>
            <div>
              <button type="submit">
                {modalMode === "edit" ? "Edit" : "Add"}
              </button>
              <button onClick={closeModal} className="asd">
                Cancel
              </button>
            </div>
          </form>
        </div>

        {modalMode === "edit" ? (
          <div className="modal-div2">
            <h2>Manage Project Users</h2>
            <div>
              <label htmlFor="userSelect"></label>
              <br />
              <select
                id="userSelect"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
              >
                <option value="">Select a user</option>
                {usersNotInProject.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddUser}
                disabled={!selectedUserId}
                className="asd"
              >
                Add User
              </button>
            </div>
            <div>
              <h3>Users in this Project</h3>
              <ul>
                {usersInProject.map((user) => (
                  <li key={user.id}>
                    <span>{user.name}</span>
                    <FontAwesomeIcon
                      icon={faXmark}
                      className="qw"
                      onClick={() => handleDeleteUserfromProject(user.id)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="modal-div3">
            <h4>
              Please click edit button after creating project so you can select
              users for your project in this area.{" "}
            </h4>
          </div>
        )}
      </Modal>
      <Navbar />
      <h1 className="projects-h1">Projects</h1>
      {isAdmin === true ? (
        <>
          <div className="add-pr">
            <div className="add-project">
              <h3>Create Project</h3>
              <FontAwesomeIcon
                title="Create new project"
                icon={faPlusCircle}
                className="add-btn"
                onClick={() => openModal("add")}
              />
            </div>
          </div>
        </>
      ) : null}
      <div className="table-div">
        <table>
          <thead>
            <tr>
              <th>Index</th>
              <th>Project Name</th>
              <th>Description</th>
              <th>Owner</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedProjects.map((project, index) => (
              <tr key={index}>
                <td className="index-column">{index + 1}</td>
                <td>{project.project_name}</td>
                <td>{project.description}</td>
                <td className="owner-column">{project.owner_id}</td>
                <td className="date-column">
                  {new Date(project.start_date).toLocaleDateString()}
                </td>
                <td className="date-column">
                  {new Date(project.end_date).toLocaleDateString()}
                </td>
                <td className="actions-column">
                  <Link to={`/projects/${project.id}/task`}>
                    <FontAwesomeIcon
                      icon={faListCheck}
                      title="Tasks"
                      className="tasks-btn"
                    />
                  </Link>
                  {isAdmin === true ? (
                    <>
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        title="Edit"
                        className="edit-btn"
                        onClick={() => openModal("edit", project)}
                      />
                      <FontAwesomeIcon
                        icon={faTrash}
                        title="Delete"
                        className="delete-btn"
                        onClick={() => handleDelete(project.id)}
                      />
                    </>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ProjectsPage;

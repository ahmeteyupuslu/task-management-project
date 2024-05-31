import React, { useState, useEffect } from "react";
import axios from "axios";
import { faTrashCan, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-modal";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../components/Navbar";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [values, setValues] = useState({
    username: "",
    name: "",
    email: "",
    is_admin: false,
    password: "",
    id: "",
  });

  const customStyles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    content: {
      position: "relative",
      background: "#fff",
      padding: "2rem",
      borderRadius: "8px",
      maxWidth: "500px",
      width: "100%",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      animation: "fadeIn 0.3s ease-in-out",
      color: "#000",
    },
  };
  

  const openModal = (mode, user = {}) => {
    setModalMode(mode);
    setValues(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setValues({
      username: "",
      name: "",
      email: "",
      is_admin: false,
      password: "",
      id: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url =
      modalMode === "edit"
        ? `http://localhost:3000/users/${values.id}`
        : "http://localhost:3000/users";
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
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: name === "is_admin" ? e.target.checked : value,
    }));
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/users", {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        if (res.data.success) {
          setUsers(res.data.users);
          setRefresh(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refresh]);

  const handleDelete = (id) => {
    axios
      .put(
        `http://localhost:3000/users/delete/${id}`,
        {},
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          setRefresh(true);
        }
      })
      .catch((err) => {
        console.error("Error deleting user:", err);
      });
  };

  const sortedUsers = [...users].sort((a, b) => a.id - b.id);

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel={modalMode === "edit" ? "Edit User" : "Add User"}
        ariaHideApp={false}
      >
        <h2>{modalMode === "edit" ? "Edit User" : "Add User"}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={values.username}
              onChange={handleInput}
            />
          </div>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={values.name}
              onChange={handleInput}
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              className="email-input"
              id="email"
              name="email"
              value={values.email}
              onChange={handleInput}
            />
          </div>
          <div>
            <label htmlFor="isAdmin">Is Admin:</label>
            <input
              type="checkbox"
              id="isAdmin"
              name="is_admin"
              checked={values.is_admin}
              onChange={handleInput}
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={handleInput}
              placeholder="Enter new password"
            />
          </div>
          <div>
            <button className="black-b">
              {modalMode === "edit" ? "Edit" : "Add"}
            </button>
          </div>
        </form>
        <button onClick={closeModal}>
          <FontAwesomeIcon icon={faXmark} /> Cancel
        </button>
      </Modal>
      <Navbar />

      <h1 className="tasks-h1">Users</h1>
      <div className="add-pr">
            <div className="add-project">
              <h3>Create User</h3>
              <FontAwesomeIcon
                title="Create new task"
                icon={faPlusCircle}
                className="add-btn"
                onClick={() => openModal("add")}
              />
            </div>
          </div>
      <div className="table-div">
      <table>
        <thead>
          <tr>
            <th>Index</th>
            <th>Username</th>
            <th>Name</th>
            <th>Email</th>
            <th>Is Admin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.username}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                {user.is_admin ? <span>&#10004;</span> : <span>&#x2716;</span>}
              </td>
              <td className="action-column">
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  className="edit-btn"
                  onClick={() => openModal("edit", user)}
                />

                <FontAwesomeIcon
                  icon={faTrashCan}
                  onClick={() => handleDelete(user.id)}
                  className="delete-btn"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </>
  );
};

export default UserPage;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { faTrashCan, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import { faSave, faXmark } from "@fortawesome/free-solid-svg-icons";

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const closeModal1 = () => {
    setIsModalOpen1(false);
    setValues(null);
  };
  const closeModal2 = () => {
    setIsModalOpen2(false);
    setValues(null);
  }; // Declare isModalOpen state
  const [values, setValues] = useState({
    username: "",
    name: "",
    email: "",
    is_admin: "",
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
      color: "#E9552B",
      backgroundColor: "rgba(255, 255, 255, 0.75)",
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "rgba(255,255,255)",
    },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put("http://localhost:3000/users/" + values.id, values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === values.id ? values : user))
        );
        closeModal1();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleInput = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleAdminChange = (e) => {
    setValues({ ...values, is_admin: e.target.checked });
  };

  const openModal1 = (user) => {
    setValues(user);
    setIsModalOpen1(true);
  };
  const openModal2 = () => {
    setIsModalOpen2(true);
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
          console.log(res.data.users);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refresh]);

  const handleDelete = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/users/delete/${id}`,
        {},
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/users", values, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then((res) => {
        if (res.data.success) {
          setRefresh(true);
        }
      
  })
      .catch((err) => {
        console.error("Error adding user:", err);
      });
    closeModal2();
    setRefresh(false);
  };

  console.log(users);
  return (
    <>
      <Modal
        isOpen={isModalOpen1}
        onRequestClose={closeModal1}
        style={customStyles}
        contentLabel="Edit User"
        ariaHideApp={false}
      >
        <h2>Edit User</h2>
        {values && (
          <div>
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
                  name="isAdmin"
                  value={values.is_admin}
                  checked={values.is_admin}
                  onChange={handleAdminChange}
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
                <button className="black-b">Edit</button>
              </div>
            </form>
            <button onClick={closeModal1}>
              <FontAwesomeIcon icon={faXmark} /> Cancel
            </button>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isModalOpen2}
        onRequestClose={closeModal2}
        style={customStyles}
        contentLabel="Add User"
        ariaHideApp={false}
      >
        <h2>Add User</h2>
        <form onSubmit={handleAdd}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              onChange={handleInput}
            />
          </div>
          <div>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" onChange={handleInput} />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input type="text" id="email" name="email" onChange={handleInput} />
          </div>
          <div>
            <label htmlFor="isAdmin">Is Admin:</label>
            <input
              type="checkbox"
              id="isAdmin"
              name="isAdmin"
              onChange={handleAdminChange}
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={handleInput}
            />
          </div>
          <div>
            <button className="black-b">Add</button>
          </div>
        </form>
      </Modal>
      <button onClick={openModal2}>Ekle</button>
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
          {users.map((user, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{user.username}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                {user.is_admin ? <span>&#10004;</span> : <span>&#x2716;</span>}
              </td>
              <td>
                <button onClick={() => openModal1(user)}>
                  <FontAwesomeIcon icon={faPenToSquare} className="edit-btn" />
                </button>
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
    </>
  );
};

export default UserPage;

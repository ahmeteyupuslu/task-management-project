import React, { useState, useEffect } from "react";
import axios from "axios";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);

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
          console.log(res.data.projects);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  console.log(projects);
  return (
    <table>
      <thead>
        <tr>
            <th>Index</th>
            <th>Project Name</th>
            <th>Description</th>
            <th>Owner</th>
            <th>Start Date</th>
            <th>End Date</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((project, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{project.project_name}</td>
            <td>{project.description}</td>
            <td>{project.owner_id}</td>
            <td>{new Date(project.start_date).toLocaleDateString()}</td>
            <td>{new Date(project.end_date).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProjectsPage;

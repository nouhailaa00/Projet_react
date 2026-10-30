import { useState } from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import "./App.css";
function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [resources, setResources] = useState("");
  const [status, setStatus] = useState("To Do");
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  function resetForm() {
    setEditingId(null);
    setTitle("");
    setStartDate("");
    setEndDate("");
    setResources("");
    setStatus("To Do");
  }
  function addTask(e) {
    e.preventDefault();
    if (title.trim() === "") {
      alert("Veuillez saisir une tâche !");
      return;
    }
    const newTask = {
      id: Date.now(),
      title,
      startDate,
      endDate,
      resources,
      status
    };
    setTasks([...tasks, newTask]);
    resetForm();
  }

  function deleteTask(id) {
    setTasks(tasks.filter(task => task.id !== id));
    if (editingId === id) {
      resetForm();
    }
  }
  function modifier(task) {
    setEditingId(task.id);
    setTitle(task.title);
    setStartDate(task.startDate);
    setEndDate(task.endDate);
    setResources(task.resources);
    setStatus(task.status);
  }
  function updateTask() {
    if (editingId === null) {
      alert("Veuillez sélectionner une tâche à modifier !");
      return;
    }
    if (title.trim() === "") {
      alert("Veuillez saisir une tâche !");
      return;
    }
    setTasks(
      tasks.map(task =>
        task.id === editingId
          ? { ...task, title, startDate, endDate, resources, status }
          : task
      )
    );
    resetForm();
  }
  function changeStatus(id, newStatus) {
    setTasks(
      tasks.map(task =>
        task.id === id
          ? { ...task, status: newStatus }
          : task
      )
    );
  }
  const todo = tasks.filter(
    task => task.status === "To Do"
  ).length;
  const inProgress = tasks.filter(
    task => task.status === "In Progress"
  ).length;
  const done = tasks.filter(
    task => task.status === "Done"
  ).length;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const overdueTasks = tasks.filter(task => {
    if (!task.endDate || task.status === "Done") {
      return false;
    }
    const endDate = new Date(task.endDate + "T00:00:00")
    return endDate < today;
  }).length;

  const filteredTasks = tasks.filter(task =>
    task.title
      .toLowerCase()
      .includes(submittedSearch.trim().toLowerCase())
  );
  const data = [
    { name: "To Do", value: todo, color: "#3b82f6" },
    { name: "In Progress", value: inProgress, color: "#f59e0b" },
    { name: "Done", value: done, color: "#22c55e" }
  ];
  return (
    <div className="container">
      <h1>Gestion des tâches</h1>
      <p>Organisez vos tâches facilement</p>
      <section className="dashboard">
        <h2>Dashboard - Statistiques</h2>
        <div className="stats">
          <div className="stat-card total">
            <h3>Total des tâches</h3>
            <p>{tasks.length}</p>
          </div>
          <div className="stat-card todo">
            <h3>To Do</h3>
            <p>{todo}</p>
          </div>
          <div className="stat-card progress">
            <h3>In Progress</h3>
            <p>{inProgress}</p>
          </div>
          <div className="stat-card done">
            <h3>Done</h3>
            <p>{done}</p>
          </div>
        </div>
        <div className="chart-card">
          <h3>Répartition des tâches</h3>
          {tasks.length === 0 ? (
            <p className="empty-chart">
              Ajoutez des tâches pour afficher les statistiques.
            </p>
          ) : (
            <div className="chart">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius="70%"
                    label
                  >
                    {data.map(item => (
                      <Cell
                        key={item.name}
                        fill={item.color}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </section>
      <h2>
        {editingId === null
          ? "Ajouter une tâche"
          : "Modifier une tâche"}
      </h2>
      <form onSubmit={addTask}>
        <label>Nom de la tâche</label>
        <input
          type="text"
          placeholder="Nom de la tâche"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <label>Date de début</label>
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
        />
        <label>Date de fin</label>
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
        />
        <label>Ressources</label>
        <input
          type="text"
          placeholder="Ressources nécessaires"
          value={resources}
          onChange={e => setResources(e.target.value)}
        />
        <label>Statut</label>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        <button type="submit">Ajouter</button>
        <button type="button" onClick={updateTask}>
          Modifier
        </button>
      </form>
      <div className="overdue-card">
        <div>
          <h3>Tâches en retard</h3>
          <p>Nombre de tâches non terminées après la date limite</p>
        </div>
        <strong>{overdueTasks}</strong>
      </div>
      <div className="task-search">
        <input
          type="text"
          placeholder="Type your search..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") {
              e.preventDefault();
              setSubmittedSearch(searchTerm);
            }
          }}
        />
        <button
          type="button"
          onClick={() => setSubmittedSearch(searchTerm)}
        >
          Search
        </button>
        <button
          type="button"
          className="reset-search"
          onClick={() => {
            setSearchTerm("");
            setSubmittedSearch("");
          }}
        >
          Réinitialiser
        </button>
      </div>
      <h2>Mes tâches ({filteredTasks.length})</h2>
      {filteredTasks.length === 0 ? (
        <p>
          {tasks.length === 0
            ? "Aucune tâche pour l'instant."
            : "Aucune tâche trouvée."}
        </p>
      ) : (
        <div className="table-container">
          <table className="tasks-table">
            <thead>
              <tr>
                <th>Nom de la tâche</th>
                <th>Date de début</th>
                <th>Date de fin</th>
                <th>Ressources</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map(task => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.startDate || "Non définie"}</td>
                  <td>{task.endDate || "Non définie"}</td>
                  <td>{task.resources || "Non définies"}</td>
                  <td>
                    <select
                      value={task.status}
                      onChange={e =>
                        changeStatus(task.id, e.target.value)
                      }
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </td>
                  <td className="table-actions">
                    <button
                      type="button"
                      onClick={() => modifier(task)}
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      className="delete"
                      onClick={() => deleteTask(task.id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
export default App;

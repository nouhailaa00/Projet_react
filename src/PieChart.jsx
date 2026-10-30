
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);
function PieChart({ tasks }) {
  const data = {
    labels: ["To Do", "In Progress", "Done"],
    datasets: [
      {
        data: [
          tasks.filter(task => task.status === "To Do").length,
          tasks.filter(task => task.status === "In Progress").length,
          tasks.filter(task => task.status === "Done").length
        ],
        backgroundColor: ["#2563eb", "#f59e0b", "#16a34a"],
        borderWidth: 2,
        borderColor: "#ffffff"
      }
    ]
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom"
      }
    }
  };
  return <Pie data={data} options={options} />;
}
export default PieChart;

import axios from "axios";

export default async function getCategories() {
        const token = localStorage.getItem("token");
        return await axios
          .get("http://localhost:8000/categoria", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            return res.data;
          });
      }
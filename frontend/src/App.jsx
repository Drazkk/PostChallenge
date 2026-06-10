import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [posts, setPosts] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/posts"
      );

      setPosts(response.data);
    } catch (error) {
      console.error("Error al cargar posts:", error);
    }
  };

  const createPost = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://127.0.0.1:5000/posts",
        {
          name,
          description,
        }
      );

      setName("");
      setDescription("");

      loadPosts();
    } catch (error) {
      console.error("Error al crear post:", error);
    }
  };

  const deletePost = async (id) => {
    try {
      await axios.delete(
        `http://127.0.0.1:5000/posts/${id}`
      );

      loadPosts();
    } catch (error) {
      console.error("Error al eliminar post:", error);
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.name.toLowerCase().includes(
      filter.toLowerCase()
    )
  );

  return (
    <div className="container">

      <h1>Posts Challenge</h1>

      {/* FILTRO */}

      <div className="filter-section">
        <input
          type="text"
          placeholder="Filtro de Nombre"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />

        <button>
          Buscar
        </button>
      </div>

      {/* TABLA */}

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acción</th>
          </tr>
        </thead>

        <tbody>

          {filteredPosts.length === 0 ? (
            <tr>
              <td colSpan="3">
                No hay posts registrados
              </td>
            </tr>
          ) : (
            filteredPosts.map((post) => (
              <tr key={post.id}>
                <td>{post.name}</td>

                <td>{post.description}</td>

                <td>
                  <button
                    className="action-button"
                    onClick={() =>
                      deletePost(post.id)
                    }
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}

        </tbody>
      </table>

      {/* FORMULARIO */}

      <form
        className="create-section"
        onSubmit={createPost}
      >

        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          required
        />

        <input
          type="text"
          placeholder="Descripción"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          required
        />

        <button type="submit">
          Crear
        </button>

      </form>

    </div>
  );
}

export default App;
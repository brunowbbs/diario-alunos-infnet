import { useEffect } from "react";
import axios from "axios";

import "./styles.css";
import { useState } from "react";

export default function App() {
  const [alunos, setAlunos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    matricula: "",
    curso: "",
    bimestre: "",
  });

  async function buscarAlunos() {
    try {
      setIsLoading(true);
      const resposta = await axios.get("https://api-aluno.vercel.app/aluno");
      setAlunos(resposta.data);
    } catch (error) {
      alert("Erro ao buscar dados");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    buscarAlunos();
  }, []);

  function clearState() {
    setFormData({
      nome: "",
      matricula: "",
      curso: "",
      bimestre: "",
    });
  }

  async function salvarAluno() {
    try {
      await axios.post("https://api-aluno.vercel.app/aluno", {
        nome: formData.nome,
        matricula: formData.matricula,
        curso: formData.curso,
        bimestre: formData.bimestre,
      });
      buscarAlunos();
      clearState();
      alert("aluno criado com sucesso");
    } catch (error) {
      alert("Erro ao cadastrar aluno");
    }
  }

  return (
    <div>
      <h1>Diário eletrônico</h1>

      <form className="container_form">
        <input
          placeholder="Nome"
          value={formData.nome}
          onChange={(event) =>
            setFormData({ ...formData, nome: event.target.value })
          }
        />
        <input
          placeholder="Matrícula"
          value={formData.matricula}
          onChange={(event) =>
            setFormData({ ...formData, matricula: event.target.value })
          }
        />
        <input
          placeholder="Curso"
          value={formData.curso}
          onChange={(event) =>
            setFormData({ ...formData, curso: event.target.value })
          }
        />
        <input
          placeholder="Bimestre"
          value={formData.bimestre}
          onChange={(event) =>
            setFormData({ ...formData, bimestre: event.target.value })
          }
        />

        <button type="button" onClick={salvarAluno}>
          Salvar
        </button>
      </form>

      <h3 className="subtitle">Alunos Cadastrados</h3>

      {alunos.length < 1 && isLoading === false ? (
        <p>Nenhum aluno encontrado</p>
      ) : (
        <>
          {isLoading ? (
            <h4>Carregando...</h4>
          ) : (
            <table>
              <tr>
                <th style={{ textAlign: "center" }}>Ordem</th>
                <th>Nome</th>
                <th>Matrícula</th>
                <th>Curso</th>
                <th>Bimestre</th>
                <th>Ações</th>
              </tr>
              {alunos.map((aluno, index) => (
                <tr>
                  <td style={{ textAlign: "center" }}>{index + 1}</td>
                  <td>{aluno.nome}</td>
                  <td>{aluno.matricula}</td>
                  <td>{aluno.curso}</td>
                  <td style={{ textAlign: "center" }}>{aluno.bimestre}</td>
                  <td>XXXX</td>
                </tr>
              ))}
            </table>
          )}
        </>
      )}

      {/* <button className="search" onClick={buscarAlunos}>
        Buscar Alunos
      </button> */}
    </div>
  );
}

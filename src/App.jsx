import { useEffect, useState } from "react";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

import { RiDeleteBin6Line } from "react-icons/ri";
import { BiSolidEdit } from "react-icons/bi";

import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import "./styles.css";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "#fff",
};

const schema = yup.object({
  nome: yup.string().required("Campo obrigatório"),
  matricula: yup.string().required("Campo obrigatório"),
  curso: yup.string().required("Campo obrigatório"),
  bimestre: yup
    .number()
    .typeError("Informe um bimestre válido")
    .required("Campo obrigatório"),
});

export default function App() {
  const [alunos, setAlunos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cursos, setCursos] = useState([]);
  const [idSelecionado, setIdSelecionado] = useState("");
  // const [formData, setFormData] = useState({
  //   nome: "",
  //   matricula: "",
  //   curso: "",
  //   bimestre: "",
  // });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  console.log(errors);

  async function buscarAlunos() {
    try {
      setIsLoading(true);
      const resposta = await axios.get("https://api-aluno.vercel.app/aluno");
      setAlunos(resposta.data);

      // toast("Dados carregados com sucesso!", {
      //   hideProgressBar: true,
      //   style: { background: "#0FBA3F", color: "#fff" },
      // });
    } catch (error) {
      alert("Erro ao buscar dados");
    } finally {
      setIsLoading(false);
    }
  }

  async function buscarCursos() {
    try {
      const resposta = await axios.get("https://api-aluno.vercel.app/cursos");
      setCursos(resposta.data.cursos);
    } catch (error) {
      alert("Erro ao buscar cursos");
    }
  }

  useEffect(() => {
    buscarAlunos();
  }, []);

  useEffect(() => {
    buscarCursos();
  }, []);

  // function clearState() {
  //   setFormData({
  //     nome: "",
  //     matricula: "",
  //     curso: "",
  //     bimestre: "",
  //   });
  // }

  async function salvarAluno(data) {
    // console.log(data);

    try {
      await axios.post("https://api-aluno.vercel.app/aluno", {
        nome: data.nome,
        matricula: data.matricula,
        curso: data.curso,
        bimestre: data.bimestre,
      });
      buscarAlunos();
      reset();
      // clearState();
      toast("Aluno criado com sucesso!", {
        hideProgressBar: true,
        style: { background: "#0FBA3F", color: "#fff" },
      });
    } catch (error) {
      alert("Erro ao cadastrar aluno");
    }
  }

  async function editarAluno(data) {
    try {
      await axios.put(`https://api-aluno.vercel.app/aluno/${idSelecionado}`, {
        nome: data.nome,
        matricula: data.matricula,
        curso: data.curso,
        bimestre: data.bimestre,
      });
      toast("Aluno editado com sucesso!", {
        hideProgressBar: true,
        style: { background: "#0FBA3F", color: "#fff" },
      });
    } catch (error) {
      alert("Erro ao editar o aluno");
    } finally {
      reset();
      setIdSelecionado("");
      buscarAlunos();
    }
  }

  async function removerAluno(id) {
    try {
      await axios.delete(`https://api-aluno.vercel.app/aluno/${id}`);
      toast("Aluno removido com sucesso!", {
        hideProgressBar: true,
        style: { background: "#0FBA3F", color: "#fff" },
      });
    } catch (error) {
      alert("Erro ao remover aluno");
    } finally {
      buscarAlunos();
    }
  }

  function preencherEstado(aluno) {
    setValue("nome", aluno.nome);
    setValue("matricula", aluno.matricula);
    setValue("curso", aluno.curso);
    setValue("bimestre", aluno.bimestre);
  }

  return (
    <div>
      <h1>Diário eletrônico</h1>

      <form
        className="container_form"
        onSubmit={handleSubmit(idSelecionado ? editarAluno : salvarAluno)}
      >
        <div style={{ width: "100%" }}>
          <input placeholder="Nome" {...register("nome")} />
          <span style={{ color: "white", fontSize: 12 }}>
            {errors.nome?.message}
          </span>
        </div>

        <div style={{ width: "100%" }}>
          <input placeholder="Matrícula" {...register("matricula")} />
          <span style={{ color: "white", fontSize: 12 }}>
            {errors.matricula?.message}
          </span>
        </div>

        <div style={{ width: "100%" }}>
          <select {...register("curso")}>
            <option value={""}>Selecione...</option>
            {cursos.map((curso) => (
              <option key={curso.id}>{curso.name}</option>
            ))}
          </select>
          <span style={{ color: "white", fontSize: 12 }}>
            {errors.curso?.message}
          </span>
        </div>

        <div style={{ width: "100%" }}>
          <input placeholder="Bimestre" {...register("bimestre")} />
          <span style={{ color: "white", fontSize: 12 }}>
            {errors.bimestre?.message}
          </span>
        </div>

        <button
          type="submit"
          // onClick={idSelecionado ? editarAluno : salvarAluno}
        >
          Salvar
        </button>
      </form>

      <h3 className="subtitle">Alunos Cadastrados</h3>

      {alunos.length < 1 && isLoading === false ? (
        <p>Nenhum aluno encontrado</p>
      ) : (
        <>
          {isLoading ? (
            <ClipLoader
              color={"#fff"}
              loading={true}
              cssOverride={override}
              size={150}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          ) : (
            <table>
              <tr>
                <th style={{ textAlign: "center" }}>ID</th>
                <th>Nome</th>
                <th>Matrícula</th>
                <th>Curso</th>
                <th>Bimestre</th>
                <th style={{ textAlign: "center" }}>Ações</th>
              </tr>
              {alunos.map((aluno, index) => (
                <tr>
                  <td style={{ textAlign: "center" }}>{aluno._id}</td>
                  <td>{aluno.nome}</td>
                  <td>{aluno.matricula}</td>
                  <td>{aluno.curso}</td>
                  <td style={{ textAlign: "center" }}>{aluno.bimestre}</td>
                  <td style={{ textAlign: "center" }}>
                    <BiSolidEdit
                      onClick={() => {
                        setIdSelecionado(aluno._id);
                        preencherEstado(aluno);
                      }}
                      cursor="pointer"
                      color="#0FBA3F"
                      size={20}
                      style={{ marginRight: 4 }}
                    />

                    <RiDeleteBin6Line
                      onClick={() => removerAluno(aluno._id)}
                      color="#F90000"
                      size={20}
                      cursor="pointer"
                    />
                  </td>
                </tr>
              ))}
            </table>
          )}
        </>
      )}

      {/* <button className="search" onClick={buscarAlunos}>
        Buscar Alunos
      </button> */}
      <ToastContainer />
    </div>
  );
}

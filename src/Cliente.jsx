import { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

function Cliente() {
  const [tela, setTela] = useState("home");
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [horariosOcupados, setHorariosOcupados] = useState([]);

  // 🔥 HORÁRIOS
  const horarios = [
    "07:00","08:00","09:00","09:40","10:20",
    "11:00","11:40","12:00","12:30","13:00",
    "13:30","14:00","15:00","16:00","17:00"
  ];

  // 🔥 BUSCAR HORÁRIOS OCUPADOS
  const buscarHorariosOcupados = async (data) => {
    const querySnapshot = await getDocs(collection(db, "agendamentos"));

    const ocupados = [];

    querySnapshot.forEach((docItem) => {
      const agendamento = docItem.data();

      if (agendamento.data === data) {
        ocupados.push(agendamento.horario);
      }
    });

    setHorariosOcupados(ocupados);
  };

  // 🔥 SALVAR AGENDAMENTO
  const confirmarAgendamento = async () => {
    try {
      await addDoc(collection(db, "agendamentos"), {
        nome,
        telefone,
        data: dataSelecionada,
        horario: horarioSelecionado
      });

      alert("Agendado com sucesso!");
      setTela("home");

    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  // 🔥 BLOQUEIO DE DIAS (SEM ERRO DE FUSO)
  const desabilitarDias = (date) => {
    const [ano, mes, dia] = date.split("-");
    const dataLocal = new Date(Number(ano), Number(mes) - 1, Number(dia));
    const diaSemana = dataLocal.getDay();

    return diaSemana === 0 || diaSemana === 1;
  };

  return (
    <div style={{
      width: "100%",
      minHeight: "100vh",
      backgroundImage: "url('/fundo.png?v=1')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "white"
    }}>

      <div style={{
        width: "100%",
        maxWidth: "900px",
        padding: "40px 20px",
        textAlign: "center"
      }}>

        {/* HOME */}
        {tela === "home" && (
          <>
            <h1>Agende seu horário</h1>
            <button onClick={() => setTela("data")}>
              Agendar
            </button>
          </>
        )}

        {/* DATA */}
        {tela === "data" && (
          <>
            <h2>Escolha uma data</h2>

            <input
              type="date"
              onChange={async (e) => {
                const data = e.target.value;

                const hoje = new Date().toISOString().split("T")[0];

                // 🔥 BLOQUEIA DOMINGO E SEGUNDA
                if (desabilitarDias(data)) {
                  alert("Não atendemos domingo e segunda ❌");
                  return;
                }

                // 🔥 BLOQUEIA DATA PASSADA
                if (data < hoje) {
                  alert("Essa data já passou ❌");
                  return;
                }

                setDataSelecionada(data);
                await buscarHorariosOcupados(data);
                setTela("agenda");
              }}
            />

            <br />
            <button onClick={() => setTela("home")}>Voltar</button>
          </>
        )}

        {/* HORÁRIOS */}
        {tela === "agenda" && (
          <>
            <h2>Escolha um horário</h2>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "10px",
              marginTop: "20px"
            }}>

              {horarios.map((h) => {
                const agora = new Date();
                const dataHoje = new Date().toISOString().split("T")[0];

                const horarioPassado =
                  dataSelecionada === dataHoje &&
                  h < agora.toTimeString().slice(0, 5);

                const ocupado =
                  (horariosOcupados || []).includes(h) || horarioPassado;

                return (
                  <button
                    key={h}
                    disabled={ocupado}
                    onClick={() => {
                      if (ocupado) return;
                      setHorarioSelecionado(h);
                      setTela("confirmar");
                    }}
                    style={{
                      padding: "10px",
                      borderRadius: "8px",
                      border: "none",
                      background: ocupado ? "#555" : "#fff",
                      color: ocupado ? "#aaa" : "#000",
                      cursor: ocupado ? "not-allowed" : "pointer",
                    }}
                  >
                    {h} {ocupado ? "❌" : ""}
                  </button>
                );
              })}

            </div>

            <br />
            <button onClick={() => setTela("data")}>Voltar</button>
          </>
        )}

        {/* CONFIRMAR */}
        {tela === "confirmar" && (
          <>
            <h2>Confirmar</h2>

            <p>{dataSelecionada}</p>
            <p>{horarioSelecionado}</p>

            <input
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <br />

            <input
              placeholder="Telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />

            <br />

            <button
              onClick={async () => {
                if (!nome || !telefone) {
                  alert("Preencha tudo!");
                  return;
                }

                await confirmarAgendamento();
              }}
            >
              Confirmar
            </button>

            <br />
            <button onClick={() => setTela("agenda")}>
              Voltar
            </button>
          </>
        )}

      </div>
    </div>
  );
}

export default Cliente;
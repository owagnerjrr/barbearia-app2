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

  // 🔥 HORÁRIOS (CORRETO NO TOPO)
  const horarios = [
    "07:00","08:00","09:00","09:40","10:20",
    "11:00","11:40","12:00","12:30","13:00",
    "13:30","14:00","15:00","16:00","17:00"
  ];

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

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>

      {tela === "home" && (
        <>
          <h1>Agende seu horário</h1>
          <button onClick={() => setTela("data")}>
            Agendar
          </button>
        </>
      )}

      {tela === "data" && (
        <>
          <h2>Escolha uma data</h2>

          <input
            type="date"
            onChange={async (e) => {
              const data = e.target.value;
              setDataSelecionada(data);
              await buscarHorariosOcupados(data);
              setTela("agenda");
            }}
          />
        </>
      )}

      {tela === "agenda" && (
        <>
          <h2>Escolha um horário</h2>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>

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

      {tela === "confirmar" && (
        <>
          <h2>Confirmar horário</h2>

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

          <button onClick={confirmarAgendamento}>
            Confirmar
          </button>

          <br />
          <button onClick={() => setTela("agenda")}>
            Voltar
          </button>
        </>
      )}

    </div>
  );
}

export default Cliente;
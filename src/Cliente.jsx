import { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

function Cliente() {
  const [tela, setTela] = useState("home"); 
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [dataTemp, setDataTemp] = useState(""); // ✅ ADICIONADO
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [horariosOcupados, setHorariosOcupados] = useState([]);

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
        nome: nome,
        telefone: telefone,
        data: dataSelecionada,
        horario: horarioSelecionado
      });

      alert("Agendado com sucesso!");
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  return (
    <div style={{ width: "100%", minHeight: "100vh", backgroundImage: "url('/fundo.png?v=1')", backgroundSize: "cover", display: "flex", justifyContent: "center", alignItems: "center", color: "white" }}>
      <div style={{ width: "100%", maxWidth: "900px", padding: "40px 20px" }}>

        {tela === "home" && (
          <div style={{ textAlign: "center" }}>
            <h1>Agende já seu horário</h1>
            <button onClick={() => setTela("data")}>Agendar</button>
          </div>
        )}

        {tela === "data" && (
          <div style={{ textAlign: "center" }}>
            <h2>Escolha uma data</h2>

            {/* ✅ ALTERADO */}
            <input
              type="date"
              onChange={(e) => setDataTemp(e.target.value)}
              style={{ padding: "10px", borderRadius: "10px", marginTop: "20px" }}
            />

            {/* ✅ NOVO BOTÃO */}
            <button
              onClick={async () => {
                const data = dataTemp;

                if (!data) {
                  alert("Escolha uma data ❌");
                  return;
                }

                const hoje = new Date().toISOString().split("T")[0];

                const [ano, mes, dia] = data.split("-");
                const diaSemana = new Date(ano, mes - 1, dia).getDay();

                if (diaSemana === 0 || diaSemana === 1) {
                  alert("Não atendemos domingo e segunda ❌");
                  return;
                }

                if (data < hoje) {
                  alert("Essa data já passou ❌");
                  return;
                }

                setDataSelecionada(data);
                await buscarHorariosOcupados(data);
                setTela("agenda");
              }}
              style={{
                marginTop: "15px",
                padding: "10px 20px",
                background: "red",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer"
              }}
            >
              Confirmar data
            </button>

            <br />

            <button onClick={() => setTela("home")}>Voltar</button>
          </div>
        )}

        {tela === "agenda" && (
          <div style={{ textAlign: "center" }}>
            <h2>Escolha um horário</h2>

            {horarios.map((h) => {
              const ocupado = (horariosOcupados || []).includes(h);

              return (
                <button
                  key={h}
                  disabled={ocupado}
                  onClick={() => {
                    if (ocupado) return;
                    setHorarioSelecionado(h);
                    setTela("confirmar");
                  }}
                >
                  {h} {ocupado ? "❌" : ""}
                </button>
              );
            })}

            <br />
            <button onClick={() => setTela("data")}>Voltar</button>
          </div>
        )}

        {tela === "confirmar" && (
          <div style={{ textAlign: "center" }}>
            <h2>Confirmar</h2>

            <p>{dataSelecionada}</p>
            <p>{horarioSelecionado}</p>

            <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
            <input placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />

            <button
              onClick={async () => {
                if (!nome || !telefone) {
                  alert("Preencha tudo!");
                  return;
                }

                await confirmarAgendamento();
                setTela("home");
              }}
            >
              Confirmar
            </button>

            <br />
            <button onClick={() => setTela("agenda")}>Voltar</button>
          </div>
        )}

      </div>
    </div>
  );
}

export default Cliente;
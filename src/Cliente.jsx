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

  const horarios = [
    "07:00","08:00","09:00","09:40","10:20",
    "11:00","11:40","12:00","12:30","13:00",
    "13:30","14:00","15:00","16:00","17:00"
  ];

  const buscarHorariosOcupados = async (data) => {
    console.log("🔥 BUSCANDO HORÁRIOS PRA:", data);

    const querySnapshot = await getDocs(collection(db, "agendamentos"));
    const ocupados = [];

    querySnapshot.forEach((docItem) => {
      const agendamento = docItem.data();

      if (agendamento.data === data) {
        ocupados.push(agendamento.horario);
      }
    });

    console.log("✅ OCUPADOS:", ocupados);
    setHorariosOcupados(ocupados);
  };

  const confirmarAgendamento = async () => {
    console.log("🔥 clicou no botão");

    try {
      await addDoc(collection(db, "agendamentos"), {
        nome: nome,
        telefone: telefone,
        data: dataSelecionada,
        horario: horarioSelecionado
      });

      console.log("✅ SALVOU NO FIREBASE");
      alert("Agendado com sucesso!");
    } catch (error) {
      console.error("❌ ERRO AO SALVAR:", error);
    }
  };

  const desabilitarDias = (date) => {
    const [ano, mes, dia] = date.split("-");
    const dataLocal = new Date(Number(ano), Number(mes) - 1, Number(dia));
    const diaSemana = dataLocal.getDay();

    return diaSemana === 0 || diaSemana === 1;
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundImage: "url('/fundo.png?v=1')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white"
      }}


      // teste atualização // teste deploy agora
    >
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          padding: "40px 20px 60px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        {tela === "home" && (
          <div style={{ textAlign: "center", marginTop: "-100px" }}>
            <h1>Agende já seu horário</h1>

            <button
              onClick={() => setTela("data")}
              style={{
                marginTop: "400px",
                padding: "14px 32px",
                background: "red",
                color: "#fff",
                border: "none",
                borderRadius: "15px",
                cursor: "pointer"
              }}
            >
              Agendar
            </button>
          </div>
        )}

        {tela === "data" && (
          <div style={{ textAlign: "center", marginTop: "-320px" }}>
            <h2>Escolha uma data</h2>

            <input
              type="date"
              onChange={async (e) => {
                const data = e.target.value;
                const hoje = new Date().toISOString().split("T")[0];

                if (desabilitarDias(data)) {
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
            />

            <br />

            <button onClick={() => setTela("home")}>
              Voltar
            </button>
          </div>
        )}

        {tela === "agenda" && (
          <div style={{ textAlign: "center", marginTop: "-320px" }}>
            <h2>Escolha um horário</h2>

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
          <div style={{ textAlign: "center", marginTop: "-320px" }}>
            <h2>Confirmar horário</h2>

            <p>{dataSelecionada}</p>
            <p>{horarioSelecionado}</p>

            <input
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <br />

            <input
              placeholder="Seu telefone"
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
                setTela("home");
              }}
            >
              Confirmar
            </button>

            <br />

            <button onClick={() => setTela("agenda")}>
              Voltar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cliente;

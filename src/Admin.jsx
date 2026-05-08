import { useEffect, useState } from "react";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

function Admin() {
  const [agendamentos, setAgendamentos] = useState({});

  const buscarAgendamentos = async () => {
    const querySnapshot = await getDocs(collection(db, "agendamentos"));

    const lista = [];

    querySnapshot.forEach((docItem) => {
      lista.push({
        id: docItem.id,
        ...docItem.data()
      });
    });

    // 🔥 FILTRA PASSADOS
    const agora = new Date();

    const listaFiltrada = lista.filter((a) => {
      const dataHora = new Date(`${a.data}T${a.horario}`);
      return dataHora >= agora;
    });

    // 🔥 ORDENA
    listaFiltrada.sort((a, b) => {
      const dateA = new Date(`${a.data}T${a.horario}`);
      const dateB = new Date(`${b.data}T${b.horario}`);
      return dateA - dateB;
    });

    // 🔥 AGRUPA POR DATA
    const agrupados = {};

    listaFiltrada.forEach((item) => {
      if (!agrupados[item.data]) {
        agrupados[item.data] = [];
      }
      agrupados[item.data].push(item);
    });

    setAgendamentos(agrupados);
  };

  const formatarDataBr = (data) => {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  useEffect(() => {
    buscarAgendamentos();
  }, []);

  const excluirAgendamento = async (id) => {
    if (!window.confirm("Excluir agendamento?")) return;

    await deleteDoc(doc(db, "agendamentos", id));
    buscarAgendamentos();
  };

  return (
    <div
      style={{
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
    >
      <div
        style={{
          width: "100%",
          maxWidth: "820px",
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(12px)",
          padding: "40px 30px",
          textAlign: "left",
          boxShadow: "0 0 45px rgba(0,0,0,0.25)",
          border: "1px solid rgba(255,255,255,0.22)",
          borderRadius: "24px"
        }}
      >
        <h2 style={{ textAlign: "center" }}>📋 Agendamentos</h2>

        {Object.keys(agendamentos).length === 0 && (
          <p style={{ textAlign: "center" }}>
            Nenhum agendamento encontrado
          </p>
        )}

        {Object.keys(agendamentos)
          .sort()
          .map((data) => (
            <div key={data} style={{ marginBottom: "20px" }}>
              <h3>📅 {formatarDataBr(data)}</h3>

              {agendamentos[data].map((a) => (
                <div
                  key={a.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    background: "rgba(255,255,255,0.1)",
                    padding: "18px",
                    borderRadius: "16px",
                    marginBottom: "14px"
                  }}
                >
                  <p style={{ fontWeight: "bold" }}>{a.nome}</p>
                  <p>📞 {a.telefone}</p>
                  <p>⏰ {a.horario}</p>

                  <button
                    onClick={() => excluirAgendamento(a.id)}
                    style={{
                      marginTop: "10px",
                      background: "red",
                      color: "#fff",
                      border: "none",
                      padding: "8px",
                      borderRadius: "10px",
                      cursor: "pointer"
                    }}
                  >
                    ❌ Excluir
                  </button>
                </div>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}

export default Admin;

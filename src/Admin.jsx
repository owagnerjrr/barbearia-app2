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

    const agora = new Date();

    const listaFiltrada = lista.filter((a) => {
      const dataHora = new Date(`${a.data}T${a.horario}`);
      return dataHora >= agora;
    });

    listaFiltrada.sort((a, b) => {
      const dateA = new Date(`${a.data}T${a.horario}`);
      const dateB = new Date(`${b.data}T${b.horario}`);
      return dateA - dateB;
    });

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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white"
      }}
    >
      <div
        style={{
          width: "90%",
          maxWidth: "420px",
          background: "rgba(255,255,255,0.10)",
          backdropFilter: "blur(6px)",
          padding: "20px",
          boxShadow: "0 0 30px rgba(0,0,0,0.25)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "20px"
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "15px" }}>
          📋 Agendamentos
        </h2>

        {Object.keys(agendamentos).length === 0 && (
          <p style={{ textAlign: "center" }}>
            Nenhum agendamento encontrado
          </p>
        )}

        {Object.keys(agendamentos)
          .sort()
          .map((data) => (
            <div key={data} style={{ marginBottom: "25px" }}>
              
              {/* DATA DESTACADA */}
              <h3
                style={{
                  background: "rgba(212,175,55,0.15)",
                  padding: "6px 10px",
                  borderRadius: "10px",
                  display: "inline-block",
                  fontWeight: "bold",
                  border: "1px solid rgba(212,175,55,0.3)"
                }}
              >
                📅 {formatarDataBr(data)}
              </h3>

              {agendamentos[data].map((a) => (
                <div
                  key={a.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    background: "rgba(255,255,255,0.1)",
                    padding: "10px",
                    borderRadius: "16px",
                    marginTop: "10px"
                  }}
                >
                  <p style={{ fontWeight: "bold" }}>{a.nome}</p>
                  <p>📞 {a.telefone}</p>

                  {/* HORÁRIO DESTACADO */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <span style={{ fontSize: "15px", opacity: 0.7 }}>
                      ⏰ Horário
                    </span>

                    <span
                      style={{
                        background: "linear-gradient(145deg, #d4af37, #b8962e)",
                        color: "#000",
                        padding: "10px 24px",
                        borderRadius: "10px",
                        fontWeight: "bold",
                        fontSize: "14px",
                        boxShadow: "0 2px 8px rgba(212,175,55,0.4)"
                      }}
                    >
                      {a.horario}
                    </span>
                  </div>

                  <button
                    onClick={() => excluirAgendamento(a.id)}
                    style={{
                      marginTop: "10px",
                      padding: "10px",
                      background: "linear-gradient(145deg, #d4af37, #b8962e)",
                      color: "#000",
                      border: "none",
                      borderRadius: "12px",
                      cursor: "pointer",
                      fontWeight: "600",
                      boxShadow: "0 4px 12px rgba(212,175,55,0.3)"
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
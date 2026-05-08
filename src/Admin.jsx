import { useEffect, useState } from "react";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

function Admin() {
  const [agendamentos, setAgendamentos] = useState([]);

  const buscarAgendamentos = async () => {
    const querySnapshot = await getDocs(collection(db, "agendamentos"));
    const lista = [];

    querySnapshot.forEach((docItem) => {
      lista.push({ id: docItem.id, ...docItem.data() });
      const agora = new Date();

const listaFiltrada = lista.filter((a) => {
  const dataHora = new Date(a.data + " " + a.horario);
  return dataHora >= agora;
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

// 🔥 AGRUPA
const agrupados = {};

listaFiltrada.forEach((item) => {
  if (!agrupados[item.data]) {
    agrupados[item.data] = [];
  }
  agrupados[item.data].push(item);
});

// 🔥 FINAL
setAgendamentos(agrupados);

    
    })

  const formatarDataBr = (data) => {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  useEffect(() => {
    const loadAgendamentos = async () => {
      await buscarAgendamentos();
    };

    void loadAgendamentos();
  }, []);

  const excluirAgendamento = async (id) => {
    if (!window.confirm("Excluir agendamento?")) return;

    await deleteDoc(doc(db, "agendamentos", id));
    buscarAgendamentos();
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundImage: "url('/fundo.png?v=1')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "white"
    }}>

      <div style={{
        width: "100%",
        maxWidth: "820px",
        background: "rgba(255,255,255,0.12)",
        backdropFilter: "blur(12px)",
        padding: "40px 30px",
        textAlign: "left",
        boxShadow: "0 0 45px rgba(0,0,0,0.25)",
        border: "1px solid rgba(255,255,255,0.22)",
        borderRadius: "24px"
      }}>

        <h2 style={{ margin: "0 0 18px", color: "#fff", textAlign: "center" }}>📋 Agendamentos</h2>

        {agendamentos.length === 0 && (
          <p style={{ color: "#eee", textAlign: "center" }}>Nenhum agendamento encontrado</p>
        )}

        {agendamentos.map((a) => (
          <div key={a.id} style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            background: "rgba(255,255,255,0.1)",
            padding: "18px",
            borderRadius: "16px",
            marginBottom: "14px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
              <div>
                <p style={{ margin: "0", fontSize: "1rem", color: "#fff", fontWeight: "700" }}>{a.nome}</p>
                <p style={{ margin: "4px 0 0", color: "#ddd" }}>📞 {a.telefone}</p>
              </div>
              <button
                onClick={() => excluirAgendamento(a.id)}
                style={{
                  padding: "10px 16px",
                  borderRadius: "12px",
                  border: "none",
                  background: "red",
                  color: "white",
                  cursor: "pointer",
                  minWidth: "120px"
                }}
              >
                ❌ Excluir
              </button>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
              <span style={{ color: "#ddd" }}>📅 {formatarDataBr(a.data)}</span>
              <span style={{ color: "#ddd" }}>⏰ {a.horario}</span>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default Admin}

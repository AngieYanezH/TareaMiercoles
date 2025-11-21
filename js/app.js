// ------------------------------------------------------
//  🔥 FIREBASE CONFIG (SIN NPM / PARA NAVEGADOR)
// ------------------------------------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getFirestore, collection, addDoc, getDocs 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 💡 TU CONFIGURACIÓN DE FIREBASE:
const firebaseConfig = {
  apiKey: "AIzaSyCpuJb5f9ycFwqVzAhgTQz6vm1t_msj1f8",
  authDomain: "tareamiercoles-da0b0.firebaseapp.com",
  projectId: "tareamiercoles-da0b0",
  storageBucket: "tareamiercoles-da0b0.appspot.com",
  messagingSenderId: "802999158776",
  appId: "1:802999158776:web:0fdb6f0a8478887c29380d",
  measurementId: "G-7N4FTTJ2RG"
};

// Inicializar Firebase
const appFirebase = initializeApp(firebaseConfig);
const db = getFirestore(appFirebase);

// ------------------------------------------------------
//  🔥 LÓGICA DEL PROTOTIPO
// ------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {

  const path = window.location.pathname;

  // --------------------
  // Marcar menú activo
  // --------------------
  const links = document.querySelectorAll(".sidebar-menu a");
  links.forEach(link => {
    if (link.href.includes(location.pathname.split("/").pop())) {
      link.classList.add("active");
    }
  });

  // --------------------
  // LOGIN
  // --------------------
  if (path.endsWith("index.html") || path.endsWith("/")) {
    const formLogin = document.getElementById("formLogin");
    if (formLogin) {
      formLogin.addEventListener("submit", (e) => {
        e.preventDefault();
        const rut = document.getElementById("rut").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!rut || !password) {
          alert("Por favor ingresa tu RUT y contraseña.");
          return;
        }

        sessionStorage.setItem("usuarioActual", rut);
        window.location.href = "dashboard.html";
      });
    }
  }

  // --------------------
  // Mostrar usuario en dashboard
  // --------------------
  const badgeUser = document.getElementById("userBadge");
  if (badgeUser) {
    const u = sessionStorage.getItem("usuarioActual") || "admin.nuam";
    badgeUser.textContent = `Sesión: ${u}`;
  }

  // ------------------------------------------------------
  //  🔥 CARGAR CALIFICACIONES DESDE FIREBASE
  // ------------------------------------------------------
  if (path.endsWith("calificaciones.html")) {
    const tbody = document.getElementById("tbodyCalificaciones");

    async function cargarCalificaciones() {
      tbody.innerHTML = "";
      const querySnapshot = await getDocs(collection(db, "calificaciones"));

      querySnapshot.forEach((doc) => {
        const c = doc.data();

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${c.rut}</td>
          <td>${c.nombre}</td>
          <td>${c.periodo}</td>
          <td>${c.categoria}</td>
          <td>$${Number(c.valor).toLocaleString("es-CL")}</td>
          <td>
            <button class="btn btn-sm btn-outline">Editar</button>
            <button class="btn btn-sm btn-secondary">Eliminar</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    cargarCalificaciones();
  }

  // ------------------------------------------------------
  //  🔥 FACTORES (DEMO)
  // ------------------------------------------------------
  if (path.endsWith("factores.html")) {
    const tbody = document.getElementById("tbodyFactores");
    if (tbody) {
      tbody.innerHTML = `
        <tr><td>Factor IVA</td><td>0.19</td></tr>
        <tr><td>Factor Renta</td><td>0.27</td></tr>
      `;
    }

    const formCarga = document.getElementById("formCargaFactores");
    if (formCarga) {
      formCarga.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Archivo leído (demo). Aquí iría la carga masiva.");
      });
    }
  }

  // ------------------------------------------------------
  //  🔥 AUDITORÍA (DEMO)
  // ------------------------------------------------------
  if (path.endsWith("auditoria.html")) {
    const tbody = document.getElementById("tbodyAuditoria");
    if (tbody) {
      tbody.innerHTML = `
        <tr><td>1</td><td>admin.nuam</td><td>Crear</td><td>2025-09-01</td></tr>
        <tr><td>2</td><td>analista.tributario</td><td>Modificar</td><td>2025-09-02</td></tr>
      `;
    }
  }

  // ------------------------------------------------------
  //  🔥 USUARIOS (DEMO)
  // ------------------------------------------------------
  if (path.endsWith("usuarios.html")) {
    const tbody = document.getElementById("tbodyUsuarios");
    if (tbody) {
      tbody.innerHTML = `
        <tr><td>admin.nuam</td><td>Administrador</td></tr>
        <tr><td>analista.tributario</td><td>Analista Tributario</td></tr>
        <tr><td>supervisor.cumplimiento</td><td>Supervisor</td></tr>
      `;
    }
  }

  // ------------------------------------------------------
  //  🔥 GUARDAR CALIFICACIÓN NUEVA EN FIREBASE
  // ------------------------------------------------------
  const formCalif = document.getElementById("formCalificacion");
  if (formCalif) {
    formCalif.addEventListener("submit", async (e) => {
      e.preventDefault();

      const inputs = formCalif.querySelectorAll("input, select");
      const rut = inputs[0].value;
      const nombre = inputs[1].value;
      const periodo = inputs[2].value;
      const categoria = inputs[3].value;
      const valor = Number(inputs[4].value);

      try {
        await addDoc(collection(db, "calificaciones"), {
          rut,
          nombre,
          periodo,
          categoria,
          valor,
          fechaRegistro: new Date().toISOString()
        });

        alert("Calificación guardada en Firebase ✔");
        window.location.href = "calificaciones.html";
      } catch (err) {
        console.error(err);
        alert("Error al guardar en Firebase ❌");
      }
    });
  }
});

// ------------------------------------------------------
// Funciones globales DEMO
// ------------------------------------------------------
function editarCalificacion(id) {
  alert("Ir a pantalla de edición (demo). ID: " + id);
  window.location.href = "calificaciones_editar.html";
}

function eliminarCalificacion(id) {
  const ok = confirm("¿Seguro de eliminar? (demo)");
  if (ok) alert("Registro eliminado (demo)");
}

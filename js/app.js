// ------------------------------------------------------
//  FIREBASE CONFIG 
// ------------------------------------------------------
import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
  updateDoc,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

 //  TU CONFIGURACIÓN DE FIREBASE
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

// Función para validar RUT chileno
function validarRut(rut) {
  const limpio = rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();
  if (!/^[0-9]+[0-9K]$/.test(limpio)) return false;

  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);
  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }

  const resto = suma % 11;
  const digito = 11 - resto;
  let dvEsperado;
  if (digito === 11) dvEsperado = "0";
  else if (digito === 10) dvEsperado = "K";
  else dvEsperado = String(digito);

  return dvEsperado === dv;
}

// Función para validar contraseña segura
function validarPassword(pass) {
  if (!pass || pass.length < 8) return false;
  const tieneEspecial = /[^A-Za-z0-9]/.test(pass);
  return tieneEspecial;
}

// ------------------------------------------------------
//  LÓGICA DEL PROTOTIPO
// ------------------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {

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
    // --------------------
  // LOGIN + REGISTRO
  // --------------------
  if (path.endsWith("index.html") || path.endsWith("/")) {
    const formLogin = document.getElementById("formLogin");
    const formRegister = document.getElementById("formRegister");
    const msg = document.getElementById("msg");
    const msgRegister = document.getElementById("msgRegister");
    const loginSection = document.getElementById("loginSection");
    const registerSection = document.getElementById("registerSection");
    const linkShowRegister = document.getElementById("linkShowRegister");
    const linkShowLogin = document.getElementById("linkShowLogin");

    const usuariosRef = collection(db, "usuarios");

    const mostrarLogin = () => {
      if (loginSection) loginSection.classList.remove("hidden");
      if (registerSection) registerSection.classList.add("hidden");
      if (msg) msg.textContent = "";
      if (msgRegister) msgRegister.textContent = "";
    };

    const mostrarRegistro = () => {
      if (loginSection) loginSection.classList.add("hidden");
      if (registerSection) registerSection.classList.remove("hidden");
      if (msg) msg.textContent = "";
      if (msgRegister) msgRegister.textContent = "";
    };

    if (linkShowRegister) {
      linkShowRegister.addEventListener("click", (e) => {
        e.preventDefault();
        mostrarRegistro();
      });
    }

    if (linkShowLogin) {
      linkShowLogin.addEventListener("click", (e) => {
        e.preventDefault();
        mostrarLogin();
      });
    }

    // --- LOGIN ---
    if (formLogin) {
      formLogin.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (msg) msg.textContent = "";

        const rutInput = document.getElementById("rut");
        const passwordInput = document.getElementById("password");
        const rut = rutInput ? rutInput.value.trim() : "";
        const password = passwordInput ? passwordInput.value.trim() : "";

        if (!rut || !password) {
          if (msg) msg.textContent = "Por favor ingresa tu RUT y contraseña.";
          return;
        }

        if (!validarRut(rut)) {
          if (msg) msg.textContent = "El RUT ingresado no es válido.";
          return;
        }

        if (!validarPassword(password)) {
          if (msg) msg.textContent = "La contraseña debe tener al menos 8 caracteres y un carácter especial.";
          return;
        }

        try {
          const rutLimpio = rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();
          const q = query(usuariosRef, where("rut", "==", rutLimpio));
          const snapshot = await getDocs(q);

          if (snapshot.empty) {
            if (msg) msg.textContent = "Usuario no registrado. Regístrate primero.";
            return;
          }

          const data = snapshot.docs[0].data();
          if (data.password !== password) {
            if (msg) msg.textContent = "Contraseña incorrecta.";
            return;
          }

          sessionStorage.setItem("usuarioActual", data.nombre || rutLimpio);
          sessionStorage.setItem("rolUsuario", data.rol || "");
          window.location.href = "dashboard.html";
        } catch (error) {
          console.error(error);
          if (msg) msg.textContent = "Error al iniciar sesión. Intenta nuevamente.";
        }
      });
    }

    // --- REGISTRO ---
    if (formRegister) {
      formRegister.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (msgRegister) msgRegister.textContent = "";

        const nombre = document.getElementById("nombreRegistro").value.trim();
        const rut = document.getElementById("rutRegistro").value.trim();
        const rol = document.getElementById("rolRegistro").value;
        const password = document.getElementById("passwordRegistro").value.trim();

        if (!nombre || !rut || !rol || !password) {
          if (msgRegister) msgRegister.textContent = "Completa todos los campos.";
          return;
        }

        if (!validarRut(rut)) {
          if (msgRegister) msgRegister.textContent = "El RUT ingresado no es válido.";
          return;
        }

        if (!validarPassword(password)) {
          if (msgRegister) msgRegister.textContent = "La contraseña debe tener al menos 8 caracteres y un carácter especial.";
          return;
        }

        try {
          const rutLimpio = rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();

          // Verificar que el usuario no exista
          const q = query(usuariosRef, where("rut", "==", rutLimpio));
          const snapshot = await getDocs(q);
          if (!snapshot.empty) {
            if (msgRegister) msgRegister.textContent = "Ya existe un usuario registrado con ese RUT.";
            return;
          }

          await addDoc(usuariosRef, {
            nombre,
            rut: rutLimpio,
            rol,
            password,
            creadoEn: new Date().toISOString()
          });

          if (msgRegister) msgRegister.textContent = "Usuario registrado correctamente. Ahora puedes iniciar sesión.";
          setTimeout(() => {
            mostrarLogin();
          }, 1500);
        } catch (error) {
          console.error(error);
          if (msgRegister) msgRegister.textContent = "Error al registrar usuario. Intenta nuevamente.";
        }
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
  //  LISTADO DE CALIFICACIONES (LEER Y PINTAR TABLA)
  // ------------------------------------------------------
  if (path.endsWith("calificaciones.html")) {
    const tbody = document.getElementById("tbodyCalificaciones");

    async function cargarCalificaciones() {
      if (!tbody) return;
      tbody.innerHTML = "";

      const querySnapshot = await getDocs(collection(db, "calificaciones"));

      querySnapshot.forEach((documento) => {
        const c = documento.data();

        // Si es un doc vacío, lo saltamos (para evitar undefined)
        if (!c.rut && !c.nombre) return;

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${c.rut || ""}</td>
          <td>${c.nombre || ""}</td>
          <td>${c.periodo || ""}</td>
          <td>${c.categoria || ""}</td>
          <td>$${Number(c.valor || 0).toLocaleString("es-CL")}</td>
          <td>
            <button class="btn btn-sm btn-outline btn-editar" data-id="${documento.id}">Editar</button>
            <button class="btn btn-sm btn-secondary btn-eliminar" data-id="${documento.id}">Eliminar</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    await cargarCalificaciones();

    // Manejo de clics en los botones EDITAR / ELIMINAR
    tbody.addEventListener("click", async (e) => {
      const target = e.target;

      // ----- ELIMINAR -----
      if (target.classList.contains("btn-eliminar")) {
        const id = target.dataset.id;
        const ok = confirm("¿Seguro que deseas eliminar esta calificación?");
        if (!ok) return;

        try {
          await deleteDoc(doc(db, "calificaciones", id));
          alert("Calificación eliminada de Firebase ✅");
          await cargarCalificaciones();
        } catch (err) {
          console.error(err);
          alert("Error al eliminar la calificación ❌");
        }
      }

      // ----- EDITAR -----
      if (target.classList.contains("btn-editar")) {
        const id = target.dataset.id;
        // Guardamos el ID en la sesión para usarlo en calificaciones_editar.html
        sessionStorage.setItem("califEditarId", id);
        window.location.href = "calificaciones_editar.html";
      }
    });

    // Filtro (demo)
    const formFiltro = document.getElementById("formFiltro");
    if (formFiltro) {
      formFiltro.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Filtro aplicado (demo). Aquí irían las consultas filtradas.");
      });
    }
  }

  // ------------------------------------------------------
  //  PANTALLA EDITAR CALIFICACIÓN
  // ------------------------------------------------------
  if (path.endsWith("calificaciones_editar.html")) {
    const formCalif = document.getElementById("formCalificacion");
    const id = sessionStorage.getItem("califEditarId");

    if (!id) {
      alert("No se encontró la calificación a editar.");
      window.location.href = "calificaciones.html";
      return;
    }

    // Cargar datos actuales en el formulario
    const docRef = doc(db, "calificaciones", id);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      alert("La calificación no existe en Firebase.");
      window.location.href = "calificaciones.html";
      return;
    }

    const c = snap.data();
    const inputs = formCalif.querySelectorAll("input, select");

    // Suponiendo el mismo orden que en 'nueva calificación'
    inputs[0].value = c.rut || "";
    inputs[1].value = c.nombre || "";
    inputs[2].value = c.periodo || "";
    inputs[3].value = c.categoria || "";
    inputs[4].value = c.valor || 0;

    // Guardar cambios
    formCalif.addEventListener("submit", async (e) => {
      e.preventDefault();

      const rut = inputs[0].value;
      const nombre = inputs[1].value;
      const periodo = inputs[2].value;
      const categoria = inputs[3].value;
      const valor = Number(inputs[4].value || 0);

      try {
        await updateDoc(docRef, {
          rut,
          nombre,
          periodo,
          categoria,
          valor
        });

        alert("Calificación actualizada en Firebase ✅");
        window.location.href = "calificaciones.html";
      } catch (err) {
        console.error(err);
        alert("Error al actualizar la calificación ❌");
      }
    });
  }

  // ------------------------------------------------------
  //  FACTORES (DEMO)
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
        alert("Archivo leído (demo). Aquí iría la carga masiva real.");
      });
    }
  }

  // ------------------------------------------------------
  // AUDITORÍA (DEMO)
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
  //  USUARIOS (DEMO)
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
  //  NUEVA CALIFICACIÓN (GUARDAR EN FIREBASE)
// ------------------------------------------------------
  const formCalifNueva = document.getElementById("formCalificacion");
  if (formCalifNueva && path.endsWith("calificaciones_nueva.html")) {
    formCalifNueva.addEventListener("submit", async (e) => {
      e.preventDefault();

      const inputs = formCalifNueva.querySelectorAll("input, select");
      const rut = inputs[0].value;
      const nombre = inputs[1].value;
      const periodo = inputs[2].value;
      const categoria = inputs[3].value;
      const valor = Number(inputs[4].value || 0);

      try {
        await addDoc(collection(db, "calificaciones"), {
          rut,
          nombre,
          periodo,
          categoria,
          valor,
          fechaRegistro: new Date().toISOString()
        });

        alert("Calificación guardada en Firebase ✅");
        window.location.href = "calificaciones.html";
      } catch (err) {
        console.error(err);
        alert("Error al guardar la calificación ❌");
      }
    });
  }
});

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


// ------------------------------------------------------
// CONFIGURACIÓN DEL PROYECTO FIREBASE
// ------------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyCpuJb5f9ycFwqVzAhgTQz6vm1t_msj1f8",
  authDomain: "tareamiercoles-da0b0.firebaseapp.com",
  projectId: "tareamiercoles-da0b0",
  storageBucket: "tareamiercoles-da0b0.appspot.com",
  messagingSenderId: "802999158776",
  appId: "1:802999158776:web:0fdb6f0a8478887c29380d",
  measurementId: "G-7N4FTTJ2RG"
};

const appFirebase = initializeApp(firebaseConfig);
const db = getFirestore(appFirebase);


// ------------------------------------------------------
// VALIDACIONES
// ------------------------------------------------------

// Validar RUT chileno
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

// Validar contraseña segura
function validarPassword(pass) {
  if (!pass || pass.length < 8) return false;
  const tieneEspecial = /[^A-Za-z0-9]/.test(pass);
  return tieneEspecial;
}



// ------------------------------------------------------
//  LÓGICA DEL SISTEMA
// ------------------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {

  const path = window.location.pathname;

  // ------------------------------------------------------
  // Marcar menú activo
  // ------------------------------------------------------
  const links = document.querySelectorAll(".sidebar-menu a");
  links.forEach(link => {
    if (link.href.includes(location.pathname.split("/").pop())) {
      link.classList.add("active");
    }
  });



  // ------------------------------------------------------
  // LOGIN + REGISTRO
  // ------------------------------------------------------
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
      loginSection?.classList.remove("hidden");
      registerSection?.classList.add("hidden");
      if (msg) msg.textContent = "";
      if (msgRegister) msgRegister.textContent = "";
    };

    const mostrarRegistro = () => {
      loginSection?.classList.add("hidden");
      registerSection?.classList.remove("hidden");
      if (msg) msg.textContent = "";
      if (msgRegister) msgRegister.textContent = "";
    };

    linkShowRegister?.addEventListener("click", (e) => {
      e.preventDefault();
      mostrarRegistro();
    });

    linkShowLogin?.addEventListener("click", (e) => {
      e.preventDefault();
      mostrarLogin();
    });


    // ---------------- LOGIN ----------------
    formLogin?.addEventListener("submit", async (e) => {
      e.preventDefault();
      msg.textContent = "";

      const rut = document.getElementById("rut").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!rut || !password) {
        msg.textContent = "Por favor ingresa tu RUT y contraseña.";
        return;
      }

      if (!validarRut(rut)) {
        msg.textContent = "El RUT ingresado no es válido.";
        return;
      }

      if (!validarPassword(password)) {
        msg.textContent = "La contraseña debe tener 8 caracteres y un símbolo.";
        return;
      }

      try {
        const rutLimpio = rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();
        const q = query(usuariosRef, where("rut", "==", rutLimpio));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          msg.textContent = "Usuario no registrado.";
          return;
        }

        const data = snapshot.docs[0].data();

        if (data.password !== password) {
          msg.textContent = "Contraseña incorrecta.";
          return;
        }

        sessionStorage.setItem("usuarioActual", data.nombre);
        sessionStorage.setItem("rolUsuario", data.rol);
        window.location.href = "dashboard.html";

      } catch (error) {
        console.error(error);
        msg.textContent = "Error al iniciar sesión.";
      }
    });


    // ---------------- REGISTRO ----------------
    formRegister?.addEventListener("submit", async (e) => {
      e.preventDefault();
      msgRegister.textContent = "";

      const nombre = document.getElementById("nombreRegistro").value.trim();
      const rut = document.getElementById("rutRegistro").value.trim();
      const rol = document.getElementById("rolRegistro").value;
      const password = document.getElementById("passwordRegistro").value.trim();

      if (!nombre || !rut || !rol || !password) {
        msgRegister.textContent = "Completa todos los campos.";
        return;
      }

      if (!validarRut(rut)) {
        msgRegister.textContent = "RUT inválido.";
        return;
      }

      if (!validarPassword(password)) {
        msgRegister.textContent = "Contraseña débil.";
        return;
      }

      try {
        const rutLimpio = rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();
        const q = query(usuariosRef, where("rut", "==", rutLimpio));
        const snap = await getDocs(q);

        if (!snap.empty) {
          msgRegister.textContent = "Ese RUT ya está registrado.";
          return;
        }

        await addDoc(usuariosRef, {
          nombre,
          rut: rutLimpio,
          rol,
          password,
          creadoEn: new Date().toISOString()
        });

        msgRegister.textContent = "Usuario registrado correctamente.";
        setTimeout(mostrarLogin, 1500);

      } catch (error) {
        console.error(error);
        msgRegister.textContent = "Error al registrar usuario.";
      }
    });
  }



  // ------------------------------------------------------
  // Dashboard: Mostrar usuario actual
  // ------------------------------------------------------
  const badgeUser = document.getElementById("userBadge");
  if (badgeUser) {
    const usuario = sessionStorage.getItem("usuarioActual") || "admin.nuam";
    badgeUser.textContent = `Sesión: ${usuario}`;
  }



  // ------------------------------------------------------
  // LISTAR CALIFICACIONES
  // ------------------------------------------------------
  if (path.endsWith("calificaciones.html")) {
    const tbody = document.getElementById("tbodyCalificaciones");

    async function cargarCalificaciones() {
      const querySnapshot = await getDocs(collection(db, "calificaciones"));
      tbody.innerHTML = "";

      querySnapshot.forEach((documento) => {
        const c = documento.data();
        if (!c.rut) return;

        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td>${c.rut}</td>
          <td>${c.nombre}</td>
          <td>${c.periodo}</td>
          <td>${c.categoria}</td>
          <td>$${Number(c.valor).toLocaleString("es-CL")}</td>
          <td>
            <button class="btn btn-sm btn-outline btn-editar" data-id="${documento.id}">Editar</button>
            <button class="btn btn-sm btn-secondary btn-eliminar" data-id="${documento.id}">Eliminar</button>
          </td>
        `;

        tbody.appendChild(tr);
      });
    }

    await cargarCalificaciones();


    // ----- Evento de botones -----
    tbody.addEventListener("click", async (e) => {
      const target = e.target;

      // ELIMINAR
      if (target.classList.contains("btn-eliminar")) {
        const id = target.dataset.id;
        if (!confirm("¿Eliminar esta calificación?")) return;

        await deleteDoc(doc(db, "calificaciones", id));
        await cargarCalificaciones();
      }

      // EDITAR
      if (target.classList.contains("btn-editar")) {
        const id = target.dataset.id;
        sessionStorage.setItem("califEditarId", id);
        window.location.href = "calificaciones_editar.html";
      }
    });
  }



  // ------------------------------------------------------
  // EDITAR CALIFICACIÓN
  // ------------------------------------------------------
  if (path.endsWith("calificaciones_editar.html")) {

    const formCalif = document.getElementById("formCalificacion");
    const id = sessionStorage.getItem("califEditarId");

    if (!id) {
      alert("No se encontró la calificación.");
      window.location.href = "calificaciones.html";
      return;
    }

    const ref = doc(db, "calificaciones", id);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      alert("No existe el documento.");
      window.location.href = "calificaciones.html";
      return;
    }

    const c = snap.data();
    const inputs = formCalif.querySelectorAll("input, select");

    inputs[0].value = c.rut;
    inputs[1].value = c.nombre;
    inputs[2].value = c.periodo;
    inputs[3].value = c.categoria;
    inputs[4].value = c.valor;


    formCalif.addEventListener("submit", async (e) => {
      e.preventDefault();

      await updateDoc(ref, {
        rut: inputs[0].value,
        nombre: inputs[1].value,
        periodo: inputs[2].value,
        categoria: inputs[3].value,
        valor: Number(inputs[4].value)
      });

      alert("Calificación actualizada ✔");
      window.location.href = "calificaciones.html";
    });
  }



  // ------------------------------------------------------
  // GUARDAR NUEVA CALIFICACIÓN
  // ------------------------------------------------------
  const formNueva = document.getElementById("formCalificacion");
  if (formNueva && path.endsWith("calificaciones_nueva.html")) {

    formNueva.addEventListener("submit", async (e) => {
      e.preventDefault();

      const i = formNueva.querySelectorAll("input, select");
      const rut = i[0].value;
      const nombre = i[1].value;
      const periodo = i[2].value;
      const categoria = i[3].value;
      const valor = Number(i[4].value);

      await addDoc(collection(db, "calificaciones"), {
        rut,
        nombre,
        periodo,
        categoria,
        valor,
        creadoEn: new Date().toISOString()
      });

      alert("Calificación guardada ✔");
      window.location.href = "calificaciones.html";
    });
  }




  // ------------------------------------------------------
  // FACTORES (DEMO)
  // ------------------------------------------------------
  if (path.endsWith("factores.html")) {
    const tbody = document.getElementById("tbodyFactores");

    tbody.innerHTML = `
      <tr><td>Factor IVA</td><td>0.19</td></tr>
      <tr><td>Factor Renta</td><td>0.27</td></tr>
    `;
  }



  // ------------------------------------------------------
  // AUDITORÍA (DEMO)
  // ------------------------------------------------------
  if (path.endsWith("auditoria.html")) {
    const tbody = document.getElementById("tbodyAuditoria");

    tbody.innerHTML = `
      <tr><td>1</td><td>admin.nuam</td><td>Crear</td><td>2025-09-01</td></tr>
      <tr><td>2</td><td>analista.tributario</td><td>Modificar</td><td>2025-09-02</td></tr>
    `;
  }



  // ------------------------------------------------------
  // USUARIOS (DEMO)
  // ------------------------------------------------------
  if (path.endsWith("usuarios.html")) {
    const tbody = document.getElementById("tbodyUsuarios");

    tbody.innerHTML = `
      <tr><td>Admin NUAM</td><td>Administrador</td></tr>
      <tr><td>Analista</td><td>Analista Tributario</td></tr>
      <tr><td>Supervisor</td><td>Supervisor</td></tr>
    `;
  }




  // ------------------------------------------------------
  // SIMULADOR DE SUELDO + RENTA + IVA
  // ------------------------------------------------------
  const formSimulador = document.getElementById("formSimulador");

  if (formSimulador) {

    const inputSueldo = document.getElementById("sueldoBruto");
    const inputPorcRenta = document.getElementById("porcentajeRenta");
    const inputMontoRenta = document.getElementById("montoRenta");
    const inputMontoIVA = document.getElementById("montoIVA");
    const inputSueldoLiquido = document.getElementById("sueldoLiquido");
    const btnLimpiar = document.getElementById("btnLimpiarSimulador");

    function obtenerPorcentajeRenta(sueldo) {
      if (sueldo <= 700000) return 0;
      if (sueldo <= 1200000) return 4;
      if (sueldo <= 2000000) return 8;
      return 13.5;
    }

    formSimulador.addEventListener("submit", (e) => {
      e.preventDefault();

      const sueldo = Number(inputSueldo.value || 0);
      if (!sueldo || sueldo <= 0) {
        alert("Ingresa un sueldo válido.");
        return;
      }

      const porc = obtenerPorcentajeRenta(sueldo);
      const descRenta = Math.round(sueldo * (porc / 100));
      const montoIVAcalc = Math.round(sueldo * 0.19);
      const liquido = sueldo - descRenta - montoIVAcalc;

      inputPorcRenta.value = `${porc} %`;
      inputMontoRenta.value = "$" + descRenta.toLocaleString("es-CL");
      inputMontoIVA.value = "$" + montoIVAcalc.toLocaleString("es-CL");
      inputSueldoLiquido.value = "$" + liquido.toLocaleString("es-CL");
    });

    btnLimpiar?.addEventListener("click", () => {
      inputSueldo.value = "";
      inputPorcRenta.value = "";
      inputMontoRenta.value = "";
      inputMontoIVA.value = "";
      inputSueldoLiquido.value = "";
    });
  }

});

// Lógica simple del prototipo (no es sistema real, solo demo)

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  // Marcar menú activo según página
  const links = document.querySelectorAll(".sidebar-menu a");
  links.forEach(link => {
    if (link.href.includes(location.pathname.split("/").pop())) {
      link.classList.add("active");
    }
  });

  // Login (index.html)
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

        // Prototipo: acepta cualquier cosa como login válido
        sessionStorage.setItem("usuarioActual", rut);
        window.location.href = "dashboard.html";
      });
    }
  }

  // Dashboard: mostrar usuario actual
  const badgeUser = document.getElementById("userBadge");
  if (badgeUser) {
    const u = sessionStorage.getItem("usuarioActual") || "admin.nuam";
    badgeUser.textContent = `Sesión: ${u}`;
  }

  // Listado de calificaciones
  if (path.endsWith("calificaciones.html")) {
    const tbody = document.getElementById("tbodyCalificaciones");
    if (tbody) {
      tbody.innerHTML = "";
      calificacionesDemo.forEach(c => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${c.rut}</td>
          <td>${c.nombre}</td>
          <td>${c.periodo}</td>
          <td>${c.categoria}</td>
          <td>$${c.valor.toLocaleString("es-CL")}</td>
          <td>
            <button class="btn btn-sm btn-outline" onclick="editarCalificacion(${c.id})">Editar</button>
            <button class="btn btn-sm btn-secondary" onclick="eliminarCalificacion(${c.id})">Eliminar</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    const formFiltro = document.getElementById("formFiltro");
    if (formFiltro) {
      formFiltro.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Filtro aplicado (prototipo). No hay backend real todavía.");
      });
    }
  }

  // Factores
  if (path.endsWith("factores.html")) {
    const tbody = document.getElementById("tbodyFactores");
    if (tbody) {
      tbody.innerHTML = "";
      factoresDemo.forEach(f => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${f.nombre}</td>
          <td>${f.valor}</td>
        `;
        tbody.appendChild(tr);
      });
    }

    const formCarga = document.getElementById("formCargaFactores");
    if (formCarga) {
      formCarga.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Archivo leído (prototipo). Aquí se implementaría la carga masiva.");
      });
    }
  }

  // Auditoría
  if (path.endsWith("auditoria.html")) {
    const tbody = document.getElementById("tbodyAuditoria");
    if (tbody) {
      tbody.innerHTML = "";
      historialDemo.forEach(h => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${h.calificacionId}</td>
          <td>${h.usuario}</td>
          <td>${h.tipo}</td>
          <td>${h.fecha}</td>
        `;
        tbody.appendChild(tr);
      });
    }
  }

  // Usuarios
  if (path.endsWith("usuarios.html")) {
    const tbody = document.getElementById("tbodyUsuarios");
    if (tbody) {
      tbody.innerHTML = "";
      usuariosDemo.forEach(u => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${u.nombre}</td>
          <td>${u.rol}</td>
        `;
        tbody.appendChild(tr);
      });
    }
  }

  // Formularios de nueva/editar calificación
  const formCalif = document.getElementById("formCalificacion");
  if (formCalif) {
    formCalif.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Calificación guardada (prototipo). Aquí se enviaría al servidor.");
      window.location.href = "calificaciones.html";
    });
  }
});

// Funciones globales simples

function editarCalificacion(id) {
  alert("Ir a pantalla de edición (prototipo). ID: " + id);
  window.location.href = "calificaciones_editar.html";
}

function eliminarCalificacion(id) {
  const ok = confirm("¿Estás seguro de eliminar esta calificación? (demo)");
  if (ok) {
    alert("Registro eliminado (prototipo).");
  }
}

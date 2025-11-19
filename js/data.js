// Datos simulados para el prototipo (no hay base de datos real)

const calificacionesDemo = [
  {
    id: 1,
    rut: "11.111.111-1",
    nombre: "Juan Pérez",
    periodo: "2024-01",
    categoria: "General",
    valor: 1250000
  },
  {
    id: 2,
    rut: "22.222.222-2",
    nombre: "María López",
    periodo: "2024-02",
    categoria: "Preferente",
    valor: 980000
  }
];

const factoresDemo = [
  { id: 1, nombre: "Factor IVA", valor: 0.19 },
  { id: 2, nombre: "Factor Renta", valor: 0.27 }
];

const usuariosDemo = [
  { id: 1, nombre: "admin.nuam", rol: "Administrador" },
  { id: 2, nombre: "analista.tributario", rol: "Analista Tributario" },
  { id: 3, nombre: "supervisor.cumplimiento", rol: "Supervisor" }
];

const historialDemo = [
  {
    id: 1,
    calificacionId: 1,
    usuario: "admin.nuam",
    tipo: "Crear",
    fecha: "2025-09-01 10:32"
  },
  {
    id: 2,
    calificacionId: 2,
    usuario: "analista.tributario",
    tipo: "Modificar",
    fecha: "2025-09-02 15:10"
  }
];

const video = document.getElementById("video");
const output = document.getElementById("output");
const tablaBody = document.querySelector("#tabla-asistencia tbody");

navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
  .then((stream) => {
    video.srcObject = stream;
  })
  .catch((err) => {
    output.textContent = "Error al acceder a la cámara";
    console.error(err);
  });

const canvas = document.createElement("canvas");
const context = canvas.getContext("2d");

function escanear() {
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    canvas.height = video.videoHeight;
    canvas.width = video.videoWidth;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    const code = jsQR(imageData.data, canvas.width, canvas.height);
    if (code) {
      const matricula = code.data;
      output.textContent = `Asistencia registrada: ${matricula}`;
      registrarAsistencia(matricula);
    }
  }
  requestAnimationFrame(escanear);
}

function registrarAsistencia(matricula) {
  const ahora = new Date();
  const fecha = ahora.toLocaleDateString();
  const hora = ahora.toLocaleTimeString();

  const fila = document.createElement("tr");
  fila.innerHTML = `<td>${matricula}</td><td>${fecha}</td><td>${hora}</td>`;
  tablaBody.appendChild(fila);

  // Para evitar múltiples registros seguidos
  output.style.color = "green";
  setTimeout(() => {
    output.textContent = "Esperando escaneo...";
    output.style.color = "";
  }, 3000);
}

requestAnimationFrame(escanear);

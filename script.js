document.addEventListener("DOMContentLoaded", () => {
    const inputFecha = document.getElementById("fechaCita");
    const contenedorHoras = document.getElementById("contenedorHoras");
    const labelHora = document.getElementById("labelHora");
    const inputHoraSeleccionada = document.getElementById("horaSeleccionada");

    // 1. Configurar el calendario para que no se puedan elegir días pasados
    // Usamos la hora local de España para calcular el día correcto
    const hoy = new Date();
    const cadenaHoy = hoy.getFullYear() + '-' + 
                      String(hoy.getMonth() + 1).padStart(2, '0') + '-' + 
                      String(hoy.getDate()).padStart(2, '0');
    inputFecha.min = cadenaHoy;

    // 2. Escuchar cuando el usuario cambia la fecha
    inputFecha.addEventListener("change", (e) => {
        // Creamos la fecha separando año, mes y día para evitar errores de zona horaria
        const partes = e.target.value.split('-');
        const fechaElegida = new Date(partes[0], partes[1] - 1, partes[2]);
        
        const diaSemana = fechaElegida.getDay(); // 0 = Domingo, 1 = Lunes, 2 = Martes... 6 = Sábado

        // Limpiar horas de consultas anteriores
        contenedorHoras.innerHTML = "";
        inputHoraSeleccionada.value = "";

        // 3. Validación de Domingo
        if (diaSemana === 0) {
            alert("Los domingos la barbería está cerrada. Por favor, elige otro día.");
            inputFecha.value = "";
            labelHora.style.display = "none";
            return;
        }

        // Si el día es válido, mostramos el título y generamos las horas
        labelHora.style.display = "block";
        generarHorarios(diaSemana);
    });

    // 3. Función para generar los botones de horas (intervalos de 30 minutos)
    function generarHorarios(dia) {
        let horaInicio, horaFin;

        if (dia === 6) {
            // Sábados: 10:00 a 13:00
            horaInicio = 10 * 60; // Convertido a minutos (600 mins)
            horaFin = 13 * 60;    // (780 mins)
        } else {
            // Lunes a Viernes: 15:00 a 20:00
            horaInicio = 15 * 60; // (900 mins)
            horaFin = 20 * 60;    // (1200 mins)
        }

        // Bucle para crear los botones de media en media hora
        for (let minutos = horaInicio; minutos < horaFin; minutos += 30) {
            const hh = Math.floor(minutos / 60).toString().padStart(2, '0');
            const mm = (minutos % 60).toString().padStart(2, '0');
            const horaTexto = `${hh}:${mm}`;

            // Crear el elemento HTML del botón
            const botonHora = document.createElement("div");
            botonHora.classList.add("bloque-hora");
            botonHora.innerText = horaTexto;

            // Evento al hacer clic en un botón de hora
            botonHora.addEventListener("click", () => {
                // Quitar la selección al botón que la tuviera antes
                const seleccionado = contenedorHoras.querySelector(".seleccionado");
                if (seleccionado) {
                    seleccionado.classList.remove("seleccionado");
                }

                // Marcar el botón actual como seleccionado
                botonHora.classList.add("seleccionado");
                // Guardar la hora en el campo oculto del formulario
                inputHoraSeleccionada.value = horaTexto;
            });

            // Añadir el botón al contenedor de la pantalla
            contenedorHoras.appendChild(botonHora);
        }
    }
});

// 4. Función para enviar los datos a WhatsApp
function enviarPorWhatsApp(event) {
    event.preventDefault(); // Evita que la página se recargue sola

    const telefono = "34602411690"; // Tu número con prefijo de España

    const nombre = document.getElementById('nombreCliente').value;
    const email = document.getElementById('emailCliente').value;
    const fecha = document.getElementById('fechaCita').value;
    const servicio = document.getElementById('servicioCita').value;
    const hora = document.getElementById('horaSeleccionada').value;

    // Validación de que haya marcado una hora
    if (!hora) {
        alert("Por favor, selecciona una hora de la lista para tu cita.");
        return;
    }

    // Estructura del mensaje
    const mensaje = `Hola MatyBarber! 💈%0A` +
                    `Quiero reservar una cita:%0A%0A` +
                    `*Nombre:* ${nombre}%0A` +
                    `*Servicio:* ${servicio}%0A` +
                    `*Fecha:* ${fecha}%0A` +
                    `*Hora:* ${hora} hs%0A` +
                    `*Email:* ${email}`;

    const url = `https://wa.me/${602411690}?text=${mensaje}`;
    window.open(url, '_blank');
}
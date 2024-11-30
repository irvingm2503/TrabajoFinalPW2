document.getElementById("login-button").addEventListener("click", async () => {
    const correo = document.getElementById("correo").value;
    const contrasena = document.getElementById("contrasena").value;

    if (!correo || !contrasena) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    try {
        // Verificar credenciales en el backend
        const response = await fetch("/api/verificar-usuario", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ correo, contrasena }),
        });

        const data = await response.json();

        if (data.success) {
            // Guardar datos en localStorage
            localStorage.setItem("usuario", JSON.stringify(data.usuario));
            alert("Inicio de sesión exitoso. Redirigiendo...");
            window.location.href = "index.html";
        } else if (data.error === "Correo no registrado") {
            alert("El correo no está registrado. Por favor, crea una cuenta.");
        } else if (data.error === "Contraseña incorrecta") {
            alert("La contraseña es incorrecta. Intenta nuevamente.");
        } else {
            alert("Error desconocido. Intenta más tarde.");
        }
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        alert("Error al conectar con el servidor.");
    }
});

document.getElementById("crear-cuenta").addEventListener("click", () => {
    window.location.href = "crear-cuenta.html";
});


    document.getElementById("executeCommand").addEventListener("click", async () => {
      const password = document.getElementById("password").value;
      if (!password) {
        alert("Por favor, insira a senha.");
        return;
      }

      try {
        // Envia a senha para o backend e executa o comando dorad keys list
        const response = await fetch("http://localhost:3000/execute-command", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ password: password })
        });

        const result = await response.json();
        if (response.ok) {
          document.getElementById("output").innerText = result.output;
        } else {
          document.getElementById("output").innerText = `Erro: ${result.error}`;
        }
      } catch (error) {
        document.getElementById("output").innerText = `Erro ao executar o comando: ${error.message}`;
      }
    });

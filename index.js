    document.addEventListener("DOMContentLoaded", () => {
      // Adiciona um único listener de evento para o contêiner pai
      document.body.addEventListener("click", async function (event) {
        // Verifica se o clique ocorreu em um botão com a classe 'executeDelete'
        if (event.target && event.target.classList.contains("executeDelete")) {
          // Obtém o nome da conta do atributo 'data-name' do botão clicado
          const accountName = event.target.getAttribute("data-name");

          // Pergunta ao usuário se deseja excluir a conta
          const confirmDelete = window.confirm(`Are you sure you want to delete the account: ${accountName}?`);

          if (confirmDelete) {
            
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
                console.log(result.output);
              
              } else {
                console.log(result.error);
                document.getElementById("output").innerText = `Erro: ${result.error}`;
              }
            } catch (error) {
              console.log(error.message);
              document.getElementById("output").innerText = `Erro ao executar o comando: ${error.message}`;
            }

          } else {
            console.log("Deletion cancelled");
          }
        }
      });
    });




    document.getElementById("exit").addEventListener("click", async () => {
      document.querySelector('.containerAccount').style.display = 'none';
      document.querySelector('.containerNewAccount').style.display = 'none';
      document.querySelector('.container').style.display = 'block';
    });
    
    document.getElementById("new").addEventListener("click", async () => {
      document.querySelector('.containerAccount').style.display = 'none';
      document.querySelector('.container').style.display = 'none';
      document.querySelector('.containerNewAccount').style.display = 'block';
    });

    document.getElementById("exitNew").addEventListener("click", async () => {
      document.querySelector('.containerAccount').style.display = 'none';
      document.querySelector('.containerNewAccount').style.display = 'none';
      document.querySelector('.container').style.display = 'block';
    });

    document.getElementById("executeUser").addEventListener("click", async () => {
      const name = document.getElementById("user_name").value;
      const password = document.getElementById("user_password").value;
      const reenter_password = document.getElementById("user_reenter_password").value;
      
      if (!password) {
        alert("Please, insert password.");
        return;
      }

      if (password != reenter_password) {
        alert("Please, passwords must be the same");
        return;
      }

      try {
        
        const response = await fetch("http://localhost:3000/create-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ name: name, password: password })
          
        });

        const result = await response.json();
        if (response.ok) {
          console.log(result.output);
          const parsedOutput = parseBlockOutput(result.output);
          document.getElementById("outputNewUser").innerHTML = parsedOutput;


          document.querySelector('.containerAccount').style.display = 'none';
          document.querySelector('.container').style.display = 'none';
          document.querySelector('.containerNewAccount').style.display = 'block';
          document.querySelector('.containerPassNewUser').style.display = 'none';

        } else {
          console.log(result.error);
          document.getElementById("output").innerText = `Erro: ${result.error}`;
        }
      } catch (error) {
        console.log(error.message);
        document.getElementById("output").innerText = `Erro ao executar o comando: ${error.message}`;
      }
    });

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
          console.log(result.output);
          const parsedOutput = parseBlockOutput(result.output);
          document.getElementById("output").innerHTML = parsedOutput;


          document.querySelector('.containerAccount').style.display = 'block';
          document.querySelector('.container').style.display = 'none';
          document.querySelector('.containerNewAccount').style.display = 'none';

        } else {
          console.log(result.error);
          document.getElementById("output").innerText = `Erro: ${result.error}`;
        }
      } catch (error) {
        console.log(error.message);
        document.getElementById("output").innerText = `Erro ao executar o comando: ${error.message}`;
      }
    });

    function parseBlockOutput(blockOutput) {
      if (!blockOutput || typeof blockOutput !== "string") {
        return "Erro: O resultado do comando está vazio ou é inválido.";
      }
    
      try {
        // Define expressões regulares para capturar os campos necessários
        const addressMatches = blockOutput.match(/address:\s*([^\s]+)/g);
        const nameMatches = blockOutput.match(/name:\s*([^\s]+)/g);
        const pubkeyMatches = blockOutput.match(/pubkey:\s*('[^']*')/g);
    
        let result = "";
        
        // Itera sobre as correspondências encontradas
        for (let i = 0; i < addressMatches.length; i++) {
          const address = addressMatches[i].split(":")[1].trim();
          const name = nameMatches[i].split(":")[1].trim();
          const rawPubkeyMatch = pubkeyMatches[i].match(/'([^']+)'/);
          const rawPubkey = rawPubkeyMatch[1];
          const pubkeyJson = JSON.parse(rawPubkey.replace(/\\/g, '').replace(/'/g, '"'));
          let key = pubkeyJson.key;

          // Processa a chave pública

          // Adiciona os dados formatados ao resultado
          result += `
            <div class="containerResultAccount">
              <label>Balance: 0 DORA</label>
              <pre id="output">
Name: ${name}
Address: ${address}
Public Key: ${key}
              </pre>
              <button class="executeDelete" data-name="${name}"><i class="bi bi-trash"></i> Delete</button>
            </div><br><br>
          `;
        }
    
        // Retorna o resultado final com todas as entradas
        return result;
        
      } catch (error) {
        return `Erro ao processar o bloco de texto: ${error.message}`;
      }
    }

    /*
        function parseBlockOutput(blockOutput) {
          if (!blockOutput || typeof blockOutput !== "string") {
            return "Erro: O resultado do comando está vazio ou é inválido.";
          }
        
          try {
            // Define expressões regulares para capturar os campos necessários
            const addressMatch = blockOutput.match(/address:\s*([^\s]+)/);
            const nameMatch = blockOutput.match(/name:\s*([^\s]+)/);
            const pubkeyMatch = blockOutput.match(/pubkey:\s*('.*?')/);

            const rawPubkey = pubkeyMatch[1]; // Captura o grupo que contém o JSON da chave pública
            const pubkeyJson = JSON.parse(rawPubkey.replace(/'/g, '').replace(/\\"/g, '"')); // Limpa as aspas
            const key = pubkeyJson.key; // Acessa a propriedade 'key'
            const address = addressMatch[1];
            const name = nameMatch[1];
            const network = document.querySelector('select').value;
        
            try {
              const pubkeyData = JSON.parse(pubkeyMatch[1]);
              pubkey = pubkeyData.key || "Chave pública indisponível";
            } catch {
              pubkey = "Erro ao processar a chave pública.";
            }
        
            return `Network: ${network}\nName: ${name}\nAddress: ${address}\nPublic Key: ${key}`;
          } catch (error) {
            return `Erro ao processar o bloco de texto: ${error.message}`;
          }
        }
    */
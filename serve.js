const express = require('express');
const app = express();
const porta = 3000;

// Middleware para permitir que a API entenda requisições com corpo em JSON
app.use(express.json());

// Nosso "banco de dados" temporário em memória
let tarefas = [
    { id: 1, titulo: "Estudar NodeJS", concluida: false },
    { id: 2, titulo: "Apresentar trabalho de Backend", concluida: false }
];

// ---------------------------------------------------------
// ROTAS DA API REST (CRUD)
// ---------------------------------------------------------

// 1. READ (Ler todas as tarefas) - Método GET
app.get('/tarefas', (req, res) => {
    res.status(200).json(tarefas);
});

// 2. READ (Ler uma tarefa específica pelo ID) - Método GET
app.get('/tarefas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const tarefa = tarefas.find(t => t.id === id);

    if (!tarefa) {
        return res.status(404).json({ mensagem: "Tarefa não encontrada" });
    }
    res.status(200).json(tarefa);
});

// 3. CREATE (Criar uma nova tarefa) - Método POST
app.post('/tarefas', (req, res) => {
    const novaTarefa = {
        id: tarefas.length > 0 ? tarefas[tarefas.length - 1].id + 1 : 1, // Gera um ID simples
        titulo: req.body.titulo,
        concluida: req.body.concluida || false
    };
    
    tarefas.push(novaTarefa);
    res.status(201).json(novaTarefa); // 201 significa "Criado com sucesso"
});

// 4. UPDATE (Atualizar uma tarefa existente) - Método PUT
app.put('/tarefas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = tarefas.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({ mensagem: "Tarefa não encontrada para atualização" });
    }

    // Atualiza os dados da tarefa
    tarefas[index].titulo = req.body.titulo || tarefas[index].titulo;
    tarefas[index].concluida = req.body.concluida !== undefined ? req.body.concluida : tarefas[index].concluida;

    res.status(200).json(tarefas[index]);
});

// 5. DELETE (Remover uma tarefa) - Método DELETE
app.delete('/tarefas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = tarefas.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({ mensagem: "Tarefa não encontrada para exclusão" });
    }

    tarefas.splice(index, 1); // Remove do array
    res.status(204).send(); // 204 significa "Sem conteúdo" (excluído com sucesso)
});

// ---------------------------------------------------------
// INICIANDO O SERVIDOR
// ---------------------------------------------------------
app.listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);
    console.log(`Acesse: http://localhost:${porta}/tarefas`);
});
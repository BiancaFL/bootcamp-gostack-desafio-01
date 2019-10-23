const express = require ('express');

const server = express();
server.use(express.json());

let projects = [];
let count = 0;

function counter(req, res, next){ 
  count++;
  console.log(+count);
  next();
}
server.use(counter);

function checkProjectID(req, res, next){ 
  const { id } = req.params;

  const project = projects.find(x => x.id == id);
  if(!project){ return res.status(400).json({ error: "o projeto não existe"  });}
  next();
}

//POST /projects: A rota deve receber id e title dentro do corpo e cadastrar um novo projeto dentro de um array no seguinte formato: { id: "1", title: 'Novo projeto', tasks: [] }; Certifique-se de enviar tanto o ID quanto o título do projeto no formato string com aspas duplas.
server.post('/projects', (req, res) => {
  projects.push({ id: req.body.id, title: req.body.title, tasks: [] });
  return res.json(projects);
});


//GET /projects: Rota que lista todos projetos e suas tarefas;
server.get('/projects', (req, res) => {
  return res.json(projects);
});

//PUT /projects/:id: A rota deve alterar apenas o título do projeto com o id presente nos parâmetros da rota;
server.put('/projects/:id', checkProjectID ,  (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(x => x.id == id);

  project.title = title;
  return res.json(projects);
});


//DELETE /projects/:id: A rota deve deletar o projeto com o id presente nos parâmetros da rota;
server.delete('/projects/:id', checkProjectID, (req, res) => {
  const { id } = req.params;

  projects = projects.filter(x => x.id != id);
  return res.send();
});


//POST /projects/:id/tasks: A rota deve receber um campo title e armazenar uma nova tarefa no array de tarefas de um projeto específico escolhido através do id presente nos parâmetros da rota;
server.post('/projects/:id/tasks', checkProjectID, (req, res) => {
  const { title } = req.body;
  const { id } = req.params;

  const project = projects.find(x => x.id == id);
  project.tasks.push(title);

  return res.json(projects);
});


server.listen(3000);

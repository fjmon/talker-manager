const fs = require('fs').promises;
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const { generateToken,
  validacao,
  validaAutoriza,
  validaNome,
  validaIdade,
  validaTalkW,
  validaTalkR } = require('./middlewares');

const oradores = path.resolve(__dirname, './talker.json');

const app = express();
app.use(bodyParser.json());
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';
const HTTP_DELETE_STATUS = 204;

// não remova esse endpoint, e para o avaliador funcionar

app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

app.get('/talker/search', validaAutoriza, async (req, res) => {
  const dadoOrador = req.query.q;
  const result = await fs.readFile(oradores, 'utf-8');
  const orador = JSON.parse(result);
  const procPessoa = orador.filter((pessoa) => pessoa.name.includes(dadoOrador));
  return res.status(200).json(procPessoa);
});

app.get('/talker', async (_req, res) => {
  const result = await fs.readFile(oradores, 'utf-8');
  const orador = result ? JSON.parse(result) : [];
  return res.status(HTTP_OK_STATUS).json(orador);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const result = await fs.readFile(oradores, 'utf-8');
  const orador = JSON.parse(result);

  const findOra = orador.find((oradorId) => oradorId.id === Number(id));

  if (!findOra) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  return res.status(HTTP_OK_STATUS).json(findOra);
});

app.post('/login', validacao, async (_req, res) => {
  const tokenAl = generateToken();

  return res.status(HTTP_OK_STATUS).json({ token: tokenAl });
});

app.post('/talker',
  validaNome,
  validaIdade,
  validaTalkW,
  validaTalkR,
  async (req, res) => {
    const pessoa = req.body;
    const result = await fs.readFile(oradores, 'utf-8');
    const novoArq = JSON.parse(result);
    const proxId = novoArq[novoArq.length - 1].id + 1;
    const reqBody = { id: proxId, ...pessoa };
    const reqArq = [...novoArq, reqBody];
    await fs.writeFile(oradores, JSON.stringify(reqArq));

    return res.status(201).json(reqBody);
  });

app.put('/talker/:id',
  validaNome,
  validaIdade,
  validaTalkW,
  validaTalkR, async (req, res) => {
    const { id } = req.params;
    const info = req.body;
    const result = await fs.readFile(oradores, 'utf-8');
    const novoArq = JSON.parse(result);
    const reqBody = { id: Number(id), ...info };
    const talkEd = novoArq
      .map((ed) => (ed.id === Number(id) ? { id: ed.id, ...reqBody } : ed));
    await fs.writeFile(oradores, JSON.stringify(talkEd));
    res.status(HTTP_OK_STATUS).json(reqBody);
  });

app.delete('/talker/:id', validaAutoriza, async (req, res) => {
  const { id } = req.params;
  const result = await fs.readFile(oradores, 'utf-8');
  const novoArq = JSON.parse(result);
  const talkEd = novoArq
    .filter((ed) => ed.id !== Number(id));
  await fs.writeFile(oradores, JSON.stringify(talkEd));
  res.sendStatus(HTTP_DELETE_STATUS);
});

import express from 'express'
import bodyParser from 'body-parser'
import { getAll, getById, create, updateById, deleteById } from './store.js'

const app = express()
app.use(express.static('public'));
app.use(bodyParser.json())
app.set('view engine', 'ejs')

app.get('/about', async (request, response) => {
  const whispers = await getAll()
  response.render('about', { whispers })
})

app.get('/api/v1/whisper', async (request, response) => {
  const whispers = await getAll()
  response.json(whispers)
})

app.get('/api/v1/whisper/:id', async (request, response) => {
  const id = parseInt(request.params.id)
  const whisper = await getById(id)
  (!whisper ? response.sendStatus(404) : response.json(whisper));
})

app.post('/api/v1/whisper', async (request, response) => {
  const { message } = request.body;
  if (!message) {
    response.sendStatus(400);
  } else {
    const whisper = await create( message);
    response.status(201).json(whisper);
  }
})

app.put('/api/v1/whisper/:id', async (request, response) => {
  const { message } = request.body;
  const id = parseInt(request.params.id);
  if (!message) {
    response.sendStatus(400);
  } else {
    const whisper = await getById(id);
    if (!whisper) {
      response.sendStatus(404);
    } else {
      await updateById(id, message);
      response.sendStatus(200);
    }
  }
})

app.delete('/api/v1/whisper/:id', async (request, response) => {
  const id = parseInt(request.params.id);
  const whisper = await getById(id);
  if (!whisper) {
    response.sendStatus(404);
    return;
  }
  await deleteById(id);
  response.sendStatus(200);
})

export { app }

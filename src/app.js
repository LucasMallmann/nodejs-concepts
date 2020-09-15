const express = require("express");
const cors = require("cors");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  // TODO
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const { title, url, techs } = request.body;

  const index = repositories.findIndex((repository) => repository.id === id);

  if (index < 0) {
    return response.status(400).json({ error: "Repository does not exist" });
  }

  const updatedRepository = {
    id,
    likes: repositories[index].likes,
    title,
    url,
    techs,
  };

  repositories[index] = updatedRepository;

  return response.json(updatedRepository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const foundRepository = repositories.findIndex((repo) => repo.id === id);

  if (foundRepository < 0) {
    return response
      .status(400)
      .json({ error: "This repository does not exist" });
  }

  repositories.splice(foundRepository, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const foundRepositoryIndex = repositories.findIndex((repo) => repo.id === id);

  if (foundRepositoryIndex < 0) {
    return response
      .status(400)
      .json({ error: "This repository does not exist" });
  }

  repositories[foundRepositoryIndex].likes += 1;

  return response.json(repositories[foundRepositoryIndex]);
});

module.exports = app;

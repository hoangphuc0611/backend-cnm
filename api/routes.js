"use strict";
const jwt = require("jsonwebtoken");
const util = require("util");
const mysql = require("mysql");
const db = require("./db");
const { application } = require("express");
// const {fetch} = require('node-fetch') ;
// const axios = require('axios');
const superagent = require("superagent");
module.exports = function (app) {
  var projectsCtrl = require("./controllers/ProjectsController");
  var messsCtrl = require("./controllers/MessagesController");
  var taskCtrl = require("./controllers/TasksController");
  // var accCtrl = require("./controllers/AccsController");
  var authenToken = require("./middleware/auth");


  app.get("/projects", async (req, res) => {
    const results = await projectsCtrl.getAllProjects();
    res.status(200).json({ results })
  });
  app.post("/login", async (req, res) => {
    const user = req.body;
    var accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "24h",
    });
    const api_url = `https://0ogw1vj2tg.execute-api.ap-southeast-1.amazonaws.com/accs/`;
    let fetch_response = await superagent.get(api_url);
    let jsons = JSON.parse(fetch_response["text"]);
    let temp = false;
    let response;
    jsons.forEach((element) => {
      if (
        element["username"] === user.username &&
        element["passwd"] === user.passwd
      ) {
        temp = true;
        response = element;
      }
    });
    if (temp) {
      res.json({ accessToken, response });
    } else {
      res.status(403).send({
        message: "Sai tai khoan hoac mat khau",
      });
    }
  });

  app.post("/accs", async (req, res) => {
    const user = req.body;
    const api_url = `https://0ogw1vj2tg.execute-api.ap-southeast-1.amazonaws.com/accs/`;
    const fetch_response = await superagent
      .post(api_url)
      .send({ username: user.username, passwd: user.passwd, img: user.img })
      .set("X-API-Key", "foobar")
      .set("accept", "json");
    const re = JSON.parse(fetch_response["text"]);
    if (re?.username) {
      res.status(200).send({
        success: true,
        message: "Tạo tài khoản thành công",
      });
    } else {
      if (re.status === 404) {
        res.status(404).send({
          success: false,
          message: "Tài khoản đã tồn tại",
        });
      } else {
        res.status(403).send({
          success: false,
          message: "Tạo tài khoản không thành công",
        });
      }
    }
  });

  app.use(authenToken.isAuth);
  app.post("/projects", async (req, res) => {
    const results = await projectsCtrl.createProject(req.body);
    res.status(201).json({ "message": "Tao thanh cong" })
  });


  app.get("/projects/:id", async (req, res) => {
    const results = await projectsCtrl.getProject(req.params.id);
    res.status(200).json(results[0])
  });

  app.put("/projects/:id", async (req, res) => {
    const id = await projectsCtrl.updateProject(req.params.id, req.body);
    res.status(200).json({ "message": "Sua thanh cong" })
  })
  app.delete("/projects/:id", async (req, res) => {
    const id = await projectsCtrl.deleteProject(req.params.id);
    res.status(200).json({ "message": "Xoa thanh cong" })
  })

  app.get("/messages", async (req, res) => {
    const results = await messsCtrl.getAllMessages();
    res.status(200).json({ results })
  });

  app.post("/messages", async (req, res) => {
    const results = await messsCtrl.createMessage(req.body);
    res.status(201).json({ "message": "Them thanh cong" })
  });

  app.get("/messages/:id", async (req, res) => {
    const results = await messsCtrl.getMessage(req.params.id);
    res.status(200).json(results[0])
  });


  app.get("/tasks", async (req, res) => {
    const results = await taskCtrl.getAllTask();
    res.status(200).json({ results })
  });

  app.get("/tasks/:id", async (req, res) => {
    const results = await taskCtrl.getTasks(req.params.id);
    res.status(200).json(results[0])
  });

  app.post("/tasks/:projectId", async (req, res) => {
    const results = await messsCtrl.createMessage(req.body);
    res.status(201).json({ "message": "Them thanh cong" })
  });

  app.put("/tasks/:projectId", async (req, res) => {
    const results = await taskCtrl.updateTasks(req.body["dataupdate"]);
    res.status(201).json({ "message": "Sua thanh cong" })
  });

  app.get("/tasks/:idpro/:idtas", async (req, res) => {
    const results = await taskCtrl.getTask(req.params.idpro, req.params.idtas);
    res.status(200).json(results[0])
  });

  app.put("/tasks/:idpro/:idtas", async (req, res) => {
    const results = await taskCtrl.updateTask(req.body);
    res.status(201).json({ "message": "Sua thanh cong" })
  });

  app.delete("/tasks/:idpro/:idtas", async (req, res) => {
    const result = await taskCtrl.deleteTask(req.params.id);
    res.status(200).json({ "message": "Xoa thanh cong" })
  });

};

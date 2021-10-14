"use strict";

const knex = require("../db");

function getAllProjects(){
  return knex("Project").select("*");
}

function createProject(project){
  return knex("Project").insert(project);
}

function updateProject(id, project){
    return knex("Project").where("project_ID",id).update(project)
}

function updateProjects(data){

  data.forEach(element => {

      knex("Project").where("project_ID",element['project_ID']).update(element);

  });
  return {message: 'Update success!'}
}

function deleteProject(id){
  return knex("Project").where("project_ID",id).del();
}

function getProject(id){
  return knex("Project").select("*").where("project_ID",id);
}

module.exports = {
  createProject,
  getAllProjects,
  updateProject,
  deleteProject,
  getProject,
  updateProjects
}
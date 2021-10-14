"use strict";

const knex = require("../db");

function getAllTask(){
  return knex("Task").select("*");
}

function getTasks(projectId){
    return knex("Task").select("*").where("project_ID",projectId);
}

function getTask(projectId, taskId){
    return knex("Task").select("*").where("project_ID",projectId).where("task_ID", taskId);
}

function createTask(task){
  return knex("Task").insert(task);
}

function updateTasks(data){

    data.forEach(element => {

        knex("Task").where("task_ID",element['task_ID']).update(element);

    });
    return {message: 'Update success!'}
}

function updateTask(task){

    return knex("Task").update(task);
}

function deleteTask(id){
    knex("Task").where("task_ID",id).del();
    return {message: 'Delete success!'}
  }

module.exports = {
    getAllTask,
    getTasks,
    getTask,
    createTask,
    updateTasks,
    updateTask,
    deleteTask
}
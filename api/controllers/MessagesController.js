"use strict";

const knex = require("../db");

function getAllMessages(){
  return knex("Message").select("*");
}

function createMessage(mess){
  return knex("Message").insert(mess);
}


function getMessage(id){
  return knex("Message").select("*").where("message_ID",id);
}

module.exports = {
  getAllMessages,
  createMessage,
  getMessage
}
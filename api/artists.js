const express = require('express')
const sqlite3 = require('sqlite3')
const db = new sqlite3.Database(process.env.TEST_DATABASE || '../database.sqlite')
const artistsRouter = express.Router()

module.exports = artistsRouter

const bcrypt = require("bcryptjs");
const db = require("../db.js");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const crypto = require("crypto");
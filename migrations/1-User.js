'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "Users", deps: []
 *
 **/

var info = {
    "revision": 1,
    "name": "User",
    "created": "2022-01-18T16:15:58.843Z",
    "comment": ""
};

var migrationCommands = [{
    fn: "createTable",
    params: [
        "Users",
        {
            "id": {
                "type": Sequelize.INTEGER,
                "field": "id",
                "autoIncrement": true,
                "primaryKey": true,
                "allowNull": false
            },
            "uuid": {
                "type": Sequelize.UUID,
                "field": "uuid",
                "unique": true,
                "defaultValue": Sequelize.UUIDV4
            },
            "firstName": {
                "type": Sequelize.STRING,
                "field": "firstName"
            },
            "lastName": {
                "type": Sequelize.STRING,
                "field": "lastName"
            },
            "email": {
                "type": Sequelize.STRING,
                "field": "email",
                "unique": true,
                "validate": {
                    "isEmail": true
                }
            },
            "hash": {
                "type": Sequelize.STRING,
                "field": "hash",
                "allowNull": true
            },
            "salt": {
                "type": Sequelize.STRING,
                "field": "salt",
                "allowNull": true
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "field": "createdAt",
                "allowNull": false
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "field": "updatedAt",
                "allowNull": false
            }
        },
        {}
    ]
}];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};

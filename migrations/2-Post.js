'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "Posts", deps: [Users]
 *
 **/

var info = {
    "revision": 2,
    "name": "Post",
    "created": "2022-01-19T02:19:40.711Z",
    "comment": ""
};

var migrationCommands = [{
    fn: "createTable",
    params: [
        "Posts",
        {
            "id": {
                "type": Sequelize.INTEGER,
                "field": "id",
                "allowNull": false,
                "autoIncrement": true,
                "primaryKey": true
            },
            "uuid": {
                "type": Sequelize.UUID,
                "field": "uuid",
                "unique": true,
                "defaultValue": Sequelize.UUIDV4
            },
            "message": {
                "type": Sequelize.STRING,
                "field": "message",
                "allowNull": false
            },
            "title": {
                "type": Sequelize.STRING,
                "field": "title",
                "allowNull": false
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
            },
            "UserId": {
                "type": Sequelize.INTEGER,
                "field": "UserId",
                "onUpdate": "CASCADE",
                "onDelete": "SET NULL",
                "references": {
                    "model": "Users",
                    "key": "id"
                },
                "allowNull": true
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

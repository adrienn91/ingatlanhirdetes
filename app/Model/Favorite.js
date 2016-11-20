'use strict'

const Lucid = use('Lucid')

class Favorite extends Lucid {

    properties() {
        return this.belongsTo('App/Model/Property')
    }

    users() {
        return this.belongsTo('App/Model/User')
    }
}

module.exports = Favorite

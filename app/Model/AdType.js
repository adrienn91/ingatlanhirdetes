'use strict'

const Lucid = use('Lucid')

class AdType extends Lucid {

    properties() {
        return this.belongsTo('App/Model/Property')
    }
}

module.exports = AdType

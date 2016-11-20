'use strict'

const Lucid = use('Lucid')

class Property extends Lucid {
    adTypes() {
        return this.hasOne('App/Model/AdType')
    }

    users() {
        return this.belongsTo('App/Model/User')
    }

    favorites() {
        return this.hasMany('App/Model/Favorite')
    }
}

module.exports = Property
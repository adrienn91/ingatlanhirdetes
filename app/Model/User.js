'use strict'

const Lucid = use('Lucid')

class User extends Lucid {

  apiTokens () {
    return this.hasMany('App/Model/Token')
  }

  properties() {
    return this.hasMany('App/Model/Property')
  }

  favorites() {
    return this.hasMany('App/Model/Favorite')
  }
}

module.exports = User

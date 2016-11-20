'use strict'

const Schema = use('Schema')

class PropertiesSchema extends Schema {

  up () {
    this.create('properties', (table) => {
      table.increments()
      table.string('image').unique()
      table.string('city',100).notNullable()
      table.string('address',100).notNullable()
      table.string('property_type', 100).notNullable()
      table.integer('price').notNullable()
      table.integer('size').notNullable()
      table.string('condition',100).notNullable()
      table.integer('floor')
      table.text('desctiption').notNullable()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.timestamps()
    })
  }

  down () {
    this.drop('properties')
  }

}

module.exports = PropertiesSchema

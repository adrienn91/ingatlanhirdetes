'use strict'

const Schema = use('Schema')

class AdTypesSchema extends Schema {

  up () {
    this.create('ad_types', (table) => {
      table.increments()
      table.string('is_sale', 1)
      table.string('is_rent', 1)
      table.integer('property_id').unsigned().references('id').inTable('properties')
      table.timestamps()
    })
  }

  down () {
    this.drop('ad_types')
  }

}

module.exports = AdTypesSchema

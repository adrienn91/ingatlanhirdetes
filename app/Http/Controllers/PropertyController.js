'use strict'

const Database = use('Database')
const Property = use('App/Model/Property')
const AdType = use('App/Model/AdType')
const User = use('App/Model/User')
const Favorite = use('App/Model/Favorite')
const Validator = use('Validator')
const Helpers = use('Helpers')
const File = use('AdonisFilesystem/Filesystem')

class PropertyController {
  
  * index(request, response) {
    // const categories = yield Database.from('categories').select('*')
    // response.send(categories)
    const properties = yield Property.all()
    const users = yield User.all()

    yield response.sendView('main', {
      properties: properties.toJSON()
    }) 
  }

    * show(request, response) {
    
    const id = request.param('id')
    const property = yield Property.find(id)
    
    //const file = yield File.get('15arrow.png')
    if (!property) {
      response.notFound('Property does not exist')
      return
    }
    yield property.related('adTypes').load()

    yield response.sendView('showProperty', {
      property: property.toJSON(),
    })
  }

  * create(request, response) {
    const properties = yield Property.all();
    const type = yield AdType.all();

    yield response.sendView('createProperty', {
      properties: properties.toJSON(),
      type : type.toJSON()
    });
  }

  * doCreate(request, response) {
    const type = new AdType() 
    const property = new Property()
    const propertyData = request.except('_csrf');
    const rules = {
      city: 'required',
      address: 'required',
      property_type: 'required',
      price: 'required',
      size: 'required',
      condition: 'required',
      floor: 'required',
      desctiption: 'required',
    } 

    if(propertyData.isSale == undefined){
      type.is_sale = 'N'
    } else{
      type.is_sale = 'Y'
    }

   if(propertyData.isRend == undefined){
      type.is_rent = 'N'
    } else{
      type.is_rent = 'Y'
    }
    
    const validation = yield Validator.validateAll(propertyData, rules);
    if (validation.fails()) {
      yield request
        .withAll()
        .andWith({ errors: validation.messages() })
        .flash()

      response.redirect('/')
      return
    }

    const prop = yield Property.create({
      address: propertyData.address,
      city: propertyData.city,
      property_type: propertyData.property_type,
      price: propertyData.price,
      size: propertyData.size,
      condition: propertyData.condition,
      floor: propertyData.floor,
      desctiption: propertyData.desctiption,
      user_id: request.currentUser.id
    });

    type.property_id = prop.id
    yield type.save();

    response.redirect('create/' + prop.id + '/upload');
  }

  * edit(request, response) {
    const id = request.param('id')
    const property = yield Property.find(id)

    if (request.currentUser.id !== property.user_id) {
      response.unauthorized('Nincs jog')
      return
    }

    const type = yield AdType.all();

    yield response.sendView('editProperty', {
      type: type.toJSON(),
      property: property.toJSON(),
    });
  }

  * doEdit(request, response) {
    const propertyData = request.except('_csrf');
    const rules = {
      city: 'required',
      address: 'required',
      property_type: 'required',
      price: 'required',
      size: 'required',
      condition: 'required',
      floor: 'required',
      desctiption: 'required'
    }
    const validation = yield Validator.validateAll(propertyData, rules);
    if (validation.fails()) {
      yield request
        .withAll()
        .andWith({ errors: validation.messages() })
        .flash()

      response.redirect('back')
      return
    }

    const id = request.param('id')
    const property = yield Property.find(id)

    if (request.currentUser.id !== property.user_id) {
      response.unauthorized()
      return
    }

    property.city = propertyData.city
    property.address = propertyData.address
    property.property_type = propertyData.property_type
    property.price = propertyData.price
    property.size = propertyData.size
    property.condition = propertyData.condition
    property.floor = propertyData.floor
    property.desctiption = propertyData.desctiption
    

    yield property.save()

    response.redirect('/');
  }

  * doDelete(request, response) {
    const id = request.param('id')
    const property = yield Property.find(id)
    const favorites = yield Favorite.query().where('property_id', id).fetch()
    const adType = yield AdType.query().where('property_id', id).fetch()
    if (!property) {
      response.notFound('Property does not exist')
      return
    }

    for (let favorite of favorites) {   
          yield favorite.delete()
    }
    yield property.delete()
    response.redirect('/');
  }

    * addFavorite(request, response) {
    const id = request.param('id')
    const existFavorites = yield Favorite.all()
    const favorite = new Favorite()
    favorite.user_id = request.currentUser.id
    favorite.property_id = id

    for (let existFavorite of existFavorites) {
      if(existFavorite.user_id == request.currentUser.id && 
         existFavorite.property_id == id) {
           response.redirect('/')
           return
         }
    }

    yield favorite.save()
    response.redirect('/');
  }
  
  * myFavorites(request, response) {
    
    const favorites = yield Favorite.query().where('user_id', request.currentUser.id).fetch()

    for (let favorite of favorites) {
      const property = yield favorite.properties().fetch()
      if(property !== null){
        favorite.property = property.toJSON()
      }
     
    }
   // yield favorites.related('properties').load()
    yield response.sendView('showFavorite', {
      favorites: favorites.toJSON()
    }) 
  }

   * search (request, response) {
    const page = Math.max(1, request.input('p'))
    const filters = {
      propertyAddress: request.input('propertyAddress') || '',
     // category: request.input('category') || 0,
      createdBy: request.input('createdBy') || 0
    }

    const property = yield Property.query()
      .where(function () {
   //     if (filters.category > 0) this.where('category_id', filters.category)
        if (filters.createdBy > 0) this.where('user_id', filters.createdBy)
        if (filters.propertyAddress.length > 0) this.where('address', 'LIKE', `%${filters.propertyAddress}%`)
      })
      .with('users')
      .paginate(page, 9)

    //const property = yield Property.all()
    const users = yield User.all()

    yield response.sendView('propertySearch', {
      property: property.toJSON(),
      users: users.toJSON(),
      filters
    })
  }

}

module.exports = PropertyController

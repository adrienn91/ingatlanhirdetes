'use strict'


const Database = use('Database')
const Property = use('App/Model/Property')
const AdType = use('App/Model/AdType')
const User = use('App/Model/User')
const Validator = use('Validator')
const Helpers = use('Helpers')
const File = use('AdonisFilesystem/Filesystem')
var temp;

class FileController {

*show(request, response) {
  
    const id = request.param('id')
    const property = yield Property.find(id)
      if (request.currentUser.id !== property.user_id) {
        response.unauthorized('Nincs jog')
        return
      }

    if (!property) {
      response.notFound('Property does not exist')
      return
    }
    yield property.related('adTypes').load()

    yield response.sendView('fileUpload', {
      property: property.toJSON()
    })
}

 * store(request, response) {
    const id = request.currentUser.id 
    const file = request.file('file', {
        allowedExtensions: ['jpg', 'png', 'jpeg']
    })
    const property = yield Property.find(temp)

    const filename = temp + file.clientName()

   yield file.move(Helpers.storagePath('uploads'), filename)

    if(!file.move()) {
      response.badRequest({error: file.errors()})
      return
    }
    const fs = require('fs');
    var path = 'C:/Users/Adrienn/Desktop/alkfejl-recept-2-master'
    var data = fs.readFileSync(path + '/storage/uploads/' + filename) 
    var base64 = new Buffer(data).toString('base64')
    var type = file.mimeType();
    var prefix = "data:" + type + ";base64,";

    property.image = (prefix + base64);
    yield property.save()

    response.ok('success')
    
  }

}
module.exports = FileController
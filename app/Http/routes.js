'use strict'

const Route = use('Route')

// Route.on('/').render('welcome')
// Route.on('/').render('main')
// Route.get('/', function * (request, response) {
//     yield response.sendView('main');
// });
Route.get('/', 'PropertyController.index')
Route.get('/advertisments/create', 'PropertyController.create').middleware('auth')
Route.post('/advertisments/create', 'PropertyController.doCreate').middleware('auth')
Route.get('/advertisments/:id', 'PropertyController.show')
Route.get('/advertisments/create/:id/upload', 'FileController.show')
Route.post('/advertisments/create/upload/file', 'FileController.store')

Route.get('/advertisments/:id/edit', 'PropertyController.edit').middleware('auth')
Route.post('/advertisments/:id/edit', 'PropertyController.doEdit').middleware('auth')
Route.get('/advertisments/:id/delete', 'PropertyController.doDelete').middleware('auth')
Route.get('/advertisments/:id/favorite', 'PropertyController.addFavorite').middleware('auth')
Route.get('/myfavorites', 'PropertyController.myFavorites').middleware('auth')
Route.delete('/advertisments/:id', 'PropertyController.doDelete')
Route.get('/advertisments', 'PropertyController.search')

Route.get('/register', 'UserController.register')
Route.post('/register', 'UserController.doRegister')
Route.get('/login', 'UserController.login')
Route.post('/login', 'UserController.doLogin')
Route.get('/logout', 'UserController.doLogout')
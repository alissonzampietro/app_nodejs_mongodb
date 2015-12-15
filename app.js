var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var informationConnect = 'mongodb://127.0.0.1/nodejs';
var mongoose = require('mongoose').connect(informationConnect);
var User;

//realização da conexão
var db = mongoose.connection;
db.on('error',console.error.bind(console,"Erro ao realizar conexão"));

//abertura do banco de dados
db.once('open',function(){
	var userSchema = mongoose.Schema({
		fullname: String,
		email: String,
		password: String,
		created_at: Date
	})

	User = mongoose.model('User',userSchema);
})

//seleciona a porta que deseja usar para realizar as chamadas na aplicação
app.listen(5000);

//converte para JSON
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
	extended: true
}));



app.get('/',function(req,res){
	res.end('SERVIÇO FUNCIONANDO CORRETAMENTE!');
});
//função para listar todos os usuários
app.get('/users',function(req,res){
	User.find({},function(error, users){

		if(error){
			res.json({error: 'Não foi possível obter todos os usuários'});
		}else{
			res.json(users);
		}

	})
});

//função para buscar o usuário pelo ID
app.get('/users/:id',function(req,res){
	var id = req.param("id");
	User.findById(id,{},function(error, user){

		if(error){
			res.json({error: 'Não foi possível retornar o usuário'});
		}else{
			res.json(user);
		}

	})
});

//função para deletar do banco de dados pelo ID
app.delete('/users/:id',function(req,res){
	var id = req.param("id");
	User.findById(id,{},function(error, user){
		
		if(error){
			res.json({error: 'Não foi possível deletar o usuário'});
		}else{
			user.remove(function(error){
				if(!error){
					res.json({response:"Usuário excluído com sucesso"});
				}
			})
		}

	})
});



app.post('/users',function(req,res){
	var nome = req.param("nome");
	var email = req.param("email");
	var senha = req.param("senha");
		new User({
			fullname: nome,
			email: email,
			password: senha,
			created_at: new Date()
		}).save(function(error,users){
			if(error){
				res.json({error: 'Não foi possível salvar o usuário'});
			}else{
				res.json(users);
			}
		});
});





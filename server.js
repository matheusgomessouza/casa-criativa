// Usei express pra criar e configurar meu servidor
const express = require('express');
const server = express();

const db = require('./db');

// Configurações do Express
// Configurar arquivos estáticos (css, scripts, imagens)
server.use(express.static('public'));
// Habilitar uso do req.body
server.use(express.urlencoded({ extended: true}));



// Configuração do nunjucks
const nunjucks = require('nunjucks');
nunjucks.configure('views', {
	express: server,
	noCache: true, //boolean
});

/* Criei uma rota
e capturo o pedido do cliente para responder*/

server.get('/', function (req, res) { 

	db.all('SELECT * FROM ideas', function(err, rows){
		if (err) {
			console.log(err);
			return res.send('Erro no banco de dados');
		}
        
		const reversedIdeas = [...rows].reverse();

		let lastIdeas = [];
		for (let idea of reversedIdeas) {
			if (lastIdeas.length < 2) {
				lastIdeas.push(idea);
			}
		}
        
		return res.render('index.html', { ideas: lastIdeas });
	});

    
});

server.get('/ideias', function (req, res){ 
	db.all('SELECT * FROM ideas', function(err, rows){
		if (err) {
			console.log(err);
			return res.send('Erro no banco de dados');
		}

		const reversedIdeas = [...rows].reverse();
		return res.render('ideias.html', { ideas: reversedIdeas});
	});
});

server.post('/', function(req, res){
	// Inserir dados na tabela
	const query = `

        INSERT INTO ideas(
            image,
            title,
            category,
            description,
            link
       ) VALUES(?,?,?,?,?);
    `;
	const values = [
		req.body.image,
		req.body.title,
		req.body.category,
		req.body.description,
		req.body.link,
	]; 

	db.run (query, values,function(err){
		if (err) {
			console.log(err);
			return res.send('Erro no banco de dados');
		}
         
		// Redirecionei para o caminho 
		return res.redirect('/ideias');
	});        

	// Consultar dados na tabela
	db.all('SELECT * FROM ideas', function(err, rows){
		if (err) return console.log(err);
        
		console.log(rows);
	});
});


// Liguei meu servidor na porta 3000
server.listen(3000);




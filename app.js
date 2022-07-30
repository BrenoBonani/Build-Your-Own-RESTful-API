require('dotenv').config()

const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));



// CONNECT TO MONGOOSE

mongoose.connect(process.env.MONGO_URI);

// ARTICLE SCHEMA

const articleSchema = {
    title: String,
    content: String,
}

// ARTICLE MODEL 

const Article = mongoose.model("Article", articleSchema);


// REQUEST ALL ARTICLES 
app.route("/articles")

    .get((req, res) => {
    Article.find((err, foundArticles) => {
        if (!err) {
            console.log(foundArticles);   
        } else {
            console.log(err);
        }    
    });
})
    .post((req, res) => {
    console.log(req.body.title);
    console.log(req.body.content);

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    
    newArticle.save((err) => {
        if (!err) {
            res.send("Successfuly new added a new article!")
        } else {
            res.send(err);
        }
    });
})

    .delete((req, res) => {
    Article.deleteMany((err) => {
        if (!err) {
            res.send("Successfuly deleted all articles!");
        } else {
            res.send(err);
        }
    });
});


// REQUEST SPECIFIC ROUTE

app.route("/articles/:articlesTitle")

    .get((req, res) => {

        Article.findOne({title: req.params.articlesTitle}, (err, foundArticle) => {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No articles matching that title was found.");
            }
        });
    })

    .put((req, res) => {
        Article.replaceOne(
            {title: req.params.articlesTitle},
            {title: req.body.title, content: req.body.content},
            {overwrite: true},
            (err) => {
                if (!err) {
                    res.send("Successfully updated article!");
                } 
            }
        );
    })

    .patch((req, res) => {
        Article.updateOne(
            {title: req.params.articlesTitle},
            {$set: req.body},
            (req, res) => {
                if (!err) {
                    res.send("Successfully updated the article!");
                } else {
                    res.send(err);
                }
            }
        );
    })

    .delete((req, res) => {
        Article.deleteOne(
            {title: req.params.articleTitle},
            (err) => {
                if (!err) {
                    res.send("Successfully deleted the article!");
                } else {
                    res.send(err);
                }
            }
        );
    });

    

    




// LISTEN TO 

// LISTEN ROUTE
app.listen(port, () => console.log(`Server started at port: ${port}`)
);



/* A primeira coisa que eu fiz foi criar todo o template dos require (express, mongoose, EJS e etc). Depois eu coloquei o app.listen() e coloquei os:

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser({urlencoded: true}));
app.use(express.static("public"));

Depois de colocar todos eles. Eu fui conectar com o mongoose. Utilizando:

mongoose.connect("mongodb://localhost:27017/wikiDB");

Que conecta ao localhost na porta que o mongoDB gosta de usar e com o nome do meu novo database (wikiDB). Depois disso, eu preciso criar um novo Schema:

const articleSchema = {
    title: String,
    content: String,
}

Depois eu crio o meu model (modelo):

const Article = mongoose.model("Article", articleSchema);

Dentro do mongoose.model, o "Article" vai ficar minusculo e no plural automaticamente pelo mongoose. Também especifico o meu schema antes de fechar ().





==================
Criando GET ROUTE
==================

GET ROUTE busca todos os articles usando a rota/articles. Dessa forma, eu posso usar o express, escrevendo app.get e especificando a minha rota e adicionando
uma callback function para lidar com a resposta. Dessa forma:

app.get("/articles", (req, res) => {

})

Mas dentro do app.get, eu preciso passar o READ vai acontecer nos bastidores do meu DB. Para isso, eu vou ter que usar o model que eu criei "Article".find({conditions}).
Dentro do .find() pode ir alguma condição que eu queira achar nos meus documentos, mas eu vou deixar vazio agora pq eu quero buscar todos os documentos dentro de articles.
Ainda vai uma callback function, que vai mostrar um error (err) e os resultados, ficando assim no final:

app.get("/articles", (req, res) => {
    Article.find((err, foundArticles) => {

    })
})

Nota: O foundArticles podia ter levado qualquer nome.

Eu posso usar console.log("foundArticles") ou usar res.send("findArticle") para renderizar no localhost.

Por fim, nesta parte, eu preciso adicionar um if/else para pegar o error:

app.get("/articles", (req, res) => {
    Article.find((err, foundArticles) => {
        if (!err) {
            console.log(foundArticles);   
        } else {
            console.log(err);
        }    
    })
})


=====================
Criando POST REQUEST
=====================

Para o express atender as solicitações POSTs que o nosso servidor receber, vou ter que usar:

app.post(route, (req, res) => {

})


Agora, a minha rota é a mesma do app.get (vai ser /articles) pq por via de regra do RESTful, para POST eu continuo com a mesma rota do get.
Depois disso, eu crio um req.body.title e um req.body.content pq caso eu tivesse o front-end com os inputs, dentro dos inputs teriamos um
name="title" e outro input com name="content". Dessa forma, conseguiriamos puxar dali os inputs que o usuário estaria colocando com req.body.

Depois disso, eu vou lá no aplicativo POSTMAN, crio uma nova aba, mudo o request para POST. Vou na aba body e mudo para form-urlencoded. Assim,
eu vou conseguir criar dois inputs que vão levar como key value o "title" e o "content" para o meu req.body conseguir acessar.

Em ordem para armazenar os dados que vieram do POST no meu DB, eu preciso:

const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
});

newArticle.save();

Em seguida, se eu for no POSTMAN e enviar mais uma vez (usando SEND), os key values que eu quero armazenar. Então, lá dentro do Studio3T do mongo DB,
vão estar armazenados os novos dados que eu inseri.


=====================
DELETING ARTICLES
=====================

Agora, o cliente está enviando uma solicitação HTTP de delete para a minha rota e isso deve deletar todos os articles na minha coleção. Para isso, basta:

app.delete(route, (req, res) => {

});

Dentro do app.delete, eu vou ter que passar o metodo de deletar que o mongoose utiliza, que é assim:

<modelname>.deleteMany({conditions}, (err) => {

});

Ou seja, preciso passar o model que eu criei usando .deleteMany(). Dentro do deleteMany, tem que ir as condições que eu quero. A condição que eu posso
passar é para filtrar a coleção e descobrir o que podemos excluir (se eu deixar ela vazia, vai deletar todos os documentos).


Uma coisa que o Express nos permite fazer, é ter as rotas definidas com o app.route method. Já que até agora, eu estava tendo as mesmas rotas sendo repetidias
várias vezes. Assim, eu posso usar app.route para amarrar (chained method) todos os outros methods que eu usei, como app.post, app.get e etc. Dessa forma:

app.route("/articles")

    .get(req, res) => {
    Article.find((err, foundArticles) => {
        if (!err) {
            console.log(foundArticles);   
        } else {
            console.log(err);
        }    
    });
})
    .post(req, res) => {
    console.log(req.body.title);
    console.log(req.body.content);

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    
    newArticle.save((err) => {
        if (!err) {
            res.send("Successfuly new added a new article!")
        } else {
            res.send(err);
        }
    });
})

    .delete((req, res) => {
    Article.deleteMany((err) => {
        if (!err) {
            res.send("Successfuly deleted all articles!");
        } else {
            res.send(err);
        }
    });
});



=======================
GET A SPECIFIC ARTICLE
=======================

Agora que já colocamos como o servidor deve responder quando o usuário fizer alguma solicitação HTTP de post, get ou delete para a rota de artigos. Agora é preciso
fazer para uma rota especifica. Ou seja, quando o usuário pesquisar, ele vai colocar /articles/API ou /articles/MongoDB para especificamente solicitar aquele artigo
artigo.

Usando, req.params, que é ajuda a criar rotas dinamicas, como a que queremos:

app.route("/articles:articlesTitle")

    .get((req, res) => {

    });

Agora, para que o meu banco de dados possa buscar e ler um artigo especifico, eu preciso usar um find method. Neste caso, já que eu quero um artigo em especifico, eu
vou usar o findOne(). Que também vai ter uma condição dentro, que vai ter que dar match com o parametro do título que vamos obter através da URL e ai vamos saber se tive
mos algum erro ou se temos o resultado que queremos. Então fica assim:


app.route("/articles:articlesTitle")

    .get((req, res) => {

        Article.findOne({title: req.params.articleTitle}, (err, foundArticle) => {
            if (foundArticle) {
                res.rend(foundArticle)
            } else {
                res.send("No articles matching that title was found.")
            }
        });
    });

O que vai acontecer aqui, é que quando o usuário fizer um get request de um artigo especifico, ele vai ir no app.route e vai olhar o que vem depois do :articlesTitle. Em
seguida, ele vai ir para o .get e entrar na minha função findOne, onde vai olhar para o req.params e verificar se os títulos batem. Encontrando o título que corresponde ao 
que foi solicitado, devemos devolve-lo ao servidor, com o res.send(foundArticle). Se não, mostrar a mensagem de err.


=======================
PUT ON SPECIFIC ARTICLE
=======================

Para dar update em um artigo especifico, podemos usar o PUT method usando mongoose. Para isso, vamos usar o model que criamos, com uma condição, depois artigo será update,
depois overwrite como true, e isso diz ao MongoDB que queremos subscrever (overwrite) todo o documento com o que está especificado no update (se eu deixar false ou vazio, ele
vai atualizar apenas um campo em especifico). Dessa forma:

.put((req, res) => {
        Article.replaceOne(
            {title: req.params.articlesTitle},
            {title: req.body.title, content: req.body.content}
        )
    })

Vamos usar o Article.replaceOne para PUT e criar dois objetos, um igual ao que temos no .get e outro igual ao que temos no app.post. Dessa forma, o req.body vai analisar
a minha solicitação e procurar por aquilo que foi enviado por meio de um formulario HTML (exemplo). Dessa forma, quando eu fizer a minha solicitação de atualizar pelo postman.
Eu vou ter que mudar para PUT e atulizar o body lá também. Agora, eu preciso usar o overwrite: true e usar a callback function. Assim:

.put((req, res) => {
        Article.replaceOne(
            {title: req.params.articlesTitle},
            {title: req.body.title, content: req.body.content},
            {overwrite: true},
            (err) => {
                if (!err) {
                    res.send("Successfully updated article!")
                } 
            }
        );
    })


=========================
PATCH A SPECIFIC ARTICLE
=========================

O PATCH é usado quando você quer atualizar apenas um campo específico em um documento específico. Sendo assim, o method ainda é atualização, mas não usaremos mais o replaceOne. Agora,
vamos usar o updateOne. Com as condições, o que vai ser {$set: update} e a callback function. Vale ressaltar, que esse $set: update, diz ao MongoDB, que queremos atualizar apenas um 
campo em especifico. Ficando assim:

.patch((req, res) => {
    Article.updateOne(
        {title: req.params.articlesTitle},
        {$set: req.body},
        (req, res) => {
            if (!err) {
                res.send("Successfully updated the article!")
            } else {
                res.send(err)
            }
        }
    );
});

No $set:, tudo que temos que fazer é colocar req.body. Isso acontece pq, quando o usuário fizer um request, o nosso patch vai entender como req.body com um JS Object. Dessa forma, quando
o usuário enviar um PATCH request, o req.body vai analisar a solicitação e selecionar os campos para os quais eles fornecem atualizações. Então, usando o $set: podemos atualizar o meu banco 
de dados apenas para os campos que tem novos valores.



==========================
DELETE A SPECIFIC ARTICLE
==========================

Agora, a última coisa que eu preciso fazer para terminar a minha RESTful API, é adicionar o DELETE para specific articles. Sendo assim, eu vou usar .delete((req, res) => {}) e usar o deleteOne
do mongoose. Vou usar o model mais uma vez, com uma condição e uma callback function. Dessa forma:

.delete((req, res) => {
    Article.deleteOne(
        {title: req.params.articleTitle},
        (err) => {
            if (!err) {
                res.send("Successfully deleted the article!");
            } else {
                res.send(err);
            }
        }
    );
});

Neste caso, eu quero apenas deletar um artigo, então eu tenho que mirar no título dele. Por isso, dentro da condição eu vou usar o title:


*/
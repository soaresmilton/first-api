# Módulo Node JS

# Criando a primeira API

Esse repositório é construído com base no módulo 01 do curso JStack, da Dev Academy. Nosso objetivo, é criar uma API utilizando os recursos nativos do NODE.JS, de forma a aprender e entender os seus conceitos básicos para conseguir criar API's robustas no futuro.

---

# Tecnologias usadas

***A API criada nesse repositório utiliza somente métodos e módulos nativos do NODE.JS***

- Node.js
    - http
    - URL

---

# A API

Essa é uma API de contatos, criada com o intuito de fornecer os principais dados de um contato/ cliente para serem consumidos em um front end que será criado futuramente em outro repositório. 

*Formato básico da API criada:*

```json
{
    "id": 1,
    "name": "Milton Soares",
    "age": 25,
    "phone": "35998571018",
    "email": "eng.milton.soares@gmail.com",
    "occupation": "Software developer",
    "preferences": [
      "Books",
      "RPG Games",
      "Code",
      "Movies"
    ]
  },
  {
    "id": 2,
    "name": "Sara Guimarães",
    "age": 22,
    "phone": "35998571018",
    "email": "sara@gmail.com",
    "occupation": "Nutricionist",
    "preferences": [
      "Books",
      "Comedy Series",
      "Movies"
    ]
  },
  {
    "id": 3,
    "name": "Andrea",
    "age": 41,
    "phone": "35998571018",
    "email": "andrea@gmail.com",
    "occupation": "Pharmacist",
    "preferences": [
      "Books",
      "Sleep"
    ]
  }
```

---

## OBSERVAÇÕES E ANOTAÇÕES IMPORTANTES

### 1 - Criando a primeira rota da API

nessa especificação, o método end de uma resposta HTTP, sempre deverá receber seus dados  em formato de string. Por isso, utilizamos o JSON.stringify para transformar os dados em formato JSON para uma string.

```jsx
if(req.url === '/users' && req.method === 'GET') {
	res.writeHead(200, { 'Content-Type': 'application/json' });
	res.end(JSON.stringify(users));
}
```

---

### 2 - Criando Controller de Usuários e Sistema de Rotas

***ESTRUTURA DE ARQUIVOS E RESUMO DA AULA:***

Nessa aula foram criados dois arquivos: UserController.js e routes.js de modo a fatorar, facilitar e diminuir a repetição de códigos ao criar rotas. O arquivo userController, é um controller para a listagem dos usuários cadastrados no arquivo /mocks/users.js. O User controller, utilzia de uma função chamada de findUsers para fazer essa listagem. De forma geral, essa função simplesmente envia um header com status 200, do tipo json e busca nossa lista de usuários que está continda em users, transformando-a em um JSON.

**UserController.js:**

```jsx
const users = require('../mocks/users');

module.exports = {
  listUsers(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  }
}
```

Já o arquivo routes.js exporta um objeto de rotas que configura nossa criação de rotas (sistema de rotas). O principal ponto desse arquivo é facilitar a criação de novas rotas, sem precisar de repetir códigos que antes eram criados no index.js (apresentado no tópico 1 dessa lista).

**routes.js:**

```jsx
const UserController = require('./controllers/UserController');

// CADA OBJETO REPRESENTA UMA ROTA DA NOSSA API
module.exports = [
  {
    endpoint: '/users',
    method: 'GET',
    handler: UserController.listUsers,
  },
];
```

Por fimr, nosso arquivo index.js ficou confrome código abaixo. Nota-se que agora, para chamarmos as rotas dentro desse arquivo, nós importamos os routes, e passamos um método ***find*** para validar se o endpoint e o método passado nos parâmetros da rota são iguais os que temos na requisição da aplicação.

**index.js:**

```jsx
const http = require('http');

const routes = require('./routes');

const server = http.createServer((req, res) => {

  console.log(`Request method: ${req.method} | Endpoint: ${req.url}`);

  const route = routes.find((routeObject) => (routeObject.endpoint === req.url && routeObject.method === req.method)
  );

  if (route) {
    route.handler(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(`Cannot ${req.method}  ${req.url}`);
  }

});

server.listen(3000, () => console.log('Server is running at http://localhost:3000'));
```

---

### 3 - Query Params

Intuito dessa aula é aprender a manipular nosso array de users a partir da nossa URL, utilizando os **Query Params.** Nessa aula, para conhecer os conceitos dos Query Params, iremos criar uma função que ordena nossos users com base no ID do user.

Para isso, iremos utilizar do módulo nativo do node, chamado **URL.**

o URL é uma classe que retorna um objeto com várias propriedades para manipulação da URL.

![Untitled](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/d8a3d87e-592c-4793-b2a5-4f72e34dd55a/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20211020%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211020T195823Z&X-Amz-Expires=86400&X-Amz-Signature=0a1a141fee341b6a52fdc09dddb1c8551696a88cb8cc0847d4dc00f6d9019524&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22)

Log da classe URL descrita anteriormente.

O pulo do gato dessa aula, é justamente esse objeto URL, pois é através dele que conseguimos identificar qual é o query params passado na URL e assim, executar funções específicas para cada parâmetro passado.

A implementação de código, o qual configura os query params dessa aula foram construídos no arquivo **index.js**. O código desse arquivo, ao final da aula ficou:

```jsx
const http = require('http');
const { URL } = require('url');

const routes = require('./routes');

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(`http://localhost:3000${req.url}`);

  console.log(`Request method: ${req.method} | Endpoint: ${parsedUrl.pathname}`);

  const route = routes.find((routeObject) => (routeObject.endpoint === parsedUrl.pathname && routeObject.method === req.method)
  );

  if (route) {
    req.query = Object.fromEntries(parsedUrl.searchParams);
    route.handler(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(`Cannot ${req.method}  ${parsedUrl.pathname}`);
  }

});

server.listen(3000, () => console.log('Server is running at http://localhost:3000'));
```

Atenção para:

- Importação desestruturada da classe URL
- criar nova instancia dessa classe URL ⇒ ***const parsedUrl;***
- Injetar uma propriedade nova no *req* ⇒ req.query = Object.fromEntries(parsedUrl.searchParams); Aqui, utilizou-se do fromEntries para transformar o objeto que é recebido na propriedade searchParams da classe URL. Nota-se, de acordo com o print do log acima, que em *searchParams* o objeto recebido com valor não é em formato de objeto JavaScript. Para transformar esse valor em um objeto Js utilizou-se do método fromEntries da instancia Object.

Por fim, para concluir o objetivo da aula de organizar os usuários pela Query Params, criou-se uma função sort que ordena os usuários com base no seu ID. Essa função foi criada no arquivo **UserController.js.** E seu código, ao final da aula ficou:

```jsx
const users = require('../mocks/users');

module.exports = {
  listUsers(req, res) {
    const { order } = req.query;
    const sortedUsers = users.sort((a, b) => {
      if (order === 'desc') {
        return a.id < b.id ? 1 : -1;
      }
      return a.id > b.id ? 1 : -1;
    });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(sortedUsers));
  }
}
```

---

### 4 - Recebendo parâmetros na URL

Receber parâmetros na URL, é uma convenção de APIS REST. Portanto, não faz parte originalmente do HTTP. Sendo assim, é necessário implementar todo esse método.

Nessa aula, teremos como objetivo listar um único usuário passando seu ID na URL, e assim listar somente esse usuário. Para começar a construção dessa funcionalidade, o primeiro passo é criar uma rota específica para isso, em **routes.js**.
Assim, o arquivo de rotas ficou da seguinte maneira:

```jsx
const UserController = require('./controllers/UserController');

// CADA OBJETO REPRESENTA UMA ROTA DA NOSSA API
module.exports = [
  {
    endpoint: '/users',
    method: 'GET',
    handler: UserController.listUsers,
  },

  {
    endpoint: '/users/:id',
    method: 'GET',
    handler: UserController.getUserById,
  },
];
```

Continuando com o desenvolvimento da aula, foi feito uma desestruturação do pathname da parsedUrl (criada na aula anterior, com base na nova instancia da classe URL). Essa desestruturação veio para contribuir para legibilidade e flexibilidade do código na montagem do processo para manipulação dos parâmetros na URL.

Posteriormente, foi criado a constante splitEndpoint, de forma a separar nosso pathname em um array. Essa estratégia, ajuda a identificarmos o id que foi passado na URL, para sabermos exatamente qual usuário retornar na lista.

Dessa forma, o arquivo **index.js** ficou da seguinte maneira:

```jsx
const http = require('http');
const { URL } = require('url');

const routes = require('./routes');

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(`http://localhost:3000${req.url}`);

  console.log(`Request method: ${req.method} | Endpoint: ${parsedUrl.pathname}`);

  let { pathname } = parsedUrl;
  let id = null;

  const splitEndpoint = pathname.split('/').filter(Boolean);

  if (splitEndpoint.length > 1) {
    pathname = `/${splitEndpoint[0]}/:id`;
    id = splitEndpoint[1];
  }

  const route = routes.find((routeObject) => (routeObject.endpoint === pathname && routeObject.method === req.method)
  );

  if (route) {
    req.query = Object.fromEntries(parsedUrl.searchParams);
    req.params = { id };
    
    route.handler(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(`Cannot ${req.method}  ${parsedUrl.pathname}`);
  }

});

server.listen(3000, () => console.log('Server is running at http://localhost:3000'));
```

Pontos a observar:

- Desestruturação do pathname da variável parsedUrl
- Criação da constante splitEndpoint para identificarmos qual o id passado na URL através de um array. Nesse caso, o número ID passado na URL sempre será o índice 1 do array.
- Implementação de uma validação que verifica se o comprimento do splitEndpoint é maior que 1. Se for, passa-se o valor do índice 1 (ID) para a variável id.
- Por fim, da mesma forma que o req.query na aula anterior, injetou uma propriedade chamada *params* em *req*, que recebe um objeto { id: id } === { id }

Por fim, finalizando a aula, implementou-se no UserController, a função getUserById, que filtra os usuários com base no número de ID passado na URL.

**UserController.js:**

```jsx
const users = require('../mocks/users');

module.exports = {
  listUsers(req, res) {
    const { order } = req.query;
    const sortedUsers = users.sort((a, b) => {
      if (order === 'desc') {
        return a.id < b.id ? 1 : -1;
      }
      return a.id > b.id ? 1 : -1;
    });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(sortedUsers));
  },

  getUserById(req, res) {
    const { id } = req.params;
    const user = users.find(user => user.id === Number(id));

    if (!user) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'User not found' }));
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    }

  }
}
```

---

### 5 - Criando o método response.send

Nessa aula, o objetivo é refatorar a parte de envio de respostas para o cliente, visto que temos muita repetição de código no desenvolvimento da API.

Primeiro passo é, dentro do nosso arquivo **index.js**, injetar uma propriedade dentro do nosso objeto *res*. Essa propriedade, que daremos o nome de **send**, será uma função que recebe dois argumentos: statusCode e o body.
A função criada, fica dessa maneira:

```jsx
res.send = (statusCode, body) => {
      res.writeHead(statusCode, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(body));
    }
```

Nosso **index.js**, ficou dessa maneira:

```jsx
const http = require('http');
const { URL } = require('url');

const routes = require('./routes');

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(`http://localhost:3000${req.url}`);

  console.log(`Request method: ${req.method} | Endpoint: ${parsedUrl.pathname}`);

  let { pathname } = parsedUrl;
  let id = null;

  const splitEndpoint = pathname.split('/').filter(Boolean);

  if (splitEndpoint.length > 1) {
    pathname = `/${splitEndpoint[0]}/:id`;
    id = splitEndpoint[1];
  }

  const route = routes.find((routeObject) => (routeObject.endpoint === pathname && routeObject.method === req.method)
  );

  if (route) {
    req.query = Object.fromEntries(parsedUrl.searchParams);
    req.params = { id };

    res.send = (statusCode, body) => {
      res.writeHead(statusCode, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(body));
    }

    route.handler(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(`Cannot ${req.method}  ${parsedUrl.pathname}`);
  }

});

server.listen(3000, () => console.log('Server is running at http://localhost:3000'));
```

A refatoração ocorreu dentro do nosso arquivo de **UserController.js**. Ao final da aula, nosso código ficou da seguinte maneira:

```jsx
const users = require('../mocks/users');

module.exports = {
  listUsers(req, res) {
    const { order } = req.query;
    const sortedUsers = users.sort((a, b) => {
      if (order === 'desc') {
        return a.id < b.id ? 1 : -1;
      }
      return a.id > b.id ? 1 : -1;
    });

    res.send(200, sortedUsers);
  },

  getUserById(req, res) {
    const { id } = req.params;
    const user = users.find(user => user.id === Number(id));

    if (!user) {
      return res.send(400, { error: 'User not found' });
    }

    res.send(200, user);

  }
}
```

### 6 - Capturando o Body das Requests

Nesse ponto de desenvolvimento, nossa API já está praticamente pronta. Ela possui as seguintes funcionalidades:

- Sistema de rotas ⇒ permite criar rotas de maneira organizada e simplificada
- req.query ⇒ já consegue receber querys na URL, para executar alguma função específica. No caso dessa API, conseguimos ordenar a lista de usuários tomando como base o ID de cada user.
- req.params ⇒ consegue receber parametros na URL. Nesse caso, conseguimos filtrar os usuários passando o número de seu ID na URL, retornando somente o usuário do ID especificado.

Para finalizar a configuração da API, agora precisamos receber o body das requisições.

Para isso, o primeiro passo é criar a rota com o método **POST** para que possamos enviar o conteúdo do corpo (body) das nossas requisições.

Nessa rota, também iremos criar um handler exclusivo para manusear o Body de nossas requisições. Para isso, criaremos o método createUser no nosso UserController, que permitirá que criemos novos usuários na API.

Nesse ponto, nossa **routes.js** ficou dessa maneira:

```jsx
const UserController = require('./controllers/UserController');

// CADA OBJETO REPRESENTA UMA ROTA DA NOSSA API
module.exports = [
  {
    endpoint: '/users',
    method: 'GET',
    handler: UserController.listUsers,
  },

  {
    endpoint: '/users/:id',
    method: 'GET',
    handler: UserController.getUserById,
  },

  {
    endpoint: '/users',
    method: 'POST',
    handler: UserController.createUser,
  },
];
```

A partir daqui, o próximo passo é criar a função createUser() no UserController.js. Podemos testar se nossa rota POST está funcionando, utilizando o Insomnia:

![Untitled](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/7e254b9f-d8e6-4256-b358-90cd3bfa5886/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20211020%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211020T195852Z&X-Amz-Expires=86400&X-Amz-Signature=8fc5b88fd290ca59fa250df179f50243e01a619e713c1cca718cd8d3ec82b850&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22)

Enviando um body no método POST do Create user. Nota-se que o status 200 na parte direita do Insomnia, indica que a requisição deu certo.

Uma vez testado, podemos dar continuidade para implementar a funcionalidade que captura o texto do body da nossa req dentro da função createUser().

Dessa forma. nosso arquivo **UserController.js** ficou da seguinte maneira:

```jsx
const users = require('../mocks/users');

module.exports = {
  listUsers(req, res) {
    const { order } = req.query;
    const sortedUsers = users.sort((a, b) => {
      if (order === 'desc') {
        return a.id < b.id ? 1 : -1;
      }
      return a.id > b.id ? 1 : -1;
    });

    res.send(200, sortedUsers);
  },

  getUserById(req, res) {
    const { id } = req.params;
    const user = users.find(user => user.id === Number(id));

    if (!user) {
      return res.send(400, { error: 'User not found' });
    }

    res.send(200, user);

  },

  createUser(req, res) {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      body = JSON.parse(body);

      const lastUserId = users[users.length - 1].id;
      const newUser = {
        id: lastUserId + 1,
        name: body.name,
        age: body.age,
        phone: body.phone,
        email: body.email,
        occupation: body.occupation,
        preferences: body.preferences
      }

      users.push(newUser);

      res.send(200, newUser);
    })
  }
}
```

### 7 - Criando o helper BodyParser

Para continuarmos com o desenvolvimento de nossa API, podemos elevar um pouco o nível e refatorar nosso código. Nesse ponto da aula, vamos criar uma função helper para evitar a duplicaçãod e código para cada requisição do tipo POST que quisermos criar futuramente.

Para isso, primeiro passo é criar uma pasta dentro de src, chamada *helpers* e também um arquivo chamado bodyParser.js que será onde iremos implementar a função helper ⇒ /src/helpers/bodyParser.js

Dentro do nosso arquivo bodyParser, iremos construir a lógica de captura de text do body no nosso método POST. Dessa forma, a função helper bodyParser dentro do file **bodyParser.js** fica da seguinte maneira:

```jsx
function bodyParser(req, callback) {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    body = JSON.parse(body);
    req.body = body;
    callback();
  })
}

module.exports = bodyParser;
```

Continuando, no nosso arquivo **index.js**, iremos verificar se nossa req.method é igual a POST ou PUT. Quando for, podemos chamar nossa função bodyParser e executá-la para capturar o body da requisição.

Nosso arquivo index.js ficará da seguinte forma:

```jsx
const http = require('http');
const { URL } = require('url');

const bodyParser = require('./helpers/bodyParser');
const routes = require('./routes');

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(`http://localhost:3000${req.url}`);

  console.log(`Request method: ${req.method} | Endpoint: ${parsedUrl.pathname}`);

  let { pathname } = parsedUrl;
  let id = null;

  const splitEndpoint = pathname.split('/').filter(Boolean);

  if (splitEndpoint.length > 1) {
    pathname = `/${splitEndpoint[0]}/:id`;
    id = splitEndpoint[1];
  }

  const route = routes.find((routeObject) => (routeObject.endpoint === pathname && routeObject.method === req.method)
  );

  if (route) {
    req.query = Object.fromEntries(parsedUrl.searchParams);
    req.params = { id };

    res.send = (statusCode, body) => {
      res.writeHead(statusCode, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(body));
    }
    
    if (['POST', 'PUT'].includes(req.method)) {
      bodyParser(req, () => route.handler(req, res))
    } else {
      route.handler(req, res);
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(`Cannot ${req.method}  ${parsedUrl.pathname}`);
  }

});

server.listen(3000, () => console.log('Server is running at http://localhost:3000'));
```

Depois de configurar o index.js com a função bodyparser, devemos fazer as configurações necessárias no nosso **UserController.js**. Nesse arquivo, iremos refatorar a função createUser(), desestruturando uma constante chamada body vindo do body.req (criado no passo anterior dentro do arquivo **index.js**) e implementando somente a lógica de criação de um usuário na função.

Dessa forma, nosso arquivo **UserController.js**, fica da seguinte forma:

```jsx
const users = require('../mocks/users');

module.exports = {
  listUsers(req, res) {
    const { order } = req.query;
    const sortedUsers = users.sort((a, b) => {
      if (order === 'desc') {
        return a.id < b.id ? 1 : -1;
      }
      return a.id > b.id ? 1 : -1;
    });

    res.send(200, sortedUsers);
  },

  getUserById(req, res) {
    const { id } = req.params;
    const user = users.find(user => user.id === Number(id));

    if (!user) {
      return res.send(400, { error: 'User not found' });
    }

    res.send(200, user);

  },

  createUser(req, res) {
    const { body } = req;
    const lastUserId = users[users.length - 1].id;
    const newUser = {
      id: lastUserId + 1,
      name: body.name,
      age: body.age,
      phone: body.phone,
      email: body.email,
      occupation: body.occupation,
      preferences: body.preferences
    }

    users.push(newUser);

    res.send(200, newUser);
  }
}
```

![Untitled](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/1bb935de-da56-4224-ad2b-28f42fbbbaad/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20211020%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211020T195935Z&X-Amz-Expires=86400&X-Amz-Signature=d7399d0b6ba15206fd2e0ad76778c8d123020950251ca8e2bbb257e8bfed3b08&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22)

Criando um novo usuário com o método POST, capturando seu body. No lado direito, o status code 200 informa que o request foi concluído com sucesso.

![Untitled](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/df791962-b3d8-4fa1-821f-4599ab7a36f1/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20211020%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211020T195944Z&X-Amz-Expires=86400&X-Amz-Signature=acce6c28b2054ec55d77853fae0a64532cb1a512f37111303bad7efe1dd3c5a5&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22)

Listando os usuários cadastrados com o método GET.

### 8 - Rotas de Edição e Deleção

Para finalizar nossa API, falta somente criar as rotas de edição e deleção, para conseguirmos alterar os dados dos usuários quando for necessário, bem como excluir algum usuário.
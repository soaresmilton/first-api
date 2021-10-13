# Criando a primeira API

Esse repositório é construído com base no módulo 01 do curso JStack, da Dev Academy. Nosso objetivo, é criar uma API utilizando os recursos nativos do NODE.JS, de forma a aprender e entender os seus conceitos básicos para conseguir criar API's robustas no futuro.

---

# Tecnologias usadas

- Node.js

---

# A API

Essa é uma API de contatos, criada com o intuito de fornecer os principais dados de um contato/ cliente para serem consumidos em um front end que será criado futuramente em outro repositório. 

*Formato básico da API:*

```json
{
		"name": "Milton",
		"lastname": "Soares",
		"age": 25,
		"phone": 35998571018,
		"email": "eng.milton.soares@gmail.com",
		"role": "Desenvolvedor de Software'",
    "preferences": ["Livros", "Games", "Coding", "Filmes"]
}
```

## OBSERVAÇÕES E ANOTAÇÕES IMPORTANTES

### 1 - Criando a rotas para listar usuários

nessa especificação, o método end de uma resposta HTTP, sempre deverá receber seus dados  em formato de string. Por isso, utilizamos o JSON.stringify para transformar os dados em formato JSON para uma string.

```jsx
if(req.url === '/users' && req.method === 'GET') {
	res.writeHead(200, { 'Content-Type': 'application/json' });
	res.end(JSON.stringify(users));
}
```
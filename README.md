## Endpoints
### **POST/developers**
* Cria um desenvolvedor contendo os seguintes dados: 
  * **name**,
  * **email**
* Não é possível criar um novo desenvolvedor com email já cadastrado.

### **GET/developers**
* Retorna uma lista de desenvolvedores cadastrados na aplicação e o relacionamento com developer_infos.

### **GET/developers/:id**
* Retorna o desenvolvedor passado por 'id'. Retornando o relacionamento com developer_infos.

### **GET/developers/:id/projects**
* Retorna uma lista de todos os projetos de um desenvolvedor. As informações do projeto são enviadas caso existam.

### **PATCH/developers/:id**
* Atualiza os dados do desenvolvedor passado por 'id'.
  
### **DELETE/developers/:id**
 * Exclui o desenvolvedor passado por 'id'.
 
### **POST/developers/:id/infos**
* Cadastra as informações adicionais do desenvolvedor passado por 'id' contendo os seguinte dados: 
 * **developerSince**
 * **preferredOS**
* Não é possível cadastrar novas informações para desenvolvedor que já tenha infromações cadastradas.
 
### **PATCH/developers/:id/infos**
* Atualiza as informações do desenvolvedor passado por 'id'.
 
### **POST/projects**
* Cria um novo projeto com os seguintes dados: 
  * **name**,
  * **description**,
  * **estimatedTime**,
  * **repository**,
  * **startDate**,
  * **developerId**

### **GET/projects**
* Retorna uma lista com todos os projetos. As tecnologias dos projetos são enviadas caso existam.

### **GET/projects/:id**
* Retorna o projeto passado por 'id'. As tecnologias são enviadas caso existam.

### **PATCH/projects/:id**
* Atualiza o projeto passado por 'id'.

### **DELETE/projects/:id**
* Exclui o projeto passado por 'id'.

### **POST /projects/:id/technologies**
* Cadastra uma tecnologia para o projeto passado por 'id' contendo o **name** da tecnologia de acordo com a seguinte lista: 
  * JavaScript,
  * Python,
  * React,
  * Express.js,
  * HTML,
  * CSS,
  * Django,
  * PostgreSQL,
  * MongoDB

 ### **DELETE /projects/:id/technologies/:name**
 * Exclui a tecnologia passada em 'name' do projeto passado por 'id'.



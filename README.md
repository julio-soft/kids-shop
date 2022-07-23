# Kids-Shop

## Tabla de contenido

- [Introducción](#introducción)
- [Ejecutar](#ejecutar)
- [Modelos de la Base de Datos](#bd)
- [API REST](#apit)
- [License](#license)

## Introducción

Una API Rest que provee las funcionalidades básicas de un ecommerce usando Node js, Express js, y Sequelize.

NOTA: Lea la sección EJECUTAR para iniciar el servicio correctamente.
## Ejecutar

### 1. Clonar repositorio


```
$ git clone https://github.com/julio-soft/kids-shop.git
$ cd kids-shop
$ npm install
```

### 2. Setup MySQL

Para el desarrollo de la solución se utilizó MySQL como base de dato.

### 3. Cree el fichero .env

Para ejecutar esta aplicación, debe configurar sus propias variables de entorno. Por razones de seguridad, algunas variables se ocultaron y se usaron como variables de entronos con la ayuda del paquete dotenv. **Cree el fichero .env en la carpet raíz del proyecto**. A continuación se muestran las variables que debe configurar para ejecutar la aplicación:

- MYSQL_HOST: Dirección del host de la base de datos MySQL.

- MYSQL_USER: Usuario para acceder a la bd. Ejemplo: admin

- MYSQL_PASSWORD: Contraseña asociada al usario.

- MYSQL_DB: Nombre de la BD donde se guardarán los datos. Debe crearse antes de iniciar el servicio.

- PORT: Especifica el puerto http donde va a escuchar el servicio REST.

Ejemplo de fichero .env: 

```
MYSQL_HOST=localhost
MYSQL_USER=admin
MYSQL_PASSWORD=password
MYSQL_DB=shop
PORT=3000
```

### 4. Run commands
La solución contiene dos commands. Puede ejecutar uno u otro según prefiera.

- Ejecuta y levantar el servico por default en el puerto 3000.
```
$ npm run start
```

- Ejecuta una batería de pruebas unitarias y de integración (en total 30 test). Las pruebas se ejecutan secuencialmente para asegurar que los test sean predecibles.
```
$ npm run test
```

NOTA: Cada commands elimina y crea las tablas en la BD. Luego de ello hace una carga inicial de datos.

## BD

Todos los modelos se pueden encontra en la carpeta /src/models

### User Schema:

- username (String)
- email (String)
- password (String)

### Role Schema:

- name (String)

### Product Schema:

- sku (String) (Llave primaria)
- name (String)
- stock (Integer)
- price (Double)
- description (Text)
- additional_information (Text)

### Category Schema:

- name (String)

### Tag Schema:

- name (String) 

### Image Schema:

- url (String) 

### Valoracion Schema:

- stars (double) 
- comments (Text)

### Sele Schema (Modelo de ventas):

- sele_price (double)    

NOTA: Para mas detalles, como la relación entre los modelos ir a la definición de los modelos.

## API

Toda la **documentación** de la API REST se encuentra publicada en el siguiente link: 

- https://documenter.getpostman.com/view/22248415/UzXKWJp1  

En el siguiente link puede acceder al **workspace publico** de la API en **POSTMAN**:
- https://www.postman.com/jcgoza97/workspace/kids-shop-api  


**IMPORTANTE**: En cada petición enviada a la api debe proporcionar el token devuelto por el endpoint de autenticación; en el formato de una cabecera http la cual es:  **x-access-token**

Ejemplo x-access-token: token

Las rutas y sus configuraciones se encuentran en la carpeta ./src/routes/  
Los controlladores para cada una de las rutas estan en la carpeta ./src/controllers

### - Roles

La solucion consta de 3 roles basicos: admin (Administrador del sistema), moderator (El editor del ecommerce) y user (Son los clientes registrados en el sistema). Se estableció el esquema de autorización basado solo en estos 3 roles para dar una solución mas simple. 

NOTA: Al levantar el proyecto estos roles se crean automaticamente en el sistema.

### - Usarios

Los siguientes usuarios son cargados a la BD automáticamente y pueden ser usados desde un inicio.

- Usuario: admin Password: admin
- Usuario: moderator Password: moderator
- Usuario: user Password: user

## License

[![License](https://img.shields.io/:License-MIT-blue.svg?style=flat-square)](http://badges.mit-license.org)

- MIT License
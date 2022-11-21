//Importar bibliotecas
const express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
const path = require('path');
const passport = require("passport");
require("./config/auth")(passport);
//Carregando módulos
const loginRouter = require('./routes/loginRoutes');
const gestorRouter = require('./routes/gestorRoutes');
const medicoRouter = require('./routes/medicoRoutes');
const medicoConvRouter = require('./routes/medicoConvRoutes');
const atletaRouter = require('./routes/atletaRoutes');
const recuperarSenhaRoutes = require('./routes/recuperarSenhaRoutes')

//Chama a o express criando uma nova aplicação dentro da variavel app
const app = express();
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'download')));

//Rotas
app.use('/login', loginRouter);
app.use('/', gestorRouter);
app.use('/medico', medicoRouter);
app.use('/medicoConv', medicoConvRouter);
app.use('/atleta', atletaRouter);
app.use('/recuperarSenha', recuperarSenhaRoutes)

//Inicializa Servidor
const port = 3001;
app.listen(port, () => {
    console.log(`Servidor escutando em http://localhost:${port}`)
});

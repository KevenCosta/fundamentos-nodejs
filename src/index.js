
const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const express = require ('express');
const app = express();
var porta = require('../normalizaPorta');
app.use(express.json());

const customers = [];

function verifyCPF(req, res, next){
    const { cpf } = req.headers;
    const customer = customers.find((customer) => customer.cpf === cpf);
    if(!customer){
        return res.status(400).json({erro: "Customer not found!"})
    }
    req.customer = customer;
    return next();
};
function getBalance(statement){
    
    const balance = statement.reduce((acc, operation)=>{
        if(operation.type === 'credit'){
            return acc+operation.amount;
        }else{
            return acc - operation.amount;
        }
    }, 0)
    return balance;
}
app.post('/account', (req, res)=>{
    const {cpf, name} = req.body;
    const cExistBool = customers.some(
        (customers) => customers.cpf === cpf//=== compara valor e tipo
    )
    if(cExistBool){
        return res.status(400).json({ erro: "Customer already exists!"})
    }
    const id = uuidv4();
    customers.push({
        cpf,
        name,
        id,// = id:uuidv4() *apaga const id
        statement: []
    });
    return res.status(201).send();
});

app.get('/statement', verifyCPF,(req, res)=>{
    const {customer} = req;
    return res.json(customer.statement);
});

app.post('/deposit', verifyCPF, (req, res) => {
    const {description, amount} = req.body;
    const {customer} = req;
    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: "credit"
    }
    customer.statement.push(statementOperation);
    return res.status(201).send();
})

app.post('/withdraw', verifyCPF,(req, res)=>{
    const {amount} = req.body;
    const {customer} = req;
    const balance = getBalance(customer.statement);
    if(balance < amount){
        return res.status(400).json({erro: "Insufficient funds!"})
    }
    const statementOperation = {
        amount,
        created_at: new Date(),
        type: "debit"
    }
    customer.statement.push(statementOperation);
    return res.status(201).send();
})

app.get('/statement/date', verifyCPF,(req, res)=>{
    const {customer} = req;
    const {date} = req.query;
    const dateFormat = new Date(date+" 00:00");
    const statement = customer.statement.filter((statement)=> 
        statement.created_at.toDateString()=== new Date(dateFormat).toDateString())

    return res.json(statement);
});

/**app.put('/ola/:id', (req, res)=>{
    const params = req.params; //const {id} = req.params;
    console.log(params);//console.log(id);
    return res.json({message: "put"})
});**/
app.put('/account', verifyCPF,(req, res)=>{
    const {name}= req.body; //const {id} = req.params;
    const {customer} = req//console.log(id);
    customer.name = name;
    return res.status(201).send();
});

app.get('/account', verifyCPF, (req,res)=>{
    const {customer} = req;
    return res.json(customer);
})

app.delete('/account', verifyCPF, (req,res)=>{
    const {customer}= req;
    customers.splice(customer, 1);
    return res.status(200).json(customers);
})

app.get('/balance',verifyCPF,(req,res)=>{
    const {customer}=req
    const balance = getBalance(customer.statement);
    return res.json(balance);
})

//Fechamento
var portaOpen = porta(process.env.PORT || '8081');
app.listen(portaOpen, function(){
console.log('Conectado na porta: '+portaOpen)});
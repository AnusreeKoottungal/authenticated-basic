const port = process.env.port || 3000;
const express = require('express');
//const bodyParser = require('body-parser');

const app = express();
app.use(express.json());
const USERNAME = "XOTest";
const PASSWORD = "Welcome1";
const employees = [
    { id: 2, name: 'employee2' },
    { id: 1, name: 'employee1' },
    { id: 4, name: 'employee4' },
    { id: 3, name: 'employee3' }
  ];

app.get('/employee', (req, res) => {
    console.log('Requesting');
    console.log(req.body);
    if(authenticate(req, res)){
        res.json(employees);
    }
});
app.get('/employee/:id', (req, res) => {
    if(authenticate(req, res)){
        employees.forEach((employee, index, emps) => {
            console.log([employee, index, emps]);
            if(employee.id.toString() === req.params.id){
                res.json(employee);
            } else if(index === emps.length-1){
                res.status(404);
                res.send('Employee not found');
            }
        });
    }
});
app.post('/employee', (req, res) => {
    if(authenticate(req, res)){
        employees.forEach((employee, index, emps) => {
            console.log([employee, index, emps]);
            if(employee.id === req.body.id){
                res.status(400);
                res.send('Another employee exists for the same id');
            } else if(index === emps.length-1){
                console.log('match not found');
                employees.push(req.body);
                res.json(employees[index+1]);
            }
        });
    }
});

app.patch('/employee/:id', (req, res) => {
    if(authenticate(req, res)){
        employees.forEach((employee, index, emps) => {
            console.log([employee, index, emps]);
            if(employee.id.toString() === req.params.id){
                employee.name = req.body.name;
                res.json(employee);
            } else if(index === emps.length-1){
                res.status(404);
                res.send();
            }
        });
    }
});

app.put('/employee', (req, res) => {
    if(authenticate(req, res)){
        employees.forEach((employee, index, emps) => {
            console.log([employee, index, emps]);
            if(employee.id === req.body.id){
                console.log('match found');
                employee.name = req.body.name;
                res.json(employee);
            } else if(index === emps.length-1){
                console.log('match not found');
                employees.push(req.body);
                res.json(employees[index+1]);
            }
        });
    }
});

app.delete('/employee/:id', (req, res) => {
    if(authenticate(req, res)){
        console.log(req.params.id);
        const matchfound = 0;
        employees.forEach((employee, index, emps) => {
            console.log([employee, index, emps]);
            if(employee.id.toString() === req.params.id){
                console.log('match found!');
                emps.splice(index,1);
                res.status(204);
                res.send();
            } else if(index === emps.length-1){
                res.status(404);
                res.send();
            }
        });
        
    }
});

function authenticate(req, res) {
    const auth = req.headers.authorization;
    if(auth){
        const base64Credentials =  auth.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [username, password] = credentials.split(':');
        if(username === USERNAME && password === PASSWORD){
            return true;
        } else{
            res.status(401);
            res.send();
        }
    }
    else{
        res.status(401);
        res.send();
    }
    return false;
}

app.listen(port, ()=> { console.log('App is listening in port ' + port);});
const express=require('express');
const mustacheExpress=require('mustache-express');
const bodyParser=require('body-parser');
const app=express();
const mustache=mustacheExpress();
const {Client} = require('pg');

mustache.cache=null;


app.engine('mustache',mustache);
app.set('view engine','mustache');


app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));

app.get('/add',(req,res)=>{
    res.render('products-form');
});



app.post('/products/add',(req,res)=>{
    console.log('post body',req.body);

    const client=new Client({
        user:'postgres',
        host:'localhost',
        database:'runner',
        password:'test123',
        port:5432,
    });
    client.connect().then(()=>{
        console.log('Connection complete');
        const sql='INSERT INTO products(name,category,price,description) VALUES($1,$2,$3,$4)';
        const params=[req.body.name,req.body.category,req.body.price,req.body.description];
        return client.query(sql,params);
    }).then((result)=>{
        console.log('results?',result);
        res.redirect('/products');
    });

});


app.get('/dashboard',(req,res)=>{

    const client=new Client({
        user:'postgres',
        host:'localhost',
        database:'runner',
        password:'test123',
        port:5432,
    });
    client.connect().then(()=>{
        return client.query("SELECT COUNT(*) FROM products WHERE category LIKE 'Shoes'; SELECT COUNT(*) FROM products WHERE category LIKE 'Watches'");

    }).then((results)=>{
        console.log('results?',results[0]);
        console.log('results?',results[1]);
        res.render('dashboard',{n1:results[0].rows,n2:results[1].rows});
    });


});





app.get('/shoes',(req,res)=>{

    const client=new Client({
        user:'postgres',
        host:'localhost',
        database:'runner',
        password:'test123',
        port:5432,
    });
    client.connect().then(()=>{
        return client.query("SELECT * FROM products WHERE category LIKE 'Shoes'");

    }).then((results)=>{
        console.log('results?',results);
        res.render('shoes',results);
    });



});


app.get('/watches',(req,res)=>{

    const client=new Client({
        user:'postgres',
        host:'localhost',
        database:'runner',
        password:'test123',
        port:5432,
    });
    client.connect().then(()=>{
        return client.query("SELECT * FROM products WHERE category LIKE 'Watches'");

    }).then((results)=>{
        console.log('results?',results);
        res.render('watches',results);
    });



});



app.get('/products',(req,res)=>{

    const client=new Client({
        user:'postgres',
        host:'localhost',
        database:'runner',
        password:'test123',
        port:5432,
    });
    client.connect().then(()=>{
        return client.query('SELECT * FROM products');

    }).then((results)=>{
        console.log('results?',results);
        res.render('products',results);
    });


});


app.post('/products/delete/:id',(req,res)=>{
    const client=new Client({
        user:'postgres',
        host:'localhost',
        database:'runner',
        password:'test123',
        port:5432,
    });

    client.connect().then(()=>{
        const sql='DELETE FROM products WHERE pid=$1';
        const params=[req.params.id];
        return client.query(sql,params);

    }).then((results)=>{
        res.redirect('/products');
    });

});


app.get('/products/edit/:id',(req,res)=>{

    const client=new Client({
        user:'postgres',
        host:'localhost',
        database:'runner',
        password:'test123',
        port:5432,
    });
    client.connect().then(()=>{
        const sql='SELECT * FROM products WHERE pid=$1';
        const params=[req.params.id];
        return client.query(sql,params);

    }).then((results)=>{

        res.render('products-edit',{prod:results.rows[0]});
    });


});


app.post('/products/edit/:id',(req,res)=>{
    const client=new Client({
        user:'postgres',
        host:'localhost',
        database:'runner',
        password:'test123',
        port:5432,
    });

    client.connect().then(()=>{
        const sql='UPDATE products SET name=$1,category=$2, price=$3, description=$4 WHERE pid=$5';
        const params=[req.body.name,req.body.category,req.body.price,req.body.description,req.params.id];
        return client.query(sql,params);

    }).then((results)=>{
        res.redirect('/products');
    });

});






app.listen(5001,()=> {
    console.log('Listening to port 5001');
})



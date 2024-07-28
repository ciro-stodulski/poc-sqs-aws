CREATE DATABASE poc;

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    type VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    operation VARCHAR(10) NOT NULL,
    quantity INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    status VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (type, name, quantity) 
    VALUES ('banana', 'banana_split', 1000),
        ('chocolate', 'bolo de chocolate', 1000),
        ('salgado', 'coxinha', 1000);



select count(*) from transactions where status = 'success';
select count(*) from transactions where status = 'error';

drop table products;
drop table transactions;
CREATE DATABASE dindin;

CREATE TABLE usuarios (
	id serial primary key,
  nome text not null,
  email text not null unique,
  senha text not null
);

CREATE TABLE categorias (
	id serial primary key,
  descricao text
);

CREATE TABLE transacoes (
	id serial primary key,
  descricao text,
  valor integer,
  data timestamptz,
  categoria_id integer references categorias(id),
  usuario_id integer references usuarios(id),
  tipo text not null
);

INSERT INTO categorias (descricao)
VALUES ('Alimentação'),
('Assinaturas e Serviços'),
('Casa'),
('Mercado'),
('Cuidados Pessoais'),
('Educação'),
('Família'),
('Lazer'),
('Pets'),
('Presentes'),
('Roupas'),
('Saúde'),
('Transporte'),
('Salário'),
('Vendas'),
('Outras receitas'),
('Pix'),
('Outras despesas');
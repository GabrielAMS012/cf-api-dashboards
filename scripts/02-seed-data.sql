-- Inserir dados de exemplo para LOJAS
INSERT INTO lojas (codigo, nome, bandeira, cidade, uf, bairro, data_inauguracao, status) VALUES
('001', 'Supermercado Central', 'Rede A', 'São Paulo', 'SP', 'Centro', '2020-01-15', true),
('002', 'Mercado do Bairro', 'Rede B', 'Rio de Janeiro', 'RJ', 'Copacabana', '2019-06-20', true),
('003', 'Super Família', 'Rede C', 'Belo Horizonte', 'MG', 'Savassi', '2021-03-10', true),
('004', 'Mercadinho da Esquina', 'Rede A', 'Salvador', 'BA', 'Pelourinho', '2018-11-05', true),
('005', 'Hipermercado Norte', 'Rede D', 'Fortaleza', 'CE', 'Aldeota', '2022-08-12', true);

-- Inserir dados de exemplo para OSCS
INSERT INTO oscs (nome, cnpj, responsavel, email, bairro, cidade, uf, ipa_code, data_inicio, data_vencimento, status) VALUES
('Instituto Alimentar Solidário', '12.345.678/0001-90', 'Maria Silva Santos', 'contato@alimentarsolidario.org.br', 'Vila Madalena', 'São Paulo', 'SP', 'IPA001', '2022-03-15', '2024-12-31', true),
('Rede Contra Fome', '98.765.432/0001-10', 'João Carlos Oliveira', 'admin@redecontrafome.org', 'Copacabana', 'Rio de Janeiro', 'RJ', 'IPA002', '2021-08-20', '2025-06-30', true),
('Associação Prato Cheio', '11.222.333/0001-44', 'Ana Paula Costa', 'contato@pratocheio.org.br', 'Savassi', 'Belo Horizonte', 'MG', 'IPA003', '2023-01-10', '2024-09-15', true),
('Fundação Mesa Brasil', '55.666.777/0001-88', 'Carlos Eduardo Lima', 'fundacao@mesabrasil.org', 'Pelourinho', 'Salvador', 'BA', 'IPA004', '2020-11-05', '2025-03-20', true),
('ONG Nutrir Comunidade', '33.444.555/0001-22', 'Fernanda Rodrigues', 'nutrir@comunidade.org.br', 'Água Verde', 'Curitiba', 'PR', 'IPA005', '2022-07-18', '2024-11-10', true),
('Instituto Vida Verde', '77.888.999/0001-33', 'Roberto Santos', 'contato@vidaverde.org.br', 'Asa Norte', 'Brasília', 'DF', 'IPA006', '2021-05-12', '2025-01-15', true),
('Associação Mãos Solidárias', '44.555.666/0001-77', 'Lucia Fernandes', 'maos@solidarias.org.br', 'Boa Viagem', 'Recife', 'PE', 'IPA007', '2020-09-08', '2024-08-30', true),
('Fundação Esperança', '22.333.444/0001-55', 'Pedro Oliveira', 'fundacao@esperanca.org.br', 'Centro', 'Manaus', 'AM', 'IPA008', '2023-02-20', '2025-12-31', true);

-- Inserir dados de exemplo para CAMPANHAS
INSERT INTO campanhas (nome, descricao, data_inicio, data_fim) VALUES
('Campanha Solidária 2024', 'Campanha de arrecadação de alimentos para famílias em situação de vulnerabilidade', '2024-01-01', '2024-12-31'),
('Natal Solidário 2024', 'Campanha especial de Natal para distribuição de cestas básicas', '2024-11-01', '2024-12-25');

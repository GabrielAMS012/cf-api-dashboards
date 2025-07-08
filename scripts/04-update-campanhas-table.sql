-- Atualizar tabela de campanhas para incluir criador
ALTER TABLE campanhas ADD COLUMN IF NOT EXISTS criador TEXT NOT NULL DEFAULT 'Sistema';

-- Atualizar campanhas existentes com um criador padrão
UPDATE campanhas SET criador = 'Administrador' WHERE criador = 'Sistema';

-- Inserir algumas campanhas de exemplo com criador
INSERT INTO campanhas (nome, criador, descricao, data_inicio, data_fim) VALUES
('Campanha Natal Solidário 2024', 'Maria Silva', 'Campanha especial de Natal para distribuição de cestas básicas e brinquedos', '2024-11-01', '2024-12-25'),
('Campanha Páscoa Solidária 2024', 'João Santos', 'Distribuição de ovos de páscoa para crianças carentes', '2024-03-15', '2024-04-15'),
('Campanha Volta às Aulas 2024', 'Ana Costa', 'Arrecadação de material escolar para estudantes em vulnerabilidade', '2024-01-15', '2024-02-29')
ON CONFLICT (nome) DO NOTHING;

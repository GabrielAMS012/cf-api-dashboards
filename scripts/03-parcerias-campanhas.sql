-- Criar tabela para Parcerias por Campanha
CREATE TABLE parcerias_campanhas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campanha_id UUID REFERENCES campanhas(id) ON DELETE CASCADE,
  loja_id UUID REFERENCES lojas(id) ON DELETE CASCADE,
  osc_id UUID REFERENCES oscs(id) ON DELETE CASCADE,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'Ativa' CHECK (status IN ('Ativa', 'Concluída')),
  created_at TIMESTAMP DEFAULT now(),
  
  -- Constraint para evitar duplicatas
  UNIQUE (campanha_id, loja_id, osc_id),
  
  -- Constraint para validar datas
  CHECK (data_fim >= data_inicio)
);

-- Índices para melhor performance
CREATE INDEX idx_parcerias_campanhas_campanha_id ON parcerias_campanhas(campanha_id);
CREATE INDEX idx_parcerias_campanhas_loja_id ON parcerias_campanhas(loja_id);
CREATE INDEX idx_parcerias_campanhas_osc_id ON parcerias_campanhas(osc_id);
CREATE INDEX idx_parcerias_campanhas_status ON parcerias_campanhas(status);
CREATE INDEX idx_parcerias_campanhas_data_fim ON parcerias_campanhas(data_fim);

-- Função para atualizar status automaticamente baseado na data
CREATE OR REPLACE FUNCTION update_parceria_campanha_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualizar status baseado na data atual
  IF NEW.data_fim < CURRENT_DATE THEN
    NEW.status = 'Concluída';
  ELSE
    NEW.status = 'Ativa';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar status automaticamente
CREATE TRIGGER trigger_update_parceria_campanha_status
  BEFORE INSERT OR UPDATE ON parcerias_campanhas
  FOR EACH ROW
  EXECUTE FUNCTION update_parceria_campanha_status();

-- Inserir dados de exemplo
INSERT INTO parcerias_campanhas (campanha_id, loja_id, osc_id, data_inicio, data_fim) 
SELECT 
  c.id as campanha_id,
  l.id as loja_id,
  o.id as osc_id,
  '2024-02-01'::date as data_inicio,
  '2024-11-30'::date as data_fim
FROM campanhas c, lojas l, oscs o
WHERE c.nome = 'Campanha Solidária 2024'
  AND l.codigo = '001'
  AND o.nome = 'Instituto Alimentar Solidário'
LIMIT 1;

INSERT INTO parcerias_campanhas (campanha_id, loja_id, osc_id, data_inicio, data_fim) 
SELECT 
  c.id as campanha_id,
  l.id as loja_id,
  o.id as osc_id,
  '2024-01-15'::date as data_inicio,
  '2024-06-30'::date as data_fim
FROM campanhas c, lojas l, oscs o
WHERE c.nome = 'Campanha Solidária 2024'
  AND l.codigo = '002'
  AND o.nome = 'Rede Contra Fome'
LIMIT 1;

-- LOJAS
CREATE TABLE lojas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo VARCHAR(20) UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  bandeira TEXT,
  cidade TEXT,
  uf VARCHAR(2),
  bairro TEXT,
  data_inauguracao DATE,
  status BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT now()
);

-- OSCS
CREATE TABLE oscs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  cnpj VARCHAR(18) UNIQUE NOT NULL,
  responsavel TEXT,
  email TEXT,
  bairro TEXT,
  cidade TEXT,
  uf VARCHAR(2),
  ipa_code TEXT,
  data_inicio DATE,
  data_vencimento DATE,
  status BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT now()
);

-- PARCERIAS (associação entre LOJAS e OSCS)
CREATE TABLE parcerias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loja_id UUID REFERENCES lojas(id) ON DELETE CASCADE,
  osc_id UUID REFERENCES oscs(id) ON DELETE CASCADE,
  favorita BOOLEAN DEFAULT FALSE,
  status BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE (loja_id, osc_id)
);

-- CAMPANHAS
CREATE TABLE campanhas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT,
  data_inicio DATE,
  data_fim DATE,
  created_at TIMESTAMP DEFAULT now()
);

-- CAMPANHA → LOJA
CREATE TABLE campanhas_lojas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campanha_id UUID REFERENCES campanhas(id) ON DELETE CASCADE,
  loja_id UUID REFERENCES lojas(id) ON DELETE CASCADE,
  UNIQUE (campanha_id, loja_id)
);

-- CAMPANHA → LOJA → OSC
CREATE TABLE campanhas_lojas_oscs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campanha_id UUID REFERENCES campanhas(id) ON DELETE CASCADE,
  loja_id UUID REFERENCES lojas(id) ON DELETE CASCADE,
  osc_id UUID REFERENCES oscs(id) ON DELETE CASCADE,
  favorita BOOLEAN DEFAULT FALSE,
  UNIQUE (campanha_id, loja_id, osc_id)
);

-- Índices para melhor performance
CREATE INDEX idx_lojas_codigo ON lojas(codigo);
CREATE INDEX idx_lojas_status ON lojas(status);
CREATE INDEX idx_lojas_uf ON lojas(uf);
CREATE INDEX idx_oscs_cnpj ON oscs(cnpj);
CREATE INDEX idx_oscs_status ON oscs(status);
CREATE INDEX idx_oscs_uf ON oscs(uf);
CREATE INDEX idx_parcerias_loja_id ON parcerias(loja_id);
CREATE INDEX idx_parcerias_osc_id ON parcerias(osc_id);
CREATE INDEX idx_parcerias_status ON parcerias(status);
CREATE INDEX idx_campanhas_lojas_campanha_id ON campanhas_lojas(campanha_id);
CREATE INDEX idx_campanhas_lojas_loja_id ON campanhas_lojas(loja_id);
CREATE INDEX idx_campanhas_lojas_oscs_campanha_id ON campanhas_lojas_oscs(campanha_id);
CREATE INDEX idx_campanhas_lojas_oscs_loja_id ON campanhas_lojas_oscs(loja_id);
CREATE INDEX idx_campanhas_lojas_oscs_osc_id ON campanhas_lojas_oscs(osc_id);

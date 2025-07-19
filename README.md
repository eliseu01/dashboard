# 📊 Dashboard de Descongelamento – PulseMinds (Filial 7)

Repositório com o código-fonte de um **dashboard analítico** voltado para o monitoramento e previsão de dados de descongelamento da Filial 7 da PulseMinds. Este sistema é voltado para análises preditivas, relatórios operacionais e insights baseados em séries temporais.

## 🧠 Objetivo

O objetivo principal deste projeto é auxiliar na **tomada de decisões operacionais**, fornecendo visualizações gráficas e predições de comportamento futuro com base em dados históricos e inteligência de dados.

## 🚀 Tecnologias Utilizadas

- **Python 3.11+**
- **Pandas** – manipulação de dados
- **Prophet (Meta)** – modelagem e previsão de séries temporais
- **Plotly / Matplotlib** – visualização gráfica
- **Streamlit** – construção do dashboard interativo
- **Concurrent.futures** – execução paralela

## 📁 Estrutura do Projeto

├── data/
│ └── [arquivo CSV com os dados]
├── log/
│ └── StockLogger.py
├── model/
│ └── Prophet.py
├── policies/
│ └── stock.py
├── dashboard.py
├── requirements.txt
└── README.md


## 📈 Funcionalidades

- 📂 Importação e limpeza de dados
- 📉 Previsão de consumo/estoque com Prophet
- 🧩 Simulação de cenários e testes
- ⚙️ Execução paralela de simulações
- 📊 Visualizações claras e interativas com Streamlit

## 💡 Como Executar Localmente

1. Clone o repositório:


git clone https://github.com/eliseu01/dashboard.git
cd dashboard 

Crie e ative um ambiente virtual:
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

Instale as dependências:
pip install -r requirements.txt

Execute o dashboard:

bash
Copiar
Editar
streamlit run dashboard.py

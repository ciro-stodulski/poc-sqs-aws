# Teste de caraga com o Sistema de Mensagens Baseado em SQS (AWS)

### Objetivo do Teste
O objetivo deste teste é avaliar a performance e a consistência de um sistema de mensagens baseado em SQS para registrar transações de produtos em um banco de dados, sob diferentes configurações de fila.

### Configuração Inicial
- **Arquitetura:**
  - Um serviço foi criado para receber as requisições e enviá-las para o SQS.
  - Outro serviço foi criado para consumir as mensagens do SQS e gravar as transações no banco de dados.
  - Os serviços utilizados estão disponíveis no seguinte repositório: [poc-sqs-aws](https://github.com/ciro-stodulski/poc-sqs-aws).

- **Banco de Dados:**
  - 3 produtos registrados, cada um com uma quantidade inicial de 1000.
  - Tabela de transações pronta para registro.
  - Banco de dados Postgres.

- **Teste:**
  - 4000 requisições disparadas, com 100 requisições em paralelo por segundo.
  - Dados aleatórios dos produtos para cada grupo de requisições.
  - **Critérios de Sucesso:**
    - Quantidade na tabela de produtos deve ser zerada.
    - Registro de 3000 transações com sucesso e 1000 com falha.

## Cenários de Teste

### Primeiro Cenário: SQS sem FIFO

**Descrição:**
Neste cenário, utilizamos uma fila SQS sem FIFO para processar as requisições.

**Configuração:**
- SQS: Padrão (sem FIFO)

**Resultados:**
- Quantidade dos produtos não foi zerada.
- 4000 registros de transações com sucesso, sem falhas.

### Segundo Cenário: SQS FIFO com uma instância

**Descrição:**
Neste cenário, utilizamos uma fila SQS FIFO com Group ID por tipo de produto, processando as requisições com uma única instância.

**Configuração:**
- SQS: FIFO
- Group ID: Por tipo de produto

**Resultados:**
- Quantidade dos produtos zerada.
- 3000 registros de transações com sucesso e 1000 com falha.


### Terceiro Cenário: SQS FIFO com quatro instâncias

**Descrição:**
Neste cenário, utilizamos uma fila SQS FIFO com quatro instâncias (quatro consumidores) para processar as requisições.

**Configuração:**
- SQS: FIFO
- Group ID: Por tipo de produto
- Instâncias: 4

**Resultados:**
- Quantidade dos produtos zerada.
- 3000 registros de transações com sucesso e 1000 com falha.


## Conclusão

**Comparação dos Resultados:**
- O uso de SQS FIFO garantiu a consistência desejada nas transações, enquanto o SQS sem FIFO não conseguiu manter a consistência esperada.

**Lições Aprendidas:**
- A importância de utilizar filas FIFO para garantir a ordem e a consistência das mensagens em sistemas críticos.

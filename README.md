# Teste de Carga com o Sistema de Mensagens Baseado em SQS (AWS)

### Objetivo do Teste
O objetivo deste teste é avaliar a performance e a consistência de um sistema de mensagens baseado em SQS para registrar transações de produtos em um banco de dados, sob diferentes configurações de fila.

### Configuração Inicial
- **Arquitetura:**
  - Um serviço foi criado para receber as requisições e enviá-las para o SQS.
  - Outro serviço foi criado para consumir as mensagens do SQS e gravar as transações no banco de dados.
  - Os serviços utilizados estão disponíveis no seguinte repositório: [poc-sqs-aws](https://github.com/ciro-stodulski/poc-sqs-aws).
- **Pré-requisitos:**
  - Docker e Docker Compose instalados.
  - Para iniciar os serviços e o banco de dados, execute o Docker Compose na pasta `consumer` e configure o MySQL com o script [mysql.sql](https://github.com/ciro-stodulski/poc-sqs-aws/blob/develop/consumer/mysql.sql).
- **Banco de Dados:**
  - 3 produtos registrados, cada um com uma quantidade inicial de 1000.
  - Tabela de transações pronta para registro.
  - Banco de dados MySQL.
- **Teste:**
  - Para disparar as requisições em cargas, utilize o script de estresse disponível em [stress.sh](https://github.com/ciro-stodulski/poc-sqs-aws/blob/develop/producer/stress.sh).
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

**Diagrama:**
![image](https://github.com/user-attachments/assets/ead3c1da-d241-48c6-84f4-377ab1e70bf2)

**Resumo:**
Este teste foi o mais rápido em termos de tempo de execução. No entanto, ele não garantiu um processamento eficiente em cenários de concorrência, resultando em uma quantidade incorreta de produtos no banco de dados ao utilizar 4 instâncias.

### Segundo Cenário: SQS FIFO com uma instância

**Descrição:**
Neste cenário, utilizamos uma fila SQS FIFO com Group ID por tipo de produto, processando as requisições com uma única instância.

**Configuração:**
- SQS: FIFO
- Group ID: Por tipo de produto
- Instâncias: 1

**Resultados:**
- Quantidade dos produtos zerada.
- 3000 registros de transações com sucesso e 1000 com falha.

**Diagrama:**
![image](https://github.com/user-attachments/assets/e717b488-562e-4f4c-8ceb-bb5f9ea74872)

**Resumo:**
Este teste garantiu a consistência dos dados, com a quantidade correta de produtos e transações no banco de dados. No entanto, o processamento com uma única instância resultou em um tempo de execução menos eficiente.

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

**Diagrama:**
![image](https://github.com/user-attachments/assets/87a41022-7152-4fac-b35c-73594331d584)

**Resumo:**
Este teste obteve sucesso, garantindo a consistência dos dados e um tempo de resposta eficiente. A utilização de 4 instâncias permitiu um processamento paralelo eficiente, enquanto a configuração de Group ID do SQS FIFO assegurou a ordenação correta das mensagens, evitando problemas de concorrência.

## Conclusão

**Comparação dos Resultados:**
- O uso de SQS FIFO garantiu a consistência desejada nas transações, enquanto o SQS sem FIFO não conseguiu manter a consistência esperado sem o uso de lock pessimista no banco de dados para tratar a concorrência, evitando assim alto processamento demasiado no banco de dados.
- 
**Lições Aprendidas:**
- A importância de utilizar filas FIFO para garantir a ordem e a consistência das mensagens em sistemas críticos.


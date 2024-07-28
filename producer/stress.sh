#!/bin/bash

# Número total de mensagens
total_messages=4000

# Número de processos paralelos
parallel_jobs=100

# Valores alternados para `type`
types=("banana" "chocolate" "salgado")

# Valores alternados para `product_id`
product_ids=(1 2 3)

# Função para gerar um número de usuário aleatório
random_user_id() {
  echo $((RANDOM % 1000 + 1))
}

# Função para enviar uma mensagem usando curl
send_message() {
  local type=$1
  local product_id=$2
  local quantity=$3
  local user_id=$4
  
  curl --silent --location 'http://localhost:3001/purchase' \
       --header 'Content-Type: application/json' \
       --data "{
           \"type\": \"$type\",
           \"product_id\": $product_id,
           \"quantity\": $quantity,
           \"user_id\": $user_id
       }" > /dev/null
}

# Enviar as mensagens
for ((i=1; i<=total_messages; i++))
do
  # Escolher valores aleatórios
  type=${types[$((i % ${#types[@]}))]}
  product_id=${product_ids[$((i % ${#product_ids[@]}))]}
  quantity=1
  user_id=$(random_user_id)

  # Enviar a mensagem em paralelo
  send_message "$type" "$product_id" "$quantity" "$user_id" &
  
  # Controlar o número de processos paralelos
  if (( i % parallel_jobs == 0 )); then
    wait
  fi
done

# Esperar que todos os processos terminem
wait
Funcionalidade: Cadastro de Colaboradores

CT-013 - Criar colaborador com gestor definido

Cenário: Criar colaborador com gestor
Dado que existe um gestor cadastrado
E existe um time cadastrado
Quando criar um colaborador informando nome, time e gestor
Então o colaborador deve ser criado com sucesso

--------------------------------------------------

CT-014 - Criar colaborador sem gestor

Cenário: Criar colaborador sem gestor
Dado que existe um time cadastrado
Quando criar um colaborador sem informar gestor
Então o colaborador deve ser criado com sucesso

--------------------------------------------------

CT-015 - Editar colaborador existente

Cenário: Alterar dados de um colaborador
Dado que existe um colaborador cadastrado
Quando alterar suas informações
E salvar as alterações
Então os novos dados devem ser persistidos

--------------------------------------------------

CT-016 - Excluir colaborador

Cenário: Excluir colaborador existente
Dado que existe um colaborador cadastrado
Quando solicitar sua exclusão
Então o colaborador não deve mais aparecer na listagem

--------------------------------------------------

CT-017 - Alterar time de um colaborador

Cenário: Transferir colaborador entre times
Dado que existem dois times cadastrados
E existe um colaborador associado ao primeiro time
Quando alterar seu time para o segundo time
Então a associação deve ser atualizada corretamente

--------------------------------------------------

CT-018 - Alterar gestor de um colaborador

Cenário: Trocar gestor direto
Dado que existem dois gestores cadastrados
E existe um colaborador associado ao primeiro gestor
Quando alterar seu gestor para o segundo gestor
Então a nova associação deve ser salva corretamente

--------------------------------------------------

CT-019 - Criar colaborador sem time

Cenário: Criar colaborador sem informar time
Dado que o usuário está na tela de Colaboradores
Quando tentar salvar um colaborador sem time associado
Então o sistema deve impedir o cadastro
E exibir mensagem de validação

--------------------------------------------------

CT-020 - Utilizar colaborador em um ciclo

Cenário: Participação em ciclo através do time
Dado que existe um colaborador associado a um time
E existe um ciclo que inclui esse time
Quando o ciclo for iniciado
Então o colaborador deve participar do processo de avaliação
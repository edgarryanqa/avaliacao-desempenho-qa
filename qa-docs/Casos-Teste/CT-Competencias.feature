Funcionalidade: Cadastro de Competências

CT-001 - Criar competência com nome válido

Cenário: Criar competência com nome válido
Dado que o usuário está na tela de Competências
Quando informar um nome válido
E salvar o cadastro
Então a competência deve ser criada com sucesso
E deve ser exibida na listagem

--------------------------------------------------

CT-002 - Tentar criar competência sem nome

Cenário: Criar competência sem preencher nome
Dado que o usuário está na tela de Competências
Quando tentar salvar uma competência sem nome
Então o sistema deve impedir o cadastro
E exibir mensagem de validação

--------------------------------------------------

CT-003 - Editar competência existente

Cenário: Editar competência existente
Dado que existe uma competência cadastrada
Quando alterar seu nome
E salvar
Então a alteração deve ser persistida

--------------------------------------------------

CT-004 - Excluir competência

Cenário: Excluir competência
Dado que existe uma competência cadastrada
Quando solicitar sua exclusão
Então a competência não deve mais aparecer na listagem

--------------------------------------------------

CT-005 - Associar competência a um ciclo

Cenário: Utilizar competência em um ciclo
Dado que existe uma competência cadastrada
E existe um ciclo em criação
Quando selecionar a competência no ciclo
E salvar o ciclo
Então a competência deve ser associada corretamente ao ciclo



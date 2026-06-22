Funcionalidade: Cadastro de Times

CT-006 - Criar time sem time superior

Cenário: Criar time raiz
Dado que o usuário está na tela de Times
Quando cadastrar um novo time sem informar um time superior
Então o time deve ser criado com sucesso
E deve aparecer na listagem

--------------------------------------------------

CT-007 - Criar time com time superior

Cenário: Criar time filho
Dado que existe um time cadastrado
Quando criar um novo time vinculando-o ao time superior
Então o relacionamento hierárquico deve ser salvo corretamente

--------------------------------------------------

CT-008 - Editar time existente

Cenário: Editar informações de um time
Dado que existe um time cadastrado
Quando alterar suas informações
E salvar as alterações
Então os dados devem ser atualizados com sucesso

--------------------------------------------------

CT-009 - Excluir time existente

Cenário: Excluir time
Dado que existe um time cadastrado
Quando solicitar sua exclusão
Então o registro deve ser removido da listagem

--------------------------------------------------

CT-010 - Criar múltiplos níveis hierárquicos

Cenário: Criar estrutura hierárquica de times
Dado que existe um time raiz cadastrado
Quando criar um segundo time vinculado ao time raiz
E criar um terceiro time vinculado ao segundo time
Então a estrutura hierárquica deve ser mantida corretamente

--------------------------------------------------

CT-011 - Tentar criar time sem nome

Cenário: Criar time sem preencher nome
Dado que o usuário está na tela de Times
Quando tentar salvar um time sem preencher o nome
Então o sistema deve impedir o cadastro
E exibir mensagem de validação

--------------------------------------------------

CT-012 - Utilizar time em um ciclo

Cenário: Associar time a um ciclo
Dado que existe um time cadastrado
E existe um ciclo em criação
Quando selecionar o time como participante do ciclo
E salvar o ciclo
Então o time deve ser associado corretamente ao ciclo

-------------------------------------------------

Cobertura desses cenários
Caso	Tipo
CT-006	Funcional Positivo
CT-007	Funcional / Hierarquia
CT-008	Funcional
CT-009	Funcional
CT-010	Regra de Negócio
CT-011	Negativo
CT-012	Integração com Ciclos

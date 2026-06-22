Funcionalidade: Avaliações

CT-031 - Gerar autoavaliação para colaborador

Cenário: Gerar autoavaliação ao iniciar ciclo
Dado que existe um ciclo ativo
E existe um colaborador participante
Quando as avaliações forem geradas
Então deve ser criada uma autoavaliação para o colaborador

--------------------------------------------------

CT-032 - Gerar avaliação do gestor direto

Cenário: Gerar avaliação do gestor
Dado que existe um colaborador com gestor definido
E existe um ciclo ativo
Quando as avaliações forem geradas
Então deve ser criada uma avaliação para o gestor direto

--------------------------------------------------

CT-033 - Não gerar avaliação de gestor para colaborador sem gestor

Cenário: Colaborador sem gestor
Dado que existe um colaborador sem gestor associado
E existe um ciclo ativo
Quando as avaliações forem geradas
Então nenhuma avaliação de gestor deve ser criada

--------------------------------------------------

CT-034 - Gerar avaliações entre colegas do mesmo time

Cenário: Avaliação entre pares
Dado que existem colaboradores no mesmo time
E existe um ciclo ativo
Quando as avaliações forem geradas
Então avaliações entre pares devem ser criadas para os colaboradores elegíveis

--------------------------------------------------

CT-035 - Responder avaliação com notas válidas

Cenário: Preencher avaliação corretamente
Dado que existe uma avaliação disponível
Quando informar notas entre 1 e 5 para todas as competências
E salvar a avaliação
Então a avaliação deve ser registrada com sucesso

--------------------------------------------------

CT-036 - Informar nota abaixo do limite mínimo

Cenário: Nota menor que 1
Dado que existe uma avaliação disponível
Quando informar nota igual a 0
Então o sistema deve impedir o salvamento
E exibir mensagem de validação

--------------------------------------------------

CT-037 - Informar nota acima do limite máximo

Cenário: Nota maior que 5
Dado que existe uma avaliação disponível
Quando informar nota igual a 6
Então o sistema deve impedir o salvamento
E exibir mensagem de validação

--------------------------------------------------

CT-038 - Responder avaliação fora do período do ciclo

Cenário: Avaliação fora da vigência
Dado que o período do ciclo está encerrado
Quando tentar responder uma avaliação
Então o sistema deve bloquear a ação

--------------------------------------------------

CT-039 - Salvar avaliação parcialmente preenchida

Cenário: Competência sem nota
Dado que existe uma avaliação disponível
Quando deixar pelo menos uma competência sem nota
E tentar salvar a avaliação
Então o sistema deve impedir o salvamento
E informar os campos obrigatórios

--------------------------------------------------

CT-040 - Validar associação correta entre avaliador e avaliado

Cenário: Conferir participantes da avaliação
Dado que as avaliações foram geradas
Quando consultar os registros criados
Então o avaliador e o avaliado devem corresponder às regras definidas pelo ciclo
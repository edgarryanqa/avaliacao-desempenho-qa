Funcionalidade: Relatórios

CT-041 - Gerar relatório de ciclo concluído

Cenário: Consultar relatório de um ciclo encerrado
Dado que existe um ciclo concluído
Quando acessar a tela de relatórios
Então os resultados do ciclo devem ser exibidos corretamente

--------------------------------------------------

CT-042 - Validar cálculo da média final do colaborador

Cenário: Conferir média das avaliações recebidas
Dado que existem avaliações respondidas para um colaborador
Quando consultar o relatório de resultados
Então a média exibida deve corresponder às notas registradas

--------------------------------------------------

CT-043 - Validar aplicação dos pesos das competências

Cenário: Relatório com pesos habilitados
Dado que o ciclo utiliza pesos por competência
Quando consultar o relatório final
Então os cálculos devem considerar os pesos configurados

--------------------------------------------------

CT-044 - Validar relatório sem pesos configurados

Cenário: Relatório com pesos desabilitados
Dado que o ciclo não utiliza pesos por competência
Quando consultar o relatório final
Então o cálculo deve considerar peso igual para todas as competências

--------------------------------------------------

CT-045 - Exibir colaborador sem avaliações concluídas

Cenário: Colaborador sem respostas registradas
Dado que existe um colaborador participante do ciclo
E não existem avaliações respondidas para ele
Quando consultar o relatório
Então a situação deve ser apresentada corretamente

--------------------------------------------------

CT-046 - Validar consistência dos dados apresentados

Cenário: Conferir informações do relatório
Dado que existe um relatório gerado
Quando visualizar os resultados
Então os nomes dos colaboradores devem estar corretos
E as competências avaliadas devem estar corretas
E as notas exibidas devem corresponder aos registros existentes

--------------------------------------------------

CT-047 - Filtrar relatório por colaborador

Cenário: Consultar resultado individual
Dado que existe mais de um colaborador no relatório
Quando filtrar por um colaborador específico
Então apenas as informações do colaborador selecionado devem ser exibidas

--------------------------------------------------

CT-048 - Acessar relatório inexistente

Cenário: Consultar relatório não encontrado
Dado que o relatório solicitado não existe
Quando tentar acessá-lo
Então o sistema deve apresentar uma mensagem apropriada ao usuário
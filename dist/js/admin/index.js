var app = angular.module("aplicacao", ['ngCookies']);

app.controller("Rest", function ($scope, $cookies, $http, $q, $compile) {
    
    var dataAtual = new Date(); // Obtém a data atual
    var diaAtual = dataAtual.getDay()
    var mesAtual = dataAtual.getMonth() + 1; // Obtém o mês atual (0-11)
    var anoAtual = dataAtual.getFullYear(); // Obtém o ano atual
    var diaCadastroAgenda = undefined;
    $scope.mesDescricao = retornaMes(mesAtual);
    $('#agendamentoTag').addClass('tagAtiva')

    $('#btE').prop("disabled", true);
    $('#btD').prop("disabled", true);

    // Função para exibir o mês anterior
    $scope.anteriorMes = function() {
        $('#btE').prop("disabled", true);
        $('#btD').prop("disabled", true);
        mesAtual--;
        if (mesAtual < 1) {
            mesAtual = 12;
            anoAtual--;
        }
        criarCalendario()
        .then(function() {
            $scope.mesDescricao = retornaMes(mesAtual);
            insereDadosTabela($scope.dados);
        });
    }

    // Função para exibir o próximo mês
    $scope.proximoMes = function() {
        $('#btE').prop("disabled", true);
        $('#btD').prop("disabled", true);
        mesAtual++;
        if (mesAtual > 12) {
            mesAtual = 1;
            anoAtual++;
        }
        criarCalendario()
        .then(function() {
            $scope.mesDescricao = retornaMes(mesAtual);
            insereDadosTabela($scope.dados);
        });
    }

    $scope.adicionaRequisicao = function(day) {
        var authorization = $cookies.get('autorization');
        var req = {
          method: "POST",
          url: hostBack+"/api/agenda/adicionarAgendamento",
          headers: {'Authorization': authorization, 'DiasSemana': $('#checkBox').is(':checked')},
          data: {
            dataAgendamento: moment(anoAtual+'-'+(mesAtual).toString().padStart(2, '0')+'-'+diaCadastroAgenda.toString().padStart(2, '0'))
          }
        }
        $http(req).then(function (data) {
            $scope.calendario = criarCalendario();
            buscarConteudo()
            if($('#checkBox').is(':checked')){
                $('#checkBox').prop('checked', false);
            }
        },function error(){
            $('#checkBox').prop('checked', false);
        });
        
    };

    function retornaMes(mes) {
        mes = mes;
        if (mes < 1 || mes > 12) {
            return "Mês inválido";
        }
    
        const meses = [
            "","Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho",
            "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];
    
        return meses[mes];
    }
    
      // Função para criar a estrutura de dados do calendário
    function criarCalendario() {
        return new Promise(function(resolve, reject) {
            var calendario = [];
            var primeiroDia = new Date(anoAtual, mesAtual-1, 1).getDay();
            var primeiroDiaProximoMes = new Date(anoAtual, mesAtual-1, 1);
            var ultimoDia = new Date(primeiroDiaProximoMes - 1).getDate(); // Obtém o último dia do mês
            var linha = [];
            for (var i = 0; i < primeiroDia; i++) {
                linha.push(' ');
            }

            for (var day = 1; day <= ultimoDia; day++) {
                linha.push(day);

                if (linha.length === 7) {
                calendario.push(linha);
                linha = [];
                }
            }

            if (linha.length > 0) {
                calendario.push(linha);
            }

            ultimaColuna = -calendario[calendario.length-1].length + 7;
            for(var i = 0; i < ultimaColuna; i++){
                calendario[calendario.length-1].push(' ');
            }
            $scope.calendario = calendario;
            resolve();
        });
    }

    criarCalendario().then(function(){
        buscaDados()
    });

    function buscaDados() {
        var deferred = $q.defer();
        var authorization = $cookies.get('autorization');
        var req = {
          method: "GET",
          url: hostBack+"/api/admin/listaAgendamentos",
          headers: {'Authorization': authorization},
        }
        $http(req).then(function (data) {
            deferred.resolve(data)
            $scope.dados = data.data;
            insereDadosTabela(data.data)
        },function error(){
            deferred.reject([]);
        });

        return deferred.promise;
    }

    function insereDadosTabela(dados){
            // var enumAgendamento = {
            //     0: 'Agu. Confir',
            //     1: 'Confirmado',
            //     2: 'Cancelado'
            //   };
            dados.forEach(element => {
                var data = moment(element.dataAgendamento, 'YYYY-MM-DD');
                var dia = data.format('DD');
                var mes = data.format('MM');
                var ano = data.format('YYYY');
                if(parseInt(mes) == parseInt(mesAtual) && parseInt(ano) == parseInt(anoAtual)){
                    var minhaDiv = $('<div>', {class:'conteudo_obs'});
                    if(element.confirmacao){
                        var meuH1 = $('<h3>', { text: 'Agendado - '+element.nomeUser, class:'h3true' });
                    }else{
                        var meuH1 = $('<h3>', { text: 'Agendado - '+element.nomeUser, class:'h3false' });
                    }
                    minhaDiv.append(meuH1);
                    $('#'+parseInt(dia)).append(minhaDiv);
                }
            });
        $('[id][id=" "]').css('color', 'red').parent().removeAttr('data-target');
        $('[id][id=" "]').css('color', 'red').parent().css('background-color', '#80808045');
        $('[id][id=" "]').css('color', 'red').parent().removeAttr('ng-click');
        $('[id][id=" "]').css('color', 'red').parent().css('cursor', 'auto');
        $('#btE').prop("disabled", false);
        $('#btD').prop("disabled", false);
    }

    $scope.setarDia = function(diaCadastro){
        diaCadastroAgenda = diaCadastro;
    }

    function buscaDadosUser() {
        var deferred = $q.defer();
        var authorization = $cookies.get('autorization');
    
        var req = {
          method: "GET",
          url: hostBack+"/api/agenda/buscaDadosUsuario",
          headers: {'Authorization': authorization},
        }
        $http(req).then(function (data) {
            $('#userNome').text(data.data.nome);
        },function error(){
            $('#userNome').text("");
        });
    }

    buscaDadosUser();

    $scope.alteraTag = function (tag){
        if(tag == 'agendamentoTag'){
            $('#pagamentoTag').removeClass('tagAtiva');
            $('#historicoTag').removeClass('tagAtiva');
            $('#agendamentoTag').addClass('tagAtiva');
        }
        if(tag == 'pagamentoTag'){
            $('#agendamentoTag').removeClass('tagAtiva');
            $('#historicoTag').removeClass('tagAtiva');
            $('#pagamentoTag').addClass('tagAtiva');
        }
        if(tag == 'historicoTag'){
            $('#pagamentoTag').removeClass('tagAtiva');
            $('#agendamentoTag').removeClass('tagAtiva');
            $('#historicoTag').addClass('tagAtiva');
        }
    }
    
    $('#historico').on('hidden.bs.modal', function (e) {
        $scope.alteraTag('agendamentoTag');
    })
    $('#pagamentos').on('hidden.bs.modal', function (e) {
        $scope.alteraTag('agendamentoTag');
    })

    $scope.checkAgendamento = function(id, index){
        var authorization = $cookies.get('autorization');
        $('#check').removeClass("bi bi-check-all pointer");
        $('#check').addClass("spinner-border");
    
        var req = {
          method: "POST",
          url: hostBack+"/api/admin/atualizaAgendamento/"+id,
          headers: {'Authorization': authorization},
        }
        $http(req).then(function (data) {
            var dataFormatada = moment(data.data.dataAgendamento, 'YYYY-MM-DD');
            var dia = dataFormatada.format('DD');
            
            $scope.dados.filter(function(elemento){
                if(elemento.id === id){
                    elemento.confirmacao = true;
                }
            })
            $('#'+parseInt(dia)+' .conteudo_obs h3').removeClass('h3false').addClass('h3true');
            $('#check').removeClass("spinner-border");
        },function error(){
            $('#check').removeClass("spinner-border");
            $('#check').addClass("bi bi-check-all pointer");
        });
    }
});


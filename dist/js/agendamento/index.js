var app = angular.module("aplicacao", ['ngCookies']);

app.controller("Rest", function ($scope, $cookies, $http, $q, $compile) {
    
    const socket = new SockJS('http://localhost:8081/websocket');
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, function (frame) {
        console.log('Connected to WebSocket');

        stompClient.subscribe('/topic/messages', function (message) {
            removeDadosTabela();
            insereDadosTabela(JSON.parse(message.body));
        });
    });
    
    var dataAtual = new Date(); // Obtém a data atual
    var diaAtual = dataAtual.getDay()
    var mesAtual = dataAtual.getMonth()+1; // Obtém o mês atual (0-11)
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
            insereDadosTabela($scope.dados);
            watchTagCreation();
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
            insereDadosTabela($scope.dados);
            watchTagCreation();
        });
    }

    $scope.adicionaRequisicao = function(day) {
        if(!$('#'+$scope.diaCadastroAgenda+' .conteudo_obs').length){
            var authorization = $cookies.get('autorization');
            var req = {
            method: "POST",
            url: hostBack+"/api/agenda/adicionarAgendamento",
            headers: {'Authorization': authorization, 'DiasSemana': $('#checkBox').is(':checked')},
            data: {
                dataAgendamento: moment(anoAtual+'-'+(mesAtual).toString().padStart(2, '0')+'-'+$scope.diaCadastroAgenda.toString().padStart(2, '0'))
            }
            }
            $http(req).then(function (data) {
                // criarCalendario();
                buscaDados();
                if($('#checkBox').is(':checked')){
                    $('#checkBox').prop('checked', false);
                }
            },function error(){
                $('#checkBox').prop('checked', false);
            });
        }else{
            excluirRequisicao();
        }
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
            $scope.mesDescricao = retornaMes(mesAtual);
            var calendario = [];
            var primeiroDia = new Date(anoAtual, mesAtual-1, 1).getDay();
            var primeiroDiaProximoMes = new Date(anoAtual, mesAtual-1, 1);
            var ultimoDia = new Date(primeiroDiaProximoMes - 1).getDate(); // Obtém o último dia do mês
            var linha = [];

            for (var i = 0; i < primeiroDia; i++) {
                linha.push(' - ');
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
                calendario[calendario.length-1].push(' - ');
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
          url: hostBack+"/api/agenda/listaAgendamentos",
          headers: {'Authorization': authorization},
        }
        $http(req).then(function (data) {
            removeDadosTabela();
            deferred.resolve(data)
            $scope.dados = data.data;
            insereDadosTabela(data.data)
        },function error(){
            deferred.reject([]);
        });

        return deferred.promise;
    }

    // function insereDadosTabela(dados){
    //         // var enumAgendamento = {
    //         //     0: 'Agu. Confir',
    //         //     1: 'Confirmado',
    //         //     2: 'Cancelado'
    //         //   };
    //         dados.forEach(element => {
    //             var data = moment(element.dataAgendamento, 'YYYY-MM-DD');
    //             var dia = data.format('DD');
    //             var mes = data.format('MM');
    //             var ano = data.format('YYYY');
    //             if(parseInt(mes) == parseInt(mesAtual) && parseInt(ano) == parseInt(anoAtual)){
    //                 var minhaDiv = $('<div>', {class:'conteudo_obs'});
    //                 if(element.confirmacao){
    //                     var meuH1 = $('<h3>', { text: 'Agendado', class:'h3true', 'data-info': element.id });
    //                 }else{
    //                     var meuH1 = $('<h3>', { text: 'Agendado', class:'h3false', 'data-info': element.id  });
    //                 }
    //                 minhaDiv.append(meuH1);
    //                 $('#'+parseInt(dia)).append(minhaDiv);
    //             }
    //         });
    //     $('[id][id=" "]').css('color', 'red').parent().removeAttr('data-target');
    //     $('[id][id=" "]').css('color', 'red').parent().css('background-color', '#80808045');
    //     $('[id][id=" "]').css('color', 'red').parent().removeAttr('ng-click');
    //     $('[id][id=" "]').css('color', 'red').parent().css('cursor', 'auto');
    //     $('#btE').prop("disabled", false);
    //     $('#btD').prop("disabled", false);
    // }

    function insereDadosTabela(dados){
            dados.forEach(element => {
            var data = moment(element.dataAgendamento, 'YYYY-MM-DD');
            var dia = data.format('DD');
            var mes = data.format('MM');
            var ano = data.format('YYYY');
                if(parseInt(mes) == parseInt(mesAtual) && parseInt(ano) == parseInt(anoAtual)){
                    var minhaDiv = $('<div>', {class:'conteudo_obs'});
                    if(element.confirmacao){
                        var meuH1 = $('<span class="anotacao-green">');
                    }else{
                        var meuH1 = $('<span class="anotacao">');
                    }
                    minhaDiv.append(meuH1);
                    $('#'+parseInt(dia)).append(minhaDiv);
                }
            });
        $('[id][id=" - "]').css('color', 'red').parent().removeAttr('data-target');
        $('[id][id=" - "]').css('color', 'red').parent().css('background-color', '#80808045');
        $('[id][id=" - "]').css('color', 'red').parent().removeAttr('ng-click');
        $('[id][id=" - "]').css('color', 'red').parent().css('cursor', 'auto');
        $('#btE').prop("disabled", false);
        $('#btD').prop("disabled", false);
    }
    

    $scope.setarDia = function(diaCadastro){
        if($('#'+diaCadastro+' .conteudo_obs').length){
            $('#tituloAgendar').text('Excluir agendamento')
            $('#corpoModal').hide();
            $('#corpoEditarModal').show();
        }else{
            $('#tituloAgendar').text('Agendamento')
            $('#corpoEditarModal').hide();
            $('#corpoModal').show();
        }
        $scope.diaCadastroAgenda = diaCadastro;
        $('#myModal').modal('show');
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

    function excluirRequisicao(){
        var authorization = $cookies.get('autorization');
        var req = {
          method: "DELETE",
          url: hostBack+"/api/agenda/excluirAgendamento/"+$('#'+$scope.diaCadastroAgenda+' .conteudo_obs').find('h3').attr('data-info'),
          headers: {'Authorization': authorization, 'DiasSemana': $('#checkBox').is(':checked')},
          data: {
            dataAgendamento: moment(anoAtual+'-'+(mesAtual+1).toString().padStart(2, '0')+'-'+$scope.diaCadastroAgenda.toString().padStart(2, '0'))
          }
        }
        $http(req).then(function (data) {
            criarCalendario();
            buscarConteudo()
            if($('#checkBox').is(':checked')){
                $('#checkBox').prop('checked', false);
            }
        },function error(){
            $('#checkBox').prop('checked', false);
        });
    }

    function removeDadosTabela(){
        $(".conteudo_obs").remove();
    }

    function adicionaNomeSemanaCalendario() {
        var dias = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
        var colunas = $(".conteudo");

        for (var i = 0; i < colunas.length; i++) {
          var dia = dias[i % 7]; 
          var h1Element = $("<h1></h1>");
          h1Element.text(dia);
          
          $(colunas[i]).prepend(h1Element);
        }
    }

      

    function watchTagCreation() {
        var intervalId = setInterval(function() {
          if ($(".conteudo").length > 0) {
            clearInterval(intervalId);
            adicionaNomeSemanaCalendario();
          }
        }, 10);
      }
    watchTagCreation();
});


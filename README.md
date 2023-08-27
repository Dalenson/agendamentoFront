
# Aplicação produzida para realizar agendamentos de horários.
Serviço desenvolvido para praticar o desenvolvimento de aplicações WEB.
## Stack utilizada

**Front-end:** 
Express: Utilizado como framework web para a construção da estrutura do aplicativo.
Gulp: Utilizado como task runner para automatizar tarefas de construção e otimização.
Sass: Utilizado como pré-processador de CSS para facilitar a estilização e manutenção do design.
Cors: Utilizado para lidar com políticas de segurança de origem cruzada e permitir comunicação entre diferentes domínios.
Moment: Utilizado para manipulação e formatação de datas e horários.
Cookie-parser: Utilizado para analisar cookies HTTP no servidor.
WebSockets: Através do uso de WebSockets, o aplicativo "Fisio" é capaz de estabelecer comunicações bidirecionais em tempo real, possibilitando interações dinâmicas e atualizações instantâneas entre o servidor e o cliente.

Tela de login e de agendamento!

![image](https://github.com/Dalenson/agendamentoFront/assets/108817919/dc734e5a-743e-46f8-96b5-aaeaf1464543)
![image](https://github.com/Dalenson/agendamentoFront/assets/108817919/aa203bf6-a73f-4364-aa4e-82d9cda3b052)


##Conceito
O sistema tinha por finalidade realizar o cadastro de usuários onde os mesmos teriam como adicionar agendamentos e realizar o acompanhamento deles pelo sistema.
O sistema também teria uma pagina administradora onde o admin conseguiria aceitar o agendamente ou rejeitar.
Foi realizado também a implementação de um Web-Socket para mandar a comunicação com relação as datas iguais para todos os usuarios conectados ao servidor, para que não tivesse problemas quanto a visualização de dias vagos que não estariam vagos naquele momento.

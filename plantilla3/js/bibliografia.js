/**
 * Created by usuario on 03/10/2017.
 */
// Inicia o jQuery
jQuery(function ($) {
    $('.tabs-menu ul li a').click(function () {

        /** Variáveis **/

            // Configura o link clicado
        var a = $(this);

        // A classe da aba ativa
        var active_tab_class = 'active-tab-menu';

        // Captura o atributo data-tab e gera uma classe
        var the_tab = '.' + a.attr('data-tab');

        // Remove a classe de aba ativa de todas as abas
        $('.tabs-menu ul li a').removeClass(active_tab_class);

        // Adiciona a classe de aba ativa apenas no link clicado
        a.addClass(active_tab_class);

        // Adiciona um CSS para ocultar todas as abas
        $('.tabs-content .tabs').css({
            'display': 'none'
        });

        // Mostra apenas a aba que queremos
        $(the_tab).show();

        // Não deixa o navegador atualizar a página
        return false;
    });
});

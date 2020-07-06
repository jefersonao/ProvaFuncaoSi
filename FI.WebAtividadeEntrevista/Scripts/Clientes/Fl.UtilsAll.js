//Preenche endereco Pelo Cep 
$(document).ready(function () {

    setMascaras();
    validateForm();

});

//Cpf e novo
$('#CPF').change(function () {
    ///Verificar se alteração ou inclusao
    var alter = false;
    alter = $('#alter').val();

    var cpf = $('#CPF').val().replace(/\./g, '').replace(/\-/g, '');
    $.ajax({
        type: "POST",
        data: { cpf: cpf, alter: alter },
        url: '/cliente/CpfnewValid',
        dataType: 'json',
        success: function (json) {
            switch (json) {
                case 0:
                    $("#lblErroCpf").remove();
                    $('#CPF').addClass('error');
                    $('#CPF').after('<label id="lblErroCpf" class="error">*Cpf Inválido!</label>');
                    $('#CPF').html('mismatch');
                    $('#CPF')[0].setCustomValidity('*Cpf Inválido!');
                    break;
                case 1:
                    $("#lblErroCpf").remove();
                    $('#CPF').addClass('error');
                    $('#CPF').after('<label id="lblErroCpf" class="error">*Cpf já cadastrado!</label>');
                    $('#CPF').html('mismatch');
                    $('#CPF')[0].setCustomValidity('Cpf já cadastrado!');
                    break;
                default:
                    $("#lblErroCpf").remove();
                    $('#CPF').removeClass('error');
                    $('#CPF').html('match');
                    $('#CPF')[0].setCustomValidity('');
            }
        }
    });

});


function setMascaras() {
    //Mascaras
    // CPF
    $('#CPF').mask('999.999.999-99');
    $('#CPFBnf').mask('999.999.999-99');
    // CEP
    $('#CEP').mask('99999-999');

    $('#Telefone').mask("(99) 9999-9999?9")
        .focusout(function (event) {
            var target, phone, element;
            target = (event.currentTarget) ? event.currentTarget : event.srcElement;
            phone = target.value.replace(/\D/g, '');
            element = $(target);
            element.unmask();
            if (phone.length > 10) {
                element.mask("(99) 99999-9999");
            } else {
                element.mask("(99) 9999-99999");
            }
            element.attr('maxlength', '17');
        });

}

function limpa_formulário() {
    // Limpa valores do formulário de cep.
    $("#rua").val("");
    //$("#bairro").val("");
    $("#cidade").val("");
    $("#uf").val("");
    $("#ibge").val("");
}

$("#formCadastro").submit(function () {
    //Gravar sem Mascaras
    $('#CPF').unmask();
    $('#CEP').unmask();
    $('#Telefone').unmask();

});

//Quando o campo cep perde o foco.
$("#CEP").blur(function () {

    //Nova variável "cep" somente com dígitos.
    var cep = $(this).val().replace(/\D/g, '');

    //Verifica se campo cep possui valor informado.
    if (cep != "") {

        //Expressão regular para validar o CEP.
        var validacep = /^[0-9]{8}$/;

        //Valida o formato do CEP.
        if (validacep.test(cep)) {
            //Preenche os campos com "..." enquanto consulta webservice.
            $("#rua").val("...");
            //$("#bairro").val("...");
            $("#cidade").val("...");
            $("#uf").val("...");
            $("#ibge").val("...");

            //Consulta o webservice viacep.com.br/
            $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function (json) {

                if (!("erro" in json)) {
                    //Atualiza os campos com os valores da consulta.
                    $('#Cidade').val(json.localidade);
                    $('#Logradouro').val(json.logradouro);
                    //$('#bairro').val(json.bairro);
                    $('#Estado').val(json.uf);

                } //end if.
                else {
                    //CEP pesquisado não foi encontrado.
                    limpa_formulário();
                    alert("CEP não encontrado.");
                }
            });
        } //end if.
        else {
            //cep é inválido.
            limpa_formulário();
            alert("Formato de CEP inválido.");
        }
    } //end if.
    else {
        //cep sem valor, limpa formulário.
        limpa_formulário();
    }
});


// VALIDATE FORM
function validateForm() {
    $.validator.messages.required = '* Campo obrigatório';
    $.validator.messages.equalTo = '* Os valores informados não são iguais';
    $.validator.messages.email = '* Informe um formato de e-mail válido';
}

function storeTblValues() {
    var TableData = new Array();

    $('#tblBeneficiarios > tbody > tr').each(function (row, tr) {
        TableData[row] = {
            "Id": 0,
            "IdCliente": 0,
            "CPF": $(tr).find('td:eq(0)').text(),
            "Nome": $(tr).find('td:eq(1)').text()
        }
    });
    console.log(TableData);

    return TableData;
};

$('#btntest').on('click', function () {
    TableData = storeTblValues();
    //storeTblValues();
});

$('#CPFBnf').on('blur', function () {
    if (CpfValido($('#CPFBnf').val())) {

        $("#lblErroCpf").remove();
        $('#CPFBnf').removeClass('error');
        $('#btnIncluirBenef').prop('disabled', false);

    } else {
        $('#btnIncluirBenef').prop('disabled', true);
        $("#lblErroCpf").remove();
        $('#CPFBnf').addClass('error');
        $('#CPFBnf').after('<label id="lblErroCpf" class="error">*Cpf Inválido!</label>');
    }
});

$('#btnIncluirBenef').on('click', function () {

    var idRow = $('#tblBeneficiarios tbody tr').length + 1;
    var htmlRow = '';
    htmlRow = htmlRow + '<tr id="tr_' + idRow + '">';
    htmlRow = htmlRow + '<td id="td_CpfBnf' + idRow + '">' + $('#CPFBnf').val() + '</td>';
    htmlRow = htmlRow + '<td id="td_NomeBnf' + idRow + '">' + $('#NomeBnf').val() + '</td >';
    htmlRow = htmlRow + '<td>';
    htmlRow = htmlRow + '<button type="button" class="btn btn-sm btn-info" onclick="AlterBnf(' + idRow + ');">Alterar</button>';
    htmlRow = htmlRow + '</td>';
    htmlRow = htmlRow + '<td>';
    htmlRow = htmlRow + '<button type="button" class="btn btn-sm btn-info" onclick="$(this).parent().parent().remove();" >Excluir</button>';
    htmlRow = htmlRow + '</td>';
    htmlRow = htmlRow + '</tr>';

    $('#tblBeneficiarios tbody').append(htmlRow);
    $('#CPFBnf').val('');
    $('#NomeBnf').val('');

});

function AlterBnf(idRow) {
    $('#CPFBnf').val($('#td_CpfBnf' + idRow).text());
    $('#NomeBnf').val($('#td_NomeBnf' + idRow).text());
    $('#tr_' + idRow).remove();
}

$('#btnMdBeneficiarios').on('click', function () {
    var idCliente = $('#Id').val();

    if (idCliente != "" && idCliente != undefined) {
        GetBeneficiarios();
    }
    $('#MdBeneficiarios').modal();
});

function GetBeneficiarios() {

    var idCliente = $('#Id').val();

    $.ajax({
        type: "GET",
        data: { idCliente: idCliente },
        url: '/cliente/GetBeneficiarios',
        dataType: 'json',
        success: function (data) {

            $('#tblBeneficiarios tbody').empty();

            jQuery.each(data, function (idRow, bnf) {
                var htmlRow = '';
                htmlRow = htmlRow + '<tr id="tr_' + idRow + '">';
                htmlRow = htmlRow + '<td id="td_CpfBnf' + idRow + '">' + bnf.CPF + '</td>';
                htmlRow = htmlRow + '<td id="td_NomeBnf' + idRow + '">' + bnf.Nome + '</td >';
                htmlRow = htmlRow + '<td>';
                htmlRow = htmlRow + '<button type="button" class="btn btn-sm btn-info" onclick="AlterBnf(' + idRow + ');">Alterar</button>';
                htmlRow = htmlRow + '</td>';
                htmlRow = htmlRow + '<td>';
                htmlRow = htmlRow + '<button type="button" class="btn btn-sm btn-info" onclick="$(this).parent().parent().remove();" >Excluir</button>';
                htmlRow = htmlRow + '</td>';
                htmlRow = htmlRow + '</tr>';

                $('#tblBeneficiarios tbody').append(htmlRow);

            });

            $('#CPFBnf').val('');
            $('#NomeBnf').val('');
        },
        error:
            function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");

            },
    }
    );
};

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}
function CpfValido(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.toString().length != 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    var result = true;
    [9, 10].forEach(function (j) {
        var soma = 0, r;
        cpf.split(/(?=)/).splice(0, j).forEach(function (e, i) {
            soma += parseInt(e) * ((j + 2) - (i + 1));
        });
        r = soma % 11;
        r = (r < 2) ? 0 : 11 - r;
        if (r != cpf.substring(j, j + 1)) result = false;
    });
    return result;
}
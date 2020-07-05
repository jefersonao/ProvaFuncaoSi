//Preenche endereco Pelo Cep 
$(document).ready(function () {

    setMascaras();
    validateForm();

});

function setMascaras() {
    //Mascaras
    // CPF
    $('#CPF').mask('999.999.999-99');
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

$('#btn-success').click(function () {
    e.preventDefault();
    if ($("#formCadastro").valid()) {
        $("#formCadastro").submit();
    }
}
);

$('#btnIncluirBenef').click(function () {
    $.ajax({
        type: "GET",
        data: { idCliente: idCliente },
        url: '/cliente/GetBeneficiarios',
        dataType: 'json',
        success: function (data) {
            $('#tblBeneficiarios').html(data);
        }
    }
});

$('#btnMdBeneficiarios').click(function () {

    GetBeneficiarios();
});

$("#formCadastro").submit(function () {
    //Gravar sem Mascaras
    $('#CPF').unmask();
    $('#CEP').unmask();
    $('#Telefone').unmask();

});

$("#formCadastro").bind('ajax:complete', function () {
    setMascaras();
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

//Cpf e novo
$('#CPF').change(function () {
    ///Verificar se alteração ou inclusao
    var alter = false;
    if (!window.location.pathname.includes('Alterar')) {
        alter = true;
    }

    var cpf = $('#CPF').cleanVal();
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
                    break;
                case 1:
                    $("#lblErroCpf").remove();
                    $('#CPF').addClass('error');
                    $('#CPF').after('<label id="lblErroCpf" class="error">*Cpf já cadastrado!</label>');
                    break;
                default:
                    $("#lblErroCpf").remove();
                    $('#CPF').removeClass('error');
            }
        }
    });

});

// VALIDATE FORM
function validateForm() {
    $.validator.messages.required = '* Campo obrigatório';
    $.validator.messages.equalTo = '* Os valores informados não são iguais';
    $.validator.messages.email = '* Informe um formato de e-mail válido';
}

$('#btnMdBeneficiarios').on('click', function () {
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
            $('#tblBeneficiarios').html(data);
        }
    }
    );
};
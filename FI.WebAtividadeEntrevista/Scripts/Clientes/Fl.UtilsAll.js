//Preenche endereco Pelo Cep 
$(document).ready(function ()
{
    validateForm();
});

function limpa_formulário_cep() {
    // Limpa valores do formulário de cep.
    $("#rua").val("");
    $("#bairro").val("");
    $("#cidade").val("");
    $("#uf").val("");
    $("#ibge").val("");
}

//Quando o campo cep perde o foco.
$("#cep").blur(function () {

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
            $("#bairro").val("...");
            $("#cidade").val("...");
            $("#uf").val("...");
            $("#ibge").val("...");

            $('#formCadastro #Cidade').val(json.Cidade);
            $('#formCadastro #Logradouro').val(json.Logradouro);
            $('#bairro').val(json.bairro);
            $('#Estado').val(Capitular(json.logradouro));
            $("#Estado").empty();
            $('#Estado').append($("<option></option>").attr("value", json.uf).text(json.uf));

            //Consulta o webservice viacep.com.br/
            $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function (json) {

                if (!("erro" in json)) {
                    //Atualiza os campos com os valores da consulta.
                    $('#formCadastro #Cidade').val(json.Cidade);
                    $('#formCadastro #Logradouro').val(json.Logradouro);
                    $('#bairro').val(json.bairro);
                    $('#Estado').val(Capitular(json.logradouro));
                    $("#Estado").empty();
                    $('#Estado').append($("<option></option>").attr("value", json.uf).text(json.uf));
                } //end if.
                else {
                    //CEP pesquisado não foi encontrado.
                    limpa_formulário_cep();
                    alert("CEP não encontrado.");
                }
            });
        } //end if.
        else {
            //cep é inválido.
            limpa_formulário_cep();
            alert("Formato de CEP inválido.");
        }
    } //end if.
    else {
        //cep sem valor, limpa formulário.
        limpa_formulário_cep();
    }
});



// VALIDATE FORM
function validateForm() {

    $('.validateForm').each(function () {
        var jThis = $(this);

        jThis.validate({
            ignore: ".ignore",
            rules: {
                emailRequired: {
                    required: true,
                    email: true
                }
            },
            invalidHandler: function (event, validator) {
                for (var i = 0; i < validator.errorList.length; i++) {
                    var elm = $(validator.errorList[i].element);

                    if (elm.is('select')) {
                        elm.siblings('.chosen-container').find('>a').addClass('error')
                    }
                };
            },
            errorPlacement: function (error, elm) {
                if (elm.is('select')) {
                    error.insertAfter(elm.siblings('.chosen-container'));
                } else if (elm.is('[type=checkbox]')) {
                    error.insertAfter(elm.siblings('label'));
                } else if (elm.is('[type=radio]')) {
                    error.text('* Selecione uma opção')
                    error.insertBefore(elm.siblings('.label'));
                } else {
                    error.insertAfter(elm);
                }
            },
            // ,
            submitHandler: function (form) {

                if (!form.classList.contains('tabForm')) {
                    form.submit();
                }
            }
        });
    });

    $.validator.messages.required = '* Campo obrigatório';
    $.validator.messages.equalTo = '* Os valores informados não são iguais';
    $.validator.messages.email = '* Informe um formato de e-mail válido';
}


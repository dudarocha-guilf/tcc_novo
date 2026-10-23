
(function () {
    const CHAVE_FONTE = "letrikaTamanhoFonte";
    const TAMANHO_PADRAO = 100;
    const TAMANHO_MINIMO = 80;
    const TAMANHO_MAXIMO = 150;
    const PASSO = 10;

    let tamanhoAtual = obterTamanhoSalvo();

    function obterTamanhoSalvo() {
        const salvo = Number(localStorage.getItem(CHAVE_FONTE));

        if (
            !Number.isFinite(salvo) ||
            salvo < TAMANHO_MINIMO ||
            salvo > TAMANHO_MAXIMO
        ) {
            return TAMANHO_PADRAO;
        }

        return salvo;
    }

    function criarControle() {
        if (document.getElementById("letrika-acessibilidade")) return;

        const controle = document.createElement("div");
        controle.id = "letrika-acessibilidade";

        Object.assign(controle.style, {
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "7px",
            width: "fit-content",
            maxWidth: "calc(100vw - 24px)",
            boxSizing: "border-box",
            margin: "16px auto",
            padding: "10px 12px",
            background: "#fff5fa",
            border: "1px solid #edc3d7",
            borderRadius: "14px",
            boxShadow: "0 4px 14px rgba(138,23,79,0.12)",
            color: "#8a174f",
            fontFamily: "Arial, sans-serif",
            fontSize: "14px"
        });

        const titulo = document.createElement("span");
        titulo.textContent = "Acessibilidade";
        Object.assign(titulo.style, {
            fontWeight: "bold",
            color: "#8a174f"
        });
        controle.appendChild(titulo);

        const botoes = [
            { acao: "diminuir", texto: "A−", descricao: "Diminuir tamanho das letras" },
            { acao: "aumentar", texto: "A+", descricao: "Aumentar tamanho das letras" },
            { acao: "restaurar", texto: "↺", descricao: "Restaurar tamanho original" }
        ];

        botoes.forEach(function (item) {
            const botao = document.createElement("button");
            botao.type = "button";
            botao.dataset.acao = item.acao;
            botao.textContent = item.texto;
            botao.setAttribute("aria-label", item.descricao);
            botao.title = item.descricao;

            Object.assign(botao.style, {
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flex: "0 0 auto",
                minWidth: "38px",
                minHeight: "36px",
                padding: "6px 10px",
                border: "1px solid #d98ab0",
                borderRadius: "9px",
                background: "#ffffff",
                color: "#8a174f",
                fontFamily: "Arial, sans-serif",
                fontSize: "15px",
                fontWeight: "bold",
                cursor: "pointer",
                boxSizing: "border-box"
            });

            botao.addEventListener("mouseenter", function () {
                botao.style.background = "#f8d7e3";
            });

            botao.addEventListener("mouseleave", function () {
                botao.style.background = "#ffffff";
            });

            botao.addEventListener("click", function () {
                if (item.acao === "aumentar") {
                    tamanhoAtual = Math.min(
                        TAMANHO_MAXIMO,
                        tamanhoAtual + PASSO
                    );
                } else if (item.acao === "diminuir") {
                    tamanhoAtual = Math.max(
                        TAMANHO_MINIMO,
                        tamanhoAtual - PASSO
                    );
                } else {
                    tamanhoAtual = TAMANHO_PADRAO;
                }

                localStorage.setItem(CHAVE_FONTE, String(tamanhoAtual));
                aplicarTamanho();
            });

            controle.appendChild(botao);
        });

        const valor = document.createElement("span");
        valor.id = "letrika-fonte-valor";
        valor.setAttribute("aria-live", "polite");
        Object.assign(valor.style, {
            color: "#8a174f",
            fontWeight: "bold",
            whiteSpace: "nowrap"
        });
        controle.appendChild(valor);

        const menu = document.querySelector(".topbar");

        if (menu) {
            menu.insertAdjacentElement("afterend", controle);
        } else {
            document.body.prepend(controle);
        }
    }

    function aplicarTamanho() {
        document.documentElement.style.fontSize = tamanhoAtual + "%";

        const valor = document.getElementById("letrika-fonte-valor");
        if (valor) valor.textContent = tamanhoAtual + "%";

        const diminuir = document.querySelector(
            '#letrika-acessibilidade [data-acao="diminuir"]'
        );
        const aumentar = document.querySelector(
            '#letrika-acessibilidade [data-acao="aumentar"]'
        );

        if (diminuir) {
            diminuir.disabled = tamanhoAtual <= TAMANHO_MINIMO;
            diminuir.style.opacity = diminuir.disabled ? "0.45" : "1";
        }

        if (aumentar) {
            aumentar.disabled = tamanhoAtual >= TAMANHO_MAXIMO;
            aumentar.style.opacity = aumentar.disabled ? "0.45" : "1";
        }
    }

    function iniciar() {
        criarControle();
        aplicarTamanho();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar);
    } else {
        iniciar();
    }
})();

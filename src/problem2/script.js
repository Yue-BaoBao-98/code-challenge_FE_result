const $ = document.querySelector.bind(document);

const amount_inp = $('#amount_inp');
const base_currency_inp = $('#base_currency_inp');
const target_currency_inp = $('#target_currency_inp');
const base_currencies_datalist = $('#base_currencies');
const target_currencies_datalist = $('#target_currencies');
const floating_label = $('.floating_label');
const result = $('.result');
const convert_btn = $('.convert_btn');

const currencies_url = 'https://interview.switcheo.com/prices.json';
// const currencies_url = 'https://intrview.switcheo.com/prices.json';

const handle_url = async (url) => {
    //retrieve and handle url
    try {
        const res = await fetch(url);
        return await res.json();
    } catch (err) {
        alert(
            "We're so sorry, there are some technical problems currently. Please come again latter. Thanks for your understanding.",
        );
        return false;
    }
};

const rendering_currencies = async () => {
    const data = await handle_url(currencies_url);

    //fill all the option tag with currency property from val
    const render_opt_data = data.map((val, index, ori_arr) => {
        return `<option value="${val.currency}"></option>`;
    });

    //join the code for rendering
    const render_to_html = render_opt_data.join('');

    //render to html page
    base_currencies_datalist.innerHTML = render_to_html;
    target_currencies_datalist.innerHTML = render_to_html;
};

rendering_currencies();

const check_inp_value = () => {
    let inp_amount_val = amount_inp.value.trim();

    //check the user input if it is not an integer or its value is invalid
    if (isNaN(inp_amount_val) || 0 > inp_amount_val || inp_amount_val === '') {
        return null;
    } else {
        return parseInt(inp_amount_val);
    }
};

const rendering_result = (amount, base_currency, target_currency, converted_result) => {
    if (window.innerWidth < 741) {
        converted_result = converted_result.toFixed(3);
    } else if (window.innerWidth < 1024) {
        converted_result = converted_result.toFixed(6);
    }

    const render_to_html = `
    <span class="result__base_amount"
        >${amount}<span class="result__base_currency">${base_currency} =</span></span
    >
    <h3 class="result__target_amount">${converted_result}<span class="result__target_currency">${target_currency}</span></h3>
    `;

    //render to html page
    result.innerHTML = render_to_html;
};

const convert_currencies = async (amount, base, target) => {
    const data = await handle_url(currencies_url);
    let res;

    let validated_currencies = [
        { type: 'base', currency: '', price: 0 },
        { type: 'target', currency: '', price: 0 },
    ];

    //find the input currencies
    data.find((val, index, ori_array) => {
        if (val.currency === base) {
            validated_currencies[0].currency = val.currency;
            validated_currencies[0].price = val.price;
        }
        if (val.currency === target) {
            validated_currencies[1].currency = val.currency;
            validated_currencies[1].price = val.price;
        }
    });

    //validate input currencies
    res = validated_currencies.findIndex((val, index, ori_array) => {
        return val.currency === '';
    });

    if (res === -1) {
        res = amount * validated_currencies[1].price;
    } else if (res === 0) {
        alert(`Base currency: "${base}" is invalid, please recheck your base currency in the "From" input`);
        return false;
    } else if (res === 1) {
        alert(`Target currency: "${target}" is invalid, please recheck your target currency in the "To" input`);
        return false;
    }

    //render result if the currencies is validated successfully
    rendering_result(amount, validated_currencies[0].currency, validated_currencies[1].currency, res);
};

convert_btn.addEventListener('click', async () => {
    let convert_amount = check_inp_value();
    if (convert_amount !== null) {
        let base_currency = base_currency_inp.value;
        let target_currency = target_currency_inp.value;
        convert_currencies(convert_amount, base_currency, target_currency);
        amount_inp.value = '';
    } else {
        alert('Please ensure that the amount input is a NUMBER with a value equal to or greater than 0.');
    }
});

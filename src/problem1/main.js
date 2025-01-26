const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const input_form = $('#input_number');
const calculate_btn = $('.calculate');
const result_1 = $('.result_1');
const result_2 = $('.result_2');
const result_3 = $('.result_3');

const MAX_SAFE_INTEGER = parseInt($('.safe_integer').textContent);

const check_inp_value = () => {
    let inp_val = input_form.value.trim();

    if (isNaN(inp_val)) {
        return null;
    } else {
        if (inp_val > MAX_SAFE_INTEGER || 0 > inp_val) {
            return null;
        } else {
            return parseInt(inp_val);
        }
    }
};

const sum_to_n_1st = (number) => {
    let total = 0;
    for (let i = 1; i <= number; i++) {
        total += i;
    }
    return total;
};

const sum_to_n_2nd = (number) => {
    let total = 0;
    let i = 1;

    while (i <= number) {
        total += i;
        i++;
    }
    return total;
};

const sum_to_n_3rd = (number) => {
    let total = 0;

    let number_to_sum = (number - 1) / 1 + 1;
    total = ((1 + number) * number_to_sum) / 2;

    return total;
};

calculate_btn.addEventListener('click', () => {
    let inp_val = check_inp_value();
    let display_number;

    if (inp_val === null) {
        alert(
            `Please ensure that the amount input is a NUMBER with a value less than ${MAX_SAFE_INTEGER} and greater than -1!`,
        );
    } else {
        display_number = sum_to_n_1st(inp_val);
        result_1.textContent = display_number;

        display_number = sum_to_n_2nd(inp_val);
        result_2.textContent = display_number;

        display_number = sum_to_n_3rd(inp_val);
        result_3.textContent = display_number;
    }
});

const decimalInput = document.getElementById('decimal');
const binaryInput = document.getElementById('binary');
const hexInput = document.getElementById('hex');

const inputs = {
    decimal: {
        el: decimalInput,
        regex: /^[0-9]*$/,
        msg: document.getElementById('msg-decimal'),
        base: 10
    },
    binary: {
        el: binaryInput,
        regex: /^[01]*$/,
        msg: document.getElementById('msg-binary'),
        base: 2
    },
    hex: {
        el: hexInput,
        regex: /^[0-9A-Fa-f]*$/,
        msg: document.getElementById('msg-hex'),
        base: 16
    }
};

function updateValues(sourceKey, value) {
    if (value === "") {
        Object.values(inputs).forEach(input => {
            input.el.value = "";
            input.el.classList.remove('error');
            input.msg.classList.remove('visible');
        });
        return;
    }

    const source = inputs[sourceKey];
    const isValid = source.regex.test(value);

    if (!isValid) {
        source.el.classList.add('error');
        source.msg.classList.add('visible');
        return;
    }

    source.el.classList.remove('error');
    source.msg.classList.remove('visible');

    // Parse value to BigInt to handle large numbers
    let decimalValue;
    try {
        if (sourceKey === 'decimal') {
            decimalValue = BigInt(value);
        } else if (sourceKey === 'binary') {
            decimalValue = BigInt('0b' + value);
        } else if (sourceKey === 'hex') {
            decimalValue = BigInt('0x' + value);
        }
    } catch (e) {
        source.el.classList.add('error');
        return;
    }

    // Update other inputs
    if (sourceKey !== 'decimal') {
        inputs.decimal.el.value = decimalValue.toString(10);
    }
    if (sourceKey !== 'binary') {
        inputs.binary.el.value = decimalValue.toString(2);
    }
    if (sourceKey !== 'hex') {
        inputs.hex.el.value = decimalValue.toString(16).toUpperCase();
    }
}

// Add event listeners
Object.keys(inputs).forEach(key => {
    inputs[key].el.addEventListener('input', (e) => {
        updateValues(key, e.target.value.trim());
    });
});

// Clipboard Functionality
document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const input = document.getElementById(targetId);
        const tooltip = document.getElementById(`tip-${targetId}`);

        if (input.value) {
            navigator.clipboard.writeText(input.value).then(() => {
                tooltip.classList.add('show');
                setTimeout(() => {
                    tooltip.classList.remove('show');
                }, 1500);
            });
        }
    });
});

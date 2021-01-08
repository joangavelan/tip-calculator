const App = (() => {
    const errorMessagesBox = document.querySelector('.error-messages');
    const ERROR_MESSAGES = document.getElementsByClassName('error-message');
    const closeIcon = document.querySelector('.close');
    const INPUTS = document.getElementsByClassName('input');
    const billAmountInput = document.querySelector('.input__bill-amount');
    const billShareInput = document.querySelector('.input__bill-share');
    const rateInputEl = document.querySelector('.input__rate-select');
    const loadingBarsEl = document.querySelector('.loading-bars');
    const resultsEl = document.querySelector('.results');
    const BUTTONS = document.getElementsByClassName('btn');
    const calcButton = document.querySelector('.calc');
    const newCalcButton = document.querySelector('.new-calc');
    
    const displayErrorMessage = () => {
        errorMessagesBox.classList.add('show');
        const emptyInputs = [];
        let inputErrorReference = '';
        //Iterating through the inputs to find out which one is empty, then I push its data-id into the array 'emptyInputs'
        for(let input of INPUTS) {
            input.value === '' ? emptyInputs.push(input.dataset.id) : null;
        }
        //If there is only one empty input, we pass its id as a reference to trigger the linked error message, if there is more than one empty input, we display the general error
        inputErrorReference = (emptyInputs.length === 1) ? emptyInputs[0] :  'general';
        //Iteration over the error messages to find the one linked to the error reference
        for(let errorMessage of ERROR_MESSAGES) {
            //Once identified it is displayed
            if(errorMessage.dataset.inputReference === inputErrorReference) errorMessage.classList.add('show');
            //The error message that has been displayed and no longer matches the error reference will be removed, this prevents more than one error message from being displayed at the same time
            else errorMessage.classList.remove('show');
        }
    }

    const loadingBars = (state) => {
        if(state === 'on') loadingBarsEl.classList.add('show');
        else if(state === 'off') loadingBarsEl.classList.remove('show');
        else console.log('You need to set a proper loading state: (on/off)')
    }
    
    const toggleButton = () => {
        calcButton.classList.toggle('show');
        newCalcButton.classList.toggle('show');
    }

    const beautifiedNum = x => x.toLocaleString('en', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    const getResults = (bill, share, rate) => {
        //loading while I get the results
        loadingBars('on');
        //converting str inputs into numbers
        bill = parseFloat(bill);
        share = parseFloat(share);
        rate = parseFloat(rate);
        //resolution and storage of results
        const tip = (rate * bill) / 100;
        const total = tip + bill;
        const each = total / share;
        //creating results markup
        const markup = `
            <p>Tip amount: <span>$ ${beautifiedNum(tip)}</span></p>
            <p>Total amount: <span>$ ${beautifiedNum(total)}</span></p>
            <p>Each person owes: <span>$ ${beautifiedNum(each)}</span></p>
        `
        //hiding loading bars and showing results after 2 seconds - initial calc button toggled to new tip calc button
        setTimeout(() => {
            loadingBars('off');
            resultsEl.innerHTML = markup;
            toggleButton();
        }, 2000);
    }

    const inputsState = (state) => {
        for(let input of INPUTS) {
            if(state === 'disabled') input.setAttribute('disabled', true);
            else if(state === 'enabled') input.removeAttribute('disabled');
            else console.log('You need to set a proper input state: (enabled/disabled)')
        }
    }

    const calcButtonState = (state) => {
        if(state === 'calculating') {
            calcButton.textContent = 'Calculating...';
            calcButton.disabled = true;
        }
        else if('initial') {
            calcButton.textContent = 'Calculate';
            calcButton.removeAttribute('disabled');
        }
        else console.log('You need to set a proper calc-button state: (calculating/initial)')
    }

    const reset = () => {
        billAmountInput.value = '';
        billShareInput.value = '';
        rateInputEl.value = '';
        resultsEl.innerHTML = '';
        inputsState('enabled');
        toggleButton();
        calcButtonState('initial');
        billAmountInput.focus();
    }
    
    const removeErrorMessage = () => errorMessagesBox.classList.remove('show');
    
    const listeners = () => {
        //-calc- and -new tip calc- button functionalities
        for(let button of BUTTONS) {
            button.addEventListener('click', () => {
                if(button.classList.contains('calc')) {
                    const bill = billAmountInput.value;
                    const share = billShareInput.value;
                    const rate = rateInputEl.value;
        
                    if(bill && share && rate) {
                        getResults(bill,share,rate);
                        removeErrorMessage();
                        inputsState('disabled');
                        calcButtonState('calculating');
                    } 
                    else displayErrorMessage();
                }
                else reset();
            })
        }
        //closes error messages box
        closeIcon.addEventListener('click', removeErrorMessage)
    }

    return {
        listeners
    }
})();

App.listeners();
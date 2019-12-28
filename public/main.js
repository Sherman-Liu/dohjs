const doh = require('../lib/doh');

document.addEventListener('DOMContentLoaded', function(e) {
    const responseElem = document.getElementById('doh-response');
    const $loadingModal = $('#loading-modal');
    const doDohBtn = document.getElementById('do-doh');

    const errorFunction = (err) => {
        console.error(err);
        $loadingModal.modal('hide');
        doDohBtn.classList.remove('disabled');
        responseElem.innerHTML = `
<div class="text-danger">
    An error occurred with your DNS request
    (hint: check the console for more details).
    Here is the error:
  <p class="font-weight-bold">${err}</p>
</div>`;
    };

    const successFunction = (response) => {
        responseElem.innerHTML = `<pre>${JSON.stringify(response, null, 4)}</pre>`;
        $loadingModal.modal('hide');
        doDohBtn.classList.remove('disabled');
    };

    doDohBtn.addEventListener('click', function(e) {
        const dohForm = document.getElementById('try-doh-form');
        dohForm.classList.remove('needs-validation');
        dohForm.classList.add('was-validated');

        responseElem.childNodes.forEach(node => node.remove());
        const urlInputElem = document.getElementById('doh-url');
        const url = urlInputElem.value;
        if (!url) {
            return;
        }
        const method = document.getElementById('doh-method').value;
        const qname = document.getElementById('doh-qname').value;
        const qtype = document.getElementById('doh-qtype').value;
        const options = {
            url: url,
            method: method,
            qname: qname,
            qtype: qtype,
            success: successFunction,
            error: errorFunction
        };
        $loadingModal.modal('show');
        document.getElementById('do-doh').classList.add('disabled');
        try {
            doh(options);
        } catch(e) {
            errorFunction(e);
        }
    })
});
